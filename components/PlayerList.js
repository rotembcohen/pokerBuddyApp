import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

import styles from '../Styles';

import * as utils from '../UtilFunctions';

//props:
//data = array of bets (the rows - player info, amount of bet, etc)
//is_host = is current user with host priviliges?
//user_id = current's
//username = current's
export default class PlayerList extends Component {

	constructor(props){
		super(props);
		this.state = {
			isModalVisible: false,
			selectedPlayer: props.user,
			amount: 0,
			final_result: 0,
			user: props.user,
			token: props.token,
		}
	}

	//TODO: put in utils
	_renderButton = (text, onPress) => (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.modalButton}>
				<Text>{text}</Text>
			</View>
		</TouchableOpacity>
	);
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
        	</View>
        );
	}


}
