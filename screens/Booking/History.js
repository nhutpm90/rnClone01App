import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback } from "react-native";

import { Container, Header, Title, Subtitle, Content, Button, Left, Right, Body } from "native-base";

import {
  createBottomTabNavigator,
  createAppContainer,
  createMaterialTopTabNavigator
} from 'react-navigation';

import Icon from "react-native-vector-icons/Ionicons";
import { color } from 'color';

class BookingList extends Component {

  _getData() {
    const data = [];
    const dataTemplate = {
      id: "",
      name: "Lorem ipsum dolor sit amet",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo"
    };

    for (var i = 0; i < 50; i++) {
      data.push({ ...dataTemplate, id: i });
    }
    return data;
  }

  render() {
    const data = this._getData();

    return (
      <View style={{ flex: 1, }} >
        <FlatList contentContainerStyle={{
            marginTop: 8,
            marginBottom: 8,
            marginLeft: 16,
            marginRight: 16,
          }}
          data={data}
          // ItemSeparatorComponent={() => (
          //   <View style={{ 
          //     height: 0.5,
          //     backgroundColor: "#DCE1E5",
          //     marginHorizontal: 16
          //   }} />
          // )}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback onPress={() => alert('on press:: id - '+ item.id)}>
              <View style={{
                flex: 1,
                flexDirection: "column",
                backgroundColor: "#FFFFFF",
                marginVertical: 8,
                paddingHorizontal: 16,
                paddingVertical: 4,
                borderTopWidth: 2,
                borderTopColor: "#DCE1E4",
                borderBottomWidth: 2,
                borderBottomColor: "#DCE1E4",
              }} >
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#DCE0E4",
                  paddingBottom: 4,
                }}>
                  <Text style={{
                    backgroundColor: "#11AFCD",
                    color: "#FFFFFF",
                    borderRadius: 2,
                    padding: 2,
                    fontSize: 12,
                  }}>
                    Promo
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    Apr 28, 2019, 3:25 PM
                  </Text>
                </View>
                <View style={{
                  flex: 1,
                  flexDirection: "row",
                  // backgroundColor: "green",
                  paddingVertical: 6,
                }}>
                  <View>
                    <Text>From:</Text>
                    <Text style={{ marginTop: 15, }}>To:</Text>
                  </View>
                  <View style={{
                    flex: 2,
                    flexDirection: "column",
                    paddingLeft: 6
                  }}>
                    <Text numberOfLines={1}>The Coffee Factory - Trương Định</Text>
                    <Text style={{ marginTop: 15, }} numberOfLines={1}>6 Tôn Thất Đạm</Text>
                  </View>
                  <View style={{
                    flex: 1,
                    alignItems: "flex-end",
                  }}>
                    <Text style={{ color: "#00b14f" }}>21.000đ</Text>
                  </View>
                </View>
                <View>
                  <Text style={{ color: "#9A9A9A", fontSize: 12}}>Personal</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          )}
        />
      </View>
    );
  }
}

class Booking extends React.Component {
  render() {
    return (
      <Container>
        <Content style={{ backgroundColor: "#E3E8EB" }}>
          <BookingList/>
        </Content>
      </Container>
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