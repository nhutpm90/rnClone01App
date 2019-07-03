import React from "react";

import { createStackNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";

import { Root } from "native-base";

import Login from './Login';

import Boxes from './ServicePoint/Boxes';
import Orders from './ServicePoint/Orders';
import OrderDetail from './ServicePoint/OrderDetail';

import ServicePointMain from "./ServicePoint/ServicePointMain";

// const RootStack = createStackNavigator(
//   {
//     Login: {
//       screen: Login,
//     },
//     ServicePointMain: {
//       screen: ServicePointMain,
//     },
//     Orders: {
//       screen: Orders,
//     },
//     OrderDetail: {
//       screen: OrderDetail,
//     }
//   },
//   {
//     initialRouteName: 'Login',
//     headerMode: 'none',
//   }
// )

const AppNavigator = createSwitchNavigator({
  Login: Login,
  ServicePointMain: ServicePointMain
});

export default AppNavigator;

// const AppContainer = createAppContainer(RootStack);

// export default class App extends React.Component {

//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <Root>
//         <AppContainer />
//       </Root>
//     );
//   }
// }