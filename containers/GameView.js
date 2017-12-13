import React, { Component } from 'react';
import {
  Text, View, ScrollView, TextInput, Picker, AppState, TouchableOpacity, AsyncStorage, SafeAreaView,
} from 'react-native';

import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { PUSHER_API_KEY,PUSHER_CLUSTER,ASSET_POT_ICON } from 'react-native-dotenv';

import styles, {app_red,app_pink} from '../Styles';
import * as utils from '../UtilFunctions';
import PlayerList from '../components/PlayerList';
import ResultList from '../components/ResultList';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import SafeImage from '../components/SafeImage';
import ListPicker from '../components/ListPicker';
import CalculatorInput from '../components/CalculatorInput';
import TutorialModal from '../components/TutorialModal';
import StatusBar from '../components/StatusBar';

import Pusher from 'pusher-js/react-native';

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher(PUSHER_API_KEY, {
  cluster: PUSHER_CLUSTER,
  encrypted: true
});

export default class GameView extends Component {

	constructor(props){
		super(props);
		const {navigation} = props;
		const {user,game,token,showTutorial} = navigation.state.params;
		const is_host = (game.host === user.id);

		var channel = pusher.subscribe(game.identifier);
		channel.bind('game-update', function(data) {
		  this.setState({game:data.game});
		}.bind(this));

		this.state = {
			navigation: navigation,
			token: token,
			user: user,
			game: game,
			buy_in_amount: user.buy_in_intervals,
			result_amount: 0,
			is_host: is_host,
		    isModalVisible: false,
		    modalType: '',
		    isTutorialVisible: false,
		    showTutorial: showTutorial,
		    selected_player: user,
		    guest_first_name: '',
		    guest_last_name: '',
		    guest_password: '',
		    guest_venmo: '',
		    errorLabel: '',
		    appState: AppState.currentState,
		    isHostMenuVisible: false,
		    paying_player_id: null,
		    paying_amount: 0,
		    result_calc_1: 0,
		    result_calc_2: 0,
		    result_calc_3: 0,
		    result_calc_4: 0,
		    result_calc_5: 0,
		    isCalcVisible: false,
		    channel: channel,
		    new_venmo_username: user.venmo_username,
		};

	}

	_renderModalContent = () => {
		switch(this.state.modalType){
			case 'AddGuest':
				return (
					<View style={styles.modalContent}>
						<Text style={styles.textSubheader}>Add Guest</Text>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.game_modals_textInput}
					      		onChangeText={(text)=>{this.setState({guest_first_name:text})}}
								value={this.state.guest_first_name}
								selectTextOnFocus={true}
								placeholder='First Name'
								onSubmitEditing={()=>{this.refs.Input2.focus()}}
								underlineColorAndroid="transparent"
							/>
							<TextInput
								ref='Input2'
								style={styles.game_modals_textInput}
					      		onChangeText={(text)=>{this.setState({guest_last_name:text})}}
								value={this.state.guest_last_name}
								selectTextOnFocus={true}
								placeholder='Last Name'
								onSubmitEditing={()=>{this.refs.Input3.focus()}}
								underlineColorAndroid="transparent"
							/>
							<TextInput
								ref='Input3'
								style={styles.game_modals_textInputButtom}
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
						<View style={styles.modalButtonsContainer} >
							<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
			        		<IconButton action={()=> this.submitGuest()} name="ios-checkmark-circle-outline" text="Confirm" />
						</View>
					</View>
				);
			case 'FinishGame':
				if(this.calcPotMoney().potMoney === 0){
					return(
						<View style={styles.modalContent}>
							<Text>Are you sure? This will finish the game and is irreversible.</Text>
							<View style={styles.modalButtonsContainer} >
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
							<View style={styles.row}>
								<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Close" />
							</View>
						</View>);
				}
			case 'ApproveGame':
				return(
					<View style={styles.modalContent}>
						<Text>Are you sure? This will end the game and no more payments can be listed.</Text>
						<View style={styles.modalButtonsContainer} >
							<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Close" />
							<IconButton action={async ()=> {
								await this.approveGame();
								//TODO: check if error
								this.setState({isModalVisible:false});
							}} name="ios-checkmark-circle-outline" text="Confirm" />
						</View>
					</View>);
				
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
										this.setState({buy_in_amount:this.state.buy_in_amount-this.state.user.buy_in_intervals});
									}
								} else if (this.state.buy_in_amount > this.state.user.buy_in_intervals){
									this.setState({buy_in_amount:this.state.buy_in_amount-this.state.user.buy_in_intervals});
								} else {
									return;
								}
							}} name="ios-remove-circle-outline" />
							<Text style={styles.game_valueText}>${this.state.buy_in_amount}</Text>
							<IconButton action={()=>{this.setState({buy_in_amount:this.state.buy_in_amount+this.state.user.buy_in_intervals})}} name="ios-add-circle-outline" />
						</View>
						<View style={styles.modalButtonsContainer} >
							<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
			        		<IconButton action={async () => {
								let updated_game = await utils.buy_in(
									this.state.buy_in_amount,this.state.game.identifier,this.state.token,this.state.selected_player.id
								);
								this.setState({game:updated_game,buy_in_amount:this.state.user.buy_in_intervals,isModalVisible:false});
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
							editable={!this.state.isCalcVisible}
						/>

						{this.renderResultCalc()}

						<View style={styles.modalButtonsContainer} >
							<IconButton action={()=> this.setState({isCalcVisible:!this.state.isCalcVisible})} name="ios-calculator-outline" text="Calculator" />
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
						<ListPicker
							containerStyle={{width:200,maxHeight:375}} 
							optionArray={this.state.game.bets}
							keyExtractor={(l,i)=>l.player.id}
							onPressElement={(l,i)=> async ()=>{
					        	//TODO: check all this occuronces for errors!
					        	this.setState({isModalVisible:false,selected_player:l.player});
					        }}
					        textExtractor={(l,i)=> <Text style={styles.textSubheader} >{l.player.first_name} {l.player.last_name}</Text>}
						/>
						<View style={styles.modalButtonsContainer} >
			      			<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
				        </View>
					</View>
				);
			case 'UpdateVenmo':
				return (
					<View style={styles.modalContent}>
						<Text style={styles.textSubheader}>Update Venmo</Text>
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.textinputwide}
								onChangeText={(text)=>{this.setState({new_venmo_username:text})}}
								value={this.state.new_venmo_username}
								selectTextOnFocus={true}
								autoFocus={true}
								placeholder='Account username (without the @)'
								onSubmitEditing={()=>{this.updateVenmo()}}
								underlineColorAndroid="transparent"
							/>
						</View>
						<View style={styles.modalButtonsContainer}>
							<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
							<IconButton action={()=> {
								this.updateVenmo();
							}} name="ios-checkmark-circle-outline" text="Confirm" />
						</View>
					</View>
				);
			case 'Tutorial':
				let hostTutorial = [
					"Welcome to your new game!\n\nAccess this tutorial using the \"Help\" button at any time.",
					"Note the \"Show Host Menu\" on the buttom of the screen. \nUse this menu to invite guests who don't have the pocat app.\nYou can also act as other users using the \"Act as\" button.",
					"Acting as others is easy, just use the menu buttons as if you were them.\nRemember to use the \"Act as\" button again when you want to resume playing as yourself.",
					"When all players cashed out, the game is complete and you should press the \"Finish Game\" button. Pocat would then tell each winning player who they should charge.\nYou will be able to send charge requests to all players yourself if needed.",
					"Once all winning players confirmed (using the thumb up icon) they received all payments, you can then press the \"Approve Game\" button and end the game.",
				];
				let game_host = this.state.game.bets.find((elem)=>{return elem.player.id==this.state.game.host}); 
				let playerTutorial = [
					`Welcome to ${game_host.player.first_name}'s game!\n\nAccess this tutorial using the \"Help\" button at any time.`,
					`Use the \"Buy In\" button whenever you run out of chips and want to resume playing, ${game_host.player.first_name} and the rest of the players will be able to see that in real time\n`,
					"Use the \"Cash Out\" button when you leave the game. When all players left the game, Pocat will be able to tell each winner who they should charge to get their winnings",
					"In case you won, \"Charge\" and \"Confirm\" buttons would appear under your name for any player Pocat assigned to pay you. Use them to get paid using Venmo and to tell your host you received the money.",
				];
				let content = (this.state.is_host) ? hostTutorial : playerTutorial;
				return <TutorialModal 
					onClose={()=> this.setState({isTutorialVisible:false})}
					content={content}
					checkmarkValue={this.state.showTutorial}
					onCheckmark={async ()=>{
						let showTutorial = !this.state.showTutorial;
						this.setState({showTutorial:showTutorial});
						await AsyncStorage.setItem('@pokerBuddy:showTutorial',showTutorial.toString());
					}}
				/>
			default:
				return (<View><Text>Error</Text></View>);

		}
		
	}

	updateVenmo(){
		//if you ever want to add this to "act as" feature, remember to also change the venmo username when replacing selected player
		utils.updateVenmo(this.state.new_venmo_username,this.state.user,this.state.token);
		this.setState({isModalVisible:false});
	}

	componentDidMount() {
		//update game when app returns to foreground
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount() {
		this.state.channel.unbind();
		AppState.removeEventListener('change', this._handleAppStateChange);
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

	renderResultCalc() {

		if(this.state.isCalcVisible){
		return (
			<View>
				<View style={styles.row}>
					<CalculatorInput onChangeText={async (text)=>{await this.setState({result_calc_1:text});this.setState({result_amount:this.calcResult()})}} value={this.state.result_calc_1} color={'#aaa'} text="$1/4" inputIndex={1}/>
					<CalculatorInput onChangeText={async (text)=>{await this.setState({result_calc_2:text});this.setState({result_amount:this.calcResult()})}} value={this.state.result_calc_2} color={'#f00'} text="$1/2" inputIndex={2}/>
					<CalculatorInput onChangeText={async (text)=>{await this.setState({result_calc_3:text});this.setState({result_amount:this.calcResult()})}} value={this.state.result_calc_3} color={'#0c0'} text="$1" inputIndex={3}/>
					<CalculatorInput onChangeText={async (text)=>{await this.setState({result_calc_4:text});this.setState({result_amount:this.calcResult()})}} value={this.state.result_calc_4} color={'#00f'} text="$2" inputIndex={4}/>
					<CalculatorInput onChangeText={async (text)=>{await this.setState({result_calc_5:text});this.setState({result_amount:this.calcResult()})}} value={this.state.result_calc_5} color={'#000'} text="$4" inputIndex={5}/>
				</View>
			</View>
		)
		}else{
			return null;
		}
	}

	calcResult(){
		//uses math.round to make sure number will have only 2 decimal points
		return Math.round(
			100 * this.state.user.chip_basic_unit * (
				this.state.result_calc_1 * 0.25 +
				this.state.result_calc_2 * 0.5 +
				this.state.result_calc_3 * 1 +
				this.state.result_calc_4 * 2 +
				this.state.result_calc_5 * 4
			)
		)/100;
	}

	async submitGuest(){
		this.setState({errorLabel:''})
		if (!this.state.guest_first_name || !this.state.guest_last_name){
			this.setState({errorLabel:'All fields are required'});
			return;
		}

		/*
		To make each guest a unique user with his own unique username,
		we'll use the guest's name and the game's identifier.
		Player count after this user would also be added, 
		in case there are two users with same name in the same game
		*/
		let player_count = this.state.game.bets.length + 1;
		
		let form = {
			username:
				this.state.guest_first_name
				+"-"+this.state.guest_last_name
				+"-"+this.state.game.identifier
				+"-"+player_count.toString(),
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
		var earningsTotal = 0;
		this.state.game.bets.forEach(function(player) {
			let earnings = Number(player.result) - Number(player.amount);
		    potMoney = potMoney - earnings;
		    if (earnings > 0){
		    	earningsTotal = earningsTotal + earnings;
		    }
		});

		return {earningsTotal:earningsTotal,potMoney:potMoney};
	}

	calcPaidMoney(){
		var paidMoney = 0;
		this.state.game.bets.forEach(function(bet) {
			bet.payments.forEach(function(payment) {
				if (payment.is_confirmed){
					paidMoney = paidMoney + Number(payment.amount);
				}
			});
		});
		return paidMoney;
	}

	addGuest(navigation){
		//TODO: randomize password
		this.setState({modalType:"AddGuest",guest_password:"butterfly",isModalVisible:true});
	}

	async finishGame(){
		navigation = this.state.navigation;
		const gameObj = await utils.fetchFromServer('games/' + this.state.game.identifier + "/finish_game/",'POST',{},this.state.token);
	}

	async approveGame(){
		navigation = this.state.navigation;
		const gameObj = await utils.fetchFromServer('games/' + this.state.game.identifier + "/approve_game/",'POST',{is_approved: true},this.state.token);
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
		var renderHostMenu = null;
		var ActingAsText = null;
		let user = this.state.user;
		if (this.state.is_host && !this.state.game.is_approved){
			//TODO: can you take the view our?
			if (this.state.isHostMenuVisible){
				if (this.state.game.is_active){
					if (this.state.selected_player.id !== this.state.user.id){
						ActingAsText = (
							<Text>Acting as <Text style={styles.boldText} >{this.state.selected_player.first_name} {this.state.selected_player.last_name}</Text>{"\n"}</Text>
						);
					}
					var renderHostButtons = (
						<View style={styles.game_actionsView_hostButtons} >
							<IconButton name="ios-person-add-outline" text="Add Guest" size={30} action={()=>
								this.addGuest(navigation)
							} />
							<IconButton name="ios-eye-outline" text="Act As..." size={30} action={()=>
								this.selectPlayer()
							} />
							<IconButton name="ios-checkmark-circle-outline" text="Finish Game" size={30} action={()=>
								this.setState({modalType:'FinishGame',isModalVisible:true})
							} />
						</View>
					);
				} else if (!this.state.game.is_approved){
					var renderHostButtons = (
						<View style={styles.game_actionsView_hostButtons} >
							<IconButton name="ios-checkmark-circle-outline" text="Approve" size={30} action={()=>
								this.setState({modalType:'ApproveGame',isModalVisible:true})
							} />
						</View>
					);
				}
				renderHostMenu = (
					<View style={styles.game_actionsView_hostMenu}>
						<View style={styles.row}>
						<IconButton name="ios-close-circle-outline" style={styles.narrowMargin} text="" size={20} action={
							()=>this.setState({isHostMenuVisible:false})
						} />
						{renderHostButtons}
						</View>
						<Text style={styles.game_actionsView_hostText}>
							{ActingAsText}
							As Host of this game, only you can make these actions
						</Text>
					</View>
				);
				
			}else{
				renderHostMenu = (
					<View style={styles.game_actionsView_hostShowButton}>
						<Button title="Show Host Menu" onPress={()=>this.setState({isHostMenuVisible:true})} />
					</View>
				);
			}
		}

		var renderExtraButtons = null;
		var {potMoney,earningsTotal} = this.calcPotMoney();
		var paidMoney = this.calcPaidMoney();
		
		if (this.state.game.is_active){
			renderExtraButtons = (
				<View style={styles.row} >
	    			<IconButton name="ios-add-circle-outline" text="Buy In" action={
						()=>this.setState({modalType:"BuyIn",isModalVisible:true})
					} />
		    		<IconButton name="ios-exit-outline" text="Cash Out" action={
						()=>this.setState({modalType:"LeaveGame",isModalVisible:true})
					} />
				</View>
			);
			var renderList = <PlayerList game={this.state.game} player={this.state.selected_player}/>;
			var PotLabel = "Game Money";
			var PotValue = "$" + potMoney.toString();
		}else{
			if (!this.state.game.is_approved){
				renderExtraButtons = (
					<View style={styles.row} >
		    			<IconButton name="ios-create-outline" text="Update Venmo" action={
							()=>this.setState({modalType:"UpdateVenmo",isModalVisible:true})
						} />
					</View>
				);
				var PotLabel = "Unpaid Money";
				var PotValue = "$" + (earningsTotal-paidMoney).toString();	
			}else{
				var PotLabel = "Paid Money";
				var PotValue = "$" + paidMoney.toString();
			}
			var renderList = <ResultList game={this.state.game} player={this.state.selected_player} token={this.state.token} is_host={this.state.is_host} />;
		}
	
		var renderPlayerButtons = (
			<View style={styles.game_actionsView_playerButtons} >
    			{renderExtraButtons}
    			<IconButton name="ios-help-circle-outline" text="Help" action={
					()=> {
						this.setState({isTutorialVisible:true,modalType:"Tutorial"});
					}
				} />
    			<IconButton name="ios-home-outline" text="Home" action={
					()=> {
						AsyncStorage.removeItem('@pokerBuddy:currentGame');
						utils.resetToScreen(navigation,"HomeView",{token:this.state.token,user:this.state.user})
					}
				} />
			</View>
		);
		
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container} onLayout={()=>{
					if (this.state.showTutorial){
						this.setState({isTutorialVisible:true,modalType:"Tutorial"});
					}
				}}>
					{/*Headers*/}
					<StatusBar/>
					<Modal isVisible={this.state.isModalVisible === true} style={styles.modal}>
						{this._renderModalContent()}
					</Modal>
					<Modal 
						isVisible={this.state.isTutorialVisible === true} 
						style={styles.tutorial}
						animationIn={'slideInLeft'}
	          			animationOut={'slideOutRight'}
					>
						{this._renderModalContent()}
					</Modal>

					{/*Top View*/}
					<View style={styles.game_topView}>
						<View style={styles.game_topView_section}>
							<Text style={styles.game_valueText}>{this.state.game.identifier}</Text>
							<Text style={styles.game_labelText}>Game Address</Text>
							<Ionicons name="md-link" color="red" size={75} style={styles.game_topView_identifierIcon} />
						</View>
						<View style={styles.game_topView_section}>
							<Text style={styles.game_valueText}>{PotValue}</Text>
							<Text>{PotLabel}</Text>
							<SafeImage uri={ASSET_POT_ICON} style={styles.game_potIcon} />
						</View>
					</View>

					{/*Player List*/}
					<ScrollView contentContainerStyle={styles.game_playerList} >
						{renderList}
					</ScrollView>

					{/*Actions*/}
					<View style={styles.game_actionsView}>
						{renderHostMenu}
						{renderPlayerButtons}
					</View>
				</View>
			</SafeAreaView>
		);
	}

}
