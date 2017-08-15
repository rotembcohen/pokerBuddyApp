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
	},
	textinputwide: {
		height: 40,
		width: 300,
		textAlign: 'center',
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
	// modalButton: {
	//     backgroundColor: 'lightblue',
	//     padding: 12,
	//     margin: 16,
	//     justifyContent: 'center',
	//     alignItems: 'center',
	//     borderRadius: 4,
	//     borderColor: 'rgba(0, 0, 0, 0.1)',
	// },
	modalButton: {
		backgroundColor: 'white',
		borderColor: 'red',
		borderWidth: 2,
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