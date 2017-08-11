import React from 'react';
import { StackNavigator } from 'react-navigation';

import WelcomeView from './containers/WelcomeView';
import LoginView from './containers/LoginView';
import HomeView from './containers/HomeView';
import CreateGameView from './containers/CreateGameView';
import GameView from './containers/GameView';
import PayView from './containers/PayView';
import ModalExample from './modal-example/app';

const App = StackNavigator({
    WelcomeView: {screen: WelcomeView},
    LoginView: {screen: LoginView},
    HomeView: {screen: HomeView},
    CreateGameView: {screen: CreateGameView},
    GameView: {screen: GameView},
    PayView: {screen: PayView},
    ModalExample: {screen: ModalExample},
},
{
    initialRouteName: 'WelcomeView'
});

export default App;