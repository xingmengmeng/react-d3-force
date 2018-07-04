import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../../api/http';
import './index.less';
import { DatePicker, Select } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn'
import LeftTabList from '../../components/LeftTabList';
import PersonLeftTab from '../../components/PersonLeftTab';
import Button from '../../components/Button';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default class Persons extends Component {
    constructor() {
        super();
        this.state = {
            id: '',//导航过来的id
            showLeft: true,//左侧信息是否显示
            showAppDetail: false,//是否显示进件详情
            appDetailData: [],//进件详情数据
            LeftTabListResData: [],//预警提示数据
            persionMain:[],// 主体属性
        }
    }
    componentDidMount() {
        this.getPersonGraph();
        this.getListAppInfo();
        document.querySelector('.mainDetail').addEventListener('scroll', function () {
            this.querySelector('thead').style.transform = 'translate(0, ' + this.scrollTop + 'px)';
        })
    }
    componentWillReceiveProps(nextProps) {
        let id = nextProps.match.params.id;
        if (id === this.state.id || this.state.id === '') return;
        this.setState({
            id: id,
        }, () => {
            this.getPersonGraph();
            this.getListAppInfo();
        })
    }
    //查询人物图信息
    getPersonGraph() {
        post('/graphNew/personGraph.gm', { 'appNo': this.state.id }).then(res => {
            if (res.data.code === '200') {
                let resData = res.data.data;
                this.setState({
                    showAppDetail: false,
                    LeftTabListResData: resData.graphWarnings.concat(),//预警提示
                    persionMain:resData.persionMain,
                })
            }
        })
    }
    //查询进件详细信息
    getListAppInfo() {
        post('/graphNew/listAppInfo.gm', { 'appNo': this.state.id }).then(res => {
            this.setState({
                appDetailData: res.data.data,
            })
        })
    }
    //显示进件信息详情
    showAppDetaiFn() {
        this.setState({
            showAppDetail: true,
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
    //日期后面的下拉菜单选择
    handleChange(value) {
        console.log(`selected ${value}`);
    }
    //日历组件
    timeChange(data, dateStringAry) {
        console.log(dateStringAry);
    }
    render() {
        return (
            <section className="containers">
                <div className="leftSide" style={{ display: this.state.showLeft ? 'block' : 'none' }}>
                    <h5 className="hTit">预警提示</h5>
                    <div className="leftUlWraps">
                        <LeftTabList LeftTabListData={this.state.LeftTabListResData}></LeftTabList>
                    </div>
                    <h5 className="hTit">主体属性</h5>
                    <ul className="leftMainUl clearfix">
                        <li>
                            <label>当前进件编号</label>
                            <span>{this.state.persionMain.appNo}</span>
                        </li>
                        <li>
                            <label>客户姓名</label>
                            <span>{this.state.persionMain.name}</span>
                        </li>
                        <li>
                            <label>身份证号</label>
                            <span>{this.state.persionMain.idNo}</span>
                        </li>
                        <li>
                            <label>申请进件数量</label>
                            <span>{this.state.persionMain.applyNum}</span>
                            <i onClick={this.showAppDetaiFn.bind(this)}>查看详情</i>
                        </li>
                    </ul>
                    <div className="mainDetail">
                        {this.state.showAppDetail ? <PersonLeftTab detailData={this.state.appDetailData} /> : ''}
                    </div>
                </div>
                <div className={this.state.showLeft ? 'changeSorH' : 'changeSorH2'} onClick={this.changeShow.bind(this)}></div>
                {/* 右侧大块  start */}
                <div className={this.state.showLeft ? 'rightSide' : 'rightSide2'}>
                    <div className="rightCon clearfix">
                        <div className="linkToWrap">
                            <Link to={`/allShow/${this.state.id}`}>切换为全貌图</Link>
                        </div>
                        {/* 筛选条件 */}
                        <ul className="conUl">
                            <li className="conTitle">
                                <label className="left">时间：</label>
                                <div className="left pickerWrap clearfix">
                                    <RangePicker format="YYYY-MM-DD HH:mm" showTime locale={locale} onChange={this.timeChange.bind(this)}></RangePicker>
                                </div>
                                <Select defaultValue="lastmonth" style={{ width: 100 }} onChange={this.handleChange.bind(this)}>
                                    <Option value="lastmonth">近一月</Option>
                                    <Option value="lastweek">近一周</Option>
                                    <Option value="selfding">自定义</Option>
                                </Select>
                                <label htmlFor="">产品类型：</label>
                                <Select defaultValue="lastmonth" style={{ width: 100 }} onChange={this.handleChange.bind(this)}>
                                    <Option value="lastmonth">全部</Option>
                                    <Option value="lastweek">近一周</Option>
                                    <Option value="selfding">自定义</Option>
                                </Select>
                                <label htmlFor="">关联层次：</label>
                                <Select defaultValue="lastmonth" style={{ width: 100 }} onChange={this.handleChange.bind(this)}>
                                    <Option value="lastmonth">全部</Option>
                                    <Option value="lastweek">近一周</Option>
                                    <Option value="selfding">自定义</Option>
                                </Select>
                                <Button defaultValue="搜索"></Button>
                            </li>
                        </ul>
                        {/* 图表说明*/}
                        <ul className="imgMessUl">
                            <li>
                                图释：
                            </li>
                            <li>
                                <i className="ls1"></i>
                                <span>放款成功</span>
                            </li>
                            <li>
                                <i className="ls2"></i>
                                <span>拒绝</span>
                            </li>
                            <li>
                                <i className="ls3"></i>
                                <span>逾期</span>
                            </li>
                            <li>
                                <i className="ls4"></i>
                                <span>待审核</span>
                            </li>
                            <li>
                                <i className="ls5"></i>
                                <span>黑名单</span>
                            </li>
                        </ul>
                        <div className="drowImgDiv">

                        </div>
                    </div>
                </div>
                {/* 右侧大块  end */}
            </section>
        )
    }
}