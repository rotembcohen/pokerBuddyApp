import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class CalculatorInput extends Component {

	render() {
		return (
			<View>
				<TextInput
					style={[styles.textinput,{borderColor:this.props.borderColor,width:50,margin:5}]}
					onChangeText={this.props.onChangeText}
					value={this.props.value.toString()}
					keyboardType='numeric'
					selectTextOnFocus={true}
					underlineColorAndroid="transparent"
				/>
				<Text style={{color:this.props.borderColor,textAlign:'center'}}>{this.props.text}</Text>
			</View>
		);
	}


}