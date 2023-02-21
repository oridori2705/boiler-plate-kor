import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {Provider} from "react-redux" //redux생성
import { applyMiddleware,createStore } from 'redux'; //미들웨어만들기 위한
import promiseMiddleware from "redux-promise";
import Reduxthunk from "redux-thunk";

import  Reducer from './_reducers';//우리가 만든 Reducer 파일 가져옴

//미들웨어를 이용해야지 plain object(객체)만 받는 Redux stroe가 Promise와 Function 형식을 받을 수 있다.
const  createStreWithMiddleware=applyMiddleware(promiseMiddleware,Reduxthunk)(createStore);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider
        store={createStreWithMiddleware(Reducer,
                window.__REDUX_DEVTOOLS_EXTENSION__&&
                window.__REDUX_DEVTOOLS_EXTENSION__() //Redux dev tools에서 다운받은 것을 가져옴 -> Redux Extension
            )}
    >
        <App />
    </Provider>
    

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
