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
		//TODO: handle network error
		if (this.state.min_bet === '' || this.state.token === '' || this.state.token === 'no token'){
			return;
		}
		const response = await utils.fetchFromServer('games/','POST',{
			min_bet: this.state.min_bet
		},this.state.token);

		console.log(response.status);
		//game created succesfully
		if (response.status===201){
			//get new game identifier
			let game_json = JSON.parse(response._bodyText);
			let game_identifier = game_json.identifier;
			
			//TODO: add option for host not to immediately join game
			//join game
			utils.joinGame(navigation,game_identifier,this.state.token);
			
		}
		//TODO:else
		
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
