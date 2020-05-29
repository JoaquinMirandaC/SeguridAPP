import * as React from 'react';
import { createStackNavigator, createbutton } from 'react-navigation-stack';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

//Pages
import HomeScreen from '../screens/Home';
import HistorialScreen from '../screens/Historial';
import ProfileScreen from '../screens/Profile';

//Register
import RegisterScreen from '../screens/MyAccount/Register';

//Login
import LoginScreen from '../screens/MyAccount/Login';

// Screen Restaurants
import RestaurantsScreen from "../screens/Restaurants/Restaurants";
import AddEmergencyScreen from "../screens/Restaurants/AddEmergency";
import RestaurantScreen from "../screens/Restaurants/Restaurant";
import AddReviewRestaurantScreen from "../screens/Restaurants/AddReviewRestaurant";

// Screen cards
import ListScreen from '../screens/List';
import ArticleScreen from '../screens/Article';

const homeScreenStack = createStackNavigator({
    Home: {
        screen: ListScreen,
        navigationOptions: ({ navigation }) => ({
            title: "Crear emergencia"
        })
    },
    AddEmergency: {
      screen: AddEmergencyScreen,
      navigationOptions: ({ navigation }) => ({
        title: "Crear emergencia"
      })
    },
    Article: {
      screen: ArticleScreen,
      navigationOptions: ({ navigation }) => ({
        title: "Emergencia"
      })
    }
});

const historialScreenStack = createStackNavigator({
    Historial: {
        screen: HistorialScreen,
        navigationOptions: ({ navigation }) => ({
        title: "Historial"
        })
    },
    Restaurants: {
      screen: RestaurantsScreen,
      navigationOptions: ({ navigation }) => ({
        title: "Historial"
      })
    },
    Restaurant: {
      screen: RestaurantScreen,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.restaurant.item.restaurant.name
      })
    },
    AddReviewRestaurant: {
      screen: AddReviewRestaurantScreen,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.name
      })
    }
});

const profileScreenStack = createStackNavigator({
    Profile: {
        screen: ProfileScreen,
        navigationOptions: ({ navigation }) => ({
        title: "Perfil"
        })
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: ({ navigation }) => ({
        title: "Registro"
      })
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: ({ navigation }) => ({
        title: "Login"
      })
    }
});


const RootStack = createBottomTabNavigator({
    Home: {
        screen: homeScreenStack,
        navigationOptions: ({ navigation }) => ({
          tabBarLabel: "Inicio",
          tabBarIcon: ( { tintColor} ) => (
            <Ionicons name="md-home" size={31} color={tintColor} />
          )
        })
    },
    Historial: {
        screen: historialScreenStack,
        navigationOptions: ({ navigation }) => ({
          tabBarLabel: "Historial",
          tabBarIcon: ( { tintColor} ) => (
            <Ionicons name="md-timer" size={31} color={tintColor} />
          )
        })
    },
    Profile: {
        screen: profileScreenStack,
        navigationOptions: ({ navigation }) => ({
          tabBarLabel: "Perfil",
          tabBarIcon: ( { tintColor} ) => (
            <Ionicons name="md-person" size={31} color={tintColor} />
          )
        }),
    }
},
{
    initialRouteName: "Home",
    order: ["Home", "Historial", "Profile"],
    tabBarOptions: {
        inactiveTintColor: "#646464",
        activeTintColor: "#59a9de",
        activeBackgroundColor: "#f0f5ff"
    }
}
);

export default createAppContainer(RootStack);