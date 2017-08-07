import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, TextInput, AsyncStorage,
} from 'react-native';

import styles from '../Styles';

export default class CreateGameView extends Component {

	constructor(props){
		super(props);
		this.state = {
			token: 'no token',
			min_bet: 20,
		};
	}

	componentWillMount(){
		this.getToken();
	}

	async getToken(){
		try {
			const token = await AsyncStorage.getItem('@pokerBuddy:token');
			if (token !== null){
				this.setState({
					token: token
				});
				console.log("token received: " + token);
			}
		}
		catch (error) {
			console.error("getToken error: " + error);
		}
	}

	createGame(min_bet,navigation){
		fetch('http://54.236.5.23/games/', {
			method: 'POST',
		 	headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json',
			    'Authorization': 'Token ' + this.state.token,
		  	},
			body: JSON.stringify({
			    min_bet: min_bet
			})
		})
		.then((response) => response.json())
		.then((responseJson) => {
			var gameIdentifier = responseJson.identifier;
			console.log("Recieved identifier: " + gameIdentifier);
			this.saveIdentifier(gameIdentifier);
		})
		.then(()=>navigation.navigate('GameView'))
		.catch((error) => {
			console.error(error);
		});
	}
	
	async saveIdentifier(identifier){
		try {
			await AsyncStorage.setItem('@pokerBuddy:identifier', identifier);
		}
		catch (error) {
			console.error("AsyncStorage error: " + error);
		}
	}

	render() {
		const { navigation } = this.props;
	    return (
	      <View style={styles.container}>
	      	<TextInput
	      		style={styles.textinput}
	      		onChangeText={(text)=>{this.setState({min_bet:text})}}
	      		value={this.state.min_bet.toString()}
      		/>
	        <Button title='Create!' onPress={()=>{this.createGame(this.state.min_bet,navigation)}} />
	      </View>
	    );
	}

}
