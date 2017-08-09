import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView, FlatList, Button, AsyncStorage, TextInput,
} from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class GameView extends Component {

	//TODO: change 'no token' to null
	constructor(props){
		super(props);
		this.state = {
			token: 'no token',
			user_id: null,
			username: null,
			playerList: [],
			game_identifier: 'no identifier',
			buy_in_amount: 0,
			result_amount: 0,
			is_host: false,
		};
	}

	async componentWillMount(){
		const data = await AsyncStorage.multiGet(['@pokerBuddy:token','@pokerBuddy:user','@pokerBuddy:currentGame']);
		let token = data[0][1];
		let user = JSON.parse(data[1][1]);
		let game = JSON.parse(data[2][1]);
		let is_host = (game.host === user.id);

		this.setState({
			token: token,
			user_id: user.id,
			username: user.username,
			playerList: game.bets,
			game_identifier: game.identifier,
			is_host: is_host,
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
		var renderTopView = null;
		var renderHostButtons = null;
		if (this.state.is_host){
			//TODO: can you take the view our?
			renderTopView =
			(
				<View style={{flex:0.4}}>
					<Button title='Finish Game' onPress={()=>{navigation.navigate('PayView')}} />
				</View>
			)
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
		var potMoney = 0;
		this.state.playerList.forEach(function(player) {
		    console.log(potMoney + "+" + player.amount + "-" + player.result);
		    potMoney = potMoney + Number(player.amount) - Number(player.result);
		});

	    return (
	      <ScrollView contentContainerStyle={styles.container}>
	    	<Text style={{flex:0.1,fontSize:24}}>Game Address: {this.state.game_identifier}</Text>
	    	<Text style={{flex:0.1,fontSize:18}}>Money in the pot: {potMoney.toString()}</Text>
	    	{renderTopView}    
	        <Text style={{flex:0.1}}>Players List:</Text>
	        <FlatList
	        	style={{flex:0.4}}
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
		            		{renderHostButtons}
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
