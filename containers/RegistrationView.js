import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';

import Modal from 'react-native-modal';
import styles from '../Styles';
import * as utils from '../UtilFunctions';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import StatusBar from '../components/StatusBar';

export default class RegistrationView extends Component {

	constructor(props){
		super(props);
		const { navigation } = props;
		
		this.state = {
			username: null,
			first_name: null,
			last_name: null,
			email: null,
			username: null,
			password: null,
			password_confirm: null,
			phone_number: null,
			venmo_username: null,
			errorLabel: '',
			navigation: navigation
		}
	}

	
	async onSubmit(){
		let form = {
			username: this.state.username,
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			password: this.state.password,
			password_confirm: this.state.password_confirm,
			venmo_username: this.state.venmo_username
		};
		const navigation = this.state.navigation;

		//form validation
		this.setState({errorLabel:""});
		if (form.password !== form.password_confirm){
			this.setState({errorLabel:"Passwords don't match"});
			return;
		}
		if (!form.first_name || !form.last_name || !form.password){
			this.setState({errorLabel:"All non optional fields are required"});
			return;
		}

		var response = await utils.user_registration(form);
		if (response.error === 'None'){
			utils.resetToScreen(navigation,'HomeView',{user:response.user,token:response.token});
		}else{
			this.setState({errorLabel:response.error});
		}
		
	}

	renderInputField(onChangeText,value,placeholder,index,onSubmit,secure=false,autoFocus=false,autoCapitalize='none'){
		let ref = 'Input' + index;
		return (
			<TextInput
				ref={ref} //works
	      		style={[styles.transparentTextinput,{width:300,borderBottomWidth:1,borderColor:"#ffcccc"}]}
	      		onChangeText={onChangeText}
	      		value={value}
	      		placeholder={placeholder}
	      		secureTextEntry={secure}
	      		selectTextOnFocus={true}
	      		onSubmitEditing={onSubmit}
	      		autoFocus={autoFocus}
	      		autoCapitalize={autoCapitalize}
	      		underlineColorAndroid="transparent"
	  		/>
		)
	}

	render() {

		var onChange5 = (text)=>{this.setState({first_name:text})};
		var onChange6 = (text)=>{this.setState({last_name:text})};
		var onChange1 = (text)=>{this.setState({username:text})};
		var onChange2 = (text)=>{this.setState({password:text})};
		var onChange3 = (text)=>{this.setState({password_confirm:text})};
		var onChange7 = (text)=>{this.setState({venmo_username:text})};
		
		var onSubmit5 = ()=>{this.refs.Input6.focus()};
		var onSubmit6 = ()=>{this.refs.Input1.focus()};
		var onSubmit1 = ()=>{this.refs.Input2.focus()};
		var onSubmit2 = ()=>{this.refs.Input3.focus()};
		var onSubmit3 = ()=>{this.refs.Input7.focus()};
		var onSubmit7 = ()=>{this.onSubmit()};

		//TODO: check if you can simplify the function calling here
		return (
			
			<View style={styles.container}>
				<StatusBar/>
				{this.renderInputField(onChange5,this.state.first_name,'First Name','5',onSubmit5,false,true,'words')}
				{this.renderInputField(onChange6,this.state.last_name,'Last Name','6',onSubmit6,false,false,'words')}
				{this.renderInputField(onChange1,this.state.username,'Username','1',onSubmit1)}
				{this.renderInputField(onChange2,this.state.password,'Password','2',onSubmit2,true)}
				{this.renderInputField(onChange3,this.state.password_confirm,'Confirm Password','3',onSubmit3,true)}
				{this.renderInputField(onChange7,this.state.venmo_username,'Venmo ID (Optional,without the @)','7',onSubmit7)}
				<View style={{flexDirection: 'row'}}>

					<IconButton action={()=> utils.resetToScreen(this.state.navigation,"LoginView")} name="ios-close-circle-outline" text="Cancel" />
					<IconButton action={()=> this.onSubmit()} name="ios-checkmark-circle-outline" text="Sign Up" />
				</View>
				<Text style={styles.errorLabel}>{this.state.errorLabel}</Text>
			</View>
		
		);
	}


}

			