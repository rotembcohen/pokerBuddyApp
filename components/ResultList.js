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

	venmoUser(target){
		let target_venmo = target.player.venmo_username;
		let recipients_field = '';
		if (target_venmo) {
			recipients_field = "&recipients=" + target_venmo;
		}
		let target_amount = target.result - target.amount;
		var url = "venmo://paycharge?txn=pay" + recipients_field + "&amount=" + target_amount + "&note=You brilliant Poker player, have some cash%21";
		
		AppLink.maybeOpenURL(url, { appName: 'Venmo', appStoreId: 'id351727428', playStoreId: 'com.venmo'}).then(() => {
		  // console.log("app link success");
		})
		.catch((err) => {
		  console.log("app link error: ", error);
		});
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
		            		var renderItemDiff = '';
		            		var renderItemStyle = styles.regularText;
		            		var itemColorStyle = {};
		            	} else {
		            		var renderItemResult = " Left with: $" + item.result.toString();
		            		var renderItemDiff = "$" + (item.result - item.amount).toString();		            		
		            		if(item.result){
		            			itemColorStyle = ((item.result - item.amount) >= 0) ? {color:'green'} : {color:'red'};
		            		}
		            		var itemPayButton = null;
		            		if ((item.result - item.amount) >= 0 && item.player.id!=this.props.player.id){
		            			// itemPayButton = (<Button title='Venmo' onPress={()=>this.venmoUser(item)} />);
		            			itemPayButton = (
		            				<View style={{borderRadius:12,borderColor:'#3D95CE',borderWidth:1,height:50,alignItems:'flex-start',justifyContent:'center', marginLeft:10, paddingRight:5}} >
			            				<TouchableOpacity onPress={()=>this.venmoUser(item)} style={{flexDirection:'row',alignItems:'center'}} >
			            					<SafeImage uri="https://s3.amazonaws.com/pokerbuddy/images/icon-venmo.png" style={{width:25,height:25}} />
			            					<Text style={{color:'#3D95CE'}}>{renderItemDiff}</Text>
			            				</TouchableOpacity>
		            				</View>
	            				);
		            		}
		            	}
		            	return (
		            		<View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',marginBottom:10}} >
			            		<View style={{alignItems:'flex-start',justifyContent:'center',borderWidth:1 ,borderRadius:13,borderColor:'#ccc',overflow:'hidden',width:210}}>
			            			<View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',borderColor:'#ccc',borderBottomWidth:1,width:210}} >
				            			{this.renderPlayerThumb(item.player.picture_url)}
				            			<Text style={[itemColorStyle,{marginLeft:10}]}>{item.player.first_name} {item.player.last_name}</Text>
			            			</View>
			            			<View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',width:260}}>
			            				<Text style={{marginLeft:10}}>Won: ${Number(item.result) - Number(item.amount)} Received:</Text>
			            			</View>
		            			</View>
		            			{itemPayButton}
	            			</View>
	            		);
		            }}
		        />
        	</ScrollView>
        );
	}

}
