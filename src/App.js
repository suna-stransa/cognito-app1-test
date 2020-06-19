import React from 'react';
import './App.css';
import {AuthContext} from './AuthContext';

function App() {
  const {logout, token} = React.useContext(AuthContext);

  return (
    token ? <div className="App">
      <header className="App-header">
        <h1>App A</h1>
        <h1>Authenticated!</h1>
        <button onClick={logout}>Sign out</button>
      </header>
    </div> : <></>
  );
}
export default App;