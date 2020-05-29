import React, { Component } from "react";
import Moment from "react-moment";

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { NavigationEvents } from "react-navigation";
import { firebaseApp } from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default class Historial extends React.Component {
  constructor() {
    super();

    this.state = {
      login: false,
      restaurants: null,
      startRestaurants: null,
      limitRestaurants: 8,
      isLoading: true,
    };
  }

  componentDidMount() {
    db.collection("emergencies")
      .get()
      .then((snap) => {
        if (snap.size <= 0)
          this.setState({
            isLoading: false,
          });
      });
    this.checkLogin();
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      this.loadRestaurants();
    });
  }

  checkLogin = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          login: true,
        });
      } else {
        this.setState({
          login: false,
        });
      }
    });
  };

  loadRestaurants = async () => {
    const { limitRestaurants } = this.state;
    let resultRestaurants = [];

    const restaurants = db
      .collection("emergencies")
      .orderBy("createAt", "desc")
      .limit(limitRestaurants);

    await restaurants.get().then((response) => {
      this.setState({
        startRestaurants: response.docs[response.docs.length - 1],
      });

      response.forEach((doc) => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push({ restaurant });
      });
      resultRestaurantsasc = [];
      resultRestaurants
        .slice()
        .reverse()
        .forEach((element) => {
          resultRestaurantsasc.push(element);
        });
      this.setState({
        restaurants: resultRestaurants,
      });
    });
    const isEmpty = this.state.restaurants;
  };

  handleLoadMore = async () => {
    const { limitRestaurants, startRestaurants } = this.state;
    let resultRestaurants = [];

    this.state.restaurants.forEach((doc) => {
      resultRestaurants.push(doc);
    });

    const restaurantsDb = db
      .collection("emergencies")
      .orderBy("createAt", "desc")
      .startAfter(startRestaurants.data().createAt)
      .limit(limitRestaurants);

    await restaurantsDb.get().then((response) => {
      if (response.docs.length > 0) {
        this.setState({
          startRestaurants: response.docs[response.docs.length - 1],
        });
      } else {
        this.setState({
          isLoading: false,
        });
      }

      response.forEach((doc) => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push({ restaurant });
      });

      this.setState({
        restaurants: resultRestaurants,
      });
    });
  };

  renderRow = (restaurant) => {
    const { name, description, image, createAt } = restaurant.item.restaurant;
    const dateTime = new Date(createAt["seconds"]).toUTCString();
    return (
      <TouchableOpacity onPress={() => this.clickRestaurant(restaurant)}>
        <View style={styles.viewRestaurant}>
          <View style={styles.viewRestaurantImage}>
            <Image
              resizeMode="cover"
              source={{ uri: image }}
              style={styles.imageRestaurant}
            />
          </View>

          <View>
            <Text style={styles.flatListRestaurantName}>{name}</Text>
            <Text style={styles.flatListRestaurantDescription}>
              {description.substr(0, 60)}...
            </Text>
            <Text style={styles.flatListRestaurantAddress}>{dateTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    if (this.state.isLoading) {
      return (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return (
        <View style={styles.notFoundRestaurants}>
          <Text>No quedan emergencias por cargar</Text>
        </View>
      );
    }
  };

  renderFlatList = (restaurants) => {
    if (restaurants) {
      return (
        <FlatList
          data={this.state.restaurants}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0}
          ListFooterComponent={this.renderFooter}
        />
      );
    } else {
      return (
        <View style={styles.startLoadRestaurants}>
          <ActivityIndicator size="large" />
          <Text>Cargando tu historial de emergencias</Text>
        </View>
      );
    }
  };

  clickRestaurant = (restaurant) => {
    this.props.navigation.navigate("Restaurant", { restaurant });
  };

  render() {
    const { login } = this.state;
    const { restaurants } = this.state;
    if (login) {
      return (
        <View style={styles.viewBody}>{this.renderFlatList(restaurants)}</View>
      );
    }
    return (
      <Text
        style={{ margin: 40, color: "#000", fontSize: 24, fontWeight: "bold" }}
      >
        Por favor, inicie sesión para ver este contenido.
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  startLoadRestaurants: {
    marginTop: 30,
    alignItems: "center",
  },
  viewRestaurant: {
    flexDirection: "row",
    margin: 10,
  },
  viewRestaurantImage: {
    marginRight: 15,
  },
  imageRestaurant: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  flatListRestaurantName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  flatListRestaurantAddress: {
    paddingTop: 2,
    color: "grey",
    fontSize: 14,
  },
  flatListRestaurantDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10,
  },
  notFoundRestaurants: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
