import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableWithoutFeedback } from "react-native";

import { Container, Header, Title, Subtitle, Content, Button, Icon, Left, Right, Body } from "native-base";

class InboxList extends Component {

  _getData() {
    const data = [];
    const dataTemplate = {
      id: "",
      name: "Lorem ipsum dolor sit amet",
      imageUrl: "https://cdn.dribbble.com/users/1236180/screenshots/4440250/shot.jpg",
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
            <TouchableWithoutFeedback onPress={() => alert('on press:: id - '+ item.id)}>
              <View style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "#FFFFFF",
                paddingVertical: 6,
              }} >
                <View style={{ justifyContent: "center" }} >
                  <Image source={{ uri: item.imageUrl }} style={{ width: 50, height: 50, margin: 5 }} />
                </View>
                <View style={{ 
                  flex: 1,
                  justifyContent: "center",
                  // backgroundColor: "yellow",
                }} >
                  <Text numberOfLines={1}>{item.id + 1}. {item.name}</Text>
                  <Text numberOfLines={1}>{item.description}</Text>
                </View>
                <View style={{ 
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  // backgroundColor: "blue",
                }} >
                  <Text style={{ fontSize: 20 }} >></Text>
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
  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Inbox</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => alert('on press:: delete')}>
              <Icon name="trash" />
            </Button>
          </Right>
        </Header>
        <Content style={{ backgroundColor: "#E3E8EB" }}>
          <InboxList/>
        </Content>
      </Container>
    );
  }
}