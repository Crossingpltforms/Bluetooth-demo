/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';


import routes from './routes1';
import {name as appName} from './app.json';
console.disableYellowBox = true;
// import {initializeManager} from './app/components/header/ble_manager_cp_12aug';

AppRegistry.registerComponent(appName, () => routes);
