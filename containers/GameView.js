import React, { Component } from 'react';
import {
  Text, View, ScrollView, TextInput, Picker, StatusBar, TouchableOpacity, AsyncStorage
} from 'react-native';

import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

import styles from '../Styles';
import * as utils from '../UtilFunctions';
import PlayerList from '../components/PlayerList';
import ResultList from '../components/ResultList';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import SafeImage from '../components/SafeImage';
import ListPicker from '../components/ListPicker';
import CalculatorInput from '../components/CalculatorInput';

import Pusher from 'pusher-js/react-native';

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher('442e9fce1c86b001266e', {
  cluster: 'us2',
  encrypted: true
});

export default class GameView extends Component {

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
		    isHostMenuVisible: false,
		    paying_player_id: null,
		    paying_amount: 0,
		    result_calc_1: 0,
		    result_calc_2: 0,
		    result_calc_3: 0,
		    result_calc_4: 0,
		    result_calc_5: 0,
		    isCalcVisible: false,
		};

		var channel = pusher.subscribe(game.identifier);
		channel.bind('game-update', function(data) {
		  this.setState({game:data.game});
		}.bind(this));

		//TODO: any other way to solve this?
		console.ignoredYellowBox = [
			'Setting a timer'
		];

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
				if(this.calcPotMoney().potMoney === 0){
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
			case 'ApproveGame':
				case 'FinishGame':
					return(
						<View style={styles.modalContent}>
							<Text>Are you sure? This will end the game and no more payments can be listed.</Text>
							<View style={{flexDirection:'row'}}>
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
							editable={!this.state.isCalcVisible}
						/>

						{this.renderResultCalc()}

						<View style={{flexDirection:'row'}}>
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
						<View style={{flexDirection:'row'}}>
			      			<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
				        </View>
					</View>
				);
			default:
				return (<View><Text>Error</Text></View>);

		}
		
	}

	renderResultCalc() {

		if(this.state.isCalcVisible){
		return (
			<View>
				<View style={{flexDirection:'row'}}>
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
		return (
			this.state.result_calc_1 * 0.25 +
			this.state.result_calc_2 * 0.5 +
			this.state.result_calc_3 * 1 +
			this.state.result_calc_4 * 2 +
			this.state.result_calc_5 * 4
		);
	}

	async submitGuest(){
		this.setState({errorLabel:''})
		if (!this.state.guest_first_name || !this.state.guest_last_name){
			this.setState({errorLabel:'All fields are required'});
			return;
		}
		let form = {
			username: this.state.guest_first_name+"-"+this.state.guest_last_name+"-"+this.state.game.identifier,
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
							<Text>Acting as <Text style={{fontWeight:'bold'}} >{this.state.selected_player.first_name} {this.state.selected_player.last_name}</Text>{"\n"}</Text>
						);
					}
					var renderHostButtons = (
						<View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',borderRadius:12,borderColor:'#ffccbb' ,borderWidth:1}} >
							<IconButton action={()=>this.addGuest(navigation)} name="ios-person-add-outline" text="Add Guest" size={30}/>
							<IconButton action={()=>this.selectPlayer()} name="ios-eye-outline" text="Act As..." size={30}/>
							<IconButton action={()=>this.setState({modalType:'FinishGame',isModalVisible:true})} name="ios-checkmark-circle-outline" text="Finish Game" size={30}/>
						</View>
					);
				} else if (!this.state.game.is_approved){
					var renderHostButtons = (
						<View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',borderRadius:12,borderColor:'#ffccbb' ,borderWidth:1}} >
							<IconButton action={()=>this.setState({modalType:'ApproveGame',isModalVisible:true})} name="ios-checkmark-circle-outline" text="Approve" size={30}/>
						</View>
					);
				}
				renderHostMenu = (
					<View style={{height:100,alignItems:'center',justifyContent:'center'}}>
						<View style={{flexDirection:'row'}}>
						<IconButton action={()=>this.setState({isHostMenuVisible:false})} name="ios-close-circle-outline" style={{margin:3}} text="" size={20}/>
						{renderHostButtons}
						</View>
						<Text style={{textAlign:'center',color:'#ffccbb'}}>
							{ActingAsText}
							As Host of this game, only you can make these actions
						</Text>
					</View>
				);
				
			}else{
				renderHostMenu = (
					<View style={{height:30,alignItems:'center',justifyContent:'center'}}>
					<Button title="Show Host Actions" onPress={()=>this.setState({isHostMenuVisible:true})} />
					</View>
				);
			}
		}

		var renderExtraButtons = null
		var {potMoney,earningsTotal} = this.calcPotMoney();
		var paidMoney = this.calcPaidMoney();
		
		if (this.state.game.is_active){
			renderExtraButtons = (
				<View style={{flexDirection:'row'}} >
	    			<IconButton action={
						()=>this.setState({modalType:"BuyIn",isModalVisible:true})
					} name="ios-add-circle-outline" text="Buy In" />
		    		<IconButton action={
						()=>this.setState({modalType:"LeaveGame",isModalVisible:true})
					} name="ios-exit-outline" text="Leave Game" />
				</View>
			);
			var renderList = <PlayerList game={this.state.game} player={this.state.selected_player}/>;
			var PotLabel = "Pot Money";
			var PotValue = "$" + potMoney.toString();
		}else{
			if (!this.state.game.is_approved){
				var PotLabel = "Unpaid Money";
				var PotValue = "$" + (earningsTotal-paidMoney).toString();	
			}else{
				var PotLabel = "Paid Money";
				var PotValue = "$" + paidMoney.toString();
			}
			var renderList = <ResultList game={this.state.game} player={this.state.selected_player} token={this.state.token} is_host={this.state.is_host} />;
		}
	
		var renderPlayerButtons = (
			<View style={{height:100,flexDirection:'row'}} >
    			{renderExtraButtons}
    			<IconButton action={
					()=> {
						AsyncStorage.removeItem('@pokerBuddy:currentGame');
						utils.resetToScreen(navigation,"HomeView",{token:this.state.token,user:this.state.user})
					}
				} name="ios-home-outline" text="Main Menu" />
			</View>
		);

		
		
		return (
	      <View style={[{justifyContent:'center',flex:1},styles.container]}>
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
			    	<Text style={{fontWeight:'bold',fontSize:30,margin:8}}>{PotValue}</Text>
			    	<Text>{PotLabel}</Text>
		    		<SafeImage uri="https://s3.amazonaws.com/pokerbuddy/images/icon-pot.png" style={{position:'absolute',top:0,width:75,height:75,opacity: 0.2}} />
		    	</View>
	    	</View>

	        <ScrollView contentContainerStyle={{flex:1,marginTop:10,padding:15}} >
	        	{/*Player List*/}
		        {renderList}
        	</ScrollView>

        	<View style={{justifyContent:'flex-end',alignItems:'center'}}>
		    	{/*Actions*/}
				{renderHostMenu}
				{renderPlayerButtons}
			</View>
	      </View>
	    );
	}

}
