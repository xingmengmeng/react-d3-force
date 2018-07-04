import React, { Component } from 'react';
import { Route, NavLink, Redirect, Switch } from 'react-router-dom';
import {get} from '../api/http';

import Search from '../views/search';
import Settings from '../views/setTool';
import Persons from '../views/persons';
import AllShow from '../views/allShow';
import SearchInput from '../components/SearchInput';

export default class MainNav extends Component {
    constructor() {
        super();
        this.state = {
            hasSearchHearder: true,
            userName: ''
        }
    }
    componentDidMount() {
        let pathName = this.props.location.pathname;
        this.viewHeader(pathName);
        this.setState({
            userName:localStorage.getItem('userName'),
        })
    }
    componentWillReceiveProps(nextProps) {
        let pathName = nextProps.location.pathname;

        this.viewHeader(pathName);
    }
    viewHeader(pathName) {
        if (pathName === '/search' || pathName === '/settings') {
            this.setState({
                hasSearchHearder: false,
            })
        } else {
            this.setState({
                hasSearchHearder: true,
            })
        }
    }
    //退出
    logoutFn() {
        get('/login/login/logout.gm').then(res=>{
            if(res.data.code==='200'){
                window.location.href = '/login';
            }
        })
    }
    render() {
        /* let noSearch = <header className="header">
            <NavLink to="/search" className="logo">logo</NavLink>
            <NavLink to='/search' className='nav'>首页</NavLink>
            <NavLink to='/settings' className='nav'>配置规则</NavLink>
            <div className="right headRight">
                <span className="headerUserName">{ this.state.userName }，您好！</span>
                <i className="line"></i>
                <div className="layoutIcon" onClick={this.logoutFn.bind(this)}>退出</div>
            </div>
        </header>; */
        let headerDom = <header className={this.state.hasSearchHearder ? 'header headerHs' : 'header'}>
            <a href="/search" className="logo">logo</a>
            <NavLink to='/search' className='nav'>首页</NavLink>
            <NavLink to='/settings' className='nav'>配置规则</NavLink>
            {this.state.hasSearchHearder ?
                <div className="left headerS">
                    <SearchInput preWidth='110' preHeight='38' txtWidth='247' txtHeight='38' btnWidth='74' btnHeight='38' btnBg='70%' position='relt'></SearchInput>
                </div> : ''
            }
            <div className="right headRight">
                <span className="headerUserName">{this.state.userName}，您好！</span>
                <i className="line"></i>
                <span className="layoutIcon" onClick={this.logoutFn.bind(this)}>退出</span>
            </div>
        </header>;
        return (
            <div className="allWrap">
                {headerDom}
                <Switch>
                    <Route path='/search' component={Search}></Route>
                    <Route path='/settings' component={Settings}></Route>
                    <Route path='/persons/:id' component={Persons}></Route>
                    <Route path='/allShow/:id' component={AllShow}></Route>
                    <Redirect to="/search" />
                </Switch>
                {/* 用redirect跳转相同名称的路由 必须用switch */}
            </div>
        )
    }
}