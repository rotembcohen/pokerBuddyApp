import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, TextInput, AsyncStorage,
} from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

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
			if (token !== null) this.setState({token: token});
		}
		catch (error) {
			console.error("getToken error: " + error);
		}
	}

	async createGame(navigation){
		if (this.state.min_bet === '' || this.state.token === '' || this.state.token === 'no token'){
			return;
		}
		const response = await utils.fetchFromServer('games/','POST',{
			min_bet: this.state.min_bet
		},this.state.token);

		if (response) {
			response.json()
			.then((responseJson)=>{
				var gameIdentifier = responseJson.identifier;
				console.log("Recieved identifier: " + gameIdentifier);
				AsyncStorage.setItem('@pokerBuddy:identifier', gameIdentifier);
			})
			.then(()=> navigation.navigate('GameView'))	
			.catch((error) => {
				console.error(error);
			});
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
	        <Button title='Create!' onPress={()=>{this.createGame(navigation)}} />
	      </View>
	    );
	}

}
