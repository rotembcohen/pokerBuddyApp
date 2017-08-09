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
	},
	textinput: {
		height: 40,
		width: 100,
		textAlign: 'center',
	},
	regularText: {
		fontSize: 16,
	},
	strikethroughText: {
		fontSize: 16,
		textDecorationLine: 'line-through',
	},
});

export default styles;