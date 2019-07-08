import AsyncStorage from "@react-native-community/async-storage";
import moment from 'moment';

const StorageUtils = {
  write(key, value) {
    return AsyncStorage.setItem(key, value);
  },
  read(key) {
    // return AsyncStorage.getItem(key).then((value) => this.setState({ 'name': value }))
    return AsyncStorage.getItem(key);
  },
  writeObj(key, value) {
    return this.write(key, JSON.stringify(value));
  }
};

const DateTimeUtils = {
  toFullDateFormat(time) {
    return moment(time).format('DD-MM-YYYY HH:mm:ss');
  },
};

const LOGIN_SCREEN = "Login";
const HOME_SCREEN = "Boxes";
const ACCOUNT_SCREEN = "Account";
const ORDERS_SCREEN = "Orders";
const ORDER_DETAIL_SCREEN = "OrderDetail";
const CUSTOMER_SCANNER_SCREEN = "CustomerScanner";
const DRIVER_SCANNER_SCREEN = "DriverScanner";
const DRIVER_ORDERS_SCREEN = "DriverOrders";
const QRCODE_GENERATOR_SCREEN = "QRCodeGenerator";
const INPUT_OTP_SCREEN = "InputOTP";

const NavigationUtils = {
  navigateToLoginScreen(navigation) {
    this.navigateTo(navigation, LOGIN_SCREEN);
  },
  navigateToHomeScreen(navigation) {
    this.navigateTo(navigation, HOME_SCREEN);
  },
  navigateToAccountScreen(navigation) {
    this.navigateTo(navigation, ACCOUNT_SCREEN);
  },
  navigateToOrdersScreen(navigation, boxId) {
    this.navigateTo(navigation, ORDERS_SCREEN, { boxId: boxId });
  },
  navigateToOrderDetailScreen(navigation, orderCode, deliverFlag) {
    this.navigateTo(navigation, ORDER_DETAIL_SCREEN, { orderCode: orderCode, deliverFlag: deliverFlag });
  },
  navigateToCustomerScannerScreen(navigation) {
    this.navigateTo(navigation, CUSTOMER_SCANNER_SCREEN);
  },
  navigateToDriverScannerScreen(navigation, hub) {
    this.navigateTo(navigation, DRIVER_SCANNER_SCREEN, { hub: hub });
  },
  navigateToDriverOrdersScreen(navigation, hub, driverCode) {
    this.navigateTo(navigation, DRIVER_ORDERS_SCREEN, { hub: hub, driverCode: driverCode });
  },
  navigateToQRCodeGeneratorScreen(navigation, title, data) {
    this.navigateTo(navigation, QRCODE_GENERATOR_SCREEN, { title: title, data: data });
  },
  navigateToInputOTPScreen(navigation, hub) {
    this.navigateTo(navigation, INPUT_OTP_SCREEN, { hub: hub });
  },
  navigateTo(navigation, screen, params) {
    LoggerUtils.log('navigateTo', 'screen', screen, 'params', JSON.stringify(params));
    navigation.navigate(screen, params);
  },
  goBack(navigation) {
    navigation.goBack();
  }
};

const SCREENS = {
  LOGIN_SCREEN, HOME_SCREEN, ACCOUNT_SCREEN, ORDERS_SCREEN, ORDER_DETAIL_SCREEN,
  CUSTOMER_SCANNER_SCREEN, DRIVER_SCANNER_SCREEN, DRIVER_ORDERS_SCREEN,
  QRCODE_GENERATOR_SCREEN
};


const LoggerUtils = {
  log(prefix, key1, param1, key2, param2, key3, param3, key4, param4, key5, param5) {
    console.log(`${prefix}:: ${key1 != undefined? key1: ''}${param1 != undefined? ':: ' + param1: ''} ${key2 != undefined? '- ' + key2: ''}${param2 != undefined? ':: ' + param2: ''} ${key3 != undefined? '- ' + key3: ''}${param3 != undefined? ':: ' + param3: ''} ${key4 != undefined? '- ' + key4: ''}${param4 != undefined? ':: ' + param4: ''} ${key5 != undefined? '- ' + key5: ''}${param5 != undefined? ':: ' + param5: ''}`);
  }
};

export { StorageUtils, DateTimeUtils, NavigationUtils, SCREENS, LoggerUtils };
