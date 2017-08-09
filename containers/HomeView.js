import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, TextInput, AsyncStorage, Picker
} from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class HomeView extends Component {

	constructor(props){
		super(props);
		this.state = {
			token: 'no token',
			user_id: null,
			username: null,
			game_identifier: '',
			active_games: [],
		};
	}
	
	async componentWillMount(){
		const data = await AsyncStorage.multiGet(['@pokerBuddy:token','@pokerBuddy:user']);
		let token = data[0][1];
		let user = JSON.parse(data[1][1]);
		this.setState({token: token, user_id: user.id, username: user.username, });
		await this.getActiveGames();
	}

	async getActiveGames(){
		const response = await utils.fetchFromServer(
			'users/' + this.state.user_id + '/active_games/',
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

	render() {
		const { navigation } = this.props;
		let active_games = this.state.active_games;
		console.log("active_games",active_games.length);
	    return (
	      <View style={styles.container}>
	      	<Button title='Create Game' onPress={()=>{navigation.navigate('CreateGameView')}} />
	      	<Text>Current User: {this.state.username}</Text>
	      	<Text>Game Address: </Text>
	      	<TextInput
	      		style={styles.textinput}
	      		onChangeText={(text)=>{this.setState({game_identifier:text})}}
	      		value={this.state.game_identifier}
	      		autoCapitalize={'characters'}
	      		maxLength={5}
      		/>
	        <Button title='Join Game' onPress={()=>{utils.joinGame(navigation,this.state.game_identifier,this.state.token)}} />

	        <Picker
	        	style={{width:125}}
				selectedValue={this.state.game_identifier}
				onValueChange={(itemValue, itemIndex) => {this.setState({game_identifier: itemValue});console.log("itemValue ",itemValue)}}>
					<Picker.Item value="" label="" key="placeholder" />
					{this.state.active_games.map((l, i) => {return <Picker.Item value={l.game} label={l.game} key={l.game}  /> })}
			</Picker>
	      </View>
	    );
	}

}

