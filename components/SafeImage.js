//Image that works with all platforms

import React, { Component } from 'react';
import { View, Image } from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class SafeImage extends Component {

	render() {
		let uri = this.props.uri;
		if (uri){
			return <Image source={{uri:uri}} style={[this.props.style,{borderWidth: 0, borderRadius: 12, borderColor: 'rgba(0, 0, 0, 0.1)'}]} />
		}else{
			return <View style={[this.props.style,{backgroundColor:'grey',borderWidth: 0, borderRadius: 12, borderColor: 'rgba(0, 0, 0, 0.1)'}]} />
		}
	}


}