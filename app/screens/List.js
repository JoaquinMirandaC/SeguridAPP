import React, { Component } from "react";
import {
  Animated,
  Text,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Octicons from "react-native-vector-icons/Octicons";
import { firebaseApp } from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
import { Asset } from "expo-asset";
const db = firebase.firestore(firebaseApp);
import ActionButton from "react-native-action-button";
import * as theme from "../../theme";
const { width, height } = Dimensions.get("window");
//Images URI version
const imgSecurity = Asset.fromModule(require("../../assets/img/seguridad.png"))
  .uri;
const imgHealth = Asset.fromModule(require("../../assets/img/salud.png")).uri;
const imgFire = Asset.fromModule(require("../../assets/img/incendio.png")).uri;

const mocks = [
  {
    id: 1,
    title: "Seguridad",
    preview: imgSecurity,
    images: [imgSecurity],
  },
  {
    id: 2,
    title: "Salud",
    preview: imgHealth,
    images: [imgHealth],
  },
  {
    id: 3,
    title: "Bomberos",
    preview: imgFire,
    images: [imgFire],
  },
];
const styles = StyleSheet.create({
  flex: {
    flex: 0,
  },
  column: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.sizes.padding,
    paddingTop: theme.sizes.padding * 1.5,
    paddingBottom: theme.sizes.padding * 0.2,
    justifyContent: "space-between",
    alignItems: "center",
  },
  articles: {},
  destinations: {
    flex: 1,
    justifyContent: "space-between",
  },
  destination: {
    width: width - theme.sizes.padding * 2,
    height: width * 0.45,
    marginHorizontal: theme.sizes.margin,
    paddingHorizontal: theme.sizes.padding,
    paddingVertical: theme.sizes.padding * 0.66,
    borderRadius: theme.sizes.radius,
    backgroundColor: "#f0f5ff",
  },
  destinationInfo: {
    position: "relative",
    borderRadius: theme.sizes.radius,
    paddingVertical: 20,
    paddingHorizontal: -5,
    marginTop: -75,
    left: (width - theme.sizes.padding * 6) / (Platform.OS === "ios" ? 3.2 : 3),
    backgroundColor: theme.colors.green,
    width: 100,
    height: 50,
  },
  image: {
    width: width * 0.8,
    height: height * 0.23,
    margin: 13,
  },
});

class Articles extends React.Component {
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
    this.checkLogin();
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

  scrollX = new Animated.Value(0);

  static navigationOptions = {
    header: (
      <View style={[styles.flex, styles.row, styles.header]}>
        <View>
          <Text
            style={{
              color: "#59a9de",
              fontSize: theme.sizes.font * 1.4,
              fontWeight: "bold",
            }}
          >
            Seleccione su tipo de emergencia:
          </Text>
        </View>
      </View>
    ),
  };

  renderDestinations = () => {
    return (
      <View
        style={[styles.column, styles.destinations, styles.flex, styles.row]}
      >
        <FlatList
          pagingEnabled
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          scrollEventThrottle={16}
          snapToAlignment="center"
          style={{ overflow: "visible" }}
          data={this.props.destinations}
          keyExtractor={(item, index) => `${item.id}`}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { x: this.scrollX } } },
          ])}
          renderItem={({ item }) => this.renderDestination(item)}
          ItemSeparatorComponent={() => <Text> </Text>}
        />
      </View>
    );
  };

  renderDestination = (item) => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Article", { article: item })}
      >
        <ImageBackground
          style={[styles.flex, styles.destination, styles.shadow, styles.image]}
          imageStyle={{ borderRadius: theme.sizes.radius }}
          source={{ uri: item.preview }}
        ></ImageBackground>
        <View style={[styles.column, styles.destinationInfo, styles.shadow]}>
          <Text
            style={{
              bottom: 5,
              textAlignVertical: "center",
              textAlign: "center",
              fontSize: theme.sizes.font * 1.15,
              paddingBottom: 8,
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { login } = this.state;

    if (login) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: theme.sizes.padding }}
        >
          {this.renderDestinations()}
        </ScrollView>
      );
    }

    return (
      <Text
        style={{
          margin: 40,
          color: "#000",
          fontSize: theme.sizes.font * 1.4,
          fontWeight: "bold",
        }}
      >
        Por favor, inicie sesión para ver este contenido.
      </Text>
    );
  }
}

Articles.defaultProps = {
  destinations: mocks,
};

export default Articles;
