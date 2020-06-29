import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import AuthContextProvider from './AuthContext';

// import { AUTH_TYPE } from 'aws-appsync';
// import { ApolloProvider } from 'react-apollo'
// import { InMemoryCache } from "apollo-cache-inmemory";
// import { ApolloLink } from 'apollo-link';
// import { createAuthLink } from 'aws-appsync-auth-link';
// import { createHttpLink } from 'apollo-link-http';
// import ApolloClient from 'apollo-client';

// const link = ApolloLink.from([
//   createAuthLink({
//     url: 'https://ynuqdr644bhadp7iwu7utqnjei.appsync-api.ap-northeast-1.amazonaws.com/graphql',
//     region: 'ap-northeast-1',
//     auth: {
//       type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
//       jwtToken: token,
//     },
//   }),
//   createHttpLink({ uri: 'https://ynuqdr644bhadp7iwu7utqnjei.appsync-api.ap-northeast-1.amazonaws.com/graphql', })
// ]);
// const client = new ApolloClient({
//   link,
//   cache: new InMemoryCache()
// });

ReactDOM.render(
  <React.StrictMode>
    {/* <ApolloProvider client={client}> */}
      <AuthContextProvider>
        <BrowserRouter>
          <Switch>
            <Route exact={true} path="/" component={App} />
            <Route component={App} />
          </Switch>
        </BrowserRouter>
      </AuthContextProvider>
    {/* </ApolloProvider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
