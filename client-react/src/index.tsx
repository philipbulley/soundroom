import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/app';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

// Patch TweenConfig interface due to https://github.com/greensock/GreenSock-JS/issues/231#issuecomment-338376104
// declare module 'gsap' {
// 	export interface TweenConfig {
// 		[p: string]: any;
// 	}
// }

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
