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

export { StorageUtils, DateTimeUtils };
