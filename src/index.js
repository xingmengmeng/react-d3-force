import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.less';
import './assets/css/reset.min.less';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));
