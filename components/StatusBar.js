import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import styles from '../Styles';
import * as utils from '../UtilFunctions';

export default class ComponentName extends Component {

	render() {
		return (
			<StatusBar hidden={false} barStyle='light-content' backgroundColor="#bc0000" />
		);
	}


}