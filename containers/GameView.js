import React, { Component } from 'react';
import {
  Text, View, ScrollView, TextInput, Picker, AppState, StatusBar, TouchableOpacity,
} from 'react-native';

import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

import styles from '../Styles';
import * as utils from '../UtilFunctions';
import PlayerList from '../components/PlayerList';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import SafeImage from '../components/SafeImage';

import Pusher from 'pusher-js/react-native';

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher('442e9fce1c86b001266e', {
  cluster: 'us2',
  encrypted: true
});

export default class GameView extends Component {

	static navigationOptions = {
		title: 'Current Game'
	}

	constructor(props){
		super(props);
		const {navigation} = props;
		const {user,game,token} = navigation.state.params;
		const is_host = (game.host === user.id);

		this.state = {
			navigation: navigation,
			token: token,
			user: user,
			game: game,
			buy_in_amount: 5,
			result_amount: 0,
			is_host: is_host,
		    isModalVisible: false,
		    selected_player: user,
		    modalType: '',
		    guest_first_name: '',
		    guest_last_name: '',
		    guest_password: '',
		    guest_venmo: '',
		    errorLabel: '',
		    appState: AppState.currentState,
		    isHostMenuVisible: false,
		};

		var channel = pusher.subscribe(game.identifier);
		channel.bind('game-update', function(data) {
		  this.setState({game:data.game});
		}.bind(this));

	}

	_renderModalContent = () => {
		switch(this.state.modalType){
			case 'AddGuest':
				return (
					<View style={styles.modalContent}>
						<Text style={styles.textSubheader}>Add Guest</Text>
						<View style={styles.inputContainer}>
							<TextInput
								style={[styles.transparentTextinput,{borderBottomWidth:1,borderColor:'#ffccbb',width:250}]}
					      		onChangeText={(text)=>{this.setState({guest_first_name:text})}}
								value={this.state.guest_first_name}
								selectTextOnFocus={true}
								placeholder='First Name'
								onSubmitEditing={()=>{this.refs.Input2.focus()}}
								underlineColorAndroid="transparent"
							/>
							<TextInput
								ref='Input2'
								style={[styles.transparentTextinput,{borderBottomWidth:1,borderColor:'#ffccbb',width:250}]}
					      		onChangeText={(text)=>{this.setState({guest_last_name:text})}}
								value={this.state.guest_last_name}
								selectTextOnFocus={true}
								placeholder='Last Name'
								onSubmitEditing={()=>{this.refs.Input3.focus()}}
								underlineColorAndroid="transparent"
							/>
							<TextInput
								ref='Input3'
								style={[styles.transparentTextinput,{width:250}]}
								onChangeText={(text)=>{this.setState({guest_venmo:text})}}
								value={this.state.guest_venmo}
								selectTextOnFocus={true}
								placeholder='Venmo Account (Optional, no @)'
								onSubmitEditing={()=>this.submitGuest()}
								underlineColorAndroid="transparent"
								autoCapitalize='words'
							/>
						</View>
						<Text style={styles.errorLabel}>{this.state.errorLabel}</Text>
						<View style={{flexDirection:'row'}}>
							<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
			        		<IconButton action={()=> this.submitGuest()} name="ios-checkmark-circle-outline" text="Confirm" />
						</View>
					</View>
				);
			case 'FinishGame':
				if(this.calcPotMoney() === 0){
					return(
						<View style={styles.modalContent}>
							<Text>Are you sure? This will finish the game and is irreversible.</Text>
							<View style={{flexDirection:'row'}}>
								<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Close" />
								<IconButton action={()=> {
									this.setState({isModalVisible:false});
									this.finishGame();
								}} name="ios-checkmark-circle-outline" text="Confirm" />
							</View>
						</View>);
				}else{
					return(
						<View style={styles.modalContent}>
							<Text>Pot money has to be 0!</Text>
							<View style={{flexDirection:'row'}}>
								<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Close" />
							</View>
						</View>);
				}
			case 'BuyIn':
				return(
					<View style={styles.modalContent}>
						<Text style={styles.textSubheader}>Buy in amount:</Text>
						<View style={[styles.inputContainer,{flexDirection:'row',alignItems:'center',justifyContent:'center'}]}>
							<IconButton action={()=>{
								if (this.state.is_host){
									let bets = this.state.game.bets;
									let selected_bet = bets.find((elem)=>{return elem.player.id == this.state.selected_player.id});
									if (this.state.buy_in_amount > (-1 * selected_bet.amount)){
										this.setState({buy_in_amount:this.state.buy_in_amount-5});
									}
								} else if (this.state.buy_in_amount > 5){
									this.setState({buy_in_amount:this.state.buy_in_amount-5});
								} else {
									return;
								}
							}} name="ios-remove-circle-outline" />
							<Text style={{fontWeight:'bold',fontSize:30}}>${this.state.buy_in_amount}</Text>
							<IconButton action={()=>{this.setState({buy_in_amount:this.state.buy_in_amount+5})}} name="ios-add-circle-outline" />
						</View>
						<View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}} >
							<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
			        		<IconButton action={async () => {
								let updated_game = await utils.buy_in(
									this.state.buy_in_amount,this.state.game.identifier,this.state.token,this.state.selected_player.id
								);
								this.setState({game:updated_game,buy_in_amount:5,isModalVisible:false});
							}} name="ios-checkmark-circle-outline" text="Confirm" />
						</View>
					</View>);
			case 'LeaveGame':
				return (
					<View style={styles.modalContent}>
						<Text style={styles.textSubheader}>Final amount:</Text>
						<Text style={{marginBottom:10}}>(value of remaining chips, if any)</Text>
						<TextInput
							style={styles.textinput}
							onChangeText={(text)=>{this.setState({result_amount:text})}}
							value={this.state.result_amount.toString()}
							keyboardType='numeric'
							selectTextOnFocus={true}
							placeholder='Final result'
							underlineColorAndroid="transparent"
						/>
						<View style={{flexDirection:'row'}}>
							<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
			        		<IconButton action={async () => {
								let updated_game = await utils.leave_game(
									this.state.result_amount,this.state.game.identifier,this.state.token,this.state.selected_player.id
								);
								this.setState({game:updated_game,isModalVisible:false});
							}} name="ios-checkmark-circle-outline" text="Confirm" />
						</View>
					</View>);
			case 'SelectPlayer':
				return (
					<View style={styles.modalContent}>
						{/*TODO: move to utils*/}
		    			<ScrollView style={[styles.inputContainer,{width:200,maxHeight:375}]}> 
		    				{this.state.game.bets.map((l, i) => {
		    					if (i!==0){
		    						var elementStyle = {borderTopWidth:1,borderColor:'#ffccbb',width:200,paddingTop:10,paddingBottom:10};
		    					}else{
		    						var elementStyle = {borderTopWidth:0,borderColor:'#ffccbb',width:200,paddingTop:10,paddingBottom:10};
		    					}
		    					return (
			    					<TouchableOpacity key={l.player.id} style={elementStyle} onPress={async ()=>{
							        	//TODO: check all this occuronces for errors!
							        	this.setState({isModalVisible:false,selected_player:l.player});
							        }} >
			    						<Text style={styles.textSubheader} >{l.player.first_name} {l.player.last_name}</Text>
			    					</TouchableOpacity>
	    						)
		    				})}
						</ScrollView>
						<View style={{flexDirection:'row'}}>
			      			<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
				        </View>
					</View>
				);
			default:
				return (<View><Text>Error</Text></View>);

		}
		
	}

	componentDidMount() {
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	_handleAppStateChange = (nextAppState) => {
		if(this.state.appState){
			if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
				// Toggle the state every 2 minutes
			    this.refreshGame()
			}
			this.setState({appState: nextAppState});
		}
	}


	async submitGuest(){
		this.setState({errorLabel:''})
		if (!this.state.guest_first_name || !this.state.guest_last_name){
			this.setState({errorLabel:'All fields are required'});
			return;
		}
		let form = {
			username: this.state.guest_first_name+"-"+this.state.guest_last_name,
			first_name: this.state.guest_first_name,
			last_name: this.state.guest_last_name,
			password: this.state.guest_password,
			venmo_username: this.state.guest_venmo
		}
		var response = await utils.user_registration(form,false);
		if (response.error === 'None'){
			game = await utils.joinGame(this.state.game.identifier,this.state.token,response.user);

			this.setState({
				guest_first_name: '',
				guest_last_name: '',
				guest_password: '',
				guest_venmo: '',
				game: game,
				isModalVisible:false,
			});
		}else{
			this.setState({errorLabel:response.error});
		}
		this.setState({ isModalVisible:false });
	}

	calcPotMoney(){
		var potMoney = 0;
		this.state.game.bets.forEach(function(player) {
		    potMoney = potMoney + Number(player.amount) - Number(player.result);
		});
		return potMoney;
	}

	addGuest(navigation){
		//TODO: randomize password
		this.setState({modalType:"AddGuest",guest_password:"butterfly",isModalVisible:true});
	}

	async finishGame(){
		navigation = this.state.navigation;
		const gameObj = await utils.fetchFromServer('games/' + this.state.game.identifier + "/finish_game/",'POST',{},this.state.token);
		if (gameObj.status === 200){
			utils.resetToScreen(navigation,"HomeView",{token:this.state.token,user:this.state.user});
		}	
	}

	selectPlayer(){
		this.setState({isModalVisible:true,modalType:'SelectPlayer'});
	}

	async refreshGame(){
		const response = await utils.fetchFromServer('games/' + this.state.game.identifier + "/",'GET',null,this.state.token);
		if (response.status === 200){
			const game = await response.json();
			this.setState({game:game});
		}
	}

	render() {
		const { navigation } = this.props;
		var renderHostButtons = null;
		let user = this.state.user;
		if (this.state.is_host){
			//TODO: can you take the view our?
			if (this.state.isHostMenuVisible){
				renderHostButtons = (
					<View style={{height:100}}>
						<View style={{flexDirection:'row'}}>
						<IconButton action={()=>this.setState({isHostMenuVisible:false})} name="ios-close-circle-outline" style={{margin:3}} text="" size={20}/>
						<View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',borderRadius:12,borderColor:'#ffccbb' ,borderWidth:1}} >
							<IconButton action={()=>this.addGuest(navigation)} name="ios-person-add-outline" text="Add Guest" size={30}/>
							<IconButton action={()=>this.selectPlayer()} name="ios-eye-outline" text="Act As..." size={30}/>
							<IconButton action={()=>this.setState({modalType:'FinishGame',isModalVisible:true})} name="ios-checkmark-circle-outline" text="Finish Game" size={30}/>
						</View>
						</View>
						<Text style={{textAlign:'center',color:'#ffccbb'}}>
							Host Actions - Acting as {this.state.selected_player.first_name} {this.state.selected_player.last_name}
						</Text>
					</View>
				);
				}else{
					renderHostButtons = (
						<View style={{height:30}}>
						<Button title="Show Host Actions" onPress={()=>this.setState({isHostMenuVisible:true})} />
						</View>
					);
				}
		}
		var potMoney = this.calcPotMoney();
		
		return (
	      <View style={[{justifyContent:'center'},styles.container]}>
	      	<StatusBar hidden={true} />
	      	{/*Modal*/}
			<Modal isVisible={this.state.isModalVisible === true}>
				{this._renderModalContent()}
	        </Modal>

	        <View style={{height:90,justifyContent:'center',alignItems:'flex-start',flexDirection:'row'}}>
	        	{/*Top View*/}
	        	<View style={{justifyContent:'flex-start',alignItems:'center',flex:1}}>
			    	<Text style={{fontWeight:'bold',fontSize:30,margin:8}}>{this.state.game.identifier}</Text>
			    	<Text>Game Address</Text>
		    		<Ionicons name="md-link" color="red" size={75} style={{position:'absolute',bottom:12,opacity: 0.2}} />
		    	</View>
		    	<View style={{justifyContent:'flex-start',alignItems:'center',flex:1}}>
			    	<Text style={{fontWeight:'bold',fontSize:30,margin:8}}>${potMoney.toString()}</Text>
			    	<Text>Pot Money</Text>
		    		<SafeImage uri="https://s3.amazonaws.com/pokerbuddy/images/icon-pot.png" style={{position:'absolute',top:0,width:75,height:75,opacity: 0.2}} />
		    	</View>
	    	</View>

	        <ScrollView contentContainerStyle={{marginTop:10}} >
	        	{/*Player List*/}
		        <PlayerList game={this.state.game} player={this.state.user}/>
        	</ScrollView>

        	<View style={{justifyContent:'flex-end',alignItems:'center'}}>
		    	{/*Actions*/}
				{renderHostButtons}
		    	<View style={{height:100,flexDirection:'row'}} >
					<IconButton action={async ()=>{
						this.setState({modalType:"BuyIn",isModalVisible:true});
					}} name="ios-add-circle-outline" text="Buy In" />
		    		<IconButton action={async ()=>{
						this.setState({modalType:"LeaveGame",isModalVisible:true});
					}} name="ios-exit-outline" text="Leave Game" />
					{/*<IconButton action={()=>this.refreshGame()} name="ios-refresh-circle-outline" text="Refresh" />*/}
				</View>
			</View>
	      </View>
	    );
	}

}
