import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';

import AppLink from 'react-native-app-link';

import styles from '../Styles';
import * as utils from '../UtilFunctions';
import SafeImage from './SafeImage';
import Button from './Button';

//props:
//game = contains array of bets (the rows - player info, amount of bet, etc)
export default class PlayerList extends Component {

	constructor(props){
		super(props);
		this.state = {
		}
	}

	renderPlayerThumb(image_uri){
		return <SafeImage uri={image_uri} style={{width:30,height:30,borderTopLeftRadius:12,borderBottomLeftRadius:0}} />
	}

	render() {
		return (
			<ScrollView contentContainerStyle={this.props.style}>
		        <FlatList
		        	data={this.props.game.bets}
		            keyExtractor={item=>item.id}
		            renderItem={({item}) => {
		            	if (item.result === null) {
		            		//player is in the game
		            		var renderItemResult = '';
		            		var itemColorStyle = {};
		            	} else {
		            		var renderItemResult = " Left with: $" + item.result.toString();
		            		if(item.result){
		            			itemColorStyle = ((item.result - item.amount) >= 0) ? {color:'green'} : {color:'red'};
		            		}
		            	}
		            	return (
		            		<View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:10,flex:1}} >
			            		<View style={{alignItems:'flex-start',justifyContent:'center',borderWidth:1 ,borderRadius:13,borderColor:'#ccc',overflow:'hidden',width:'100%'}}>
			            			<View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',borderColor:'#ccc',borderBottomWidth:1,width:'100%'}} >
				            			{this.renderPlayerThumb(utils.getUserProfilePicture(item.player))}
				            			<Text style={[itemColorStyle,{marginLeft:10}]}>{item.player.first_name} {item.player.last_name}</Text>
			            			</View>
			            			<View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
			            				<Text style={{marginLeft:10}}>Bet: ${item.amount}{renderItemResult}</Text>
			            			</View>
		            			</View>
	            			</View>
	            		);
		            }}
		        />
        	</ScrollView>
        );
	}

}
