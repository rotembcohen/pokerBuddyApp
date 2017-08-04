import React from 'react';

import { StackNavigator } from 'react-navigation';

import HomeView from './containers/HomeView';
import CreateView from './containers/CreateView';
import GameView from './containers/GameView';
import PayView from './containers/PayView';

const App = StackNavigator({
        HomeView: {screen: HomeView},
        CreateView: {screen: CreateView},
        GameView: {screen: GameView},
        PayView: {screen: PayView},
    },
    {
        initialRouteName: 'HomeView'
    }

);

export default App;
