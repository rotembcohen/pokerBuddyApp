import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';

import Modal from 'react-native-modal';
import styles from '../Styles';
import * as utils from '../UtilFunctions';
import Button from '../components/Button';

export default class RegistrationView extends Component {


	static navigationOptions = {
		title: 'pocAt Registration'
	}

	constructor(props){
		super(props);
		const { navigation } = props;
		
		this.state = {
			username: null,
			first_name: null,
			last_name: null,
			email: null,
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
			username: this.state.first_name+"-"+this.state.last_name,
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			password: this.state.password,
			password_confirm: this.state.password_confirm,
			venmo_username: this.state.venmo_username
		};
		const navigation = this.state.navigation;

		//form validation
		console.log("form: ", JSON.stringify(form))
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

	renderInputField(onChangeText,value,placeholder,index,onSubmit,secure=false,autoFocus=false,keyboardType='default',autoCapitalize='none'){
		let ref = 'Input' + index;
		return (
			<TextInput
				ref={ref} //works
	      		style={styles.textinputwide}
	      		onChangeText={onChangeText}
	      		value={value}
	      		placeholder={placeholder}
	      		secureTextEntry={secure}
	      		selectTextOnFocus={true}
	      		onSubmitEditing={onSubmit}
	      		autoFocus={autoFocus}
	      		keyboardType={keyboardType}
	      		autoCapitalize={autoCapitalize}
	  		/>
		)
	}

	render() {

		var onChange5 = (text)=>{this.setState({first_name:text})};
		var onChange6 = (text)=>{this.setState({last_name:text})};
		var onChange2 = (text)=>{this.setState({password:text})};
		var onChange3 = (text)=>{this.setState({password_confirm:text})};
		var onChange7 = (text)=>{this.setState({venmo_username:text})};
		
		var onSubmit5 = ()=>{this.refs.Input6.focus()};
		var onSubmit6 = ()=>{this.refs.Input2.focus()};
		var onSubmit2 = ()=>{this.refs.Input3.focus()};
		var onSubmit3 = ()=>{this.refs.Input7.focus()};
		var onSubmit7 = ()=>{this.onSubmit()};

		//TODO: check if you can simplify the function calling here
		return (
			
			<View style={styles.container}>
				<StatusBar hidden={true} />
				{this.renderInputField(onChange5,this.state.first_name,'First Name','5',onSubmit5,false,false,'default','words')}
				{this.renderInputField(onChange6,this.state.last_name,'Last Name','6',onSubmit6,false,false,'default','words')}
				{this.renderInputField(onChange2,this.state.password,'Password','2',onSubmit2,true)}
				{this.renderInputField(onChange3,this.state.password_confirm,'Confirm Password','3',onSubmit3,true)}
				{this.renderInputField(onChange7,this.state.venmo_username,'Venmo ID (Optional,without the @)','7',onSubmit7)}
				<View style={{flexDirection: 'row'}}>
					<Button title='Back' onPress={()=>utils.backOneScreen(this.state.navigation)} />
					<Button title='Submit' onPress={()=>this.onSubmit()} />
				</View>
				<Text style={styles.errorLabel}>{this.state.errorLabel}</Text>
			</View>
		
		);
	}


}

			