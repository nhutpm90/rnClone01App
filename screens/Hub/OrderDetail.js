import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback } from "react-native";

import { Container, Header, Title, Subtitle, Content, Icon, Button, Left, Right, Body, Card, CardItem } from "native-base";

export default class App extends Component {
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "#051B49"}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{color: "#FFF"}}>Chi tiết đơn hàng</Title>
          </Body>
          <Right style={{flex: 1}}>
            
          </Right>
        </Header>
        <Content style={{ backgroundColor: "#FFF" }}>
          <View style={{flex: 1, padding: 10, }}>
            {/* Section 1 */}
            <View style={{
              flex: 1, 
              flexDirection: 'row',
              // borderColor: 'green',
              borderWidth: 1,
            }}>
              <View style={{
                flex: 1,
                // borderWidth: 1,
              }}>
                <Text>FO - ILG004601</Text>
                <Text style={{marginTop: 10}}>25/06/2019 17:57:41</Text>
              </View>
              
              <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                // borderWidth: 1,
              }}>
                <View style={{
                  backgroundColor: 'blue',
                  padding: 12,
                  marginRight: 5
                }}></View>
                <View>
                  <Text>Đã giao</Text>
                </View>
              </View>
            </View>

            {/* Section 2 */}
            <View style={{
              flexDirection: 'column',
              marginTop: 20,
              borderWidth: 1,
            }}>
              <View>
                <Text>From: 15 Võ Văn Kiệt, Phường Nguyễn Thái Bình, Quận 1, Hồ Chí Minh, Việt Nam</Text>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text>Sender 01</Text>
                  <Text>0938674470</Text>
                </View>
              </View>
              <View style={{
                alignItems: 'center'
              }}>
                <Text>|</Text>
                <Text>|</Text>
              </View>
              <View>
                <Text>To: 177 Lý Tự Trọng, Phường Bến Thành, Quận 1</Text>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text>Receiver 01</Text>
                  <Text>0938674470</Text>
                </View>
              </View>
            </View>

            {/* Section 3 */}
            <View style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
              borderWidth: 1,
            }}>
              <View style={{
                flexDirection: 'column',
              }}>
                <View>
                  <Text>Mã Vận Đơn</Text>
                </View>
                <View>
                  <Text>185067829288490485</Text>
                </View>
              </View>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Icon name="qr-scanner" color="#000" size={24} />
              </View>
            </View>

            {/* Section 4 */}
            <View style={{
              flexDirection: 'column',
              marginTop: 20,
              borderWidth: 1,
            }}>
              <View>
                <Text>Hình ảnh</Text>
              </View>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 90,
                  height: 90,
                  borderWidth: 1,
                }}>
                  <Text>Chạm để chụp</Text>
                </View>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 90,
                  height: 90,
                  borderWidth: 1,
                }}>
                  <Text>Chạm để chụp</Text>
                </View>
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 90,
                  height: 90,
                  borderWidth: 1,
                }}>
                  <Text>Chạm để chụp</Text>
                </View>
              </View>
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}