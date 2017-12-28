import React, { Component } from 'react';
import {
	StyleSheet, Platform, Dimensions,
} from 'react-native';

import { Constants } from 'expo';

const app_red = "#bc0000";
const app_pink = "#ffccbb";
const app_grey = "#ccc";
const app_green = "#226622";
const app_darkgreen = "#bbffbb"
const textColor = "white";
const errorTextColor = "white";
const {width, height} = Dimensions.get('window');
const isSmallDevice = (height <= 568);
const imageDimsNormal = 50;

const styles = StyleSheet.create({
	
	//common
	safeArea:{
		flex: 1,
    	backgroundColor: app_red,
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 15,
	},
	iconButton: {
		marginTop: 5,
		marginBottom: 5,
		marginLeft: 10,
		marginRight: 10,
		justifyContent:'center',
		alignItems:'center',
	},
	row: {
		flexDirection:'row',
	},
	narrowMargin: {
		margin: 3,
	},
	menuButton: {
		flexDirection:'row',
		padding:5,
		margin:5,
		borderWidth:0,
		borderRadius:12,
		backgroundColor:'white',
		justifyContent:'center',
		alignItems:'center',
		width: (isSmallDevice)?250:300,
		//height: (isSmallDevice)?40:60,
		height: '20%',
	},
	center: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	
	//labels
	textHeader:{
		fontSize:24,
		textAlign: 'center',
		color: textColor,
	},
	textSubheader:{
		fontSize: 18,
		textAlign: 'center',
		color: textColor,
	},
	textinput: {
		height: 40,
		width: 150,
		textAlign: 'center',
		borderWidth:1,
		borderColor:'white',
		borderRadius:12,
	},
	textinputthin:{
		height: 40,
		width: 50,
		textAlign: 'center',
		borderWidth:1,
		borderColor:'white',
		borderRadius:12,
		color:textColor,
	},
	transparentTextinput: {
		height: 40,
		width: 150,
		textAlign: 'center',
		color: textColor,
	},
	regularText: {
		fontSize: 16,
		textAlign: 'center',
		color: textColor,
	},
	strikethroughText: {
		fontSize: 16,
		textDecorationLine: 'line-through',
	},
	errorLabel: {
		fontSize: 14,
		color: errorTextColor,
		textAlign:'center',
	},
	boldText: {
		fontWeight: 'bold',
		color: textColor,
	},
	italicText: {
		fontStyle:'italic',
		color: textColor,
	},

	//textInput
	inputContainer: {
		borderColor:'white',
		borderWidth:1,
		borderRadius:12,
		margin: 5,
	},
	textinputwide: {
		height: 40,
		width: 250,
		textAlign: 'center',
		borderWidth:1,
		borderColor:'white',
		borderRadius:12,
		color: textColor,
	},
	
	//modals
	modal: {
		alignItems:'center',
		...Platform.select({
			'ios': {
				justifyContent:'flex-start',
				marginTop: (isSmallDevice) ? 25 : 50,
			},
			'android': {
				justifyContent:'center',
			}
		}),
	},
	modalButton: {
		flexDirection:'row',
		padding:5,
		margin:5,
		borderWidth:0,
		borderRadius:12,
		backgroundColor:'white',
		justifyContent:'center',
		alignItems:'center',
		width: 50,
		height: 50,
	},
	modalContent: {
		width:300,
	    padding: 22,
	    justifyContent: 'center',
	    alignItems: 'center',
	    borderRadius: 12,
	    borderColor: 'white',
	    borderWidth: 1,
	    backgroundColor: app_green,
	},
	modalButtonsContainer: {
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
	},
	modalText: {
		color: textColor,
		textAlign: 'center',
	},
	
	//Tutorial
	tutorial: {
		alignItems:'center',
		justifyContent:'center',
	},
	progressCircle: {
		width:10,
		height:10,
		borderWidth:0,
		borderRadius:5,
		margin:5,
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
		color:textColor,
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
		margin:5,
	},
	welcome_buttonText: {
		margin:10,
		fontWeight:'bold',
		fontSize: 18,
		textAlign: 'center',
		color: app_red,
	},
	welcome_errorText: {
		color:errorTextColor,
		textAlign:'center',
	},

	//Login View
	login_signupButton:{
		color:app_red,
		textDecorationLine:'underline',
	},
	login_labelText: {
		color:textColor,
		fontStyle:'italic',
		fontSize: 14,
		textAlign: 'center',
	},

	//Home View
	
	//home containers:
	home_appLogoContainer:{
		flex: 1.5,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	home_mainContainer: {
		flex:5,
		justifyContent:'center',
		alignItems:'center',
	},
	home_userMenuContainer: {
		flex:1.5,
		justifyContent:'center',
		alignItems:'center',
	},

	home_appLogoImage: {
		...Platform.select({
			'ios': {
				width:80,
				height:80,
				marginBottom:2
			},
			'android': {
				width:80,
				height:80,
				marginBottom:2
			}
		}),
	},
	home_appLogoText: {
		color: textColor,
		fontWeight: 'bold',
		fontSize: 75,
	},

	home_mainInputContainer: {
		flex:2,
		borderColor:'#fff',
		borderWidth:1,
		borderRadius:12,
		margin: 5,
		width: (isSmallDevice)?250:300,
		height: (isSmallDevice)?90:116,
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:app_red,
	},
	home_mainTextInput:{
		fontSize:16,
		color:textColor,
		fontWeight:'bold',
		width:'90%',
		height:'48%',
		textAlign: 'center',
	},

	home_gameList: {
		width:200,
		maxHeight:375,
	},
	home_boldLink: {
		fontWeight: 'bold',
		color: app_darkgreen,
	},
	home_settingsSection: {
		alignItems: 'flex-start',
		marginBottom: 10,
		flexDirection: 'row',
		justifyContent:'flex-start'
	},
	
	home_userMenu: {
		borderColor:app_pink,
		borderWidth:1,
		borderRadius:12,
		...Platform.select({
			'ios': {
				marginTop:0
			},
			'android': {
				marginTop:20
			}
		}),
	},
	home_userPicture: {
		width:imageDimsNormal,
		height:imageDimsNormal,
		borderWidth:0,
		borderColor:'white',
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
		zIndex: 2,
		backgroundColor:'rgba(0,0,0,0)',
	},
	game_labelText:{
		zIndex: 2,
	},
	game_topView_identifierIcon: {
		position:'absolute',
		zIndex: 1,
		...Platform.select({
			'ios': {
				opacity: 0.5,
				bottom:0,
			},
			'android': {
				opacity: 0.2,
				bottom:11,
			}
		}),
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
		justifyContent:'center',
		width:'75%',
	},
});


export {styles as default,app_red,app_pink,app_grey,app_green};