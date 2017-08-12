import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, TextInput, AsyncStorage, Picker
} from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class HomeView extends Component {

	static navigationOptions = {
		title: 'Choose Game'
	}

	constructor(props){
		super(props);
		const {navigation} = props;
		this.state = {
			navigation: navigation,
			token: navigation.state.params.token,
			user: navigation.state.params.user,
			game_identifier: '',
			active_games: [],
		};
		this.getActiveGames();
	}
	
	async getActiveGames(){
		const response = await utils.fetchFromServer(
			'users/' + this.state.user.id + '/active_games/',
			'GET',
			null,
			this.state.token
		);
		if (response.status===200){
			let response_json = JSON.parse(response._bodyText);
			this.setState({active_games:response_json});
			//console.log("active_games",this.state.active_games[0].game);
		}
	}

	async logout(){
		await AsyncStorage.multiRemove(['@pokerBuddy:token','@pokerBuddy:user']);
		utils.resetToScreen(this.state.navigation,'LoginView');
	}

	render() {
		navigation = this.state.navigation;
		let active_games = this.state.active_games;
		return (
	      <View style={styles.container}>
	      	<Button title='Create Game' onPress={()=>{navigation.navigate('CreateGameView',{token:this.state.token,user:this.state.user})}} />
	      	<Text>Current User: {this.state.user.username}</Text>
	      	<Text>Game Address: </Text>
	      	<TextInput
	      		style={styles.textinput}
	      		onChangeText={(text)=>{this.setState({game_identifier:text})}}
	      		value={this.state.game_identifier}
	      		autoCapitalize={'characters'}
	      		maxLength={5}
      		/>
	        <Button title='Join Game' onPress={()=>{utils.joinGame(navigation,this.state.game_identifier,this.state.token,this.state.user)}} />

	        <Picker
	        	style={{width:125}}
				selectedValue={this.state.game_identifier}
				onValueChange={(itemValue, itemIndex) => {this.setState({game_identifier: itemValue})}}>
					<Picker.Item value="" label="" key="placeholder" />
					{this.state.active_games.map((l, i) => {return <Picker.Item value={l.game} label={l.game} key={l.game}  /> })}
			</Picker>

			<Button title='Logout' onPress={()=>this.logout()} />
	      </View>
	    );
	}

}


//believe or not this is possible:
//<Button title='Create Game' onPress={()=>{navigation.navigate('CreateGameView',currentState)}} />
