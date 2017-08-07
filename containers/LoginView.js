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
		const response = await utils.fetchFromServer('api-token-auth/','POST',{
			username: 'rotembcohen',
		    password: 'cl446074',
		},this.state.token);
		
		if (response) {
			response.json()
			.then((responseJson) => {
				var token = responseJson.token;
				console.log("Recieved token: " + token);
				this.saveToken(token);
			})
			.then(()=>navigation.navigate('HomeView'))
			.catch((error) => {
				console.error(error);
			});
		}
		
	}
	
	async saveToken(token){
		try {
			await AsyncStorage.setItem('@pokerBuddy:token', token);
		}
		catch (error) {
			console.error("AsyncStorage error: " + error);
		}
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

