import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, AsyncStorage, TextInput, TouchableOpacity
} from 'react-native';

import Modal from 'react-native-modal';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class HomeView extends Component {

	static navigationOptions = {
		title: 'Welcome to PoCat!'
	}

	constructor(props){
		super(props);
		const {navigation} = props;
		this.state = {
			errorLabel: '',
			navigation: navigation,
			loginUsername: '',
			loginPassword: '',
		};
	}
	
	async FBLogIn(navigation) {
		const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('309462139518578', {
			permissions: ['public_profile'],
		});
		if (type === 'success') {
			// Get the user's name using Facebook's Graph API
			const response = await fetch(
				`https://graph.facebook.com/me?fields=id,picture,first_name,last_name&access_token=${token}`);
			const responseJson = await response.json();

			var form = {
				first_name: responseJson.first_name,
				last_name: responseJson.last_name,
				picture_url: responseJson.picture.data.url,
				facebook_token: token,
				username: responseJson.id,
				password: responseJson.id,
			}

			const loginresponse = await utils.loginWithCreds(form.username,form.password);
			if (loginresponse.error === 'None'){
				utils.resetToScreen(navigation,'HomeView',{user:loginresponse.user,token:loginresponse.token});
				return;
			}

			var response = await utils.user_registration(form);
			if (response.error === 'None'){
				utils.resetToScreen(navigation,'HomeView',{user:response.user,token:response.token});
			}else{
				this.setState({errorLabel:response.error});
			}
		}
	}

	render() {
		navigation = this.state.navigation;
		onSubmit = async ()=>{
			this.setState({errorLabel:''});
			if (this.state.loginUsername === ''){
				this.setState({errorLabel:'Username is required'});
				return;
			}
			if (this.state.loginPassword === ''){
				this.setState({errorLabel:'Password is required'});
				return;
			}
			const response = await utils.loginWithCreds(this.state.loginUsername,this.state.loginPassword);
			if (response.error === 'None'){
				utils.resetToScreen(navigation,'HomeView',{user:response.user,token:response.token});
			}else{
				this.setState({errorLabel:response.error});
			}
		}
	    return (
			<View style={styles.container}>
				
				<TextInput
		      		style={styles.textinput}
		      		onChangeText={(text)=>{this.setState({loginUsername:text})}}
		      		value={this.state.loginUsername}
		      		selectTextOnFocus={true}
		      		onSubmitEditing={(event) => { 
						this.refs.PasswordInput.focus(); 
					}}
					placeholder="Username"
	      		/>
	      		<TextInput
	      			ref='PasswordInput'
		      		style={styles.textinput}
		      		onChangeText={(text)=>{this.setState({loginPassword:text})}}
		      		value={this.state.loginPassword}
		      		secureTextEntry={true}
		      		selectTextOnFocus={true}
		      		onSubmitEditing={onSubmit}
		      		placeholder="Password"
	      		/>
				<Button title='Login' onPress={onSubmit} />
				<Text style={styles.errorLabel} >{this.state.errorLabel}</Text>
				<Button title='Sign Up' onPress={()=>{
					navigation.navigate('RegistrationView');
				}} />
				{/*}
				<Button title='Modals' onPress={()=>{
					navigation.navigate('ModalExample');
				}} />*/}
				<Button title='FB Login' onPress={()=>{
					this.FBLogIn(navigation);
				}} />
			</View>
	    );
	}

}

