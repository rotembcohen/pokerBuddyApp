//Image that works with all platforms

import React, { Component } from 'react';
import { View, Image } from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class SafeImage extends Component {

	render() {
		let uri = this.props.uri;
		if (uri){
			return <Image source={{uri:uri}} style={this.props.style} />
		}else{
			return <View style={[this.props.style,{backgroundColor:'grey'}]} />
		}
	}
// borderRadius: 12, borderWidth: 0, borderColor: 'rgba(0, 0, 0, 0.1)'

}