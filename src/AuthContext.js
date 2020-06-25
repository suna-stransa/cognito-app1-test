import React, {useState, useEffect, createContext} from 'react';
import Amplify, { Auth } from 'aws-amplify';           // amplifyのモジュールの読み込み
import aws_exports from './aws-exports';               // 設定情報を読み込みます。
Amplify.configure(aws_exports);                        // 設定情報をAmplifyに反映させます。

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);

  const logout = () => {
    Auth.signOut();
    document.cookie = 'sso-authenticated=false';
    document.cookie = "officeId=; max-age=0";
    window.location.href = `${process.env.REACT_APP_AUTHENTICATOR_URL}/logout/${encodeURIComponent('http://localhost:3001')}`
  }

  const handleCognitoLogin = async (sessionId, authKey, username) => {
    try {
      const user = await Auth.signIn(username)

      //第二引数がchallengeResponse、LambdaでchallengeAnswerで受け取る。
      //第三引数がClientMetadata。認証アプリで受け取ったsessionIdを渡すことでこれをキーにしてdynamoにアクセスする。
      //そのレスポンスのauthKeyと第二引数のauthKeyが一致したら認証成功でtokenがもらえる。
      const customUser = await  Auth.sendCustomChallengeAnswer(user, authKey, {
        sessionId,
      })
      setToken(customUser.signInUserSession.accessToken.jwtToken)
      return false;
    } catch(err) {
      console.log(err);
      return 'Some error';
    }
  }

  useEffect(() => {
    const isSSOAuthenticated = document.cookie.includes("sso-authenticated=true");

    //sso-authenticatedがtrueではない(falseもしくはそもそもない)場合、認証アプリにリダイレクト
    if (!isSSOAuthenticated) {
      window.location.href = `${process.env.REACT_APP_AUTHENTICATOR_URL}/login/${encodeURIComponent('http://localhost:3001')}`
    }

    let accessToken = "";

    for( let i=0; i < localStorage.length; i++ ){
      if (localStorage.key(i).endsWith("accessToken")) {
        const key = localStorage.key(i)
        accessToken = localStorage.getItem(key)
      };
    }

    // if (!accessToken) ;

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