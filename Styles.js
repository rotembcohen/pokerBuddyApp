import React, { Component } from 'react';
import {
	StyleSheet
} from 'react-native';

const app_red = "#bc0000";
const app_pink = "#ffccbb";
const styles = StyleSheet.create({
	
	//common
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	iconButton: {
		margin: 10,
		justifyContent:'center',
		alignItems:'center',
	},
	row: {
		flexDirection:'row',
	},
	narrowMargin: {
		margin: 3,
	},

	//labels
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
	regularText: {
		fontSize: 16,
		textAlign: 'center',
	},
	strikethroughText: {
		fontSize: 16,
		textDecorationLine: 'line-through',
	},
	errorLabel: {
		fontSize: 14,
		color: app_red,
	},
	boldText: {
		fontWeight: 'bold',
	},

	//textInput
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
	
	//modals
	modal: {
		alignItems:'center',
	},
	modalButton: {
		backgroundColor: 'white',
		borderColor: app_red,
		borderWidth: 1.5,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 5,
		margin: 8,
		borderRadius: 4,
	},
	modalContent: {
		width:300,
	    backgroundColor: 'white',
	    padding: 22,
	    justifyContent: 'center',
	    alignItems: 'center',
	    borderRadius: 4,
	    borderColor: 'rgba(0, 0, 0, 0.1)',
	},
	modalButtonsContainer: {
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
	},
	
	//Welcome View
	welcome_container: {
		backgroundColor:app_red,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	welcome_logoImage: {
		width:200,
		height:200,
	},
	welcome_tipText: {
		color:'white',
		fontStyle:'italic',
		margin:40,
		fontSize: 18,
		textAlign: 'center',
	},
	welcome_button: {
		flexDirection:'row',
		padding:5,
		borderWidth:0,
		borderRadius:12,
		backgroundColor:'white',
		justifyContent:'center',
		alignItems:'center',
	},
	welcome_buttonText: {
		margin:10,
		fontWeight:'bold',
		fontSize: 18,
		textAlign: 'center',
	},
	welcome_errorText: {
		color:'white',
		textAlign:'center',
	},

	//Login View
	login_signupButton:{
		color:app_red,
		textDecorationLine:'underline',
	},
	login_button: {
		flexDirection:'row',
		padding:5,
		margin:5,
		borderWidth:0,
		borderRadius:12,
		backgroundColor:'white',
		justifyContent:'center',
		alignItems:'center',
	},

	//Game View
	game_topView: {
		height:90,
		justifyContent:'center',
		alignItems:'flex-start',
		flexDirection:'row',
	},
	game_topView_section: {
		justifyContent:'flex-start',
		alignItems:'center',
		flex:1,
	},
	game_playerList: {
		flex:1,
		marginTop:10,
		padding:15
	},
	game_actionsView: {
		justifyContent:'flex-end',
		alignItems:'center',
	},
	game_potIcon: {
		position:'absolute',
		top:0,
		width:75,
		height:75,
		opacity: 0.2,
	},
	game_valueText: {
		fontWeight:'bold',
		fontSize:30,
		margin:8,
	},
	game_topView_identifierIcon: {
		position:'absolute',
		bottom:12,
		opacity: 0.2,
	},
	game_actionsView_playerButtons: {
		height:100,
		flexDirection:'row',
	},
	game_actionsView_hostMenu: {
		height:100,
		alignItems:'center',
		justifyContent:'center',
	},
	game_actionsView_hostShowButton: {
		height:30,
		alignItems:'center',
		justifyContent:'center',
	},
	game_actionsView_hostText: {
		textAlign:'center',
		color:app_pink
	},
	game_actionsView_hostButtons: {
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'center',
		borderRadius:12,
		borderColor:app_pink,
		borderWidth:1,
	},
	game_modals_textInput: {
		height: 40,
		textAlign: 'center',
		borderBottomWidth:1,
		borderColor:app_pink,
		width:250,
	},
	game_modals_textInputButtom: {
		height: 40,
		width: 250,
		textAlign: 'center',
	},
	game_modals_aboutButtonsContainer: {
		flexDirection:'row',
		justifyContent:'space-between',
		width:'75%',
	},
});


export {styles as default,app_red,app_pink};