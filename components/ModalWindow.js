import React, { Component } from 'react';
import { View,TouchableOpacity,Text } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import styles, { app_red,app_green } from '../Styles';
import * as utils from '../UtilFunctions';
import IconButton from '../components/IconButton';

export default class ModalWindow extends Component {

	render() {
		return (
			<View style={styles.modalContent}>
		      	<Text style={[styles.textHeader,{marginBottom:10}]}>{this.props.title}</Text>
		      	{this.props.content}
		      	<View style={styles.modalButtonsContainer}>
		        	<IconButton action={this.props.onDismiss} name="ios-close" />
		        	{(this.props.onApprove) ? <IconButton action={this.props.onApprove} name="ios-checkmark" /> : null}
				</View>
		      </View>
		);
	}


}