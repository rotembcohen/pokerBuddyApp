import React, { Component } from 'react';
import {
  Text, View, TextInput, AsyncStorage, Picker, TouchableOpacity, StatusBar, ScrollView, Image, Linking
} from 'react-native';

import { APP_VERSION, ASSET_APP_LOGO_TEXT } from 'react-native-dotenv';

import Modal from 'react-native-modal';
import styles, { app_red, app_grey } from '../Styles';
import * as utils from '../UtilFunctions';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import SafeImage from '../components/SafeImage';
import ListPicker from '../components/ListPicker';
import AboutModal from '../components/AboutModal';
import { Ionicons } from '@expo/vector-icons';

export default class HomeView extends Component {

	constructor(props){
		super(props);
		const {navigation} = props;
		this.state = {
			navigation: navigation,
			token: navigation.state.params.token,
			user: navigation.state.params.user,
			game_identifier: '',
			active_games: [],
			past_games: [],
			isModalVisible: false,
			min_bet: navigation.state.params.user.default_min_bet,
			new_venmo_username: navigation.state.params.user.venmo_username,
			new_min_bet: navigation.state.params.user.default_min_bet,
			new_buy_in_intervals: navigation.state.params.user.buy_in_intervals,
			new_chip_unit: navigation.state.params.user.chip_basic_unit,
			modalType: '',
			errorLabel: '',
		};

		this.getActiveGames();
		this.getPastGames();

		this.getPushToken(navigation.state.params.user);
		
	}

	//TODO: remove this after implemented in registration
	//need to test on iOS and make sure it works perferctly
	async getPushToken(user){
		if (!user.push_token){
			response = await utils.registerForPushNotificationsAsync(user.id);
			await AsyncStorage.setItem('@pokerBuddy:user', JSON.stringify(response.user));
		}
	}
	
	async createGame(navigation){
		//TODO: handle network error
		if (this.state.min_bet === '' || this.state.token === '' || this.state.token === 'no token'){
			return;
		}
		const response = await utils.fetchFromServer('games/','POST',{
			min_bet: this.state.min_bet
		},this.state.token);

		//game created succesfully
		if (response.status===201){
			//get new game identifier
			let game_json = JSON.parse(response._bodyText);
			let game_identifier = game_json.identifier;
			
			//TODO: add option for host not to immediately join game
			//join game
			game = await utils.joinGame(game_identifier,this.state.token,this.state.user);
			this.setState({isModalVisible:false});
			this.updateActiveGames(game.identifier);
			utils.resetToScreen(navigation,"GameView",{game: game,user: this.state.user,token:this.state.token});
		}
		//TODO:else
		
	}

	updateActiveGames(identifier) {
		let active_games = this.state.active_games;
		active_games.push({game:identifier});
		this.setState({active_games:active_games});
	}

	donate(){
		utils.useVenmo('pay','Rotem-Cohen',null,'Pocat Donation');
	}

	_renderModalContent = () => {
		switch(this.state.modalType){
			case 'CreateGame':
				navigation = this.state.navigation;
			    return (
			      <View style={styles.modalContent}>
			      	<Text style={styles.textSubheader}>Starting bet</Text>
			      	<View style={styles.inputContainer}>
				      	<TextInput
				      		style={styles.transparentTextinput}
				      		border={true}
				      		onChangeText={(text)=>{this.setState({min_bet:text})}}
				      		value={this.state.min_bet.toString()}
				      		selectTextOnFocus={true}
				      		autoFocus={true}
				      		keyboardType={'numeric'}
				      		onSubmitEditing={()=>{this.createGame(navigation)}}
							underlineColorAndroid="transparent"
			      		/>
		      		</View>
			        <View style={styles.modalButtonsContainer}>
			        	<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
			        	<IconButton action={()=> this.createGame(navigation)} name="ios-checkmark-circle-outline" text="Create" />
					</View>
			      </View>
			    );
		    case 'Settings':
		    	return (
			      <View style={styles.modalContent}>
			      	<View style={styles.home_settingsSection}>
			      		<Text style={styles.boldText}>Vemno Username</Text>
				      	<TextInput
				      		ref="Settings1"
				      		style={styles.textinputwide}
				      		onChangeText={(text)=>{this.setState({new_venmo_username:text})}}
				      		value={this.state.new_venmo_username}
				      		selectTextOnFocus={true}
				      		placeholder='Account username (without the @)'
				      		onSubmitEditing={()=>{this.refs.Settings2.focus()}}
				      		underlineColorAndroid="transparent"
			      		/>
		      		</View>
		      		<View style={styles.home_settingsSection}>
			      		<Text style={styles.boldText}>Default Starting Bet</Text>
			      		<Text style={styles.italicText}>When creating a new game</Text>
				      	<TextInput
				      		ref="Settings2"
				      		style={styles.textinput}
				      		onChangeText={(text)=>{this.setState({new_min_bet:text})}}
				      		value={this.state.new_min_bet.toString()}
				      		selectTextOnFocus={true}
				      		keyboardType='numeric'
				      		onSubmitEditing={()=>{this.refs.Settings3.focus()}}
				      		underlineColorAndroid="transparent"
			      		/>
		      		</View>
		      		<View style={styles.home_settingsSection}>
			      		<Text style={styles.boldText}>Buy In Intervals</Text>
			      		<Text style={styles.italicText}>When selecting an amount to Buy In</Text>
				      	<TextInput
				      		ref="Settings3"
				      		style={styles.textinput}
				      		onChangeText={(text)=>{this.setState({new_buy_in_intervals:text})}}
				      		value={this.state.new_buy_in_intervals.toString()}
				      		selectTextOnFocus={true}
				      		keyboardType='numeric'
				      		onSubmitEditing={()=>{this.refs.Settings4.focus()}}
				      		underlineColorAndroid="transparent"
			      		/>
		      		</View>
		      		<View style={styles.home_settingsSection}>
			      		<Text style={styles.boldText}>Chips Basic Unit</Text>
			      		<Text style={styles.italicText}>For the Cash Out calculator</Text>
				      	<TextInput
				      		ref="Settings4"
				      		style={styles.textinput}
				      		onChangeText={(text)=>{this.setState({new_chip_unit:text})}}
				      		value={this.state.new_chip_unit}
				      		selectTextOnFocus={true}
				      		keyboardType='numeric'
				      		onSubmitEditing={()=>{this.updateSettings()}}
				      		underlineColorAndroid="transparent"
			      		/>
		      		</View>
		      		<Text style={styles.errorLabel}>{this.state.errorLabel}</Text>
			        <View style={styles.modalButtonsContainer}>
			        	<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
			        	<IconButton action={()=> {
			        		this.updateSettings();
			        	}} name="ios-checkmark-circle-outline" text="Confirm" />
					</View>
			      </View>
			    );
		    case 'BackToPrev':
		    	return (
		    		<View style={styles.modalContent}>
		    			<ListPicker
							containerStyle={styles.home_gameList} 
							optionArray={this.state.active_games}
							keyExtractor={(l,i)=>l.game}
							onPressElement={(l,i)=> async ()=>{
					        	//TODO: check all this occuronces for errors!
					        	game = await utils.joinGame(l.game,this.state.token,this.state.user);
					        	this.setState({isModalVisible:false});
					        	utils.resetToScreen(navigation,"GameView",{game: game,user: this.state.user,token:this.state.token});
					        }}
					        textExtractor={this.gameDateExtractor}
						/>
		    			<View style={styles.modalButtonsContainer}>
			      			<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
				        </View>
			        </View>
	    		);
    		case 'BackToPast':
		    	return (
		    		<View style={styles.modalContent}>
		    			<ListPicker
							containerStyle={styles.home_gameList} 
							optionArray={this.state.past_games}
							keyExtractor={(l,i)=>l.game}
							onPressElement={(l,i)=> async ()=>{
					        	//TODO: check all this occuronces for errors!
					        	game = await utils.joinGame(l.game,this.state.token,this.state.user);
					        	this.setState({isModalVisible:false});
					        	utils.resetToScreen(navigation,"GameView",{game: game,user: this.state.user,token:this.state.token});
					        }}
					        textExtractor={this.gameDateExtractor}
						/>
		    			<View style={styles.modalButtonsContainer}>
			      			<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
				        </View>
			        </View>
	    		);
    		case 'About':
    			return <AboutModal
    				onClose={()=> this.setState({isModalVisible:false})} 
    				onDonate={()=> this.donate()}
    				donateButton={true}
				/> ;
		    default:
				return (<View><Text>Error</Text></View>);
		}
	}

	async updateSettings(){

		if (this.state.new_min_bet <= 0 || !Number.isInteger(Number(this.state.new_min_bet))){
			this.setState({errorLabel:"Default starting bet needs to be a positive whole number"});
			return;
		}
		if (this.state.new_buy_in_intervals <=0 || !Number.isInteger(Number(this.state.new_buy_in_intervals))){
			this.setState({errorLabel:"Default buy in interval needs to be a positive whole number"});	
			return;
		}
		if (this.state.new_chip_unit <=0){
			this.setState({errorLabel:"Chip unit needs to be a positive number"});	
			return;
		}

		let form = {
			venmo_username: this.state.new_venmo_username,
			default_min_bet: this.state.new_min_bet,
			buy_in_intervals: this.state.new_buy_in_intervals,
			chip_basic_unit: this.state.new_chip_unit,
		}

		let response = await utils.fetchFromServer(
			'users/' + this.state.user.id + "/update_settings/",
			'POST',
			form,
			this.state.token
			);

		let user = await response.json();
		console.log("THIS IS MY USER",JSON.stringify(user));
		await AsyncStorage.setItem('@pokerBuddy:user',JSON.stringify(user));

		//TODO: handle errors

		this.setState({isModalVisible:false,user:user,min_bet:this.state.new_min_bet,errorLabel:''});
	}

	gameDateExtractor(l,i) {
		let date = new Date(l.created_at);
    	let hour = date.getHours();
    	hour = (hour < 12) ? hour + "am" : ((hour==12)? hour + "pm" : (hour-12) + "pm");
    	let dateStr = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + hour;
    	return <Text style={styles.textSubheader} >{dateStr}</Text>
	}

	async getActiveGames(){
		const response = await utils.fetchFromServer(
			'users/' + this.state.user.id + '/active_games/',
			'GET',
			null,
			this.state.token
		);
		if (response.status===200){
			let response_json = JSON.parse(response._bodyText);
			this.setState({active_games:response_json});
		}
	}

	async getPastGames(){
		const response = await utils.fetchFromServer(
			'users/' + this.state.user.id + '/past_games/',
			'GET',
			null,
			this.state.token
		);
		if (response.status===200){
			let response_json = JSON.parse(response._bodyText);
			this.setState({past_games:response_json});
		}
	}

	async logout(){
		await AsyncStorage.multiRemove(['@pokerBuddy:token','@pokerBuddy:user']);
		utils.resetToScreen(this.state.navigation,'LoginView');
	}

	render() {
		navigation = this.state.navigation;
		
		let active_games = this.state.active_games;
		let prevGameColor = null;
		let prevGameAction = null;
		if (active_games.length > 0){
			prevGameAction = ()=>{this.setState({isModalVisible:true,modalType:'BackToPrev'})};
		} else {
			prevGameAction = ()=>{};
			prevGameColor = '#ccc';
		}
		let prevGameButton = (<IconButton name="ios-log-in" text="Continue" action={prevGameAction} color={prevGameColor} />);

		let past_games = this.state.past_games;
		let pastGameColor = null;
		let pastGameAction = null;
		if (past_games.length > 0){
			pastGameAction = ()=>{this.setState({isModalVisible:true,modalType:'BackToPast'})};
		} else {
			pastGameAction = ()=>{};
			pastGameColor = app_grey;
		}
		let pastGameButton = (<IconButton name="ios-timer-outline" text='History' action={pastGameAction} color={pastGameColor} />);

		
		return (
	      <View style={styles.container}>
	      	{/*Headers*/}
	      	<StatusBar hidden={true} />
	      	<Modal isVisible={this.state.isModalVisible === true} style={styles.modal}>
				{this._renderModalContent()}
	        </Modal>
	    	
	    	{/*Top - logo*/}
	        <Image source={{uri:ASSET_APP_LOGO_TEXT}} style={styles.home_appLogoImage} /> 

	    	{/*Middle - main menu*/}
	        <View>
		        <View style={styles.row}>
		        	<IconButton name="ios-add-circle-outline" text="Create" action={()=>{this.setState({isModalVisible:true,modalType:'CreateGame'})}} />
			      	{prevGameButton}
			      	{pastGameButton}
		      	</View>

		      	<View style={[styles.row,{alignItems:'center',justifyContent:'center',marginTop:15}]}>
			        <View style={styles.inputContainer}>
			    		<TextInput
				      		style={styles.transparentTextinput}
				      		onChangeText={(text)=>{this.setState({game_identifier:text})}}
				      		value={this.state.game_identifier}
				      		autoCapitalize={'characters'}
				      		selectTextOnFocus={true}
				      		maxLength={5}
				      		placeholder='Game Address'
				      		underlineColorAndroid="transparent"
			      		/>
		      		</View>
		      		<Ionicons name="ios-arrow-dropright" color={app_red} size={40} onPress={async ()=>{
		      			game = await utils.joinGame(this.state.game_identifier,this.state.token,this.state.user);
			        	if (game.error){
			        		this.setState({errorLabel:game.error});
			        		return;
			        	}
			        	utils.resetToScreen(navigation,"GameView",{game: game,user: this.state.user,token:this.state.token});
			        }}
		      		 />
		      		{/*
			        <IconButton name="ios-people-outline" text='Join Game' action={()=>{this.setState({errorLabel:'',isModalVisible:true,modalType:'JoinGame'})}} />
			    	*/}
		        </View>
		        <Text style={styles.errorLabel}>{this.state.errorLabel}</Text>
	      	</View>
	      	
	      	{/*Buttom - user menu*/}
	      	<View style={styles.home_userMenu}>
	        	<View style={styles.modalButtonsContainer} >
	        		<SafeImage uri={this.state.user.picture_url} style={styles.home_userPicture} />
	        		<Text style={styles.textSubheader}>{this.state.user.first_name + " " + this.state.user.last_name}</Text>
	        	</View>
	        	<View style={styles.modalButtonsContainer}>
			      	<IconButton name="ios-settings-outline" text="Settings" size={25} action={()=>{this.setState({isModalVisible:true,modalType:'Settings'})}} />
			      	<IconButton name="ios-exit-outline" text='Logout' size={25} action={()=>this.logout()} />
		      	</View>
	        </View>

	    	{/*Footer - about pocat*/}
	        <View style={{height:30,alignItems:'center',justifyContent:'center', marginTop:20}}>
				<Button title="About Pocat" onPress={()=>this.setState({isModalVisible:true,modalType:'About'})} />
			</View>

	      </View>
	    );
	}

}
