import React, {useState, useEffect, createContext} from 'react';
import Amplify, {Auth} from 'aws-amplify';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);

  const logout = () => {
    document.cookie = 'sso-authenticated=false';
    window.location.href = `${process.env.REACT_APP_AUTHENTICATOR_URL}/logout/${encodeURIComponent('http://localhost:3001')}`
  }

  Amplify.configure({
    Auth: {
      identityPoolId: 'ap-northeast-1:f247d53d-ffad-4a7d-bae1-941280d750a4',
      region: 'ap-northeast-1',
      userPoolId: 'ap-northeast-1_fWEpThYje',
      userPoolWebClientId: '2nhn4h9lgvi95m03a8nm1lhmht',
      authenticationFlowType: 'CUSTOM_AUTH',
    }
  })

  const handleCognitoLogin = async (sessionId, authKey, username) => {
    try {
      const user = await Auth.signIn(username)
      const customUser = await  Auth.sendCustomChallengeAnswer(user, authKey, {
        sessionId,
      })
      setToken(customUser.signInUserSession.accessToken.jwtToken)
      localStorage.setItem("test", "true");
      return false;
    } catch(err) {
      console.log(err);
      return 'Some error';
    }
  }

  useEffect(() => {
    //sso-authenticatedがtrueではない(falseもしくはそもそもない)場合、認証アプリにリダイレクト
    if (document.cookie !== 'sso-authenticated=true') {
      window.location.href = `${process.env.REACT_APP_AUTHENTICATOR_URL}/login/${encodeURIComponent('http://localhost:3001')}`
    }

    // sso-authenticated=trueの場合
    fetch('https://tooap4mvb3.execute-api.ap-northeast-1.amazonaws.com/demo/', {
      method: 'POST',
      body: JSON.stringify({'sessionId': ''}), //cookieにセットされてるsessionIdでAPI処理されるのでbodyは必要ない
      credentials: 'include',
    })
    .then(res => res.json())
    .then(res => {
      const tokens = {...res.Item};
      if(!tokens.sessionId) {
        window.location.href = `${process.env.REACT_APP_AUTHENTICATOR_URL}/login/${encodeURIComponent('http://localhost:3001')}`
      }
      handleCognitoLogin(tokens.sessionId, tokens.authKey, tokens.username);
    })
    .catch(err => {
      window.location.href = `${process.env.REACT_APP_AUTHENTICATOR_URL}/login/${encodeURIComponent('http://localhost:3001')}`
    })
  }, [])

  return (
    <AuthContext.Provider value={{
      token,
      logout,
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;