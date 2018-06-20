import React, { Component } from 'react';
import './index.less';

import LeftTabList from '../../components/LeftTabList';

export default class Persons extends Component {
    constructor() {
        super();
        this.state = {
            id: '',
        }
    }
    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({
            id: id,
        }, () => {
            console.log(this.state.id);
        })
    }
    render() {
        return (
            <section className="allWrap containers">
                <div className="leftSide">
                    <h5 className="hTit">预警提示</h5>
                    <LeftTabList></LeftTabList>
                    <h5 className="hTit">主体属性</h5>
                    <ul className="leftMainUl clearfix">
                        <li>
                            <label>当前进件编号</label>
                            <span>MJ0001</span>
                        </li>
                        <li>
                            <label>客户姓名</label>
                            <span>张三三</span>
                        </li>
                        <li>
                            <label>身份证号</label>
                            <span>239887636526252636</span>
                        </li>
                        <li>
                            <label>申请进件数量</label>
                            <span>5</span>
                            <i>查看详情</i>
                        </li>
                    </ul>
                </div>
                <div className="rightSide">
                    右侧大块
               </div>
            </section>
        )
    }
}