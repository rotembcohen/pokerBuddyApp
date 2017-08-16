import React, { Component } from 'react';
import {
  Text, View, ScrollView, TextInput, Picker, AppState, StatusBar
} from 'react-native';

import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

import styles from '../Styles';
import * as utils from '../UtilFunctions';
import PlayerList from '../components/PlayerList';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import SafeImage from '../components/SafeImage';

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
		    selected_player: '',
		    modalType: '',
		    guest_first_name: '',
		    guest_last_name: '',
		    guest_password: '',
		    guest_venmo: '',
		    errorLabel: '',
		    appState: AppState.currentState,
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
								style={[styles.transparentTextinput,{borderBottomWidth:1,borderColor:'#ffccbb',width:300}]}
					      		onChangeText={(text)=>{this.setState({guest_first_name:text})}}
								value={this.state.guest_first_name}
								selectTextOnFocus={true}
								placeholder='First Name'
								onSubmitEditing={()=>{this.refs.Input2.focus()}}
								underlineColorAndroid="transparent"
							/>
							<TextInput
								ref='Input2'
								style={[styles.transparentTextinput,{borderBottomWidth:1,borderColor:'#ffccbb',width:300}]}
					      		onChangeText={(text)=>{this.setState({guest_last_name:text})}}
								value={this.state.guest_last_name}
								selectTextOnFocus={true}
								placeholder='Last Name'
								onSubmitEditing={()=>{this.refs.Input3.focus()}}
								underlineColorAndroid="transparent"
							/>
							<TextInput
								ref='Input3'
								style={[styles.transparentTextinput,{width:300}]}
								onChangeText={(text)=>{this.setState({guest_venmo:text})}}
								value={this.state.guest_venmo}
								selectTextOnFocus={true}
								placeholder='Venmo Account (Optional, without the @)'
								onSubmitEditing={()=>this.submitGuest()}
								underlineColorAndroid="transparent"
							/>
						</View>
						<Text>This guest would be able to login in the future using the credentials:</Text>
						<Text>Username:{this.state.guest_first_name}-{this.state.guest_last_name}</Text>
						<Text>Password:{this.state.guest_password}</Text>
						<Text style={styles.errorLabel}>{this.state.errorLabel}</Text>
						<View style={{flexDirection:'row'}}>
							<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
			        		<IconButton action={()=> this.submitGuest()} name="ios-checkmark-circle-outline" text="Confirm" />
						</View>
					</View>
				);
			case 'FinishGame':
				return(
					<View style={styles.modalContent}>
						<Text>Pot money has to be 0!</Text>
						<View style={{flexDirection:'row'}}>
							<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Close" />
						</View>
					</View>);
			case 'BuyIn':
				return(
					<View style={styles.modalContent}>
						<Text style={styles.textSubheader}>Buy in amount:</Text>
						<View style={[styles.inputContainer,{flexDirection:'row',alignItems:'center',justifyContent:'center'}]}>
							<IconButton action={()=>{if (this.state.buy_in_amount > 5)this.setState({buy_in_amount:this.state.buy_in_amount-5})}} name="ios-remove-circle-outline" />
							<Text style={{fontWeight:'bold',fontSize:30}}>${this.state.buy_in_amount}</Text>
							<IconButton action={()=>{this.setState({buy_in_amount:this.state.buy_in_amount+5})}} name="ios-add-circle-outline" />
						</View>
						<View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}} >
							<IconButton action={()=> this.setState({isModalVisible:false})} name="ios-close-circle-outline" text="Cancel" />
			        		<IconButton action={async () => {
								let updated_game = await utils.buy_in(this.state.buy_in_amount,this.state.game.identifier,this.state.token,this.state.selected_player);
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
								let updated_game = await utils.leave_game(this.state.result_amount,this.state.game.identifier,this.state.token,this.state.selected_player);
								this.setState({game:updated_game,isModalVisible:false});
							}} name="ios-checkmark-circle-outline" text="Confirm" />
						</View>
					</View>);
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
			console.log("response user",response.user.id);
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

	async finishGame(navigation){
		if(this.calcPotMoney() === 0){
			const gameObj = await utils.fetchFromServer('games/' + this.state.game.identifier + "/finish_game/",'POST',{},this.state.token);
			if (gameObj.status === 200){
				utils.resetToScreen(navigation,"HomeView",{token:this.state.token,user:this.state.user});
			}	
		}else{
			this.setState({modalType:"FinishGame",isModalVisible:true});
		}
	}

	async refreshGame(){
		console.log('identifier',this.state.game.identifier);
		const response = await utils.fetchFromServer('games/' + this.state.game.identifier + "/",'GET',null,this.state.token);
		if (response.status === 200){
			const game = await response.json();
			this.setState({game:game});
		}
	}

	render() {
		const { navigation } = this.props;
		var renderHostButtons = null;
		var renderHostPicker = null;
		let user = this.state.user;
		if (this.state.is_host){
			//TODO: can you take the view our?
			renderHostButtons =
			(
				<View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',height:90}} >
					<IconButton action={()=>{this.addGuest(navigation)}} name="ios-person-add-outline" text="Add Guest"/>
					<IconButton action={()=>{this.finishGame(navigation)}} name="ios-checkmark-circle-outline" text="Finish Game" />
				</View>
			);
			renderHostPicker = 
			(
				<View style={{height:90,borderColor:'#ffccbb' ,borderWidth:1 ,borderRadius:12}}>
					<Text style={{textAlign:'center',marginTop:10}}>Take action as:</Text>
					<Picker
			        	style={{width:250}}
						selectedValue={this.state.selected_player}
						onValueChange={(itemValue, itemIndex) => {this.setState({selected_player: itemValue})}}>
							{this.state.game.bets.map(
								(l, i) => {
									return <Picker.Item 
										value={l.player.id}
										label={l.player.first_name + " " + l.player.last_name}
										key={l.player.id}  /> 
								}
							)}
					</Picker>
				</View>
			);
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
			{renderHostButtons}

	        <ScrollView contentContainerStyle={{marginTop:10}} >
	        	{/*Player List*/}
		        <PlayerList game={this.state.game} player={this.state.user}/>
        	</ScrollView>

        	<View style={{height:200,justifyContent:'flex-end',alignItems:'center'}}>
		    	{/*Actions*/}
		    	{renderHostPicker}
				<View style={{height:100,flexDirection:'row'}} >
					<IconButton action={async ()=>{
						this.setState({modalType:"BuyIn",isModalVisible:true});
					}} name="ios-add-circle-outline" text="Buy In" />
		    		<IconButton action={async ()=>{
						this.setState({modalType:"LeaveGame",isModalVisible:true});
					}} name="ios-exit-outline" text="Leave Game" />
					<IconButton action={()=>this.refreshGame()} name="ios-refresh-circle-outline" text="Refresh" />
				</View>
			</View>
	      </View>
	    );
	}

}




4