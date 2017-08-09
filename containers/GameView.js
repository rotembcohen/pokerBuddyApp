import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, AsyncStorage, TextInput,
} from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class GameView extends Component {

	constructor(props){
		super(props);
		this.state = {
			token: 'no token',
			playerList: [],
			game_identifier: 'no identifier',
			buy_in_amount: 0,
			result_amount: 0,
		};
	}

	async componentWillMount(){
		const data = await AsyncStorage.multiGet(['@pokerBuddy:token','@pokerBuddy:currentGame']);
		let token = data[0][1];
		let gameString = data[1][1];
		let game = JSON.parse(gameString);
		
		this.setState({
			token: token,
			playerList: game.bets,
			game_identifier: game.identifier,
		});
	}

	//TODO: add way to push updates/ or check updates frequently
	//TODO: duplicate code!
	async buy_in(player_id=null){
		const gameObj = await utils.fetchFromServer('games/' + this.state.game_identifier + "/buy_in/",'POST',{
			amount: parseInt(this.state.buy_in_amount),
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
		const gameObj = await utils.fetchFromServer('games/' + this.state.game_identifier + "/leave_game/",'POST',{
			result: parseInt(this.state.result_amount),
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

	render() {
		const { navigation } = this.props;
		
	    return (
	      <ScrollView contentContainerStyle={styles.container}>

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

	        <Text style={{flex:0.1}}>Players List:</Text>
	        <FlatList
	        	style={{flex:0.5}}
	            data={this.state.playerList}
	            keyExtractor={item=>item.id}
	            renderItem={({item}) => {
	            	if (item.result === null) {
	            		//player is in the game
	            		var renderItemResult = '';
	            		var renderItemStyle = styles.regularText;
	            	} else {
	            		var renderItemResult = item.result.toString();
	            		var renderItemStyle = styles.strikethroughText;
	            	}
	            	return (
	            		<View style={{flexDirection:'row'}}>
		            		<Button title='BI' onPress={()=>this.buy_in(item.player.id)}/>
		            		<Button title='LG' onPress={()=>this.leave_game(item.player.id)}/>
		            		<Text style={styles.regularText}>
		            			
		            			<Text style={renderItemStyle}>{item.amount} {item.player.username}</Text> 
		            			{renderItemResult}
	            			</Text>
            			</View>
            		);
	            }}
	        />

	      </ScrollView>
	    );
	}

}
