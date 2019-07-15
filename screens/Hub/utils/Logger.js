const LoggerUtils = {
  log(prefix, key1, param1, key2, param2, key3, param3, key4, param4, key5, param5) {
    console.log(`- ${prefix}:: ${key1 != undefined? '\n+ ' + key1: ''}${param1 != undefined? ':: ' + param1: ''} ${key2 != undefined? '\n+ ' + key2: ''}${param2 != undefined? ':: ' + param2: ''} ${key3 != undefined? '\n+ ' + key3: ''}${param3 != undefined? ':: ' + param3: ''} ${key4 != undefined? '\n+ ' + key4: ''}${param4 != undefined? ':: ' + param4: ''} ${key5 != undefined? '\n+ ' + key5: ''}${param5 != undefined? ':: ' + param5: ''}`);
  }
};

export { LoggerUtils };
