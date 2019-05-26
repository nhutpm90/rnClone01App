import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Platform,
    StatusBar,
    ScrollView,
    Image,
    Dimensions
} from "react-native";

export default class App extends Component {
  
  render() {
    return (
      <View>
        <Text>Account Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginBottom: 20,
    backgroundColor: "#fefffe"
  },
  home: {
    paddingHorizontal: 20
  }
});