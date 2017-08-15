import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

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

	venmoUser(target){
		let target_venmo = target.player.venmo_username;
		let recipients_field = '';
		if (target_venmo) {
			recipients_field = "&recipients=" + target_venmo;
		}
		let target_amount = target.result - target.amount;
		var url = "venmo://paycharge?txn=pay" + recipients_field + "&amount=" + target_amount + "&note=You brilliant Poker player, have some cash%21";
		
		AppLink.maybeOpenURL(url, { appName: 'Venmo', appStoreId: 'id351727428', playStoreId: 'com.venmo'}).then(() => {
		  console.log("app link success");
		})
		.catch((err) => {
		  console.log("app link error: ", error);
		});
	}

	renderPlayerThumb(image_uri){
		return <SafeImage uri={image_uri} style={{width:25,height:25}} />
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
		            		var itemDiffStyle = ((item.result - item.amount) >= 0) ? {color:'green'} : {color:'red'};
		            		var itemPayButton = null;
		            		if ((item.result - item.amount) >= 0 && item.player.id!=this.props.player.id){
		            			itemPayButton = (<Button title='Venmo' onPress={()=>this.venmoUser(item)} />);
		            		}
		            		var renderItemStyle = styles.strikethroughText;
		            	}
		            	return (
		            		<View style={{flexDirection:'row',alignItems:'stretch'}}>
		            			{this.renderPlayerThumb(item.player.picture_url)}
			            		<Text style={styles.regularText}>
			            			<Text style={renderItemStyle}>{item.amount} {item.player.first_name} {item.player.last_name}</Text> 
			            			{renderItemResult}
			            			<Text style={itemDiffStyle}>{renderItemDiff}</Text>
		            			</Text>
		            			{itemPayButton}
	            			</View>
	            		);
		            }}
		        />
        	</View>
        );
	}

}
