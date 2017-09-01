import React, { Component } from 'react';
import {
  Text, View, TextInput, TouchableOpacity, StatusBar, Image, AsyncStorage
} from 'react-native';

import Modal from 'react-native-modal';

import styles, {app_red} from '../Styles';
import * as utils from '../UtilFunctions';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';

export default class HomeView extends Component {

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

	//TODO: change func names, they are confusing!
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
				this.loginToApp(loginresponse.user,loginresponse.token);
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
			this.loginToApp(response.user,response.token);
		}else{
			this.setState({errorLabel:response.error});
		}
	}

	async loginToApp(user,token){
		const currentGame = await AsyncStorage.getItem('@pokerBuddy:currentGame');
		if (currentGame){
			game = await utils.joinGame(currentGame,token,user);
			if (!game.error || game.error === "None"){
				utils.resetToScreen(this.state.navigation,"GameView",{game:game,user:user,token:token});
				return;
			}else{
				AsyncStorage.removeItem('@pokerBuddy:currentGame');
			}
		}
		utils.resetToScreen(this.state.navigation,'HomeView',{user:user,token:token});	
	
	}

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
							placeholder='Venmo Account (without the @)'
							onSubmitEditing={()=>this.FBLogIn()}
							underlineColorAndroid="transparent"
							autoCapitalize='words'
						/>
						<Text>This would be used to refer others to pay you when needed. No login is required and no further information is kept.</Text>
						<View style={{flexDirection:'row'}}>
							<IconButton action={()=> this.FBLogIn()} name="ios-checkmark-circle-outline" text="Proceed" />
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
			      		<TouchableOpacity onPress={()=>{
			      			this.setState({isModalVisible:false});
			      			this.state.navigation.navigate('RegistrationView');
			      		}}>
			      			<Text style={{color:app_red,textDecorationLine:'underline'}}>Sign up</Text>
			      		</TouchableOpacity>
			      		<View style={{flexDirection:'row'}}>
							<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
							<IconButton action={()=> {
								this.setState({isModalVisible:false});
								this.onSubmit();
							}} name="ios-checkmark-circle-outline" text="Login" />
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
			utils.resetToScreen(this.state.navigation,'HomeView',{user:response.user,token:response.token});
		}else{
			this.setState({errorLabel:response.error});
		}
	}

	render(){
        const { navigation } = this.props;
        return (
            <View style={[styles.container,{backgroundColor:"#BC0000"}]}>
                <StatusBar hidden={true} />
                {/*Modal*/}
				<Modal isVisible={this.state.isModalVisible === true}>
					{this._renderModalContent()}
		        </Modal>
                <Image source={{uri:'https://s3.amazonaws.com/pokerbuddy/images/pocat_logo.png'}} style={{width:200,height:200}} /> 
                <TouchableOpacity style={{flexDirection:'row',margin:20,padding:10,borderWidth:0,borderRadius:12,backgroundColor:'white', justifyContent:'center',alignItems:'center'}} onPress={()=>{
					this.FBRegister(navigation);
				}}>
                	<SimpleLineIcons name="social-facebook" color={app_red} size={30} />
                	<Text style={[styles.textSubheader,{margin:10,fontWeight:'bold'}]}>LOGIN WITH FACEBOOK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',margin:20,padding:10,borderWidth:0,borderRadius:12,backgroundColor:'white', justifyContent:'center',alignItems:'center'}} onPress={()=>{
                	this.setState({modalType:"Log In",isModalVisible:true,errorLabel:""})	
                }}>
                	<Ionicons name="ios-log-in-outline" color={app_red} size={30} />
                	<Text style={[styles.textSubheader,{margin:10,fontWeight:'bold'}]}>LOGIN WITH POCAT USER</Text>
                </TouchableOpacity>
                <Text style={{color:'white',textAlign:'center'}}>{this.state.errorLabel}</Text>
            </View>
        );
    }

}

