import React, { Component } from 'react';
import BiteLog from './BiteLog.js';
import { ReactMic } from '@timthelion/react-mic';
import { FloatingActionButton }   from 'material-ui';
import Slider from 'material-ui/Slider';
import MicrophoneOn                from 'material-ui/svg-icons/av/mic';
import MicrophoneOff               from 'material-ui/svg-icons/av/stop';


function mkThreashold (detector) {
  return function thresholdVisualizer(analyser, canvasCtx, canvas, width, height, backgroundColor, strokeColor) {
    analyser.fftSize = 32;
    const bufferLength = analyser.frequencyBinCount;
    let origBacgroundColor = backgroundColor;

    const dataArray = new Uint8Array(bufferLength);
     canvasCtx.clearRect(0, 0, width, height);
     function draw() {
      requestAnimationFrame(draw);
       analyser.getByteFrequencyData(dataArray);
       const reductionAmount = 3;
      const reducedDataArray = new Uint8Array(bufferLength / reductionAmount);
      for (let i = 0; i < bufferLength; i += reductionAmount) {
        let sum = 0;
        for (let j = 0; j < reductionAmount; j++) {
          sum += dataArray[i + j];
        }
         reducedDataArray[i/reductionAmount] = sum / reductionAmount;
      }

      let total = 0;
      for (let i = 0; i < reducedDataArray.length; i++) {
        total += reducedDataArray[i];
      }
      if (0 < total && total < detector.state.threshold ) {
        backgroundColor = "#ff0000";
        detector.addBite();
      } else {
        backgroundColor = origBacgroundColor;
      }

      canvasCtx.clearRect(0, 0, width, height);
      canvasCtx.beginPath();
      canvasCtx.arc(width / 2, height / 2, Math.min(height, width) / 2, 0, 2 * Math.PI);
      canvasCtx.fillStyle = backgroundColor;
      canvasCtx.fill();
      const stepSize = (Math.min(height, width) / 2.0) / (reducedDataArray.length);
      canvasCtx.strokeStyle = strokeColor;
      for (let i = 0; i < reducedDataArray.length; i++) {
        canvasCtx.beginPath();
        const normalized = reducedDataArray[i] / 128;
        total += reducedDataArray[i];
        const r = (stepSize * i) + (stepSize * normalized);
        canvasCtx.arc(width / 2, height / 2, r, 0, 2 * Math.PI);
        canvasCtx.stroke();
      }
    };
     draw();
  }
}

class Bite {
  constructor(props){
    this.time = new Date()
  }
}

class BlowDetector extends Component {
  constructor(props){
    super(props);
    this.state = {
      blobObject: null,
      isRecording: false,
      threshold: 1000,
      bites: [],
      max_bite_length: 4000 // ms
    }
  }

  addBite= () => {
    let now = new Date()
    if (this.state.isRecording && (!this.state.bites.length || now - this.state.bites[this.state.bites.length -1].time > this.state.max_bite_length)) {
      this.setState({
         bites : this.state.bites.concat(new Bite())
       });
      let sound = new Audio(process.env.PUBLIC_URL + '/378394__13fpanska-stranska-michaela__school-bell.mp3');
      sound.play();  
    }
  }

  startRecording= () => {
    this.setState({
      isRecording: true
    });
  }

  stopRecording= () => {
    this.setState({
      isRecording: false
    });
  }

  onStop= (blobObject) => {
    this.setState({
      blobURL : blobObject.blobURL
    });
  }

  handleThresholdChange = (event, value) => {
   this.setState({threshold: value});
  }

  render() {
    const { isRecording } = this.state;
    return (
        <div>
          <br/>
          <div style={{display: 'flex', justifyContent: 'center'}}>
          <ReactMic
            className="oscilloscope"
            record={isRecording}
            backgroundColor="#25541a"
            visualSetting={mkThreashold(this)}
            audioBitsPerSecond= {128000}
            onStop={this.onStop}
            onStart={this.onStart}
            onSave={this.onSave}
            onData={this.onData}
            width={200}
            strokeColor="#000000" />
          </div>
          <br/>
          Drag slider to change threshold. <br/> The circle should red when the sensor is being bitten and red otherwise.
          <br/>
          <Slider
            defaultValue={1000}
            max={2000}
            onChange={this.handleThresholdChange} />
          <FloatingActionButton
            className="btn"
            secondary={true}
            disabled={isRecording}
            onClick={this.startRecording}>
            <MicrophoneOn />
          </FloatingActionButton>
          <FloatingActionButton
            className="btn"
            secondary={true}
            disabled={!isRecording}
            onClick={this.stopRecording}>
            <MicrophoneOff />
          </FloatingActionButton>
          <br/>
          <BiteLog
             bites={this.state.bites}/>
          </div>
    );
  }
}

export default BlowDetector;
