import React, { Component } from 'react';
import { View,TouchableOpacity,Text } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import styles, { app_red,app_green } from '../Styles';
import * as utils from '../UtilFunctions';

export default class ModalButton extends Component {

	render() {
		var size = (this.props.size) ? this.props.size : 45;
		var iconColor = (this.props.color) ? this.props.color : app_green;
		var fontColor = (this.props.color) ? this.props.color : app_green;
		var renderText = (this.props.text) ? <Text style={{color:fontColor,textAlign:'center',fontSize:16,fontWeight:'bold'}}>{this.props.text.toUpperCase()}</Text> : null;
		return (
			<View>
				<TouchableOpacity style={[styles.row,styles.modalButton,this.props.style]} onPress={this.props.action} >
					<Ionicons name={this.props.name} color={iconColor} size={size}/>
				</TouchableOpacity>
			</View>
		);
	}


}