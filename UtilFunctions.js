import React from 'react';
import { AsyncStorage } from 'react-native';

export function fetchFromServer(relative_url,method,body_dict,token=null){
	var headers = {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	}

	if (token){
		headers['Authorization'] = 'Token ' + token;
	}

	console.log("Request body: " + body_dict);

	// TODO: handle network errors
	return fetch('http://54.236.5.23/' + relative_url, {
		method: method,
	 	headers: headers,
		body: JSON.stringify(body_dict)
	});
	
}

export async function joinGame(navigation,game_identifier,token){
		
	valid_identifier = game_identifier.toUpperCase();
	if (valid_identifier.length !== 5){
		return;
	}
	const gameObj = await fetchFromServer('games/' + valid_identifier + '/join_game/','POST',{},token);
	//TODO: add error check
	if (gameObj.status === 200){
		gameString = gameObj._bodyText;

		await AsyncStorage.setItem('@pokerBuddy:currentGame', gameString);
		navigation.navigate('GameView');
	}
}
