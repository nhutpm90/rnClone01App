import React, { Component } from "react";
import { View, Text, FlatList, Image, TouchableWithoutFeedback } from "react-native";

import { Container, Header, Title, Content, Button, Icon, Left, Right, Body, Text as NBText, 
  ListItem, List } from "native-base";

const datas = [
  {
    route: "membership",
    text: "Points"
  },
  {
    route: "rewards",
    text: "Rewards"
  },
  {
    route: "scheduled",
    text: "Scheduled"
  },
  {
    route: "subscriptions",
    text: "Subscriptions"
  },
  {
    route: "savedPlaces",
    text: "Saves Places"
  },
  {
    route: "helpCenter",
    text: "Help Center"
  },
  {
    route: "emergency",
    text: "Emergency"
  },
  {
    route: "settings",
    text: "Settings"
  },
  {
    route: "shareFeedback",
    text: "Share Feedback"
  },
  {
    route: "driveWithGrab",
    text: "Drive With Grab"
  }
];

export default class App extends Component {
  render() {
    return (
      <Container>
        <Content>
          <View style={{
            flex: 1,
            flexDirection: "column",
          }}>
            <TouchableWithoutFeedback onPress={() => alert('on press profile')}>
              <View style={{
                flexDirection: "row",
              }}>
                <View>
                  <Image source={{ uri: "https://cdn.dribbble.com/users/1236180/screenshots/4440250/shot.jpg" }} 
                    style={{ width: 130, height: 130}} />
                </View>
                <View style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                }}>
                  <NBText>Jon Snow</NBText>
                  <Text>Edit Profile ></Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <View>
              <FlatList
                data={datas}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  // <ListItem button onPress={() => this.props.navigation.navigate(item.route)} >
                  <ListItem button onPress={() => alert('navigate to:: ' + item.route)} >
                    <Left>
                      <NBText>{item.text}</NBText>
                    </Left>
                    <Right>
                      <Icon name="arrow-forward" />
                    </Right>
                  </ListItem>
                )}
              />
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}