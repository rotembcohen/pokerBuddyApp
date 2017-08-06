import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, AsyncStorage,
} from 'react-native';

export default class HomeView extends Component {

	constructor(props){
		super(props);
		this.state = {
		};
	}

	loginWithCreds(navigation){
		fetch('http://54.236.5.23/api-token-auth/', {
			method: 'POST',
		 	headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json',
		  	},
			body: JSON.stringify({
			    username: 'rotembcohen',
			    password: 'cl446074',
			})
		})
		.then((response) => response.json())
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

