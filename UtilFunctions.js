import React from 'react';
import { AsyncStorage, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { Permissions, Notifications, Constants } from 'expo';
import { APP_VERSION, SERVER_ADDRESS, PASSWORD_HASH_SECRET } from 'react-native-dotenv';
import AppLink from 'react-native-app-link';

var CryptoJS = require("crypto-js");

//TODO: better network error check across the board

export async function fetchFromServer(relative_url,method,body_dict,token=null){
	var headers = {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	}

	if (token){
		headers['Authorization'] = 'Token ' + token;
	}

	let content = {};
	content['method'] = method;
	content['headers'] = headers;
	
	console.log(
		"====================="
		+ "\n" +"API request type: " + method
		+ "\n" + "Relative URL: " + relative_url
		+ "\n" + "Headers: " + JSON.stringify(headers)
	);

	if (method!=='GET'){
		let body = JSON.stringify(body_dict);
		console.log("Request body: " + body);
		content['body'] = body;
	}

	//TODO: handle promise error
	const response = await fetch(SERVER_ADDRESS + relative_url, content);

	//TODO: return error that says something
	if (response.status / 100 < 4){
		console.log("\n"+ "API Response: Status " + response.status + "\nContent: \n"+ response._bodyText);
	}else{
		console.log("\n"+ "API Error type: " +response.status + "\nContent: \n" + response._bodyText);
	}
	console.log("\n" + "=====================");
	return response;
	
}

export async function joinGame(game_identifier,token,user){
	
	//current user (whose token it is) might not be the user joining game
	//TODO: allow a host to add a different user to the game

	valid_identifier = game_identifier.toUpperCase();
	if (valid_identifier.length !== 5){
		return;
	}
	const response = await fetchFromServer('games/' + valid_identifier + '/join_game/','POST',{player_id:user.id},token);
	//TODO: add error check
	if (response.status === 200){
		game = JSON.parse(response._bodyText);

		await AsyncStorage.setItem('@pokerBuddy:currentGame', game.identifier);
		return game;

	}else{
		return {error:'Game address not found'};
	}
}

export async function loginWithCreds(username,password){
	var response = null;
	try{
		response = await fetchFromServer('authenticate/','POST',{
			username: username,
		    password: password,
		},null);
	}
	catch(error){
		console.log(error);
		response = {status: 500};
	}
	if (response.status===200){
		const responseJson = await response.json();
		
		let token = responseJson.token;	
		let userObj = responseJson.user;
		let user = JSON.stringify(userObj);
		//console.log("Recieved token: " + token);
		//TODO: remove everything but saving token?
		await AsyncStorage.multiSet([['@pokerBuddy:token', token], ['@pokerBuddy:user', user]]);

		//navigation.navigate('HomeView',{user: userObj,token:token});
		return {token: token, user: userObj, error: 'None'};
	}else if (response.status===400){
		return {error: 'Wrong username + password combination'};
	}else{
		return {error:'Server Unavailable'};
	}
}

export function backOneScreen(navigation){
	const backAction = NavigationActions.back();
	navigation.dispatch(backAction);
}

export function resetToScreen(navigation,screen,params=null){
	var options = { routeName: screen };

	if (params){
		options['params'] = params;
	}

	const resetAction = NavigationActions.reset({
	  index: 0,
	  actions: [
	    NavigationActions.navigate(options)
	  ]
	});

	navigation.dispatch(resetAction);
}

//TODO: add way to push updates/ or check updates frequently
//TODO: duplicate code!
export async function buy_in(buy_in_amount,game_identifier,token,player_id=null){
	const gameObj = await fetchFromServer('games/' + game_identifier + "/buy_in/",'POST',{
		amount: Number(buy_in_amount),
		player_id: player_id
	},token);
	if (gameObj.status === 200){
		gameString = gameObj._bodyText;

		let game = JSON.parse(gameString);
		return game;
	}
}

export async function leave_game(result_amount,game_identifier,token,player_id=null){
	const gameObj = await fetchFromServer('games/' + game_identifier + "/leave_game/",'POST',{
		result: Number(result_amount),
		player_id: player_id
	},token);
	if (gameObj.status === 200){
		gameString = gameObj._bodyText;

		let game = JSON.parse(gameString);
		return game;
	}	
}

export async function user_registration(form,login=true) {
	var initResponse = null;
	try{
		initResponse = await fetchFromServer('users/','POST',form,null);
	}
	catch(error){
		console.log(error);
		initResponse = {status: 500};
	}
	if (login===false){
		return {error:'None',user:JSON.parse(initResponse._bodyText)};
	}
	if (initResponse.status === 201){
		//get token
		//TODO: fix server so this wont need 2 requests
		//TODO: this should behave like fetchFromServer (at lease as far as retrun value)
		const response = await loginWithCreds(form.username,form.password);
		if (response.error === 'None'){
			return {user:response.user,token:response.token,error:'None'};
		}else{
			return {error:response.error};
		}
	}
}

//handle push notifications
export async function registerForPushNotificationsAsync(user_id) {
	const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
	let finalStatus = existingStatus;

	// only ask if permissions have not already been determined, because
	// iOS won't necessarily prompt the user a second time.
	if (existingStatus !== 'granted') {
		// Android remote notification permissions are granted during the app
		// install, so this will only ask on iOS
		const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
		finalStatus = status;
	}

	// Stop here if the user did not grant permissions
	if (finalStatus !== 'granted') {
		return;
	}

	// Get the token that uniquely identifies this device
	let token = await Notifications.getExpoPushTokenAsync();

	// POST the token to our backend so we can use it to send pushes from there
	response = await fetchFromServer('users/'+ user_id +'/push_token/','POST',{
			push_token: token,
		},null);
	
	if (response.status === 200){
		user = await response.json();
		return {user: user,error:'None'};
	}

	return {error:'Server Error'};
}

export async function RedirectToGame(navigation){
        
    const data = await AsyncStorage.multiGet(['@pokerBuddy:token','@pokerBuddy:user','@pokerBuddy:currentGame']);
    
    if (data){
    	var token = (data[0][1]!==null) ? data[0][1] : null;
    	var user = (data[1][1]!==null) ? JSON.parse(data[1][1]) : null;
    	var game_identifier = (data[2][1]!==null) ? data[2][1] : null;
    }

    //backwards compatibility
    //TODO: remove from code versions that are no longer in use
    if (token && user){
	    
	    if (typeof user.app_version === 'undefined'){

	    	//temp app version, cause users with older versions won't have it in their saved user object
	    	user.app_version = "1.2";

	    }else if (user.app_version === "1.3" || user.app_version === "1.4"){
	    	
	    	//latest, do nothing

	    }else{
	    	console.log("Unknown app version");
	    }

	    //update app_version if needed
    	if (user.app_version !== APP_VERSION){
	    	response = await this.fetchFromServer(
				'users/' + user.id + '/update_app_version/',
				'POST',
				{
					app_version:APP_VERSION
				},
				token
			);
			user = await response.json();
			await AsyncStorage.setItem('@pokerBuddy:user', JSON.stringify(user));
	    }
	}


    if (token && user && game_identifier){
    	//player in middle of a game
        game = await this.joinGame(game_identifier,token,user);
        if (!game.error || game.error === "None"){
            this.resetToScreen(navigation,"GameView",{game: game,user: user,token:token});
            return;
        }
    }
    if (token && user){
    	//player logged in
        AsyncStorage.removeItem('@pokerbuddy:currentGame');
        this.resetToScreen(navigation,"HomeView",{token:token,user:user});
    }else{
    	//player not authenticated
        this.resetToScreen(navigation,"LoginView");
    }
    //TODO: error handling
}

export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getUrlField(variable,prefix) {
	let field = '';
	if (variable) {
		field = prefix + variable;
	}
	return field;
}

export function useVenmo(method,recipient=null,amount=null,note=null) {

	let recipient_field = this.getUrlField(recipient,"&recipients=");
	let amount_field = this.getUrlField(amount,"&amount=");
	let note_field = this.getUrlField(note,"&note=");
	
	var url = "venmo://paycharge?txn="+ method + recipient_field + amount_field + note_field;
		
	AppLink.maybeOpenURL(url, { appName: 'Venmo', appStoreId: 'id351727428', playStoreId: 'com.venmo'}).then(() => {
	  // console.log("app link success");
	})
	.catch((err) => {
	  console.log("app link error: ", error);
	});

}

export async function updateVenmo(venmo_username,user,token){
	const response = await this.fetchFromServer(
		'users/' + user.id + '/update_venmo/',
		'POST',
		{
			venmo_username:venmo_username
		},
		token
	);
	//TODO: handle errors!
	user.venmo_username = venmo_username;
	await AsyncStorage.setItem('@pokerBuddy:user', JSON.stringify(user));
}

export function hashPassword(string){
	return (CryptoJS.HmacSHA1(string, PASSWORD_HASH_SECRET)).toString();
}

export function getUserProfilePicture(user){
	let possible_url = "https://graph.facebook.com/" + user.username + "/picture?type=normal";
	try{
		Image.prefetch(possible_url);
		return possible_url;
	}
	catch(error){
		return null;
	}
}
