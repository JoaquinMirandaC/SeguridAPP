import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Image } from "react-native-elements";

import { firebaseApp } from "../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);
import ActionButton from "react-native-action-button";
import { NavigationEvents } from "react-navigation";

export default class Home extends React.Component
{
  constructor() {
    super();

    this.state = {
      login: false,
      restaurants: null,
      startRestaurants: null,
      limitRestaurants: 8,
      isLoading: true
    };
  }

  componentDidMount() {
    this.checkLogin();
    this.loadRestaurants();
  }

  checkLogin = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          login: true
        });
      } else {
        this.setState({
          login: false
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


  loadActionButton = () => {
    const { login } = this.state;
  
    if (login) {
      return (
        <ActionButton
          buttonColor="#59a9de"
          onPress={() =>
            this.props.navigation.navigate("AddEmergency", {
              loadRestaurants: this.loadRestaurants
            })
          }
        />
      );
    }
  
    return null;
  };

  render()
  {
        return (
            <View style= { styles.viewBody }>
                {this.loadActionButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewBody:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff"
    }
});