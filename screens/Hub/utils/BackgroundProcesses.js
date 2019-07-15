import SockJS from "sockjs-client";
import Stomp from "stompjs";

import _ from "lodash";

import { LoggerUtils } from './Logger';

import { SERVER } from "./Constants";

class StompWebsocket {
  constructor() {
    const { WEBSOCKET } = SERVER;
    const { TOPIC } = WEBSOCKET;

    const url = _.get(WEBSOCKET, "URL");
    const paymentTopic = _.get(TOPIC, "PAYMENT");

    LoggerUtils.log("StompWebsocket:: init");

    this.socket = {
      url: url,
      socket: undefined,
      topics: {
        payment: {
          url: paymentTopic,
          topic: undefined,
          cbs: [],
        }
      },
    };
  }
  connect() {
    const { url } = this.socket;

    LoggerUtils.log("StompWebsocket:: trying to connect", "url", url);
    try {
      const socket = new SockJS(url);
      const stompClient = Stomp.over(socket);

      // prevent debug log in console
      stompClient.debug = (message) => {
        // LoggerUtils.log("StompWebsocket:: debug", 'message', message);
      };

      const headers = {};
      stompClient.connect(headers, () => {
          // console.warn("connected");
          // connectCallback
          LoggerUtils.log("StompWebsocket:: connected", "url", url);

          const paymentTopic = this.findTopic("payment");
          const paymentTopicUrl = _.get(paymentTopic, 'url');

          LoggerUtils.log("StompWebsocket:: subscribe to", "topic", paymentTopicUrl);
          paymentTopic['topic'] = stompClient.subscribe(paymentTopicUrl, (payload) => {
            const cbs = this.getPaymentCallbacks();

            LoggerUtils.log("StompWebsocket:: onMessageReceived", 
                "topic", paymentTopicUrl, "onMessageReceived", payload, 'callbacks', cbs);

            if(cbs != undefined) { 
                // const body = _.get(payload, 'body');
                const data = payload['body'];
                _.forEach(cbs, cb => {
                  LoggerUtils.log("StompWebsocket:: invoke callback", 'topic', paymentTopicUrl, 'callback', cb);
                  cb(data);
                });
            } else {
                LoggerUtils.log("StompWebsocket:: skip callback", 'topic', paymentTopicUrl);
            }
          });
        }, error => {
          // errorCallback
          LoggerUtils.log("StompWebsocket", "error", error);
        }
      );
    } catch (ex) {
      LoggerUtils.log("StompWebsocket:: exception", "ex", ex);
    }
  }
  getSocket() {
    let { socket } = this;
    if(socket == undefined) {
      socket = {};
      this.socket = socket;
    }
    return socket;
  }
  disconnect() {
    const { socket } = this.getSocket();
    LoggerUtils.log("StompWebsocket:: trying to disconnect", 'socket', socket);
    if(socket != undefined) {
      const { url } = socket;
      socket.disconnect(() => {
        LoggerUtils.log("StompWebsocket:: disconnected", 'url', url);
      }, headers = {});
    }
  }
  findTopic(topicKey) {
    return _.get(this.socket, `topics.${topicKey}`);
  }
  unsubscribe(topicKey) {
    LoggerUtils.log("StompWebsocket:: trying to unsubscribe", 'topicKey', topicKey);
    const topic = this.findTopic(topicKey);
    if(topic != undefined) {
      const url = _.get(topic, 'url');
      const topicObj = _.get(topic, 'topic');
      if(topicObj != undefined) {
        topic.unsubscribe();
        LoggerUtils.log("StompWebsocket:: unsubscribed", 'topic', topic, 'url', url);
      }
    } else {
      LoggerUtils.log("StompWebsocket:: unsubscribe:: Topic not found", 'topicKey', topicKey);
    }
  }
  getCallbacks(topicKey) {
    const topic = this.findTopic(topicKey);
    if(topic != undefined) {
      let { cbs } = topic;
      if(cb == undefined) {
        cb = [];
        topic['cbs'] = cbs;
      }
      return cbs;
    } else {
      LoggerUtils.log("StompWebsocket:: getCallbacks:: Topic not found", 'topicKey', topicKey);
    }
  }
  getPaymentCallbacks() {
      return this.getCallbacks('payment');
  }
  addPaymentCallback(cb, clear) {
    LoggerUtils.log("StompWebsocket:: addPaymentCallback", "cb", cb);
    const topic = this.findTopic("payment");
    if(clear == undefined || clear == true) {
      topic['cbs'] = [];
    }
    let cbs = topic['cbs']
    cbs.push(cb);
  }
}

class Timer {
  constructor() {
    const { TIMER } = SERVER;
    const { PAYMENT } = TIMER;

    LoggerUtils.log("Timer:: init");
    this.intervals = {
      "payment": {
        "interval": PAYMENT.INTERVAL,
        "stopAfter": PAYMENT.STOP_AFTER,
        "cb": undefined,
        "timeoutCb": undefined,
        "intervalIds": [],
        "timeoutIds": [],
      }
    }
  }
  
  startPaymentTimer(cb, timeoutCb) {
    const { payment } = this.intervals;
    const { interval, stopAfter, intervalIds, timeoutIds } = payment;
    LoggerUtils.log("Timer:: startPaymentTimer", 'interval', interval, 'stopAfter', stopAfter);

    if(cb != undefined) {
      this.setPaymentCallback(cb);
    }

    if(timeoutCb != undefined) {
      this.setPaymentTimeoutCallback(timeoutCb);
    }

    let intervalId = setInterval(() => {
      const paymentCallback = this.getPaymentCallback();
      if(paymentCallback != undefined) {
        LoggerUtils.log("Timer:: invoke", 'paymentCallback', paymentCallback);
        paymentCallback();
      }
    }, interval);
    intervalIds.push(intervalId);

    if(stopAfter != undefined) {
      let timeoutId = setTimeout(() => { 
        LoggerUtils.log("Timer:: stop payment timer");
        clearInterval(intervalId);
        const paymentTimeoutcb = this.getPaymentTimeoutCallback();
        if(paymentTimeoutcb != undefined) {
          LoggerUtils.log("Timer:: invoke", 'paymentTimeoutcb', paymentTimeoutcb);
          paymentTimeoutcb();
        }
      }, stopAfter);
      timeoutIds.push(timeoutId);
    }
  }
  getPaymentCallback() {
    return _.get(this.intervals, 'payment.cb');
  }
  getPaymentTimeoutCallback() {
    return _.get(this.intervals, 'payment.timeoutCb');
  }
  setPaymentCallback(cb) {
    LoggerUtils.log("Timer:: setPaymentCallback", 'cb', cb);
    _.set(this.intervals, 'payment.cb', cb);
    LoggerUtils.log("Timer:: setPaymentCallback:: currentPayment", 
      'payment', JSON.stringify(_.get(this.intervals, 'payment')));
  }
  setPaymentTimeoutCallback(cb) {
    LoggerUtils.log("Timer:: setPaymentTimeoutCallback", 'cb', cb);
    _.set(this.intervals, 'payment.timeoutCb', cb);
    LoggerUtils.log("Timer:: setPaymentTimeoutCallback:: currentPayment", 
      'payment', JSON.stringify(_.get(this.intervals, 'payment')));
  }
  stopAll() {
    const { payment } = this.intervals;
    const { intervalIds, timeoutIds } = payment;
    LoggerUtils.log("Timer:: stopAll::", 'payment', JSON.stringify(payment));
    _.forEach(intervalIds, intervalId => {
      clearInterval(intervalId);
      LoggerUtils.log("Timer:: stopAll:: clearInterval", 'intervalId', intervalId);
    });
    _.forEach(timeoutIds, timeoutId => {
      clearTimeout(timeoutId);
      LoggerUtils.log("Timer:: stopAll:: clearTimeout", 'timeoutId', timeoutId);
    });
    this.resetPaymentInterval();
  }
  resetPaymentInterval() {
    const { payment } = this.intervals;
    _.set(payment, 'intervalIds', []);
    _.set(payment, 'timerIds', []);
    _.set(payment, 'cb', undefined);
    _.set(payment, 'timeoutCb', undefined);
    LoggerUtils.log("Timer:: resetPaymentInterval:: currentPayment", 
      'payment', JSON.stringify(_.get(this.intervals, 'payment')));
  }
}

const stormWebsocket = new StompWebsocket();
const timer = new Timer();

export { stormWebsocket, timer };
