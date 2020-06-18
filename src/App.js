import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  //cookieある時
  useEffect(() => {
    fetch('https://tooap4mvb3.execute-api.ap-northeast-1.amazonaws.com/demo', {
      method: 'POST',
      body: JSON.stringify({ "sessionId": "123" }),
      credentials: 'include'
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
    })
  }, []);

  //cookieない時
  const apiHandler = () => {
    fetch('https://tooap4mvb3.execute-api.ap-northeast-1.amazonaws.com/demo', {
      method: 'POST',
      body: JSON.stringify({ "sessionId": "123", "authKey": "uuid" }),
      credentials: 'include',
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit src/App.js and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React 2
        </a>
        <button onClick={() => apiHandler()}>API送信</button>
      </header>
    </div>
  );
}
export default App;