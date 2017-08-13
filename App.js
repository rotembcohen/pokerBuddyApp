import React from 'react';
import { StackNavigator } from 'react-navigation';

import WelcomeView from './containers/WelcomeView';
import LoginView from './containers/LoginView';
import HomeView from './containers/HomeView';
import CreateGameView from './containers/CreateGameView';
import GameView from './containers/GameView';
import ModalExample from './modal-example/app';
import RegistrationView from './containers/RegistrationView';

const App = StackNavigator({
    WelcomeView: {screen: WelcomeView},
    LoginView: {screen: LoginView},
    HomeView: {screen: HomeView},
    CreateGameView: {screen: CreateGameView},
    GameView: {screen: GameView},
    ModalExample: {screen: ModalExample},
    RegistrationView: {screen: RegistrationView}
},
{
    initialRouteName: 'WelcomeView'
});

export default App;