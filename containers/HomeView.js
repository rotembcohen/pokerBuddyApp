import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, TextInput, AsyncStorage
} from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class HomeView extends Component {

	constructor(props){
		super(props);
		this.state = {
			token: 'no token',
			game_identifier: '',
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

	async joinGame(navigation){
		identifier = this.state.game_identifier.toUpperCase();
		if (identifier.length !== 5){
			return;
		}
		const response = await utils.fetchFromServer('games/' + identifier + '/join_game/','POST',{},this.state.token);

		console.log(response.status);

		if (response.status / 100 < 3){
			navigation.navigate('GameView');
		}
		
	}

	render() {
		const { navigation } = this.props;
	    return (
	      <View style={styles.container}>
	      	<Button title='Create Game' onPress={()=>{navigation.navigate('CreateGameView')}} />
	      	<Text>Game Address: </Text>
	      	<TextInput
	      		style={styles.textinput}
	      		onChangeText={(text)=>{this.setState({game_identifier:text})}}
	      		value={this.state.game_identifier}
	      		autoCapitalize={'characters'}
	      		maxLength={5}
      		/>
	        <Button title='Join Game' onPress={()=>{this.joinGame(navigation)}} />
	      </View>
	    );
	}

}

