import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback } from "react-native";

import { Container, Header, Title, Subtitle, Content, 
  Button, Icon, IconNB, Left, Right, Body, Footer, FooterTab, Badge } from "native-base";

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
      tab1: false,
      tab2: false,
      tab3: true,
      tab4: false
    };
  }

  toggleTab1() {
    this.setState({
      tab1: true,
      tab2: false,
      tab3: false,
      tab4: false
    });
  }
  toggleTab2() {
    this.setState({
      tab1: false,
      tab2: true,
      tab3: false,
      tab4: false
    });
  }
  toggleTab3() {
    this.setState({
      tab1: false,
      tab2: false,
      tab3: true,
      tab4: false
    });
  }
  toggleTab4() {
    this.setState({
      tab1: false,
      tab2: false,
      tab3: false,
      tab4: true
    });
  }

  render() {
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
      </Container>
    );
  }
}