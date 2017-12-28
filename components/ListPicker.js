import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, } from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

//props:
//optionArray - array of option elements
//keyExtractor - function to extract key from every option element
//textExtractor - function to extract text from every option element
//onPressElement - function to extract onPress function for each element
//containerStyle - style for the containing view, should contain width and maxHeight
//textStyle - style of display text

export default class ListPicker extends Component {

	render() {
		return (
			<ScrollView style={[styles.inputContainer,this.props.containerStyle]}> 
				{this.props.optionArray.map((l, i) => {
					if (i!==0){
						var elementStyle = {borderTopWidth:1,borderColor:'white',width:200,paddingTop:10,paddingBottom:10};
					}else{
						var elementStyle = {borderTopWidth:0,borderColor:'white',width:200,paddingTop:10,paddingBottom:10};
					}
					return (
						<TouchableOpacity key={this.props.keyExtractor(l,i)} style={elementStyle} onPress={this.props.onPressElement(l,i)} >
							{this.props.textExtractor(l,i)}
						</TouchableOpacity>
					)
				})}
			</ScrollView>
		);
	}


}