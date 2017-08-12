import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, AsyncStorage, TextInput, TouchableOpacity, Picker
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
		};
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

	_renderModalContent(){
		return (
			<View style={styles.modalContent}>
				<Text>Are you sure? Pot money is not 0!</Text>
				<View style={{flexDirection:'row'}}>
					{this._renderButton('Yes', () => this.setState({ isModalVisible:false }))}
					{this._renderButton('No', () => this.setState({ isModalVisible:false }))}
				</View>
			</View>
		)
	}

	calcPotMoney(){
		var potMoney = 0;
		this.state.game.bets.forEach(function(player) {
		    potMoney = potMoney + Number(player.amount) - Number(player.result);
		});
		return potMoney;
	}

	finishGame(navigation){
		if(this.calcPotMoney === 0){
			navigation.navigate("PayView");
		}else{
			this._showModal();
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
				<View style={{flex:0.4}}>
					<Button title='Finish Game' onPress={()=>{this.finishGame(navigation)}} />
					<Picker
			        	style={{width:250}}
						selectedValue={this.state.game_identifier}
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
			<Modal isVisible={this.state.isModalVisible === true}>
				{this._renderModalContent()}
	        </Modal>
			<Text style={{flex:0.1,fontSize:24}}>Game Address: {this.state.game.identifier}</Text>
	    	<Text style={{flex:0.1,fontSize:18}}>Money in the pot: {potMoney.toString()}</Text>
	    	{renderTopView}    
	    	<View style={{flex:0.4}}>

				<View style={{flexDirection:'row',alignItems:'center'}} >
					<Button title='-' onPress={()=>{if (this.state.buy_in_amount > 5)this.setState({buy_in_amount:this.state.buy_in_amount-5})}} />
					<Text>{this.state.buy_in_amount}</Text>
					<Button title='+' onPress={()=>{this.setState({buy_in_amount:this.state.buy_in_amount+5})}} />
				</View>
				<Button title='Buy In' onPress={async ()=>{
					let updated_game = await utils.buy_in(this.state.buy_in_amount,this.state.game.identifier,this.state.token);
					this.setState({game:updated_game,buy_in_amount:5});
				}} />

				<TextInput
					style={styles.textinput}
					onChangeText={(text)=>{this.setState({result_amount:text})}}
					value={this.state.result_amount.toString()}
					keyboardType='numeric'
					selectTextOnFocus={true}
				/>
				<Button title='Leave Game' onPress={async ()=>{
					let updated_game = await utils.leave_game(this.state.result_amount,this.state.game.identifier,this.state.token);
					this.setState({game:updated_game});
				}} />
			</View>

	        <Text style={{flex:0.1}}>Players List:</Text>
	        <View style={{flex:0.4}}>
	        	<PlayerList is_host={this.state.is_host} user={this.state.user} game={this.state.game} token={this.state.token} pot={potMoney} />
	        </View>
	      </ScrollView>
	    );
	}

}
