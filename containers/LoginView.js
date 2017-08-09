import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, AsyncStorage,
} from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class HomeView extends Component {

	constructor(props){
		super(props);
		this.state = {
		};
	}

	async loginWithCreds(navigation){
		
		const response = await utils.fetchFromServer('authenticate/','POST',{
			username: 'rotembcohen',
		    password: 'cl446074',
		},this.state.token);
		
		const responseJson = await response.json();
		
		let token = responseJson.token;	
		let user = JSON.stringify(responseJson.user);
		console.log("Recieved token: " + token);
		await AsyncStorage.multiSet([['@pokerBuddy:token', token], ['@pokerBuddy:user', user]]);

		navigation.navigate('HomeView');
	
	}
	
	render() {
		const { navigation } = this.props;
	    return (
			<View style={styles.container}>
				<Button title='Login' onPress={()=>{this.loginWithCreds(navigation)}} />
			</View>
	    );
	}

}

