import React, { Component } from 'react';
import './index.less'
import { getSearchList } from '../../api/api.js';
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
                    <SearchInput value="" fn={this.toSearch.bind(this)} preWidth='120' preHeight='50' txtWidth='400' txtHeight='50' btnWidth='120' btnHeight='50' />
                </div>
            </div>
        )
    }
    toSearch(value) {

        getSearchList().then(res => {
            this.setState({
                seVal: value,
                listData: res.data.data.dataInfo
            }, () => {
                //this.refs.pages.newSearch();//重新查询  setState的回调函数
            })
        });
    }
}
export default Search;