import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from '../views/login';
import MainNav from './hearder';

import './index.less';
export default class RouterMap extends Component {
    render() {  
        return (
            <BrowserRouter>
                <div className="allWrap">
                    <Switch>
                        <Route path='/login' component={Login}></Route>
                        <MainNav></MainNav>
                    </Switch>
                </div>
            </BrowserRouter>
            // 一个文件路由  只能在主路由中有一个browserRouter  路由的根级
        )
    }
}