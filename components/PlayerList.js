import React, { Component } from 'react';
import { View, Text, FlatList, Image } from 'react-native';

import styles from '../Styles';

import * as utils from '../UtilFunctions';

//props:
//game = contains array of bets (the rows - player info, amount of bet, etc)
export default class PlayerList extends Component {

	constructor(props){
		super(props);
		this.state = {
		}
	}

	render() {
		
		return (
			<View>
		        <FlatList
		        	style={{flex:0.4}}
		            data={this.props.game.bets}
		            keyExtractor={item=>item.id}
		            renderItem={({item}) => {
		            	if (item.result === null) {
		            		//player is in the game
		            		var renderItemResult = '';
		            		var renderItemDiff = '';
		            		var renderItemStyle = styles.regularText;
		            	} else {
		            		var renderItemResult = " " + item.result.toString();
		            		var renderItemDiff = " " + (item.result - item.amount).toString();
		            		var itemDiffStyle = ((item.result - item.amount) >= 0) ? {color:'green'} : {color:'red'}
		            		var renderItemStyle = styles.strikethroughText;
		            	}
		            	return (
		            		<View style={{flexDirection:'row',alignItems:'stretch'}}>
		            			
		            			<Image source={{uri:item.player.picture_url}} style={{width:25,height:25,borderWidth: 0,borderRadius:50}} />
			            		
			            		<Text style={styles.regularText}>
			            			
			            			<Text style={renderItemStyle}>{item.amount} {item.player.first_name} {item.player.last_name}</Text> 
			            			{renderItemResult}
			            			<Text style={itemDiffStyle}>{renderItemDiff}</Text>
		            			</Text>
	            			</View>
	            		);
		            }}
		        />
        	</View>
        );
	}

}
