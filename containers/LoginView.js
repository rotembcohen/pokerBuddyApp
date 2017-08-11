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
				navigation.navigate('HomeView',{user:response.user,token:response.token});
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
	      		/>
	      		<TextInput
	      			ref='PasswordInput'
		      		style={styles.textinput}
		      		onChangeText={(text)=>{this.setState({loginPassword:text})}}
		      		value={this.state.loginPassword}
		      		secureTextEntry={true}
		      		selectTextOnFocus={true}
		      		onSubmitEditing={onSubmit}
	      		/>
				<Button title='Login' onPress={onSubmit} />
				<Text style={styles.errorLabel} >{this.state.errorLabel}</Text>
				<Button title='Sign Up' onPress={()=>{
					navigation.navigate('RegistrationView');
				}} />
				<Button title='Modals' onPress={()=>{
					navigation.navigate('ModalExample');
				}} />
			</View>
	    );
	}

}

