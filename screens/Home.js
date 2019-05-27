import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet, FlatList, Image, ImageBackground, TouchableWithoutFeedback } from "react-native";

import { Container, Header, Title, Subtitle, Content, Button, Left, Right, Body, Text as NBText, Icon } from "native-base";

export default class App extends Component {
  
  render() {
    return (
      <Container>
        <Content>
          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
            backgroundColor: "#FFFFFF",
          }}>
            <Text>Good Morning, </Text>
            <NBText>Jon Snow!</NBText>
          </View>
          
          <ScrollView contentContainerStyle={{
          }}>
            <View style={{
              flexDirection: "column",
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#ECEDEF",
              padding: 18,
              marginHorizontal: 18,
              // backgroundColor: "red", // debug
            }}>
              <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Payment')}>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ECEDEF",
                }}>
                  <NBText>Balance</NBText>
                  <NBText>45.526 ></NBText>
                </View>
              </TouchableWithoutFeedback>

              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 16,
              }}>
                <TouchableWithoutFeedback onPress={() => alert('on press Pay')}>
                  <View style={{flexDirection: "column", alignItems: "center"}}>
                    <Icon name="barcode" style={{ color: "#999" }} />
                    <Text numberOfLines={1} style={{fontSize: 12}}>Pay</Text>
                  </View>
                </TouchableWithoutFeedback>
                <View style={{flexDirection: "column", alignItems: "center"}}>
                  <Icon name="images" style={{ color: "#999" }} />
                  <Text numberOfLines={1} style={{fontSize: 12}}>Request</Text>
                </View>
                <View style={{flexDirection: "column", alignItems: "center"}}>
                  <Icon name="images" style={{ color: "#999" }} />
                  <Text numberOfLines={1} style={{fontSize: 12}}>Top Up</Text>
                </View>
                <View style={{flexDirection: "column", alignItems: "center"}}>
                  <Icon name="images" style={{ color: "#999" }} />
                  <Text numberOfLines={1} style={{fontSize: 12}}>Rewards</Text>
                </View>
              </View>
            </View>
            
            <View style={{
              flexDirection: "column",
              marginHorizontal: 18,
              marginVertical: 20,
              // backgroundColor: "green", // debug
            }}>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}>
                <NBText>Nearby Merchants</NBText>
                <Icon name="more" />
              </View>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                <TouchableWithoutFeedback onPress={() => alert('on press card')}>
                  <View style={{ 
                    overflow: 'hidden',
                    borderWidth: 1, 
                    borderRadius: 5, 
                    marginRight: 10, 
                    borderColor: "#dddddd",
                    width: 130, 
                    height: 130,
                  }}>
                    <ImageBackground source={{ 
                      uri: "https://cdn-images-1.medium.com/max/2600/1*kihoKe7-LMxd7zr_VrTB9w.jpeg" }} 
                      style={{ 
                        justifyContent: 'flex-end',
                        width: '100%', 
                        height: '100%',
                    }}>
                      <Text style={{ color: "#FFFFFF"}}>Description</Text>
                    </ImageBackground>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => alert('on press card')}>
                  <View style={{ 
                    overflow: 'hidden',
                    borderWidth: 1, 
                    borderRadius: 5, 
                    marginRight: 10, 
                    borderColor: "#dddddd",
                    width: 130, 
                    height: 130,
                  }}>
                    <ImageBackground source={{ 
                      uri: "https://cdn-images-1.medium.com/max/2600/1*kihoKe7-LMxd7zr_VrTB9w.jpeg" }} 
                      style={{ 
                        justifyContent: 'flex-end',
                        width: '100%', 
                        height: '100%',
                    }}>
                      <Text style={{ color: "#FFFFFF"}}>Description</Text>
                    </ImageBackground>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => alert('on press card')}>
                  <View style={{ 
                    overflow: 'hidden',
                    borderWidth: 1, 
                    borderRadius: 5, 
                    marginRight: 10, 
                    borderColor: "#dddddd",
                    width: 130, 
                    height: 130,
                  }}>
                    <ImageBackground source={{ 
                      uri: "https://cdn-images-1.medium.com/max/2600/1*kihoKe7-LMxd7zr_VrTB9w.jpeg" }} 
                      style={{ 
                        justifyContent: 'flex-end',
                        width: '100%', 
                        height: '100%',
                    }}>
                      <Text style={{ color: "#FFFFFF"}}>Description</Text>
                    </ImageBackground>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => alert('on press card')}>
                  <View style={{ 
                    overflow: 'hidden',
                    borderWidth: 1, 
                    borderRadius: 5, 
                    marginRight: 10, 
                    borderColor: "#dddddd",
                    width: 130, 
                    height: 130,
                  }}>
                    <ImageBackground source={{ 
                      uri: "https://cdn-images-1.medium.com/max/2600/1*kihoKe7-LMxd7zr_VrTB9w.jpeg" }} 
                      style={{ 
                        justifyContent: 'flex-end',
                        width: '100%', 
                        height: '100%',
                    }}>
                      <Text style={{ color: "#FFFFFF"}}>Description</Text>
                    </ImageBackground>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => alert('on press card')}>
                  <View style={{ 
                    overflow: 'hidden',
                    borderWidth: 1, 
                    borderRadius: 5, 
                    marginRight: 10, 
                    borderColor: "#dddddd",
                    width: 130, 
                    height: 130,
                  }}>
                    <ImageBackground source={{ 
                      uri: "https://cdn-images-1.medium.com/max/2600/1*kihoKe7-LMxd7zr_VrTB9w.jpeg" }} 
                      style={{ 
                        justifyContent: 'flex-end',
                        width: '100%', 
                        height: '100%',
                    }}>
                      <Text style={{ color: "#FFFFFF"}}>Description</Text>
                    </ImageBackground>
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </View>

            <View style={{
              backgroundColor: "#F7F7F7",
              height: 8,
            }}></View>
            
            <View style={{
              flexDirection: "column",
              marginHorizontal: 18,
              marginVertical: 20,
              // backgroundColor: "yellow", // debug
            }}>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}>
                <NBText>Special deals</NBText>
                <Icon name="more" />
              </View>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                <TouchableWithoutFeedback onPress={() => alert('on press card')}>
                  <View style={{ 
                    overflow: 'hidden',
                    borderWidth: 1, 
                    borderRadius: 5, 
                    marginRight: 10, 
                    borderColor: "#dddddd",
                    width: 250, 
                  }}>
                    <Image source={{ 
                      uri: "https://cdn-images-1.medium.com/max/2600/1*kihoKe7-LMxd7zr_VrTB9w.jpeg" }} 
                      style={{ 
                        width: 250, 
                        height: 130,
                    }}>
                    </Image>
                    <View style={{
                      flex: 1,
                      paddingHorizontal: 18,
                    }}>
                      <NBText style={{
                        marginVertical: 10
                      }}>Lorem ipsum dolor sit amet</NBText>

                      <Text>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium</Text>
                      
                      <View style={{ 
                        alignItems: "center", 
                        paddingVertical: 10, 
                        borderBottomColor: "#dddddd", 
                        borderBottomWidth: 1}
                      }>
                        <NBText style={{ color: "#0CA6D5" }}>Open</NBText>
                      </View>

                      <View style={{ 
                        flexDirection: "row", 
                        alignItems: "center",
                        marginVertical: 8,
                      }}>
                        <Icon name="cloud-circle" />
                        <Text> 42</Text>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => alert('on press card')}>
                  <View style={{ 
                    overflow: 'hidden',
                    borderWidth: 1, 
                    borderRadius: 5, 
                    marginRight: 10, 
                    borderColor: "#dddddd",
                    width: 250, 
                  }}>
                    <Image source={{ 
                      uri: "https://cdn-images-1.medium.com/max/2600/1*kihoKe7-LMxd7zr_VrTB9w.jpeg" }} 
                      style={{ 
                        width: 250, 
                        height: 130,
                    }}>
                    </Image>
                    <View style={{
                      flex: 1,
                      paddingHorizontal: 18,
                    }}>
                      <NBText style={{
                        marginVertical: 10
                      }}>Lorem ipsum dolor sit amet</NBText>

                      <Text>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium</Text>
                      
                      <View style={{ 
                        alignItems: "center", 
                        paddingVertical: 10, 
                        borderBottomColor: "#dddddd", 
                        borderBottomWidth: 1}
                      }>
                        <NBText style={{ color: "#0CA6D5" }}>Open</NBText>
                      </View>

                      <View style={{ 
                        flexDirection: "row", 
                        alignItems: "center",
                        marginVertical: 8,
                      }}>
                        <Icon name="cloud-circle" />
                        <Text> 42</Text>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => alert('on press card')}>
                  <View style={{ 
                    overflow: 'hidden',
                    borderWidth: 1, 
                    borderRadius: 5, 
                    marginRight: 10, 
                    borderColor: "#dddddd",
                    width: 250, 
                  }}>
                    <Image source={{ 
                      uri: "https://cdn-images-1.medium.com/max/2600/1*kihoKe7-LMxd7zr_VrTB9w.jpeg" }} 
                      style={{ 
                        width: 250, 
                        height: 130,
                    }}>
                    </Image>
                    <View style={{
                      flex: 1,
                      paddingHorizontal: 18,
                    }}>
                      <NBText style={{
                        marginVertical: 10
                      }}>Lorem ipsum dolor sit amet</NBText>

                      <Text>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium</Text>
                      
                      <View style={{ 
                        alignItems: "center", 
                        paddingVertical: 10, 
                        borderBottomColor: "#dddddd", 
                        borderBottomWidth: 1}
                      }>
                        <NBText style={{ color: "#0CA6D5" }}>Open</NBText>
                      </View>

                      <View style={{ 
                        flexDirection: "row", 
                        alignItems: "center",
                        marginVertical: 8,
                      }}>
                        <Icon name="cloud-circle" />
                        <Text> 42</Text>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => alert('on press card')}>
                  <View style={{ 
                    overflow: 'hidden',
                    borderWidth: 1, 
                    borderRadius: 5, 
                    marginRight: 10, 
                    borderColor: "#dddddd",
                    width: 250, 
                  }}>
                    <Image source={{ 
                      uri: "https://cdn-images-1.medium.com/max/2600/1*kihoKe7-LMxd7zr_VrTB9w.jpeg" }} 
                      style={{ 
                        width: 250, 
                        height: 130,
                    }}>
                    </Image>
                    <View style={{
                      flex: 1,
                      paddingHorizontal: 18,
                    }}>
                      <NBText style={{
                        marginVertical: 10
                      }}>Lorem ipsum dolor sit amet</NBText>

                      <Text>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium</Text>
                      
                      <View style={{ 
                        alignItems: "center", 
                        paddingVertical: 10, 
                        borderBottomColor: "#dddddd", 
                        borderBottomWidth: 1}
                      }>
                        <NBText style={{ color: "#0CA6D5" }}>Open</NBText>
                      </View>

                      <View style={{ 
                        flexDirection: "row", 
                        alignItems: "center",
                        marginVertical: 8,
                      }}>
                        <Icon name="cloud-circle" />
                        <Text> 42</Text>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => alert('on press card')}>
                  <View style={{ 
                    overflow: 'hidden',
                    borderWidth: 1, 
                    borderRadius: 5, 
                    marginRight: 10, 
                    borderColor: "#dddddd",
                    width: 250, 
                  }}>
                    <Image source={{ 
                      uri: "https://cdn-images-1.medium.com/max/2600/1*kihoKe7-LMxd7zr_VrTB9w.jpeg" }} 
                      style={{ 
                        width: 250, 
                        height: 130,
                    }}>
                    </Image>
                    <View style={{
                      flex: 1,
                      paddingHorizontal: 18,
                    }}>
                      <NBText style={{
                        marginVertical: 10
                      }}>Lorem ipsum dolor sit amet</NBText>

                      <Text>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium</Text>
                      
                      <View style={{ 
                        alignItems: "center", 
                        paddingVertical: 10, 
                        borderBottomColor: "#dddddd", 
                        borderBottomWidth: 1}
                      }>
                        <NBText style={{ color: "#0CA6D5" }}>Open</NBText>
                      </View>

                      <View style={{ 
                        flexDirection: "row", 
                        alignItems: "center",
                        marginVertical: 8,
                      }}>
                        <Icon name="cloud-circle" />
                        <Text> 42</Text>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </View>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}