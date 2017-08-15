import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, TextInput, AsyncStorage, Picker, TouchableOpacity, StatusBar
} from 'react-native';

import Modal from 'react-native-modal';
import styles from '../Styles';
import * as utils from '../UtilFunctions';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import SafeImage from '../components/SafeImage';

export default class HomeView extends Component {

	static navigationOptions = {
		title: 'pocAt v0.1'
	}

	constructor(props){
		super(props);
		const {navigation} = props;
		this.state = {
			navigation: navigation,
			token: navigation.state.params.token,
			user: navigation.state.params.user,
			game_identifier: '',
			active_games: [],
			isModalVisible: false,
			min_bet: 20,
			new_venmo_username: navigation.state.params.user.venmo_username,
			modalType: '',
		};
		this.getActiveGames();
	}
	
	async createGame(navigation){
		//TODO: handle network error
		if (this.state.min_bet === '' || this.state.token === '' || this.state.token === 'no token'){
			return;
		}
		const response = await utils.fetchFromServer('games/','POST',{
			min_bet: this.state.min_bet
		},this.state.token);

		console.log(response.status);
		//game created succesfully
		if (response.status===201){
			//get new game identifier
			let game_json = JSON.parse(response._bodyText);
			let game_identifier = game_json.identifier;
			
			//TODO: add option for host not to immediately join game
			//join game
			game = await utils.joinGame(game_identifier,this.state.token,this.state.user);
			this.setState({isModalVisible:false});
			navigation.navigate('GameView',{game: game,user: this.state.user,token:this.state.token});
		}
		//TODO:else
		
	}

	//TODO: put in utils
	_renderButton = (text, onPress) => (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.modalButton}>
				<Text>{text}</Text>
			</View>
		</TouchableOpacity>
	);

	_renderModalContent = () => {
		switch(this.state.modalType){
			case 'CreateGame':
				navigation = this.state.navigation;
			    return (
			      <View style={styles.modalContent}>
			      	<Text style={styles.textSubheader}>Starting bet</Text>
			      	<TextInput
			      		style={styles.textinput}
			      		onChangeText={(text)=>{this.setState({min_bet:text})}}
			      		value={this.state.min_bet.toString()}
			      		selectTextOnFocus={true}
			      		autoFocus={true}
			      		keyboardType={'numeric'}
			      		onSubmitEditing={()=>{this.createGame(navigation)}}
		      		/>
			        <View style={{flexDirection:'row'}}>
						{this._renderButton('Cancel', ()=> this.setState({isModalVisible:false}))}
						{this._renderButton('Create Game', ()=>{this.createGame(navigation)})}
					</View>
			      </View>
			    );
		    case 'UpdateVenmo':
		    	return (
			      <View style={styles.modalContent}>
			      	<Text style={styles.textSubheader}>Update Vemno</Text>
			      	<TextInput
			      		style={styles.textinputwide}
			      		onChangeText={(text)=>{this.setState({new_venmo_username:text})}}
			      		value={this.state.new_venmo_username}
			      		selectTextOnFocus={true}
			      		autoFocus={true}
			      		placeholder='Account username (without the @)'
			      		onSubmitEditing={()=>{this.updateVenmo()}}
		      		/>
			        <View style={{flexDirection:'row'}}>
						{this._renderButton('Cancel', ()=> this.setState({isModalVisible:false}))}
						{this._renderButton('Confirm', ()=>{this.updateVenmo()})}
					</View>
			      </View>
			    );
		    case 'JoinGame':
		    	return (
		    		<View style={styles.modalContent}>
			    		<TextInput
				      		style={styles.textinput}
				      		onChangeText={(text)=>{this.setState({game_identifier:text})}}
				      		value={this.state.game_identifier}
				      		autoCapitalize={'characters'}
				      		selectTextOnFocus={true}
				      		maxLength={5}
				      		placeholder='Game Address'
			      		/>
			      		<View style={{flexDirection:'row'}}>
				      		{this._renderButton('Cancel', ()=> this.setState({isModalVisible:false}))}
				      		{this._renderButton('Join Game', async ()=>{
					        	//TODO: check all this occuronces for errors!
					        	game = await utils.joinGame(this.state.game_identifier,this.state.token,this.state.user);
					        	this.setState({isModalVisible:false});
					        	navigation.navigate('GameView',{game: game,user: this.state.user,token:this.state.token});
					        })}
				        </View>
			        </View>
	    		);
		    case 'BackToPrev':
		    	return (
		    		<View style={styles.modalContent}>
		    			<View style={{height:50,width:200,borderWidth:1,borderColor:'#ffccbb',borderRadius:12}}>
				    		<Picker
				        		selectedValue={this.state.game_identifier}
								onValueChange={(itemValue, itemIndex) => {this.setState({game_identifier: itemValue})}}>
									<Picker.Item value="" label="Choose Game" key="placeholder" />
									{this.state.active_games.map((l, i) => {return <Picker.Item value={l.game} label={l.game} key={l.game}  /> })}
							</Picker>
						</View>
						<View style={{flexDirection:'row'}}>
				      		{this._renderButton('Cancel', ()=> this.setState({isModalVisible:false}))}
				      		{this._renderButton('Join Game', async ()=>{
					        	//TODO: check all this occuronces for errors!
					        	if (this.state.game_identifier===''){
					        		return;
					        	}
					        	game = await utils.joinGame(this.state.game_identifier,this.state.token,this.state.user);
					        	this.setState({isModalVisible:false});
					        	navigation.navigate('GameView',{game: game,user: this.state.user,token:this.state.token});
					        })}
				        </View>
			        </View>
	    		);
		    default:
				return (<View><Text>Error</Text></View>);
		}
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
			//console.log("active_games",this.state.active_games[0].game);
		}
	}

	async updateVenmo(){
		const response = await utils.fetchFromServer(
			'users/' + this.state.user.id + '/update_venmo/',
			'POST',
			{
				venmo_username:this.state.new_venmo_username
			},
			this.state.token
		);
		this.setState({isModalVisible:false});
	}

	async logout(){
		await AsyncStorage.multiRemove(['@pokerBuddy:token','@pokerBuddy:user']);
		utils.resetToScreen(this.state.navigation,'LoginView');
	}

	render() {
		navigation = this.state.navigation;
		let active_games = this.state.active_games;
		return (
	      <View style={styles.container}>
	      	{/*Headers*/}
	      	<StatusBar hidden={true} />
	      	<Modal isVisible={this.state.isModalVisible === true}>
				{this._renderModalContent()}
	        </Modal>
	        <View style={{borderColor:'#ffccbb' ,borderWidth:1 ,borderRadius:12,padding:10}}>
	        	<Text>Current User: {this.state.user.first_name + " " + this.state.user.last_name}</Text>
	        </View>

	        <IconButton name="ios-add-circle-outline" text="Create Game" action={()=>{this.setState({isModalVisible:true,modalType:'CreateGame'})}} />
	        <IconButton name="ios-create-outline" text="Update Venmo" action={()=>{this.setState({isModalVisible:true,modalType:'UpdateVenmo'})}} />
	      	<IconButton name="ios-log-in" text='Back To Previous Game' action={()=>{this.setState({isModalVisible:true,modalType:'BackToPrev'})}} />
	      	<IconButton name="ios-people-outline" text='Join Game' action={()=>{this.setState({isModalVisible:true,modalType:'JoinGame'})}} />
	      	<IconButton name="ios-exit-outline" text='Logout' action={()=>this.logout()} />
	      </View>
	    );
	}

}
