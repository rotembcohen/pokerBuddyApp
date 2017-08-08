import React from 'react';
// import { AsyncStorage } from 'react-native';

export function fetchFromServer(relative_url,method,body_dict,token=null){
	var headers = {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	}

	if (token){
		headers['Authorization'] = 'Token ' + token;
	}

	console.log(body_dict);

	// TODO: handle network errors
	return fetch('http://54.236.5.23/' + relative_url, {
		method: method,
	 	headers: headers,
		body: JSON.stringify(body_dict)
	});
	
}
