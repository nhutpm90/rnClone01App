// import React from "react";
// import { StyleSheet, Text, View, Image } from "react-native";

// import { Root } from "native-base";

// import { createAppContainer, createBottomTabNavigator } from "react-navigation";
// import Icon from "react-native-vector-icons/Ionicons";

// import Home from "./screens/Home";
// import History from "./screens/History";
// import Payment from "./screens/Payment";
// import Inbox from "./screens/Inbox";
// import Account from "./screens/Account";

// const RootStack = createBottomTabNavigator(
//   {
//     Home: {
//       screen: Home,
//       navigationOptions: {
//         title: "HOME",
//         tabBarIcon: ({ horizontal, tintColor }) => (
//           <Icon name="ios-home" color={tintColor} size={24} />
//         )
//       }
//     },
//     History: {
//       screen: History,
//       navigationOptions: {
//         title: "HISTORY",
//         tabBarIcon: ({ horizontal, tintColor }) => (
//           <Icon name="ios-bookmark" color={tintColor} size={24} />
//         )
//       }
//     },
//     Payment: {
//       screen: Payment,
//       navigationOptions: {
//         title: "PAYMENT",
//         tabBarIcon: ({ horizontal, tintColor }) => (
//           <Icon name="ios-card" color={tintColor} size={24} />
//         )
//       }
//     },
//     Inbox: {
//       screen: Inbox,
//       navigationOptions: {
//         title: "INBOX",
//         tabBarIcon: ({ horizontal, tintColor }) => (
//           <Icon name="ios-chatboxes" color={tintColor} size={24} />
//         )
//       }
//     },
//     Account: {
//       screen: Account,
//       navigationOptions: {
//         title: "ACCOUNT",
//         tabBarIcon: ({ horizontal, tintColor }) => (
//           <Icon name="ios-person" color={tintColor} size={24} />
//         )
//       }
//     }
//   },
//   {
//     initialRouteName: "Home",
//     tabBarOptions: {
//       activeTintColor: "#00b14f",
//       inactiveTintColor: "#9a9a9a",
//       style: {
//         backgroundColor: "white",
//         borderTopWidth: 0,
//         shadowOffset: { width: 5, height: 3 },
//         shadowColor: "black",
//         shadowOpacity: 0.5,
//         elevation: 5
//       }
//     }
//   }
// );

// const AppContainer = createAppContainer(RootStack);

// export default class App extends React.Component {
//   render() {
//     return (
//       <Root>
//         <AppContainer />
//       </Root>
//     );
//   }
// }


import React, { Component } from 'react';
import { FlatList } from "react-native";

import { createStackNavigator, createAppContainer } from "react-navigation";

import { Root, Container, Header, Title, Content, Button, Icon, Left, Right, Body, Text, ListItem, List } from "native-base";

import BookingMain from "./screens/Booking/BookingMain";
import HubMain from "./screens/Hub/HubMain";

const screens = ["BookingMain", "HubMain"];

class MainScreen extends React.Component {
  state = {
    screens,
  };

  render() {
    return (
      <Container>
        <Content>
          <FlatList
            data={this.state.screens}
            extraData={this.state}
            keyExtractor={(item, index) => String(index)}
            renderItem={({item, index}) => {
              return(
              <ListItem
                button
                onPress={() => this.props.navigation.navigate(item)}
              >
                <Left>
                  <Text>{item}</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            )
            }}
          />
        </Content>
      </Container>
    );
  }
}

const RootStack = createStackNavigator(
  {
    MainScreen: {
      screen: MainScreen,
    },
    BookingMain: {
      screen: BookingMain,
    },
    HubMain: {
      screen: HubMain,
    }
  },
  {
    initialRouteName: 'HubMain',
    headerMode: 'none',
  }
)

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return (
      <Root>
        <AppContainer />
      </Root>
    );
  }
}