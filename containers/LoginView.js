import React, { Component } from 'react';
import {
  Text, View, TextInput, TouchableOpacity, StatusBar
} from 'react-native';

import Modal from 'react-native-modal';

import styles from '../Styles';
import * as utils from '../UtilFunctions';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import { SimpleLineIcons } from '@expo/vector-icons';

export default class HomeView extends Component {

	static navigationOptions = {
		title: 'pocAt v0.1'
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
			modalType: '',
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
				this.setState({modalType:"AddVenmo",isModalVisible:true});
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

	_renderModalContent = () => {
		switch (this.state.modalType) {
			case 'AddVenmo':
				return (
					<View style={styles.modalContent}>
						<Text>Add Venmo Account?</Text>
						<TextInput
							style={styles.textinputwide}
							onChangeText={(text)=>{this.setState({fbVenmo:text})}}
							value={this.state.fbVenmo}
							selectTextOnFocus={true}
							keyboardType={'numeric'}
							placeholder='Venmo Account (without the @)'
							onSubmitEditing={()=>this.FBLogIn()}
							underlineColorAndroid="transparent"
						/>
						<Text>This would be used to refer others to pay you when needed. No login is required and no further information is kept.</Text>
						<View style={{flexDirection:'row'}}>
							{this._renderButton('Proceed', ()=> this.FBLogIn())}
						</View>
					</View>
				);
			case 'Log In':
				return (
					<View style={styles.modalContent}>
						<Text style={styles.errorLabel} >{this.state.errorLabel}</Text>
				        <View style={styles.inputContainer}>
				        	<TextInput
					      		style={[styles.transparentTextinput,{borderBottomWidth:1,borderColor:'#ffccbb'}]}
					      		onChangeText={(text)=>{this.setState({loginUsername:text})}}
					      		value={this.state.loginUsername}
					      		selectTextOnFocus={true}
					      		onSubmitEditing={(event) => { 
									this.refs.PasswordInput.focus(); 
								}}
								placeholder="Username"
								underlineColorAndroid="transparent"
				      		/>
				      		<TextInput
				      			ref='PasswordInput'
					      		style={styles.transparentTextinput}
					      		onChangeText={(text)=>{this.setState({loginPassword:text})}}
					      		value={this.state.loginPassword}
					      		secureTextEntry={true}
					      		selectTextOnFocus={true}
					      		onSubmitEditing={()=>{
					      			this.setState({isModalVisible:false});
					      			this.onSubmit();
					      		}}
					      		placeholder="Password"
					      		underlineColorAndroid="transparent"
				      		/>
			      		</View>
			      		<View style={{flexDirection:'row'}}>
							{this._renderButton('Cancel', ()=> this.setState({isModalVisible:false}))}
							{this._renderButton('Login', ()=> {
								this.setState({isModalVisible:false});
								this.onSubmit();
							})}
						</View>
					</View>
				);
			default:
				return (<View><Text>Error</Text></View>);

		}
	}
	
	async onSubmit() {
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

	render() {

		navigation = this.state.navigation;
		
	    return (
			<View style={styles.container}>
				<StatusBar hidden={true} />
				<Modal isVisible={this.state.isModalVisible === true}>
					{this._renderModalContent()}
		        </Modal>
		        
				<IconButton name="ios-log-in" text='Log In' action={()=>{
					this.setState({modalType:'Log In',isModalVisible:true});
				}} />
				<IconButton name="ios-create-outline" text="Sign Up" action={()=>{
					navigation.navigate('RegistrationView');
				}} />

		        <View style={{margin:5}}>
					<TouchableOpacity style={styles.iconButton} onPress={()=>{
						this.FBRegister(navigation);
					}} >
						<SimpleLineIcons name="social-facebook" color="red" size={30} />
						<Text>Facebook</Text>
						<Text>Log In</Text>
					</TouchableOpacity>
				</View>
		      	
			</View>
	    );
	}

}

