import React from 'react';

import { StackNavigator } from 'react-navigation';

import LoginView from './containers/LoginView';
import HomeView from './containers/HomeView';
import CreateGameView from './containers/CreateGameView';
import GameView from './containers/GameView';
import PayView from './containers/PayView';
import ModalExample from './modal-example/app';

//TODO: save token locally and then make init route to home if token exists

const App = StackNavigator({
        LoginView: {screen: LoginView},
        HomeView: {screen: HomeView},
        CreateGameView: {screen: CreateGameView},
        GameView: {screen: GameView},
        PayView: {screen: PayView},
        ModalExample: {screen: ModalExample}
    },
    {
        initialRouteName: 'LoginView'
    }

);

export default App;
