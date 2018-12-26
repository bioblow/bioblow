import React, { Component } from 'react';
import './App.css';
import BlowDetector from './components/BlowDetector.js';
import { FlatButton,
         MuiThemeProvider } from 'material-ui';



class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
      <div className="App">
        <header className="App-header">
          <h1> Bioblow </h1>
          <h3> relaxation • anti-teeth clenching • biofeedback </h3>
        </header>
        <BlowDetector/>           
        <FlatButton href="https://github.com/timthelion/bioblow">Copyright © 2018 Timothy Hobbs AGPLv3. Get source.</FlatButton>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
