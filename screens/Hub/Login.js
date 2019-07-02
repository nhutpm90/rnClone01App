import React, { Component } from "react";
import { View, TouchableWithoutFeedback } from "react-native";

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  Label,
  Input,
  Body,
  Left,
  Right,
  Icon,
  IconNB,
  Form,
  Text,
  Textarea,
  Picker,
  Toast
} from "native-base";

import _ from 'lodash';
import AccountService from './services/AccountService';

import masterStore from './store/MasterStore';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: "",
      formData: { 
        username: "", 
        password: "",
      },
    };
  }

  _updateValue(text, field) {
    const { formData } = this.state;
    formData[field] = text;
    this.setState({ formData });
  }

  _login = () => {
    const { formData } = this.state;
    const username = _.get(formData, "username");
    const password = _.get(formData, "password");

    console.log(`_login:: username['${username}'] - password['${password}']`);
    if(username == undefined || username == '') {
      Toast.show({ text: "Nhập số điện thoại !", duration: 1000 });
      return;
    }
    if(password == undefined || password == '') {
      Toast.show({ text: "Nhập mật khẩu !", duration: 1000 });
      return;
    }
    this._authenticate(username, password);
  }

  _authenticate = (username, password) => {
    const self = this;
    AccountService.hubAccountInfo(username).then(response => {
      console.log(`_authenticate:: hubAccountInfo:: response['${JSON.stringify(response.data)}']`);
      const data = response.data;
      const success = data.success;
      if(success == true) {
        const accountInfo = data.data;
        AccountService.login(username, password).then(response => {
          console.log(`_authenticate:: login:: response['${JSON.stringify(response.data)}']`);
          const data = response.data;
          masterStore.setUser(data);
          self.props.navigation.navigate('ServicePointMain');
        }).catch(function (e) {
          const error = Object.assign({}, e);
          const errorCode = _.get(error, 'response.status');
          if(errorCode == 400) {
            Toast.show({ text: "Tài khoản không hợp lệ", duration: 1000 });
          }
        });
      } else {
        Toast.show({ text: "Tài khoản không hợp lệ", duration: 1000 });
      }
    });
  }

  render() {
    return (
      <Container>
        <Form style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1
        }} >
          <Item floatingLabel>
            <Label>Số điện thoại</Label>
            <Input onChangeText={text => this._updateValue(text, "username")} />
          </Item>
          <Item floatingLabel>
            <Label>Mật khẩu</Label>
            <Input secureTextEntry 
              onChangeText={text => this._updateValue(text, "password")} />
          </Item>
          <Button block style={{ margin: 15, marginTop: 50 }}
            onPress={this._login}>
            <Text>Đăng nhập</Text>
          </Button>
          {/* debug code start */}
          <Button block style={{ marginHorizontal: 15, marginBottom: 5 }}
            onPress={() => this._authenticate("0909795262", "123456")}>
            <Text>SP Võ Văn Tần</Text>
          </Button>
          <Button block style={{ marginHorizontal: 15, marginBottom: 5 }}
            onPress={() => this._authenticate("0911111111", "123456")}>
            <Text>SP Điện Biên Phủ</Text>
          </Button>
          <Button block style={{ marginHorizontal: 15, marginBottom: 5 }}
            onPress={() => this._authenticate("0938674470", "1234561")}>
            <Text>SP Vũng Tàu</Text>
          </Button>
          {/* debug code end */}
        </Form>
      </Container>
    );
  }
}


// {
//   "success": true,
//   "data": {
//     "created": 1536219225000,
//     "userName": "0909795262",
//     "hubberCode": "ILG1904002",
//     "fullName": "0909795262",
//     "phoneNumber": "0909795262",
//     "email": "van.nguyen@ilogic.vn",
//     "imgProfile": "./asset/IMAGE/ios_avatar_0909795262_1542872226.jpg",
//     "active": true,
//     "accountNonLocked": true,
//     "roles": [
//       "ROLE_SORTING_STAFF",
//       "ROLE_HUB_STAFF"
//     ],
//     "firstLogin": false,
//     "hub": {
//       "id": 4,
//       "hubType": "HUB_MANUAL",
//       "code": "HQ3-01",
//       "name": "iLogic SP-Võ Văn Tần",
//       "image": "",
//       "phone": "",
//       "location": {
//         "id": 97,
//         "lat": 10.777473,
//         "lng": 106.691238,
//         "address": "63A Võ Văn Tần, Phường 6, Quận 3, Hồ Chí Minh",
//         "placeName": "iLogic SP-Võ Văn Tần",
//         "street": "Võ Văn Tần",
//         "level1": "Hồ Chí Minh",
//         "level2": "Quận 3"
//       },
//       "startWorkingHour": null,
//       "endWorkingHour": null,
//       "description": null,
//       "live": true,
//       "distance": null,
//       "locationType": null,
//       "capacity": {
//         "B_LARGE": 1,
//         "B_MEDIUM": 0,
//         "B_SMALL": 0
//       },
//       "usedCapacity": {
//         "B_LARGE": 1,
//         "B_MEDIUM": 0,
//         "B_SMALL": 0
//       },
//       "availableCapacity": {
//         "B_LARGE": 0,
//         "B_MEDIUM": 0,
//         "B_SMALL": 0
//       },
//       "boxes": [
//         {
//           "id": 19,
//           "code": "C01",
//           "boxSize": "B_LARGE",
//           "orderCodes": [
//             {
//               "orderCode": "ILG002954",
//               "parcelDimension": "LARGE_SIZED",
//               "boxGoodStatus": "SOMETHING",
//               "orderStatus": null,
//               "token": null
//             },
//             {
//               "orderCode": "ILG003050",
//               "parcelDimension": "MEDIUM_SIZED",
//               "boxGoodStatus": "SOMETHING",
//               "orderStatus": null,
//               "token": null
//             },
//             {
//               "orderCode": "ILG004194",
//               "parcelDimension": "LARGE_SIZED",
//               "boxGoodStatus": "SOMETHING",
//               "orderStatus": null,
//               "token": null
//             }
//           ],
//           "boxGoodsStatus": "SOMETHING",
//           "boxOpenStatus": "CLOSE",
//           "driverBooard": "B-VO VAN TAN",
//           "updated": 1561961977000
//         }
//       ],
//       "active": true,
//       "homelessCount": 0,
//       "zones": null,
//       "placeName": null,
//       "mapUrl": null,
//       "shortenMapUrl": null
//     }
//   }
// }