import React, { Component } from 'react';
import { post } from '../../api/http';
import './index.less';
class Login extends Component {
    constructor() {
        super();
        this.state = {
            errorMessage: '',
            isCookerLogin: false,
            cookieNm: '',
            cookiePsd: '',
            isSaveCheck: false,
        }
    }
    componentDidMount() {
        this.getCookie();
    }
    setCookie(usern, psw) {
        var Then = new Date()
        Then.setTime(Then.getTime() + 1866240000000);
        document.cookie = "biname=" + usern + "%%" + psw + ";expires=" + Then.toGMTString();
    }
    getCookie() {
        var nm, psd;
        var cookieString = document.cookie.toString();
        var cookieHeader = "biname="
        var beginPosition = cookieString.indexOf(cookieHeader);
        cookieString = cookieString.substring(beginPosition);
        var ends = cookieString.indexOf(";");
        if (ends !== -1) {
            cookieString = cookieString.substring(0, ends);
            this.isCookerLogin = false;
        }
        if (beginPosition > -1) {
            var nmpsd = cookieString.substring(cookieHeader.length);
            if (nmpsd !== "") {
                beginPosition = nmpsd.indexOf("%%");
                nm = nmpsd.substring(0, beginPosition);
                psd = nmpsd.substring(beginPosition + 2);
                document.getElementById('username').value = this.cookieNm = nm;
                document.getElementById('password').value = this.cookiePsd = psd;
                if (nm !== "" && psd !== "") {
                    document.getElementById('rememberPass').checked = true;
                    this.setState({
                        isSaveCheck: true
                    });
                }
            }
        }
    }
    toNextText(e) {
        if (e.keyCode === 13) {
            var passTxt = document.querySelector('#password');
            passTxt.focus();
        }
    }
    saveInfo(e) {
        if (e.keyCode === 13) {
            this.subFn();
        }
    }
    saveSub() {
        this.subFn();
    }
    subFn() {
        try {
            var isSave = document.getElementById('rememberPass').checked;   //保存按键是否选中
            var usernm = document.getElementById('username').value;
            var userpsw = document.getElementById('password').value;
            this.isSaveCheck = isSave;
            localStorage.userName = usernm;
            if (usernm === '' || userpsw === '') {
                this.errorMessage = '用户名、密码不能为空'
            } else {
                if (usernm === this.cookieNm && userpsw === this.cookiePsd) {
                    this.isCookerLogin = true;
                } else {
                    this.isCookerLogin = false;
                }
                if (isSave) {
                    /*{'userName':usernm,'userPwd':userpsw,'isRemember':true,'isCookerLogin':false}*/
                    /*登录接口*/
                    post('/biPc/login/dologin.gm', { "userName": usernm, "userPwd": userpsw, "isRemember": true, "isCookerLogin": this.isCookerLogin }).then((response) => {
                        if (response.data.code !== '200') {
                            this.setState({
                                errorMessage: response.data.msg
                            })
                            if (response.data.code === 'WA10000') {
                                this.setCookie("", "");
                                this.setState({
                                    cookiePsd: '',
                                })
                            }
                            return;
                        }
                        if (this.isCookerLogin === false) {
                            userpsw = response.data.data.dataInfo.passWord;
                        }
                        if (response.data.code === '200') {
                            this.setCookie(usernm, userpsw);
                            localStorage.meijieAdminFlag = response.data.data.dataInfo.meijieAdminFlag;
                            window.location.href = '/index';
                        } else {
                            this.setState({
                                errorMessage: response.data.data.dataInfo.responseMsg
                            })
                        }
                    })
                } else {
                    post('/biPc/login/dologin.gm', { "userName": usernm, "userPwd": userpsw, "isRemember": true, "isCookerLogin": this.isCookerLogin }).then((response) => {
                        console.log(response.data.data);
                        if (response.data.code !== '200') {
                            this.setState({
                                errorMessage: response.data.msg
                            })
                            if (response.data.code === 'WA10000') {
                                this.setCookie("", "");
                                this.setState({
                                    cookiePsd: '',
                                })
                            }
                            return;
                        }
                        if (response.data.code === '200') {
                            this.setCookie(usernm, userpsw);
                            localStorage.meijieAdminFlag = response.data.data.dataInfo.meijieAdminFlag;
                            window.location.href = '/index';
                        } else {
                            this.setState({
                                errorMessage: response.data.data.dataInfo.responseMsg
                            })
                        }
                        this.setCookie("", "");
                        this.cookiePsd = '';
                    })
                }
            }
        } catch (e) {
        }
    }
    isChecked(event) {
        const target = event.target;
        let ischecked = target.checked;
        this.setState({
            isSaveCheck: ischecked
        });
    }
    render() {
        return (
            <div className="loginBody">
                <section id="login" className="loginContainer">
                    <ul className="loginUl">
                        <li>
                            <h2>国美金融天眼系统</h2>
                        </li>
                        <li>
                            <input type="text" name="username" id="username" className="txt" placeholder="请输入账号" onKeyUp={this.toNextText.bind(this)} />
                        </li>
                        <li>
                            <input type="password" name="password" id="password" className="txt" placeholder="请输入密码" onKeyUp={this.saveInfo.bind(this)} />
                        </li>
                        <li className="remLi clearfix">
                            <span className={this.state.isSaveCheck ? 'selectIcon' : 'noSelectIcon'}></span>
                            <label className="left">
                                <input type="checkbox" name="rememberPass" id="rememberPass" checked={this.state.isSaveCheck} onChange={this.isChecked.bind(this)} />
                                记住密码
                            </label>
                        </li>
                        <li className="redF" >
                            {this.state.errorMessage}
                        </li>
                        <li>
                            <input type="button" value="立即登录" id="loginBtn" onClick={this.saveSub.bind(this)} />
                        </li>
                    </ul>
                </section>
            </div>
        )
    }
}
export default Login;