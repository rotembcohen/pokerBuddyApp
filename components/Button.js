import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles, {app_red} from '../Styles';
import * as utils from '../UtilFunctions';

export default class Button extends Component {
	render() {
		let textColor = (this.props.color) ? this.props.color : app_red;
		return (
			<TouchableOpacity style={[styles.menuButton,this.props.style]} onPress={this.props.onPress}>
            	<Ionicons name={this.props.icon} color={textColor} size={30} />
            	<Text style={[styles.welcome_buttonText,{color:textColor}]}>{this.props.title}</Text>
            </TouchableOpacity>  
		);
	}


}