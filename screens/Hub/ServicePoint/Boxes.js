import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Alert, Vibration,
  ActivityIndicator, RefreshControl } from "react-native";

import { Container, Header, Title, Subtitle, Content, Item, Form, 
  Text as TextNB, Input, Button, Icon as IconNB, Left, Right, Body, Footer, FooterTab, Badge, H3 } from "native-base";

import _ from 'lodash';

import { FloatingAction } from "react-native-floating-action";

import { NavigationUtils, LoggerUtils } from '../utils/Utils';

import CodeScanner from '../components/CodeScanner';

import OrderService from '../services/OrderService';
import AccountService from '../services/AccountService';

import HubService from '../services/HubService';

import masterStore from '../store/MasterStore';

export default class App extends Component {

  constructor(props) {
    LoggerUtils.log('Boxes:: init');
    super(props);

    this.state = {
      refreshing: false,
      hub: {},
      scanAction: '',
    };

    const ACTION_SCAN_DRIVER = "ACTION_SCAN_DRIVER";
    const ACTION_PUT_INTO_SHELF = "ACTION_PUT_INTO_SHELF";
    const ACTION_SCAN_CUSTOMER = "ACTION_SCAN_CUSTOMER";
    const ACTION_OTP = "ACTION_OTP";

    this.options = {
      ACTION_SCAN_DRIVER, ACTION_PUT_INTO_SHELF, ACTION_SCAN_CUSTOMER, ACTION_OTP,
      floatingButtons : [
        // {
        //   position: 1,
        //   text: "Quét mã tài xế",
        //   color: "#B233E5",
        //   textBackground: "#B233E5",
        //   textColor: "#FFF",
        //   icon: require("../../../images/qr-code.png"),
        //   name: ACTION_SCAN_DRIVER,
        // },
        // {
        //   text: "Đặt vào kệ",
        //   color: "#008CE1",
        //   textBackground: "#008CE1",
        //   textColor: "#FFF",
        //   icon: require("../../../images/qr-code.png"),
        //   name: ACTION_PUT_INTO_SHELF,
        //   position: 2
        // },
        {
          text: "Quét mã tài xế",
          color: "#008CE1",
          textBackground: "#008CE1",
          textColor: "#FFF",
          icon: require("../../../images/qr-code.png"),
          name: ACTION_SCAN_DRIVER,
          position: 2
        },
        {
          text: "Đơn hàng",
          color: "#00BF9D",
          textBackground: "#00BF9D",
          textColor: "#FFF",
          icon: require("../../../images/qr-code.png"),
          name: ACTION_SCAN_CUSTOMER,
          position: 3
        },
        {
          text: "Nhập mã OTP",
          color: "#FFC25F",
          textBackground: "#FFC25F",
          textColor: "#FFF",
          icon: require("../../../images/sms.png"),
          name: ACTION_OTP,
          position: 4
        }
      ]
    };
  }

  _actionButtonPressed = (name) => {
    LoggerUtils.log('_actionButtonPressed', 'action', name);

    const { hub } = this.state; 
    
    const { navigation } = this.props;
    var { ACTION_SCAN_DRIVER, ACTION_PUT_INTO_SHELF, ACTION_SCAN_CUSTOMER, ACTION_OTP } = this.options;
    
    switch(name) {
      case ACTION_SCAN_DRIVER:
        NavigationUtils.navigateToDriverScannerScreen(navigation, hub);
        break;
      case ACTION_SCAN_CUSTOMER:
        NavigationUtils.navigateToCustomerScannerScreen(navigation);
        break;
      case ACTION_OTP:
        NavigationUtils.navigateToInputOTPScreen(navigation, hub);
        break;
      default:
    }
  }

  _ordersByBoxId = (boxId) => {
    LoggerUtils.log('_ordersByBoxId', 'boxId', boxId);
    const { navigation } = this.props;
    NavigationUtils.navigateToOrdersScreen(navigation, boxId);
  }

  onRefresh() {
    LoggerUtils.log("onRefresh Boxes");
    this._refresh();
  }

  _refresh = () => {
    this.setState({ refreshing: true });

    const hubCode = masterStore.getUser().getHubCode();
    LoggerUtils.log('_refresh Boxes', 'hubCode', hubCode);
    HubService.hubDetail(hubCode).then(response => {
      LoggerUtils.log('hubDetail', 'hubCode', hubCode, 'response', JSON.stringify(response));
      if(_.get(response, 'data.success') == true) {
        const hub = _.get(response, 'data.data');
        this.setState({ hub, refreshing: false });
        // debug code begin
        // NavigationUtils.navigateToInputOTPScreen(this.props.navigation, hub);

        // const driverCode = "ILG1809019";
        // NavigationUtils.navigateToDriverOrdersScreen(this.props.navigation, hub, driverCode);
        // debug code end
      } else {
        const data = _.get(response, 'data.data');
        const errorCode = _.get(data, 'errorCode');
        const params = _.get(data, 'params');
        LoggerUtils.log('hubDetail:: error', 'errorCode', errorCode, 'params', JSON.stringify(params));
        this.setState({ refreshing: false });
      }
    });
  }
  
  componentDidMount() {
    LoggerUtils.log('componentDidMount Boxes');
    this._refresh();
  }

  render() {
    LoggerUtils.log('render Boxes');
    const { refreshing, hub } = this.state;
    const { boxes } = hub;

    const { floatingButtons } = this.options;

    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}></Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>{hub.name}</Title>
          </Body>
          <Right style={{flex: 1}}>
            <Button transparent onPress={this._refresh} >
              <IconNB name="refresh" />
            </Button>
          </Right>
        </Header>
        <Content style={{ backgroundColor: "#E3E8EB" }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }>
          <View style={{ flex: 1, }} >
            <FlatList contentContainerStyle={{margin: 16, backgroundColor: '#FFFFFF'}}
              data={boxes}
              ItemSeparatorComponent={() => (
                <View style={{ 
                  height: 0.5,
                  backgroundColor: "#DCE1E5",
                  marginHorizontal: 16
                }} />
              )}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={({ item, index }) => (
                <TouchableWithoutFeedback onPress={() => this._ordersByBoxId(item.id)}>
                  <View style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: "#FFFFFF",
                    paddingVertical: 6,
                  }} >
                    <View style={{ 
                      flex: 2,
                      justifyContent: "center",
                      // backgroundColor: "yellow",
                    }} >
                      <Text>{`${item.driverBooard} - ${item.code}`}</Text>
                    </View>
                    <View style={{ 
                      flex: 1,
                      justifyContent: "center",
                      paddingHorizontal: 10,
                      // backgroundColor: "blue",
                    }} >
                      { 
                        item.orderCodes.map((item, i) => (
                          <Text key={item.orderCode}>{item.orderCode}</Text>
                        )) 
                      }
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
          </View>
        </Content>

        <FloatingAction
          showBackground={false}
          actions={floatingButtons}
          position="right"
          color="#F05553"
          onPressItem={this._actionButtonPressed}
        />
      </Container>
    );
  }
}

// {
//   "success": true,
//   "data": {
//     "id": 4,
//     "hubType": "HUB_MANUAL",
//     "code": "HQ3-01",
//     "name": "iLogic SP-Võ Văn Tần",
//     "image": "",
//     "phone": "",
//     "location": {
//       "id": 97,
//       "lat": 10.777473,
//       "lng": 106.691238,
//       "address": "63A Võ Văn Tần, Phường 6, Quận 3, Hồ Chí Minh",
//       "placeName": "iLogic SP-Võ Văn Tần",
//       "street": "Võ Văn Tần",
//       "level1": "Hồ Chí Minh",
//       "level2": "Quận 3"
//     },
//     "startWorkingHour": null,
//     "endWorkingHour": null,
//     "description": null,
//     "live": true,
//     "distance": null,
//     "locationType": "BUILDING",
//     "capacity": {
//       "B_SMALL": 0,
//       "B_MEDIUM": 0,
//       "B_LARGE": 1
//     },
//     "usedCapacity": {
//       "B_SMALL": 0,
//       "B_MEDIUM": 0,
//       "B_LARGE": 1
//     },
//     "availableCapacity": {
//       "B_SMALL": 0,
//       "B_MEDIUM": 0,
//       "B_LARGE": 0
//     },
//     "boxes": [
//       {
//         "id": 19,
//         "code": "C01",
//         "boxSize": "B_LARGE",
//         "orderCodes": [
//           {
//             "orderCode": "ILG002954",
//             "parcelDimension": "LARGE_SIZED",
//             "boxGoodStatus": "SOMETHING",
//             "orderStatus": null,
//             "token": null
//           },
//           {
//             "orderCode": "ILG003050",
//             "parcelDimension": "MEDIUM_SIZED",
//             "boxGoodStatus": "SOMETHING",
//             "orderStatus": null,
//             "token": null
//           },
//           {
//             "orderCode": "ILG004194",
//             "parcelDimension": "LARGE_SIZED",
//             "boxGoodStatus": "SOMETHING",
//             "orderStatus": null,
//             "token": null
//           }
//         ],
//         "boxGoodsStatus": "SOMETHING",
//         "boxOpenStatus": "CLOSE",
//         "driverBooard": "B-VO VAN TAN",
//         "updated": 1561961977000
//       }
//     ],
//     "active": true,
//     "homelessCount": 156,
//     "zones": [],
//     "placeName": "iLogic SP-Võ Văn Tần",
//     "mapUrl": null,
//     "shortenMapUrl": null
//   }
// }