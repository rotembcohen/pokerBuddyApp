import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class Button extends Component {

	render() {
		return (
			<TouchableOpacity onPress={this.props.onPress}>
				<View style={[styles.modalButton,this.props.style]}>
					<Text>{this.props.title}</Text>
				</View>
			</TouchableOpacity>
		);
	}


}