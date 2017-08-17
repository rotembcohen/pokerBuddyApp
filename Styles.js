import React, { Component } from 'react';
import {
	StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	textHeader:{
		fontSize:24,
		textAlign: 'center',
	},
	textSubheader:{
		fontSize: 18,
		textAlign: 'center',
	},
	textinput: {
		height: 40,
		width: 150,
		textAlign: 'center',
		borderWidth:1,
		borderColor:'#ffccbb',
		borderRadius:12,
	},
	transparentTextinput: {
		height: 40,
		width: 150,
		textAlign: 'center',
	},
	inputContainer: {
		borderColor:'#ffccbb',
		borderWidth:1,
		borderRadius:12,
		margin: 5,
	},
	textinputwide: {
		height: 40,
		width: 250,
		textAlign: 'center',
		borderWidth:1,
		borderColor:'#ffccbb',
		borderRadius:12,
	},
	regularText: {
		fontSize: 16,
	},
	strikethroughText: {
		fontSize: 16,
		textDecorationLine: 'line-through',
	},
	errorLabel: {
		fontSize: 14,
		color: 'red',
	},
	iconButton: {
		margin: 10,
		justifyContent:'center',
		alignItems:'center',
	},
	modalButton: {
		backgroundColor: 'white',
		borderColor: 'red',
		borderWidth: 1.5,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 5,
		margin: 8,
		borderRadius: 4,
	},
	modalContent: {
	    backgroundColor: 'white',
	    padding: 22,
	    justifyContent: 'center',
	    alignItems: 'center',
	    borderRadius: 4,
	    borderColor: 'rgba(0, 0, 0, 0.1)',
	},
});


export default styles;