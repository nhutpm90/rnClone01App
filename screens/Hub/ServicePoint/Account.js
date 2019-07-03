import React, { Component } from "react";
import { View, Text, FlatList, Image, TouchableWithoutFeedback } from "react-native";

import { Container, Header, Title, Content, Button, Icon, Left, Right, Body, Text as NBText, 
  ListItem, List } from "native-base";

import _ from 'lodash';

import masterStore from '../store/MasterStore';

import { NavigationUtils, LoggerUtils } from '../utils/Utils';

export default class App extends Component {
  constructor(props) {
    LoggerUtils.log('init Account');
    super(props);
    var self = this;

    this.state = {
      menuItems: this._getMenuItems()
    };
  }
  
  _getMenuItems() {
    const { userInfo } = masterStore.getUser();

    const hubName = _.get(userInfo, "hub.name");
    const menuItems = [];
    menuItems.push({
      key: "Menu_Hub_Name",
      text: hubName,
    });
    menuItems.push({
      key: "Menu_QR",
      text: "Mã QR",
    });
    menuItems.push({
      key: "Menu_Payment",
      text: "Thông tin thanh toán",
    });
    menuItems.push({
      key: "Menu_About",
      text: "Về iLogic",
    });
    menuItems.push({
      key: "Menu_Logout",
      text: "Đăng xuất",
    });
    return menuItems;
  }

  _onMenuItemClicked = ({ key }) => {
    LoggerUtils.log('_onMenuItemClicked', 'key', key);
    const { navigation } = this.props;
    switch(key) {
      case "Menu_Hub_Name":
        NavigationUtils.navigateToHomeScreen(navigation);
        break;
      case "Menu_QR":
        break;
      case "Menu_Payment":
        break;
      case "Menu_About":
        break;
      case "Menu_Logout":
        NavigationUtils.navigateToLoginScreen(navigation);
        break;
      default:
        break;
    }
  }

  render() {
    LoggerUtils.log('render Account');
    const { userInfo } = masterStore.getUser();
    const { menuItems } = this.state;

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
                  <NBText>{_.get(userInfo, 'userName')}</NBText>
                  {/* <Text>Edit Profile ></Text> */}
                </View>
              </View>
            </TouchableWithoutFeedback>
            <View>
              <FlatList
                data={menuItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <ListItem button onPress={() => this._onMenuItemClicked(item)} >
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