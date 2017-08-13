import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, AsyncStorage, TextInput, TouchableOpacity
} from 'react-native';

import Modal from 'react-native-modal';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class HomeView extends Component {

	static navigationOptions = {
		title: 'Welcome to pocAt!'
	}

	constructor(props){
		super(props);
		const {navigation} = props;
		this.state = {
			errorLabel: '',
			navigation: navigation,
			loginUsername: '',
			loginPassword: '',
			isModalVisible: false,
			fbVenmo: '',
			first_name: '',
			last_name: '',
			picture_url: '',
			facebook_token: '',
		};
	}
	
	async FBRegister(navigation) {
		const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('309462139518578', {
			permissions: ['public_profile'],
		});
		if (type === 'success') {
			// Get the user's name using Facebook's Graph API

			const response = await fetch(
				`https://graph.facebook.com/me?fields=id,picture,first_name,last_name&access_token=${token}`);
			const responseJson = await response.json();

			var form = {
				username: responseJson.id,
				password: responseJson.id,
				first_name: responseJson.first_name,
				last_name: responseJson.last_name,
				picture_url: responseJson.picture.data.url,
				facebook_token: token,
			};

			this.setState({
				loginUsername: form.username,
				loginPassword: form.password,
				first_name: form.first_name,
				last_name: form.last_name,
				picture_url: form.picture_url,
				facebook_token: form.facebook_token,
			});

			const loginresponse = await utils.loginWithCreds(form.username,form.password);
			if (loginresponse.error === 'None'){
				//existing user
				utils.resetToScreen(navigation,'HomeView',{user:loginresponse.user,token:loginresponse.token});
			}else{
				//new user, check venmo
				this._showModal();
			}
		}
	}

	async FBLogIn(){
		var form = {
			username: this.state.loginUsername,
			password: this.state.loginPassword,
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			picture_url: this.state.picture_url,
			facebook_token: this.state.facebook_token,
			venmo_username: this.state.fbVenmo,
		};
		var response = await utils.user_registration(form);
		if (response.error === 'None'){
			utils.resetToScreen(this.state.navigation,'HomeView',{user:response.user,token:response.token});
		}else{
			this.setState({errorLabel:response.error});
		}
	}

	_showModal = () => this.setState({ isModalVisible: true });

	_hideModal = () => this.setState({ isModalVisible: false });

	//TODO: put in utils
	_renderButton = (text, onPress) => (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.modalButton}>
				<Text>{text}</Text>
			</View>
		</TouchableOpacity>
	);

	_renderModalContent = () => 
		(<View style={styles.modalContent}>
			<Text>Add Venmo Account</Text>
			<TextInput
				style={styles.textinput}
				onChangeText={(text)=>{this.setState({fbVenmo:text})}}
				value={this.state.fbVenmo}
				selectTextOnFocus={true}
				placeholder='Venmo Account (Optional, without the @)'
				onSubmitEditing={()=>this.FBLogIn()}
			/>
			<Text>This would be used to refer others to pay you when needed</Text>
			<View style={{flexDirection:'row'}}>
				{this._renderButton('Cancel', () => this.setState({ isModalVisible:false }))}
				{this._renderButton('Confirm', ()=> this.FBLogIn())}
			</View>
		</View>);

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
				<Modal isVisible={this.state.isModalVisible === true}>
					{this._renderModalContent()}
		        </Modal>
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
					this.FBRegister(navigation);
				}} />
			</View>
	    );
	}

}

