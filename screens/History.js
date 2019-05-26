import React from "react";
import { Button, View, Text } from "react-native";
import {
  createBottomTabNavigator,
  createAppContainer,
  createMaterialTopTabNavigator
} from 'react-navigation';

import Icon from "react-native-vector-icons/Ionicons";

class Booking extends React.Component {
  render() {
    // dummy data start
    const data = [];
    const bookingDataTemp = {
      description: "Bacon ipsum dolor amet",
    };
    for(var i=0;i<25; i++) {
      const bookingData = { ...bookingDataTemp };
      bookingData['id']=i;
      data.push(bookingData); 
    }
    // dummy data end
    
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Booking Screen</Text>
      </View>
    );
  }
}

class Order extends React.Component {
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Order Screen</Text>
        </View>
      );
    }
}

class SameDay extends React.Component {
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No bookings yet.</Text>
          <Text>Make one today!</Text>
        </View>
      );
    }
}

const RootStack = createMaterialTopTabNavigator(
  {
    Booking: {
      screen: Booking,
      navigationOptions: {
        title: "Bookings",
        tabBarIcon: ({ horizontal, tintColor }) => <Icon name="md-home" size={25} color={tintColor} />
      }
    },
    Order: {
      screen: Order,
      navigationOptions: {
        title: "Orders",
        tabBarIcon: ({ horizontal, tintColor }) => <Icon name="md-book" size={25} color={tintColor} />
      }
    },
    SameDay: {
      screen: SameDay,
      navigationOptions: {
        title: "Same Day",
        tabBarIcon: ({ horizontal, tintColor }) => <Icon name="md-settings" size={25} color={tintColor} />
      }
    },
  },
  {
    swipeEnabled: false,
    lazy: true,
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: '#00b14f',
      inactiveTintColor: '#676767',
      upperCaseLabel: false,
      labelStyle: {
        fontSize: 15,
        fontWeight: 'bold',
      },
      style: {
        backgroundColor: 'white',
        // paddingTop: 20
      },
      indicatorStyle : {
        backgroundColor: '#00b14f',
        height: 4
      }
    }
  }
);

const AppContainer = createAppContainer(RootStack);

class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

export default App;