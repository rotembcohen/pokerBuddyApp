import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, TextInput, AsyncStorage,
} from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class CreateGameView extends Component {

	static navigationOptions = {
		title: 'Create Game'
	}

	constructor(props){
		super(props);
		const {navigation} = props;
		this.state = {
			token: navigation.state.params.token,
			min_bet: 20,
			user: navigation.state.params.user,
			navigation: navigation,
		};
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
			game = await utils.joinGame(game_identifier,this.state.token,this.state.user);
			navigation.navigate('GameView',{game: game,user: this.state.user,token:this.state.token});
		}
		//TODO:else
		
	}
	
	render() {
		navigation = this.state.navigation;
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
