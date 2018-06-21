import React, { Component } from 'react';
import './index.less';
import { DatePicker } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn'
import LeftTabList from '../../components/LeftTabList';
import PersonLeftTab from '../../components/PersonLeftTab';

const { RangePicker } = DatePicker;

export default class Persons extends Component {
    constructor() {
        super();
        this.state = {
            id: '',
            showLeft: true,
        }
    }
    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({
            id: id,
        }, () => {
            console.log(this.state.id);
        })
        document.querySelector('.mainDetail').addEventListener('scroll', function () {
            this.querySelector('thead').style.transform = 'translate(0, ' + this.scrollTop + 'px)';
        })
    }
    changeShow() {
        if (this.state.showLeft) {
            this.setState({
                showLeft: false,
            })
        } else {
            this.setState({
                showLeft: true,
            })
        }
    }
    render() {
        return (
            <section className="containers">
                <div className="leftSide" style={{ display: this.state.showLeft ? 'block' : 'none' }}>
                    <h5 className="hTit">预警提示</h5>
                    <div className="leftUlWraps">
                        <LeftTabList></LeftTabList>
                    </div>
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
                    <div className="mainDetail">
                        <PersonLeftTab></PersonLeftTab>
                    </div>
                </div>
                <div className={this.state.showLeft ? 'changeSorH' : 'changeSorH2'} onClick={this.changeShow.bind(this)}></div>
                <div className={this.state.showLeft ? 'rightSide' : 'rightSide2'}>
                    <div style={{ border: '1px red solid', width: '100%', height: '700px' }}>
                        <div className="pickerWrap">
                            <RangePicker format="YYYY-MM-DD HH:mm" showTime locale={locale}></RangePicker>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}