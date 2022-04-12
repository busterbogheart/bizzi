import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.log("\n\n\n____________SESSION_START______________\n\n");
AppRegistry.registerComponent(appName, () => App);
