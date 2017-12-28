import React, { Component } from 'react';
import {
  Text, View, TextInput, AsyncStorage, Picker, TouchableOpacity, ScrollView, Image, SafeAreaView,
} from 'react-native';

import { APP_VERSION, ASSET_APP_LOGO } from 'react-native-dotenv';

import Modal from 'react-native-modal';
import styles, { app_red, app_grey, app_green } from '../Styles';
import * as utils from '../UtilFunctions';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import SafeImage from '../components/SafeImage';
import ListPicker from '../components/ListPicker';
import AboutModal from '../components/AboutModal';
import { Ionicons } from '@expo/vector-icons';
import StatusBar from '../components/StatusBar';
import ModalWindow from '../components/ModalWindow';

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
			let game_json = JSON.parse(response._bodyText);
			let game_identifier = game_json.identifier;
			
			this.hideModal();
			this.joinGame(game_identifier);
		}
		//TODO:else
		
	}

	donate(){
		utils.useVenmo('pay','Rotem-Cohen',null,'Pocat Donation');
	}

	async joinGame(game_identifier){
		game = await utils.joinGame(game_identifier,this.state.token,this.state.user);
		if (game.error){
			this.setState({errorLabel:game.error});
			return;
		}
		let tutorialResponse = await AsyncStorage.getItem('@pokerBuddy:showTutorial');
		let showTutorial = (tutorialResponse === null) ? true : (tutorialResponse==='true');
		utils.resetToScreen(navigation,"GameView",{game: game,user: this.state.user,token:this.state.token,showTutorial:showTutorial});
	}

	_renderModalContent = () => {
		switch(this.state.modalType){
			case 'CreateGame':
				navigation = this.state.navigation;
				let betInput = (<View style={styles.inputContainer}>
			      	<TextInput
			      		style={styles.transparentTextinput}
			      		onChangeText={(text)=>{this.setState({min_bet:text})}}
			      		value={this.state.min_bet.toString()}
			      		selectTextOnFocus={true}
			      		autoFocus={true}
			      		keyboardType={'numeric'}
			      		onSubmitEditing={()=>{this.createGame(navigation)}}
						underlineColorAndroid="transparent"
		      		/>
	      		</View>)
				
			    return (
			      	<ModalWindow
			      		title="Starting bet:"
			      		onApprove={()=> this.createGame(navigation)}
			      		onDismiss={()=> this.hideModal()}
			      		content={betInput}
		      		/>
			    );
		    case 'Settings':
		    	let settingsInput = (
		    		<View>
			    		<View style={[styles.home_settingsSection,{flexDirection:'column'}]}>
				      		<Text style={styles.boldText}>Venmo Username</Text>
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
			      			<View style={{marginRight:10}}>
					      		<Text style={styles.boldText}>Default Starting Bet</Text>
					      		<Text style={styles.italicText}>When creating a new game</Text>
				      		</View>
					      	<TextInput
					      		ref="Settings2"
					      		style={styles.textinputthin}
					      		onChangeText={(text)=>{this.setState({new_min_bet:text})}}
					      		value={this.state.new_min_bet.toString()}
					      		selectTextOnFocus={true}
					      		keyboardType='numeric'
					      		onSubmitEditing={()=>{this.refs.Settings3.focus()}}
					      		underlineColorAndroid="transparent"
				      		/>
			      		</View>
			      		<View style={[styles.home_settingsSection,{marginBottom:0}]}>
				      		<View style={{marginRight:40}}>
					      		<Text style={styles.boldText}>Buy In Intervals</Text>
					      		<Text style={styles.italicText}>When selecting Buy In</Text>
				      		</View>
					      	<TextInput
					      		ref="Settings3"
					      		style={styles.textinputthin}
					      		onChangeText={(text)=>{this.setState({new_buy_in_intervals:text})}}
					      		value={this.state.new_buy_in_intervals.toString()}
					      		selectTextOnFocus={true}
					      		keyboardType='numeric'
					      		onSubmitEditing={()=>{this.refs.Settings4.focus()}}
					      		underlineColorAndroid="transparent"
				      		/>
			      		</View>
			      		{/*
			      		<View style={[styles.home_settingsSection,{marginBottom:0}]}>
			      			<View style={{marginRight:10}}>
					      		<Text style={styles.boldText}>Chips Basic Unit</Text>
					      		<Text style={styles.italicText}>For the Cash Out calculator</Text>
				      		</View>
					      	<TextInput
					      		ref="Settings4"
					      		style={styles.textinputthin}
					      		onChangeText={(text)=>{this.setState({new_chip_unit:text})}}
					      		value={this.state.new_chip_unit}
					      		selectTextOnFocus={true}
					      		keyboardType='numeric'
					      		onSubmitEditing={()=>{this.updateSettings()}}
					      		underlineColorAndroid="transparent"
				      		/>
			      		</View>
			      		*/}
		      			<Text style={styles.errorLabel}>{this.state.errorLabel}</Text>
		    		</View>
		    	);
		    	return (
			      	<ModalWindow
			      		title="Settings"
			      		onApprove={()=> this.updateSettings()}
			      		onDismiss={()=> {
			      			this.hideModal();
			      			this.setState({
			      				new_venmo_username: this.state.user.venmo_username,
			      				new_min_bet: this.state.user.default_min_bet,
			      				nem_buy_in_intervals: this.state.user.buy_in_intervals,
			      				//new_chip_unit: this.state.user.chip_basic_unit,
			      			});
			      		}}
			      		content={settingsInput}
		      		/>
			    );
		    	
		    case 'BackToPrev':
		    	let prevInput = (
		    		<ListPicker
						containerStyle={styles.home_gameList} 
						optionArray={this.state.active_games}
						keyExtractor={(l,i)=>l.game}
						onPressElement={(l,i)=> async ()=>{
				        	//TODO: check all this occuronces for errors!
				        	this.hideModal();
				        	this.joinGame(l.game);
				        }}
				        textExtractor={this.gameDateExtractor}
					/>
				);
		    	return (
		    		<ModalWindow
			      		title="Select game:"
			      		onDismiss={()=> this.hideModal()}
			      		content={prevInput}
		      		/>
	    		);
    		case 'BackToPast':
    			let pastInput = (
    				<ListPicker
						containerStyle={styles.home_gameList} 
						optionArray={this.state.past_games}
						keyExtractor={(l,i)=>l.game}
						onPressElement={(l,i)=> async ()=>{
				        	//TODO: check all this occuronces for errors!
				        	this.hideModal();
				        	this.joinGame(l.game);
				        }}
				        textExtractor={this.gameDateExtractor}
					/>
    			);
		    	return (
		    		<ModalWindow
			      		title="Select game:"
			      		onDismiss={()=> this.hideModal()}
			      		content={pastInput}
		      		/>
	    		);
    		case 'About':
    			return <AboutModal
    				onClose={()=> this.hideModal()}
    				onDonate={()=> this.donate()}
    				donateButton={false}
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
    	return <Text style={styles.modalText} >{dateStr}</Text>
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

	showModal(name){
		this.setState({isModalVisible:true,modalType:name});
	}

	hideModal(){
		this.setState({isModalVisible:false,modalType:''});
	}

	render() {
		navigation = this.state.navigation;
		
		let active_games = this.state.active_games;
		let prevGameColor = null;
		let prevGameAction = null;
		if (active_games.length > 0){
			prevGameAction = ()=>{this.showModal('BackToPrev')};
		} else {
			prevGameAction = ()=>{};
			prevGameColor = app_grey;
		}
		let prevGameButton = (
			<Button
            	onPress={prevGameAction} icon="ios-log-in" title="CONTINUE GAME"
            	color={prevGameColor}
        	/>
        );

		let past_games = this.state.past_games;
		let pastGameColor = null;
		let pastGameAction = null;
		if (past_games.length > 0){
			pastGameAction = ()=>{this.showModal('BackToPast')};
			pastGameColor = app_red;
		} else {
			pastGameAction = ()=>{};
			pastGameColor = app_grey;
		}
		let pastGameButton = (
			<Button
            	onPress={pastGameAction} icon="ios-timer-outline" title="HISTORY"
            	color={pastGameColor}
        	/>
        );
		
		let joinButtonColor = (this.state.game_identifier.length === 5) ? app_red : app_grey;

		return (
			<SafeAreaView style={styles.safeArea}>
		      <View style={styles.welcome_container}>
		      	{/*Headers*/}
		      	<StatusBar/>
		      	<Modal isVisible={this.state.isModalVisible === true} style={styles.modal}>
					{this._renderModalContent()}
		        </Modal>
		    	
		    	{/*Top - logo*/}
		        <View style={styles.home_appLogoContainer}>
			        <Text style={styles.home_appLogoText}>P</Text>
			        <TouchableOpacity onPress={()=>this.showModal('About')}>
			        	<Image source={{uri:ASSET_APP_LOGO}} style={styles.home_appLogoImage} />
			        </TouchableOpacity>
			        <Text style={styles.home_appLogoText}>CAT</Text>
		        </View>

		    	{/*Middle - main menu*/}
		        <View style={styles.home_mainContainer}>

		        	<View style={styles.home_mainInputContainer}>
			    		<TextInput
				      		style={styles.home_mainTextInput}
				      		onChangeText={(text)=>{this.setState({game_identifier:text})}}
				      		value={this.state.game_identifier}
				      		autoCapitalize={'characters'}
				      		selectTextOnFocus={true}
				      		maxLength={5}
				      		placeholder='TYPE ADDRESS...'
				      		placeholderTextColor={app_grey}
				      		underlineColorAndroid="transparent"
				      		onSubmitEditing={()=>this.joinGame(this.state.game_identifier)}
			      		/>
			      		<Button
		                	onPress={()=>this.joinGame(this.state.game_identifier)} icon="ios-arrow-dropright" title="JOIN GAME"
		                	style={{overflow:'hidden',borderTopRightRadius: 0,borderTopLeftRadius: 0,marginBottom:0,height:'50%'}}
		                	color={joinButtonColor}
	                	/>
		      		</View>
	      			<Text style={[styles.errorLabel,{color:'white',height:20}]}>{this.state.errorLabel}</Text>
		      		
		        	<View style={{flex:5,marginBottom:0,justifyContent:'center',alignItems:'center'}}>
			        
			        	<Button onPress={()=>this.showModal('CreateGame')} icon="ios-add-circle-outline" title="CREATE GAME"/>
			        	{prevGameButton}
		                {pastGameButton}
				    	<Button onPress={()=>this.showModal('Settings')} icon="ios-settings-outline" title="SETTINGS"/>
			      	</View>
		      	</View>
		      	
		      	{/*Buttom - user menu*/}
		      	<View style={styles.home_userMenuContainer}>
			      	<View style={[styles.home_userMenu,styles.row,{height:52,justifyContent:'center',alignItems:'center',borderWidth:1}]}>
			        	
			        	<View style={{borderTopLeftRadius:12,borderBottomLeftRadius:12,marginRight:10,overflow:"hidden",width:50,height:50}}>
		        			<SafeImage uri={utils.getUserProfilePicture(this.state.user)} style={[styles.home_userPicture,{borderTopLeftRadius:12,borderBottomLeftRadius:12}]} />
		        		</View>
		        		<Text style={[styles.textSubheader,{color:'white'}]}>{this.state.user.first_name + " " + this.state.user.last_name}</Text>
			        	<TouchableOpacity style={[styles.menuButton,{alignItems:'center',justifyContent:'center',width:50,height:50,borderTopLeftRadius:0,borderBottomLeftRadius:0,margin:0,marginLeft:10}]} onPress={()=>this.logout()}>
			        		<Ionicons name="ios-exit-outline" color={app_red} size={30} />
			        	</TouchableOpacity>
				      	
			        </View>
		        </View>

		      </View>
	      	</SafeAreaView>
	    );
	}

}
