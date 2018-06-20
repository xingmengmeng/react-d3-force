import React, { Component } from 'react';
import './index.less';
import Page from '../../components/Page';
import { getSearchList } from '../../api/api.js';
export default class Settings extends Component {
    //翻页接受函数
    go(pageNum){
        console.log(pageNum);
    }
    toSearch(value) {
        //this.props.history.push('/persons')  路由跳转
        getSearchList().then(res => {
            this.setState({
                seVal: value,
                listData: res.data.data.dataInfo
            },()=>{
                this.refs.pages.newSearch();//重新查询
            })
        });
        //有依赖关系的请求
        // postLogin('/biPc/login/dologin.gm', param).then(data => {
        //     if (data)
        //         getSearchList().then(res => {
        //             this.setState({
        //                 seVal: value,
        //                 listData: res.data.data.dataInfo
        //             })
        //         });
        // })
    }
    render() {
        return (
            <section className="toolMain">
                规则配置
                <Page conCount='200' pageCount='20' current='1' goFn={this.go.bind(this)} ref="pages"></Page>
            </section>
        )
    }
}