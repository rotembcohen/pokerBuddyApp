import React from 'react';
import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { Permissions, Notifications, Constants } from 'expo';

var qs = require('qs');

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
	const response = await fetch('http://54.236.5.23/' + relative_url, content);

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
		//TODO: this should behave like fetchfromserver (at lease as far as retrun value)
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


export async function parseUrl(url){
    if (url) {
        let queryString = url.replace(Constants.linkingUri, '');
        if (queryString) {
            let data = qs.parse(queryString);
            console.log(`Linked to app with data: ${JSON.stringify(data)}`);
            let game_identifier = data.join;
            
            //TODO: check regex
            if (game_identifier && game_identifier.length === 5){
                game_identifier = game_identifier.toUpperCase();
                await AsyncStorage.setItem('@pokerBuddy:currentGame', game_identifier);
            }
        }
        //console.log('Initial url is: ' + url,'\nqueryString is ' + queryString, "\nconst is " + Constants.linkingUri);
    }
}

export async function RedirectToGame(navigation){
        
    const data = await AsyncStorage.multiGet(['@pokerBuddy:token','@pokerBuddy:user','@pokerBuddy:currentGame']);

    if (data && data[0][1]!== null && data[1][1] != null && data[2][1] != null){
    	//player in middle of a game
        token = data[0][1];
        user = JSON.parse(data[1][1]);
        game_identifier = data[2][1];
        game = await this.joinGame(game_identifier,token,user);
        if (!game.error || game.error === "None"){
            this.resetToScreen(navigation,"GameView",{game: game,user: user,token:token});
            return;
        }
    }
    if (data && data[0][1]!== null && data[1][1] != null){
    	//player logged in
        AsyncStorage.removeItem('@pokerbuddy:currentGame');
        this.resetToScreen(navigation,"HomeView",{token:data[0][1],user:JSON.parse(data[1][1])});
    }else{
    	//player not authenticated
        this.resetToScreen(navigation,"LoginView");
    }
    //TODO: error handling
}

export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}