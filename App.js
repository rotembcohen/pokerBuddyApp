import React from 'react';
import { StackNavigator } from 'react-navigation';

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

export default App;