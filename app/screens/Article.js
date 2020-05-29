import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Animated,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ActionButton from "react-native-action-button";
import * as theme from "../../theme";

const { width, height } = Dimensions.get("window");

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
    backgroundColor: "transparent",
    paddingHorizontal: theme.sizes.padding,
    paddingTop: theme.sizes.padding,
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  back: {
    width: theme.sizes.base * 3,
    height: theme.sizes.base * 3,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  content: {
    // backgroundColor: theme.colors.active,
    // borderTopLeftRadius: theme.sizes.border,
    // borderTopRightRadius: theme.sizes.border,
    color: theme.sizes.green,
  },
  contentHeader: {
    backgroundColor: "transparent",
    padding: theme.sizes.padding,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.sizes.radius,
    borderTopRightRadius: theme.sizes.radius,
    marginTop: -theme.sizes.padding / 2,
    color: theme.sizes.green,
  },
  shadow: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    color: theme.sizes.green,
  },
  dotsContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 36,
    right: 0,
    left: 0,
  },
  dots: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
    backgroundColor: theme.colors.gray,
  },
  title: {
    fontSize: theme.sizes.font * 2,
    fontWeight: "bold",
    color: theme.sizes.green,
  },
  description: {
    fontSize: theme.sizes.font * 1.2,
    lineHeight: theme.sizes.font * 2,
    color: theme.colors.caption,
    color: theme.sizes.green,
  },
  actionbutton: {
    marginTop: 10,
    flexDirection: "row",
    width: 270,
  },
  text: {},
});

class Article extends Component {
  scrollX = new Animated.Value(0);

  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <View style={[styles.flex, styles.row, styles.header]}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome
              name="chevron-left"
              color={theme.colors.green}
              size={theme.sizes.font * 1}
            />
          </TouchableOpacity>
        </View>
      ),
      headerTransparent: true,
    };
  };

  render() {
    const { navigation } = this.props;
    const article = navigation.getParam("article");

    return (
      <View style={styles.flex}>
        <View style={[styles.flex]}>
          <ScrollView
            horizontal
            pagingEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate={0}
            scrollEventThrottle={16}
            snapToAlignment="center"
            onScroll={Animated.event([
              { nativeEvent: { contentOffset: { x: this.scrollX } } },
            ])}
          >
            {article.images.map((img, index) => (
              <Image
                key={`${index}-${img}`}
                source={{ uri: img }}
                resizeMode="cover"
                style={{ width, height: width, paddingLeft: 50 }}
              />
            ))}
          </ScrollView>
        </View>
        <View style={[styles.flex, styles.content]}>
          <View style={[styles.flex, styles.contentHeader]}>
            <Text style={styles.title}>{article.title}</Text>
            <View
              style={[
                styles.row,
                {
                  alignItems: "center",
                  marginVertical: theme.sizes.margin / 2,
                },
              ]}
            ></View>
          </View>
        </View>

        <View style={styles.actionbutton}>
          <Text
            style={{
              margin: 40,
              color: theme.colors.green,
              fontSize: 19,
              fontWeight: "bold",
            }}
          >
            Agregar emergencia:
          </Text>
        </View>

        <ActionButton
          style={styles.actionbutton}
          buttonColor="#59a9de"
          onPress={() =>
            this.props.navigation.navigate("AddEmergency", {
              loadRestaurants: this.loadRestaurants,
            })
          }
        />
      </View>
    );
  }
}

export default Article;
