import React, { Component } from 'react';
import { View,TouchableOpacity,Text } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class IconButton extends Component {

	render() {
		return (
			<View style={{margin:5}}>
				<TouchableOpacity style={styles.iconButton} onPress={this.props.action} >
					<Ionicons name={this.props.name} color="red" size={50} />
					<Text>{this.props.text}</Text>
				</TouchableOpacity>
			</View>
		);
	}


}