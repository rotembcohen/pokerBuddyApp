//Image that works with all platforms

import React, { Component } from 'react';
import { View, Image } from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class SafeImage extends Component {

	render() {
		let uri = this.props.uri;
		if (uri){
			Image.prefetch(uri);
			return <Image source={{uri:uri}} style={this.props.style} />
		}else{
			return <View style={[this.props.style,{backgroundColor:'grey'}]} />
		}
	}

}