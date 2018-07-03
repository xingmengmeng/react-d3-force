import React, { Component } from 'react';
import {get} from '../../api/http';
import './index.less';
import SearchInput from '../../components/SearchInput';
import imgSrc from '../../assets/images/searchLogo.png';
class Search extends Component {
    constructor() {
        super();//必须写super
        this.state = {
            seVal: '',
        }
    }
    render() {
        return (
            <div className="searchMain">
                <div className='seWrap'>
                    <img src={imgSrc} alt='logo'/>
                    <SearchInput value="" preWidth='120' preHeight='50' txtWidth='400' txtHeight='50' btnWidth='120' btnHeight='50' />
                </div>
            </div>
        )
    }
    componentDidMount(){
        get('/login/login/isLogin.gm').then(res=>{
            if(res.data.msg!=='成功'||res.data.code!=='200'){
                window.location.href='/login';
            }
        })
    }
}
export default Search;