import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, AsyncStorage, TextInput, TouchableOpacity, Picker, AppState
} from 'react-native';
import Modal from 'react-native-modal';

import styles from '../Styles';
import * as utils from '../UtilFunctions';
import PlayerList from '../components/PlayerList';

export default class GameView extends Component {

	static navigationOptions = {
		title: 'Current Game'
	}

	constructor(props){
		super(props);
		const {navigation} = props;
		const {user,game,token} = navigation.state.params;
		const is_host = (game.host === user.id);

		var refreshInterval = setInterval(this.refreshIntervalCreation, 10*1000);
	    console.log("first started interval");

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
		    refreshInterval: refreshInterval,
		    intervalCounter: 0
		};

	}

	componentDidMount(){
		this._handleAppStateChange();
	}

	refreshIntervalCreation = () => {
	    this.refreshGame();
	    this.setState({intervalCounter: this.state.intervalCounter + 1})
	    if (this.state.intervalCounter > 3){
	    	this.clearRefreshInterval();
	    }
    };

    clearRefreshInterval(){
    	clearInterval(this.state.refreshInterval);
    	this.setState({intervalCounter:0});
    	console.log("stopped interval");
    }

	_showModal = () => this.setState({ isModalVisible: true });

	_hideModal = () => this.setState({ isModalVisible: false });

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
			case 'AddGuest':
				return (
					<View style={styles.modalContent}>
						<Text>Add Guest</Text>
						<TextInput
							style={styles.textinput}
							onChangeText={(text)=>{this.setState({guest_first_name:text})}}
							value={this.state.guest_first_name}
							selectTextOnFocus={true}
							placeholder='First Name'
							onSubmitEditing={()=>{this.refs.Input2.focus()}}
						/>
						<TextInput
							ref='Input2'
							style={styles.textinput}
							onChangeText={(text)=>{this.setState({guest_last_name:text})}}
							value={this.state.guest_last_name}
							selectTextOnFocus={true}
							placeholder='Last Name'
							onSubmitEditing={()=>{this.refs.Input3.focus()}}
						/>
						<TextInput
							ref='Input3'
							style={styles.textinput}
							onChangeText={(text)=>{this.setState({guest_venmo:text})}}
							value={this.state.guest_venmo}
							selectTextOnFocus={true}
							placeholder='Venmo Account (Optional, without the @)'
							onSubmitEditing={()=>this.submitGuest()}
						/>
						<Text>This guest would be able to login in the future using the credentials:</Text>
						<Text>Username:{this.state.guest_first_name}-{this.state.guest_last_name}</Text>
						<Text>Password:{this.state.guest_password}</Text>
						<Text style={styles.errorLabel}>{this.state.errorLabel}</Text>
						<View style={{flexDirection:'row'}}>
							{this._renderButton('Cancel', () => this.setState({ isModalVisible:false,errorLabel:'' }))}
							{this._renderButton('Confirm', ()=> this.submitGuest())}
						</View>
					</View>
				);
			case 'FinishGame':
				return(
					<View style={styles.modalContent}>
						<Text>Pot money has to be 0!</Text>
						<View style={{flexDirection:'row'}}>
							{this._renderButton('Close', () => this.setState({ isModalVisible:false }))}
						</View>
					</View>);
			case 'BuyIn':
				return(
					<View style={styles.modalContent}>
						<Text>Buy in amount:</Text>
						<View style={{flexDirection:'row',alignItems:'center'}} >
							<Button title='-' onPress={()=>{if (this.state.buy_in_amount > 5)this.setState({buy_in_amount:this.state.buy_in_amount-5})}} />
							<Text>{this.state.buy_in_amount}</Text>
							<Button title='+' onPress={()=>{this.setState({buy_in_amount:this.state.buy_in_amount+5})}} />
						</View>
						<View style={{flexDirection:'row'}}>
							{this._renderButton('Cancel', () => this.setState({ isModalVisible:false }))}
							{this._renderButton('Confirm', async () => {
								let updated_game = await utils.buy_in(this.state.buy_in_amount,this.state.game.identifier,this.state.token,this.state.selected_player);
								this.setState({game:updated_game,buy_in_amount:5,isModalVisible:false});
							})}
						</View>
					</View>);
			case 'LeaveGame':
				return (
					<View style={styles.modalContent}>
						<Text style={styles.textSubheader}>Final amount:</Text>
						<Text>(value of remaining chips, if any)</Text>
						<TextInput
							style={styles.textinput}
							onChangeText={(text)=>{this.setState({result_amount:text})}}
							value={this.state.result_amount.toString()}
							keyboardType='numeric'
							selectTextOnFocus={true}
							placeholder='Final result'
						/>
						<View style={{flexDirection:'row'}}>
							{this._renderButton('Cancel', () => this.setState({ isModalVisible:false }))}
							{this._renderButton('Confirm', async () => {
								let updated_game = await utils.leave_game(this.state.result_amount,this.state.game.identifier,this.state.token,this.state.selected_player);
								this.setState({game:updated_game,isModalVisible:false});
							})}	
						</View>
					</View>);
			default:
				return (<View><Text>Error</Text></View>);

		}
		
	}

	componentDidMount() {
		AppState.addEventListener('change', this._handleAppStateChange);
	}

	componentWillUnmount() {
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	_handleAppStateChange = (nextAppState) => {

		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			// Toggle the state every 2 minutes
		    refreshInterval = setInterval(this.refreshIntervalCreation, 20*1000);
		    this.setState({refreshInterval:refreshInterval});
		    console.log("started interval");
		}else{
			this.clearRefreshInterval();
		}

		this.setState({appState: nextAppState});
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
		this.setState({modalType:"AddGuest",guest_password:"butterfly"});
		this._showModal();
	}

	async finishGame(navigation){
		if(this.calcPotMoney() === 0){
			const gameObj = await utils.fetchFromServer('games/' + this.state.game.identifier + "/finish_game/",'POST',{},this.state.token);
			if (gameObj.status === 200){
				utils.resetToScreen(navigation,"HomeView",{token:this.state.token,user:this.state.user});
			}	
		}else{
			this.setState({modalType:"FinishGame"});
			this._showModal();
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
		var renderTopView = null;
		let user = this.state.user;
		if (this.state.is_host){
			//TODO: can you take the view our?
			renderTopView =
			(
				<View>
					<Button title='Add Guest' onPress={()=>{this.addGuest(navigation)}} />
					<Button title='Finish Game' onPress={()=>{this.finishGame(navigation)}} />
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
	      <ScrollView contentContainerStyle={styles.container}>
	      	{/*Modal*/}
			<Modal isVisible={this.state.isModalVisible === true}>
				{this._renderModalContent()}
	        </Modal>

	    	{/*Top View*/}
			<View style={{flex:0.35}}>
				<Text style={styles.textHeader}>Game Address: {this.state.game.identifier}</Text>
		    	<Text style={styles.textSubheader}>Money in the pot: {potMoney.toString()}</Text>
				{renderTopView}
				<Button title='Refresh' onPress={()=>this.refreshGame()}/>
			</View>

			{/*Actions*/}
	    	<View style={{flex:0.25}}>
				<Button title='Buy In' onPress={async ()=>{
					this.setState({modalType:"BuyIn"});
					this._showModal();
				}} />
				<Button title='Leave Game' onPress={async ()=>{
					this.setState({modalType:"LeaveGame"});
					this._showModal();
				}} />
			</View>

			{/*Player List*/}
	        
	        <View style={{flex:0.45}}>
	        	<Text style={styles.textSubheader}>Players List:</Text>
	        	<PlayerList game={this.state.game} player={this.state.user}/>
	        </View>
	      </ScrollView>
	    );
	}

}




