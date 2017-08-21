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

		await AsyncStorage.setItem('@pokerBuddy:currentGame', gameString);

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

		await AsyncStorage.setItem('@pokerBuddy:currentGame', gameString);

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