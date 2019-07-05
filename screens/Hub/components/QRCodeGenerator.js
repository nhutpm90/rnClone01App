import React, { Component } from "react";

import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Alert, Vibration } from "react-native";

import { Container, Header, Title, Subtitle, Content, Item, Form, 
  Text as TextNB, Input, Button, Icon as IconNB, Left, Right, Body, Footer, FooterTab, Badge, H3, ActionSheet } from "native-base";

import QRCode from "react-native-qrcode-svg";

import { NavigationUtils, LoggerUtils } from "../utils/Utils";

type Props = {};

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    var self = this;

    const { navigation } = props;
    const title = navigation.getParam("title", "");
    const data = navigation.getParam("data", "");

    self.options = {
      color: "#000",
      backgroundColor: "#FFF",
      size: 200
    };

    LoggerUtils.log("init QRCodeGenerator", "title", title, "data", data);

    self.state = {
      title,
      data
    };
  }

  render() {
    const { title, data } = this.state;
    const { navigation } = this.props;
    const { color, backgroundColor, size } = this.options;

    LoggerUtils.log("render QRCodeGenerator",
      "title", title, "data", data, "color", color, 
      "backgroundColor", backgroundColor, "size", size
    );

    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => NavigationUtils.goBack(navigation)}>
              <IconNB name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>{title}</Title>
          </Body>
          <Right style={{flex: 1}}>
            
          </Right>
        </Header>

        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }} >
          <QRCode
            value={data}
            color={color}
            backgroundColor={backgroundColor}
            size={size}
          // logoSize={30}
          // logo={ {uri: 'base64' } }
          />
          <View>
            <Text style={{
              color: "#000",
              fontSize: 18,
              marginTop: 10,
            }}>{data}</Text>
          </View>
        </View>
      </Container>
    );
  }
}
