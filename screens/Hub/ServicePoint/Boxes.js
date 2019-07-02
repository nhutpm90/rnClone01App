import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Alert, Vibration } from "react-native";

import { Container, Header, Title, Subtitle, Content, Item, Form, 
  Text as TextNB, Input, Button, Icon as IconNB, Left, Right, Body, Footer, FooterTab, Badge, H3 } from "native-base";

import { FloatingAction } from "react-native-floating-action";

import CodeScanner from '../components/CodeScanner';

import OrderService from '../services/OrderService';
import AccountService from '../services/AccountService';

import HubService from '../services/HubService';

class BoxList extends Component {

  constructor(props) {
    super(props);
    var self = this;
  }

  // _getData() {
  //   const data = [];
  //   const dataTemplate = {
  //     id: "",
  //     name: "Lorem ipsum dolor sit amet",
  //     imageUrl: "https://cdn.dribbble.com/users/1236180/screenshots/4440250/shot.jpg",
  //     description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo"
  //   };

  //   for (var i = 0; i < 25; i++) {
  //     data.push({ ...dataTemplate, id: i, name: "C"+(i+1) });
  //   }
  //   return data;
  // }

  _getData() {
    const { boxes } = this.props;
    return boxes;
  }

  render() {
    const data = this._getData();

    return (
      <View style={{ flex: 1, }} >
        <FlatList contentContainerStyle={{margin: 16, backgroundColor: '#FFFFFF'}}
          data={data}
          ItemSeparatorComponent={() => (
            <View style={{ 
              height: 0.5,
              backgroundColor: "#DCE1E5",
              marginHorizontal: 16
            }} />
          )}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Orders')}>
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
    );
  }
}

export default class App extends Component {

  static navigationOptions = {
    tabBarVisible: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      hub: {},
      showScanner: false,
      // qrData: '',
      qrData: 'ILG004646', // debug code
      scanAction: '',
    };

    const ACTION_SCAN_DRIVER = "ACTION_SCAN_DRIVER";
    const ACTION_PUT_INTO_SHELF = "ACTION_PUT_INTO_SHELF";
    const ACTION_SCAN_CUSTOMER = "ACTION_SCAN_CUSTOMER";
    const ACTION_OTP = "ACTION_OTP";

    this.options = {
      ACTION_SCAN_DRIVER, ACTION_PUT_INTO_SHELF, ACTION_SCAN_CUSTOMER, ACTION_OTP,
      floatingButtons : [
        {
          position: 1,
          text: "Quét mã tài xế",
          color: "#B233E5",
          textBackground: "#B233E5",
          textColor: "#FFF",
          icon: require("../../../images/qr-code.png"),
          name: ACTION_SCAN_DRIVER,
        },
        {
          text: "Đặt vào kệ",
          color: "#008CE1",
          textBackground: "#008CE1",
          textColor: "#FFF",
          icon: require("../../../images/qr-code.png"),
          name: ACTION_PUT_INTO_SHELF,
          position: 2
        },
        {
          text: "Khách hàng",
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

    var { ACTION_SCAN_DRIVER, ACTION_PUT_INTO_SHELF, ACTION_SCAN_CUSTOMER, ACTION_OTP } = this.options;
    
    switch(name) {
      case ACTION_SCAN_DRIVER:
        // Alert.alert(`scan driver`);
        this.setState({
          qrData: '',
          showScanner: true,
          scanAction: name,
        });
        break;
      case ACTION_PUT_INTO_SHELF:
        Alert.alert(`put into shelf`);
        break;
      case ACTION_SCAN_CUSTOMER:
        // Alert.alert(`scan customer`);
        this.setState({
          qrData: '',
          showScanner: true,
          scanAction: name,
          qrData: 'ILG004641', // debug code
        });
        break;
      case ACTION_OTP:
        Alert.alert(`otp`);
        break;
      default:
    }
  }

  _hideScanner = () => {
    this.setState({ showScanner: false, scanAction: '' });
  }

  _barcodeRecognized = (barcodes) => {
    const firstCode  = barcodes[0];
    const { data } = firstCode;

    // console.warn("_barcodeRecognized:: " + JSON.stringify(barcodes));
    this.setState({qrData: data});
  }

  _showOrderDetail = () => {
    const { qrData } = this.state;
    const param = {
      orderCode: qrData,
    };
    this.props.navigation.navigate('OrderDetail', param);
  }

  _renderScanner = () => {
    const { qrData } = this.state;
    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={this._hideScanner}>
              <IconNB name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>1.Quét mã QR</Title>
          </Body>
          <Right style={{flex: 1}}>
          </Right>
        </Header>

        <View style={{flex: 1}}>
          <View style={{flex: 1, overflow: 'hidden'}}>
            <CodeScanner barcodeRecognized={this._barcodeRecognized}/>
          </View>
          <View>
            <View style={{
              // borderColor: 'red', 
              // borderWidth: 1
            }}>
              <Text style={{fontSize: 17, color: "#000", paddingTop: 5, paddingLeft: 5}}>2. Hoặc</Text>
            </View>
            <Form>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingRight: 5,
                // borderColor: 'red',
                // borderWidth: 1,
              }}>
                <Item style={{flex : 1}}>
                  {/* <Text>ILG</Text> */}
                  <Input placeholder='Nhập mã đơn hàng'>{qrData}</Input>
                </Item>
                <Item>
                  <Button onPress={this._showOrderDetail}>
                    <TextNB>Đồng ý</TextNB>
                  </Button>
                </Item>
              </View>
            </Form>
          </View>
        </View>
      </Container>
    );
  }

  _renderMainScreen = () => {
    const { hub } = this.state;
    const { floatingButtons } = this.options;
    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}></Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>{hub.name}</Title>
          </Body>
          <Right style={{flex: 1}}>
          </Right>
        </Header>
        <Content style={{ backgroundColor: "#E3E8EB" }}>
          <BoxList {...this.props} boxes={hub.boxes} />
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
  
  componentDidMount() {
    const self = this;
    // HubService.hubDetail('HQ3-01').then(response => {
    //   const hub = response.data.data;
    //   console.log(`hub detail ${JSON.stringify(hub)}`);
    //   this.setState({ hub });

    //   self._showOrderDetail(); // debug code
    // });
  }

  render() {
    const { showScanner } = this.state;
    if(showScanner) {
      return this._renderScanner();
    }
    
    return this._renderMainScreen();
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