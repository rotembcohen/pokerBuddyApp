import React from 'react';
import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

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

export async function joinGame(navigation,game_identifier,token,currentUser){
	
	//currentUser might not be the one joining game
	//TODO: allow a host to add a different user to the game

	valid_identifier = game_identifier.toUpperCase();
	if (valid_identifier.length !== 5){
		return;
	}
	const response = await fetchFromServer('games/' + valid_identifier + '/join_game/','POST',{},token);
	//TODO: add error check
	if (response.status === 200){
		game = JSON.parse(response._bodyText);

		navigation.navigate('GameView',{game: game,user: currentUser});
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
		console.log("Recieved token: " + token);
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