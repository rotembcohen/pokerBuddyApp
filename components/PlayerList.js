import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

import styles from '../Styles';

//props:
//data = array of bets (the rows - player info, amount of bet, etc)
//is_host = is current user with host priviliges?
//user_id = current's
//username = current's
export default class PlayerList extends Component {

	render() {
		return (
			<FlatList
	        	style={{flex:0.4}}
	            data={this.props.data}
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
		            		<Text style={styles.regularText}>
		            			
		            			<Text style={renderItemStyle}>{item.amount} {item.player.first_name} {item.player.last_name}</Text> 
		            			{renderItemResult}
	            			</Text>
            			</View>
            		);
	            }}
	        />
        );
	}


}

/*

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

*/