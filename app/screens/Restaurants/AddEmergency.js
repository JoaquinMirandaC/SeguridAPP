import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Icon, Image, Button, Text, Overlay, TextView } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';
import Toast, { DURATION } from "react-native-easy-toast";
import { uploadImage } from "../../utils/UploadImage";
import * as Permissions from "expo-permissions";
import * as Location from 'expo-location';
import t from "tcomb-form-native";
const Form = t.form.Form;
import {
  AddEmergencyStruct,
  AddEmergencyOptions
} from "../../forms/AddEmergency";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class AddEmergency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      imageUriRestaurant: "",
      formData: {
        name: "",
        description: ""
      },
      errorMessage: null,
    };
  }

  isImageRestaurant = image => {
    if (image) {
      return (
        <Image source={{ uri: image }} style={{ width: 500, height: 200 }} />
      );
    } else {
      return (
        <Image
          source={require("../../../assets/img/no-image.png")}
          style={{ width: 200, height: 200 }}
        />
      );
    }
  };

  uploadImage = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (resultPermission.status === "denied") {
      this.refs.toast.show(
        "Es necesario aceptar los permisos de la galeria",
        1500
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true
      });

      if (result.cancelled) {
        this.refs.toast.show("Has cerrado la galeria de imagenes", 1500);
      } else {
        this.setState({
          imageUriRestaurant: result.uri
        });
      }
    }
  };

  loadRestaurants = async () => {
    const { limitRestaurants } = this.state;
    let resultRestaurants = [];

    const restaurants = db
      .collection("emergencies")
      .orderBy("createAt", "desc")
      .limit(limitRestaurants);

    await restaurants.get().then(response => {
      this.setState({
        startRestaurants: response.docs[response.docs.length - 1]
      });

      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push({ restaurant });
      });
      resultRestaurantsasc = []
      resultRestaurants.slice().reverse().forEach(element => {
          resultRestaurantsasc.push(element);
      });
      this.setState({
        restaurants: resultRestaurantsasc
      });
    });
  };

  onChangeFormAddEmergency = formValue => {
    this.setState({
      formData: formValue
    });
  };

  AddEmergency = () => {
    const { imageUriRestaurant,location } = this.state;
    const { name, description } = this.state.formData;

    //if (imageUriRestaurant && name && city && address && description) {
    if (name && description && imageUriRestaurant) {
      this.setState({ loading: true });

      db.collection("emergencies")
        .add({
          name,
          description,
          image: "",
          rating: 0,
          ratingTotal: 0,
          quantityVoting: 0,
          location,
          createAt: new Date()
        })
        .then(resolve => {
          const restaurantId = resolve.id;

          uploadImage(imageUriRestaurant, restaurantId, "emergencies")
            .then(resolve => {
              const restaurantRef = db
                .collection("emergencies")
                .doc(restaurantId);

              restaurantRef
                .update({ image: resolve })
                .then(() => {
                  this.setState({ loading: false });
                  this.refs.toast.show(
                    "Emergencia creada correctamente",
                    100,
                    () => {
                      this.props.navigation.state.params.loadRestaurants();
                      this.props.navigation.goBack();
                    }
                  );
                })
                .catch(() => {
                  this.refs.toast.show("Error de servidor intentelo mas tarde");
                  this.setState({ loading: false });
                });
            })
            .catch(() => {
              this.refs.toast.show("Error de servidor intentelo mas tarde");
              this.setState({ loading: false });
            });
        })
        .catch(() => {
          this.refs.toast.show("Error de servidor intentelo mas tarde");
          this.setState({ loading: false });
        });
    } else {
      
      this.refs.toast.show("Tienes que rellenar todos los campos");
    }
  };

  componentWillMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let locationasync = await Location.getCurrentPositionAsync({});
    //this.state.location = {location};
    this.setState({ location: locationasync });
  };

  render() {

    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      location = JSON.stringify(this.state.location.coords);
      console.log(text);
    }

    const { imageUriRestaurant, loading } = this.state;

    return (

      <View style={styles.viewBody}>
        <View style={styles.viewPhoto}>
          {this.isImageRestaurant(imageUriRestaurant)}
        </View>
        <Text style={styles.paragraph}>{text.coords}</Text>
        
        <View>
          <Form
            ref="AddEmergencyForm"
            type={AddEmergencyStruct}
            options={AddEmergencyOptions}
            value={this.state.formData}
            onChange={formValue => this.onChangeFormAddEmergency(formValue)}
          />
        </View>
        <View style={styles.viewIconUploadPhoto}>
          <Icon
            name="camera"
            type="material-community"
            color="#7A7A7A"
            iconStyle={styles.addPhotoIcon}
            onPress={() => this.uploadImage()}
          />
        </View>
        <Text style={{ marginLeft: 10, color: "#30A589", fontSize: 12, fontWeight: 'bold', width: 50}}>Agregar imágen</Text>
        <View style={styles.viewBtnAddEmergency}>
          <Button
            title="Crear Emergencia"
            onPress={() => this.AddEmergency()}
            buttonStyle={styles.btnAddEmergency}
          />
        </View>

        <Overlay
          overlayStyle={styles.overlayLoading}
          isVisible={loading}
          width="auto"
          height="auto"
        >
          <View>
            <Text style={styles.overlayLoadingText}>Creando Emergencia...</Text>
            <ActivityIndicator size="large" color="#59a9de" />
          </View>
        </Overlay>

        <Toast
          ref="toast"
          position="bottom"
          positionValue={320}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#fff" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20
  },
  viewIconUploadPhoto: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 12
  },
  addPhotoIcon: {
    backgroundColor: "#e3e3e3",
    padding: 9,
    top: 5,
    paddingBottom: 10,
    margin: 0
  },
  viewBtnAddEmergency: {
    flex: 1,
    margin: 20,
    justifyContent: "flex-end"
  },
  btnAddEmergency: {
    backgroundColor: "#59a9de",
    top: 40,
    margin: 50
  },
  overlayLoading: {
    padding: 40
  },
  overlayLoadingText: {
    color: "#59a9de",
    marginBottom: 20,
    fontSize: 20
  }
});
