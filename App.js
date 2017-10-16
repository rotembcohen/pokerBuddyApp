import React from 'react';
import { StackNavigator, NavigationActions } from 'react-navigation';

import WelcomeView from './containers/WelcomeView';
import LoginView from './containers/LoginView';
import HomeView from './containers/HomeView';
import GameView from './containers/GameView';
import RegistrationView from './containers/RegistrationView';

const App = StackNavigator({
    WelcomeView: {screen: WelcomeView},
    LoginView: {screen: LoginView},
    HomeView: {screen: HomeView},
    GameView: {screen: GameView},
    RegistrationView: {screen: RegistrationView}
},
{
    initialRouteName: 'WelcomeView',
    headerMode: 'none'
});

const navigateOnce = (getStateForAction) => (action, state) => {
  const {type, routeName} = action;
  return (
    state &&
    type === NavigationActions.NAVIGATE &&
    routeName === state.routes[state.routes.length - 1].routeName
  ) ? null : getStateForAction(action, state);
};

App.router.getStateForAction = navigateOnce(App.router.getStateForAction);

export default App;