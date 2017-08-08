import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, AsyncStorage,
} from 'react-native';

import styles from '../Styles';

export default class GameView extends Component {

	constructor(props){
		super(props);
		this.state = {
			token: 'no token',
			playerList: [],
		};
	}

	async componentWillMount(){
		const data = await AsyncStorage.multiGet(['@pokerBuddy:token','@pokerBuddy:currentGame']);
		let token = data[0][1];
		let gameString = data[1][1];
		let game = JSON.parse(gameString);
		
		this.setState({
			token: token,
			playerList: game.bets,
		})
	}

	render() {
		const { navigation } = this.props;
	    return (
	      <ScrollView contentContainerStyle={styles.container}>
	        <Text>Players List:</Text>
	        <FlatList
	            data={this.state.playerList}
	            renderItem={({item}) => <Text>BI LG {item.amount} {item.player}</Text>}
	        />
	        <Button title='Buy In' onPress={()=>{}} />
	        <Button title='Leave Game' onPress={()=>{navigation.navigate('PayView')}} />
	      </ScrollView>
	    );
	}

}
