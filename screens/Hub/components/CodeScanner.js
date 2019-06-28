import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';

import { RNCamera } from 'react-native-camera';

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    var self = this;

    self.options = {
      showBarcodeText: false,
      showBarcodeFrame: false,
      canDetectBarcode: true,
      torchToggleData: {
        off: "torch",
        torch: "off",
      }
    };

    self.state = {
      flashMode: "off",
      barcodes: [],
    };
  }

  toggleTorch() {
    var flashMode = this.options.torchToggleData[this.state.flashMode];
    // console.warn(this.options.torchToggleData);
    // console.warn("toggleTorch:: " + flashMode);
    this.setState({
      flashMode: flashMode
    });
  }

  barcodeRecognized = ({ barcodes }) => {
      // console.warn("barcodeRecognized:: " + JSON.stringify(barcodes));
      // this.setState({ barcodes })

      this.props.barcodeRecognized(barcodes);
  };

  renderBarcodes = () => (
    <View style={styles.barcodeFrameContainer}>
      {this.state.barcodes.map(this.renderBarcode)}
    </View>
  );

  renderBarcode = ({ bounds, data }) => {
    const showBarcodeText = this.options.showBarcodeText;
    return (
      <React.Fragment key={data + bounds.origin.x}>
        <View
          style={[
            styles.barcodeTextContainer,
            {
              ...bounds.size,
              left: bounds.origin.x,
              top: bounds.origin.y,
            },
          ]} >
          {showBarcodeText && <Text style={[styles.barcodeTextBlock]}>{`${data}`}</Text>}
        </View>
      </React.Fragment>
    )
  };
  
  render() {

    const { flashMode } = this.state;
    const { showBarcodeFrame, canDetectBarcode } = this.options;

    return (
      // <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={{
            // flex: 1,
            width: '100%',
            height: '100%',
            // borderColor: "red",
            // borderWidth: 1,
          }}
          flashMode={flashMode}
          // ratio="16:9"
          onGoogleVisionBarcodesDetected={canDetectBarcode ? this.barcodeRecognized : null}
        >
          { showBarcodeFrame && this.renderBarcodes()}
        </RNCamera>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  barcodeFrameContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  barcodeTextContainer: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  barcodeTextBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});
