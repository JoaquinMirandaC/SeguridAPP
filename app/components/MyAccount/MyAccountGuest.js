import React, { Component } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Button, Image } from "react-native-elements";
export default class MyAccountGuest extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { navigate } = this.props.navigation;
    const { goToScreen } = this.props;

    return (
      <View style={styles.viewBody}>
        <Text style={styles.title}>Primero debes registrarte.</Text>
        <Button
          buttonStyle={styles.btnViewProfile}
          title="Ver tu perfil"
          onPress={() => this.props.navigation.navigate("Login")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30,
  },
  image: {
    height: 300,
    marginBottom: 40,
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10,
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
  },
  btnViewProfile: {
    backgroundColor: "#59a9de",
    marginRight: 10,
    marginLeft: 10,
  },
});
