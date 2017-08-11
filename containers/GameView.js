import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, AsyncStorage, TextInput, TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal';

import styles from '../Styles';
import * as utils from '../UtilFunctions';
import PlayerList from '../components/PlayerList';

export default class GameView extends Component {

	//TODO: change 'no token' to null
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
			buy_in_amount: 0,
			result_amount: 0,
			is_host: is_host,
		    isModalVisible: false,
		};
	}

	_showModal = () => this.setState({ isModalVisible: true });

	_hideModal = () => this.setState({ isModalVisible: false });

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

	//TODO: add way to push updates/ or check updates frequently
	//TODO: duplicate code!
	async buy_in(player_id=null){
		const gameObj = await utils.fetchFromServer('games/' + this.state.game.identifier + "/buy_in/",'POST',{
			amount: Number(this.state.buy_in_amount),
			player_id: player_id
		},this.state.token);
		if (gameObj.status === 200){
			gameString = gameObj._bodyText;

			await AsyncStorage.setItem('@pokerBuddy:currentGame', gameString);

			let game = JSON.parse(gameString);
			this.setState({
				playerList: game.bets,
			});
		}
	}

	async leave_game(player_id=null){
		const gameObj = await utils.fetchFromServer('games/' + this.state.game.identifier + "/leave_game/",'POST',{
			result: Number(this.state.result_amount),
			player_id: player_id
		},this.state.token);
		if (gameObj.status === 200){
			gameString = gameObj._bodyText;

			await AsyncStorage.setItem('@pokerBuddy:currentGame', gameString);

			let game = JSON.parse(gameString);
			this.setState({
				playerList: game.bets,
			});
		}	
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
		var renderHostButtons = null;
		if (this.state.is_host){
			//TODO: can you take the view our?
			renderTopView =
			(
				<View style={{flex:0.4}}>
					<Button title='Finish Game' onPress={()=>{this.finishGame(navigation)}} />
				</View>
			);
			renderHostButtons = 
			(
				<View style={{margin:5}}>
					<Button title='BI' onPress={()=>this.buy_in(item.player.id)}/>
            		<Button title='LG' onPress={()=>this.leave_game(item.player.id)}/>
				</View>
			);
		}else{
			renderTopView = 
			(
				<View style={{flex:0.4}}>
			        <TextInput
			      		style={styles.textinput}
			      		onChangeText={(text)=>{this.setState({buy_in_amount:text})}}
			      		value={this.state.buy_in_amount.toString()}
			      		keyboardType='numeric'
			      		selectTextOnFocus={true}
		      		/>
			        <Button title='Buy In' onPress={()=>{this.buy_in()}} />
			        <TextInput
			      		style={styles.textinput}
			      		onChangeText={(text)=>{this.setState({result_amount:text})}}
			      		value={this.state.result_amount.toString()}
			      		keyboardType='numeric'
			      		selectTextOnFocus={true}
		      		/>
			        <Button title='Leave Game' onPress={()=>{this.leave_game()}} />
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
	        <Text style={{flex:0.1}}>Players List:</Text>
	        <PlayerList data={this.state.game.bets} is_host={this.state.is_host} user_id={this.state.user.id} username={this.state.user.username} />
	      </ScrollView>
	    );
	}

}
