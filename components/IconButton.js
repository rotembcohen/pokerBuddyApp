import React, { Component } from 'react';
import { View,TouchableOpacity,Text } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import styles, { app_red } from '../Styles';
import * as utils from '../UtilFunctions';

export default class IconButton extends Component {

	render() {
		var size = (this.props.size) ? this.props.size : 50;
		var iconColor = (this.props.color) ? this.props.color : app_red;
		var fontColor = (this.props.color) ? this.props.color : 'black';

		return (
			<View>
				<TouchableOpacity style={[styles.iconButton,this.props.style]} onPress={this.props.action} >
					<Ionicons name={this.props.name} color={iconColor} size={size} />
					<Text style={{color:fontColor}}>{this.props.text}</Text>
				</TouchableOpacity>
			</View>
		);
	}


}