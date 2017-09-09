/* global firebase */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

document.addEventListener('DOMContentLoaded', function() {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  try {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    console.log(`Firebase SDK loaded with ${features.join(', ')}`);

    // var config = {
    //   apiKey: "AIzaSyCmnoJEwqiaq-lavYiVySWdo77uSWIcFK4",
    //   authDomain: "earlybirdshopers.firebaseapp.com",
    //   databaseURL: "https://earlybirdshopers.firebaseio.com",
    //   projectId: "earlybirdshopers",
    //   storageBucket: "earlybirdshopers.appspot.com",
    //   messagingSenderId: "853475325627"
    // };
    // firebase.initializeApp(config);
  } catch (e) {
    console.error(e);
    console.log('Error loading the Firebase SDK, check the console.');
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
