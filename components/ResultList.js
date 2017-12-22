import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

	async confirmPayment(payment_id){
		const response = await utils.fetchFromServer('games/' + this.props.game.identifier + "/confirm_payment_receipt/",'POST',{
			payment_id: payment_id
		},this.props.token);
		if (response.status !== 200){
			return {error:"Server Error: "+response.status};
		}
		return {error:"None"};
	}

	chargeUser(amount,recipient=null){
		utils.useVenmo('charge',recipient,amount,'Game winnings');
	}

	renderPlayerThumb(image_uri){
		return <SafeImage uri={image_uri} style={{width:30,height:30,borderTopLeftRadius:12,borderBottomLeftRadius:0}} />
	}

	calcEarn(bet){
		return Number(bet.result) - Number(bet.amount);
	}

	render() {
		let ordered_bets = this.props.game.bets.sort((a,b) => {
		    return -1 * (this.calcEarn(a) - this.calcEarn(b));
		});
		return (
			<ScrollView contentContainerStyle={this.props.style}>
				<FlatList
		        	data={ordered_bets}
		            keyExtractor={item=>item.id}
		            renderItem={({item}) => {
		            	var earnings = Number(item.result) - Number(item.amount);
	            			            		
	            		var itemColorStyle = (earnings >= 0) ? {color:'green'} : {color:'red'};
            			var itemWording = (earnings >= 0) ? 'Won' : 'Lost';
	            		var itemChargeButton = null;
	            		var itemReceieved = null;
	            		let sum = 0;
	            		var paymentRows = [];
	            		if (item.payments.length > 0){
	            			item.payments.forEach((l)=>{
	            				if (l.amount > 0){
	            					if (l.is_confirmed){
	            						{/*Payment confirmed - just list it*/}
			            				paymentRows.push(
			            					<View style={{flex:1,flexDirection:'row',margin:5,justifyContent:'flex-start',alignItems:'center'}} key={l.source.id}>
			            						<Ionicons size={10} name='ios-cash-outline' style={{marginRight:5}} color="#666" />
			            						<Text style={{fontSize:12,color:"#666"}}>{l.source.first_name} {l.source.last_name} paid ${Number(l.amount)} {l.is_confirmed}</Text>
		            						</View>
		            					);
		            					sum += Number(l.amount);
			            			} else if (!this.props.game.is_approved && (item.player.id===this.props.player.id || this.props.is_host)){
			            			{/*Payment unconfirmed - venmo charge and confirm payment buttons*/}
			            				paymentRows.push(
			            					<View style={{flex:1,alignItems:'center',justifyContent:'flex-start',margin:5}} key={l.id}>
			            						{/*charge player*/}
			            						<Text style={{color:'#3D95CE',fontSize:12}}>{"Charge " + l.source.first_name + " " + l.source.last_name[0] + ". for $" + l.amount}</Text>
			            						<View style={[styles.row,{flex:1}]}>
				            						<View style={{borderRadius:4,borderColor:'#3D95CE',borderWidth:1,alignItems:'center',justifyContent:'center',paddingLeft:5, paddingRight:5,margin:5}} >
							            				<TouchableOpacity onPress={()=>this.chargeUser(l.amount,l.source.venmo_username)} style={{flexDirection:'row',alignItems:'center'}} >
							            					<SafeImage uri="https://s3.amazonaws.com/pokerbuddy/images/icon-venmo.png" style={{width:15,height:15}} />
							            					<Text style={{fontSize:12,color:'#3D95CE',marginLeft:3}}>Charge</Text>
							            				</TouchableOpacity>
						            				</View>
				            						
				            						{/*confirm payment*/}
				            						<View style={{borderRadius:4,borderColor:'#3D95CE',borderWidth:1,
				            							alignItems:'center',justifyContent:'center',paddingRight:5,margin:5}} >
							            				<TouchableOpacity onPress={()=>this.confirmPayment(l.id)} style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}} >
							            					<Ionicons name='ios-checkmark-outline' style={{margin:5}} color='#3D95CE' size={25} />
							            					<Text style={{fontSize:12,color:'#3D95CE'}}>Got it!</Text>
							            				</TouchableOpacity>
						            				</View>
												</View>
			            					</View>
		            					);
			            			}
		            			}
	            			});
	            			if (sum > 0) itemReceieved = 'Recieved: $' + sum;
	            		}
	            		var itemPayments = <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>{paymentRows}</View>;
	            		
		            	return (
		            		<View style={{flex:1,justifyContent:'center',alignItems:'center',marginBottom:3}}>
			            		<View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginBottom:2,flex:1}} >
				            		<View style={{alignItems:'flex-start',justifyContent:'center',borderWidth:1 ,borderRadius:13,borderColor:'#ccc',overflow:'hidden',width:'100%'}}>
				            			<View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',borderColor:'#ccc',borderBottomWidth:1,width:'100%'}} >
					            			{this.renderPlayerThumb(utils.getUserProfilePicture(item.player))}
					            			<Text style={[itemColorStyle,{marginLeft:10}]}>{item.player.first_name} {item.player.last_name}</Text>
				            			</View>
				            			<View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
				            				<Text style={{marginLeft:10}}>{itemWording}: ${earnings} {itemReceieved}</Text>
				            			</View>
			            			</View>
		            			</View>
		            			{itemPayments}
	            			</View>
	            		);
		            }}
		        />
        	</ScrollView>
        );
	}

}
