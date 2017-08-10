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
			errorLabel: '',
		};
	}

	async loginWithCreds(navigation){
		
		var response = null;
		try{
			response = await utils.fetchFromServer('authenticate/','POST',{
				username: 'rotembcohen',
			    password: 'cl446074',
			},this.state.token);
		}
		catch(error){
			console.log(error);
		}
		if (response){
			const responseJson = await response.json();
			
			let token = responseJson.token;	
			let user = JSON.stringify(responseJson.user);
			console.log("Recieved token: " + token);
			await AsyncStorage.multiSet([['@pokerBuddy:token', token], ['@pokerBuddy:user', user]]);

			navigation.navigate('HomeView');
		}else{
			this.setState({errorLabel:'Server Unavailable'});
		}
	
	}
	
	render() {
		const { navigation } = this.props;
	    return (
			<View style={styles.container}>
				<Button title='Login' onPress={()=>{
					this.setState({errorLabel:''});
					this.loginWithCreds(navigation);
				}} />
				<Text style={styles.errorLabel} >{this.state.errorLabel}</Text>
				<Button title='Modals' onPress={()=>{
					navigation.navigate('ModalExample');
				}} />
			</View>
	    );
	}

}

