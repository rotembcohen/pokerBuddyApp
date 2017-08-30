import React, { Component } from 'react';
import { View, TextInput, Text } from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class CalculatorInput extends Component {

	render() {
		if(this.props.inputIndex == 1){
			var inputStyle ={
				borderTopLeftRadius:12,
				borderBottomLeftRadius:12,
			};
		} else if (this.props.inputIndex == 2){
			var inputStyle ={
				borderLeftWidth:0,
				borderRightWidth:0,
			};
		} else if (this.props.inputIndex == 5){
			var inputStyle ={
				borderTopRightRadius:12,
				borderBottomRightRadius:12,
			};
		} else {
			var inputStyle ={
				borderRightWidth:0,
			};
		}
		return (
			<View>
				<TextInput
					style={[inputStyle,{
						height: 40,
						width: 150,
						textAlign: 'center',
						borderWidth:1,
						width:50,
						marginTop:10,
						borderColor:'black',
						color:this.props.color
					}]}
					onChangeText={this.props.onChangeText}
					value={this.props.value.toString()}
					keyboardType='numeric'
					selectTextOnFocus={true}
					underlineColorAndroid="transparent"
				/>
				<Text style={{color:this.props.color,textAlign:'center'}}>{this.props.text}</Text>
			</View>
		);
	}


}