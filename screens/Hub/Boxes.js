import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Alert, Vibration } from "react-native";

import { Container, Header, Title, Subtitle, Content, Item, Form, 
  Text as TextNB, Input, Button, Icon as IconNB, Left, Right, Body, Footer, FooterTab, Badge, H3 } from "native-base";

import { FloatingAction } from "react-native-floating-action";

import CodeScanner from './components/CodeScanner';


class BoxList extends Component {

  _getData() {
    const data = [];
    const dataTemplate = {
      id: "",
      name: "Lorem ipsum dolor sit amet",
      imageUrl: "https://cdn.dribbble.com/users/1236180/screenshots/4440250/shot.jpg",
      description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo"
    };

    for (var i = 0; i < 25; i++) {
      data.push({ ...dataTemplate, id: i, name: "C"+(i+1) });
    }
    return data;
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
                  <Text>B-Vo Van Tan</Text>
                  <Text>Có hàng</Text>
                </View>
                <View style={{ 
                  flex: 1,
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  // backgroundColor: "blue",
                }} >
                  <Text>ILG002954</Text>
                  <Text>ILG002955</Text>
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

  constructor(props) {
    super(props);
    this.state = {
      showScanner: false,
      qrData: '',
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
          icon: require("../../images/qr-code.png"),
          name: ACTION_SCAN_DRIVER,
        },
        {
          text: "Đặt vào kệ",
          color: "#008CE1",
          textBackground: "#008CE1",
          textColor: "#FFF",
          icon: require("../../images/qr-code.png"),
          name: ACTION_PUT_INTO_SHELF,
          position: 2
        },
        {
          text: "Khách hàng",
          color: "#00BF9D",
          textBackground: "#00BF9D",
          textColor: "#FFF",
          icon: require("../../images/qr-code.png"),
          name: ACTION_SCAN_CUSTOMER,
          position: 3
        },
        {
          text: "Nhập mã OTP",
          color: "#FFC25F",
          textBackground: "#FFC25F",
          textColor: "#FFF",
          icon: require("../../images/sms.png"),
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
        });
        break;
      case ACTION_PUT_INTO_SHELF:
        Alert.alert(`put into shelf`);
        break;
      case ACTION_SCAN_CUSTOMER:
        Alert.alert(`scan customer`);
        break;
      case ACTION_OTP:
        Alert.alert(`otp`);
        break;
      default:
    }
  }

  _hideScanner = () => {
    this.setState({showScanner: false});
  }

  _barcodeRecognized = (barcodes) => {
    const firstCode  = barcodes[0];
    const { data } = firstCode;

    // console.warn("_barcodeRecognized:: " + JSON.stringify(barcodes));
    this.setState({qrData: data});
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
                  <Input placeholder='Nhập mã đơn hàng'>{qrData}</Input>
                </Item>
                <Item>
                  <Button onPress={() => this.props.navigation.navigate('OrderDetail')}>
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
    const { floatingButtons } = this.options;
    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}></Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>iLogic SP-Vo Van Tan</Title>
          </Body>
          <Right style={{flex: 1}}>
          </Right>
        </Header>
        <Content style={{ backgroundColor: "#E3E8EB" }}>
          <BoxList {...this.props} />
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
  
  render() {
    const { showScanner } = this.state;
    if(showScanner) {
      return this._renderScanner();
    }
    
    return this._renderMainScreen();
  }
}