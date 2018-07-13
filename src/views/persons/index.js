import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as d3 from "d3";
import { post } from '../../api/http';
import { throttle } from '../../assets/js/utils';
import './index.less';
import { DatePicker, Select } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn'
import LeftTabList from '../../components/LeftTabList';
import PersonLeftTab from '../../components/PersonLeftTab';
import Button from '../../components/Button';
//D3的方法
import _force from '../../components/D3Set/_force';
import { setLinks, tick, setSvg } from '../../components/D3Set/_d3Utils';
import { dragstarted, dragged, dragended } from '../../components/D3Set/nodeDrag';

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
            persionMain: [],// 主体属性
            graph: [],
            path_texts: '',//存储的线上文字背景集合
            path_text_texts: '',//存储的线上文字背景
        }
    }
    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({
            id: id,
        }, () => {
            this.getPersonGraph();
            this.getListAppInfo();
        })
        document.querySelector('.mainDetail').addEventListener('scroll', function () {
            this.querySelector('thead').style.transform = 'translate(0, ' + this.scrollTop + 'px)';
        })
        window.onresize = throttle(this.resizeFn.bind(this), 200);
    }
    componentWillUnmount() {
        window.onresize = null;
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
    resizeFn() {
        this.drawChart();
    }
    //查询人物图信息
    getPersonGraph() {
        post('/graphNew/personGraph.gm', { 'appNo': this.state.id }).then(res => {
            if (res.data.code === '200') {
                let resData = res.data.data;
                this.setState({
                    showAppDetail: false,
                    LeftTabListResData: resData.graphWarnings.concat(),//预警提示
                    persionMain: resData.persionMains,
                    graph: resData,
                }, () => {
                    this.drawChart();
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
        setTimeout(() => {
            this.drawChart();
        }, 220)
    }
    //日期后面的下拉菜单选择
    handleChange(value) {
        console.log(`selected ${value}`);
    }
    //日历组件
    timeChange(data, dateStringAry) {
        console.log(dateStringAry);
    }
    //画图
    drawChart() {
        const _this = this;
        //每次请求完重新加载显示图
        d3.select('#svgId').remove();   //删除整个SVG
        d3.select('#svgId').selectAll('*').remove();                    //清空SVG中的内容
        //开始设置
        let nodes = this.state.graph.nodes,
            links = this.state.graph.links;
        //设置连线  双向及多条  处理数据
        setLinks(links);

        //设置 引入力导向图
        const w = document.querySelector('.drowImgDiv').clientWidth,//后期改为整块区域的宽高，待修改
            h = document.querySelector('.drowImgDiv').clientHeight;
        let centerX, centerY;
        centerX = w / 2;
        centerY = h / 2;

        let force = _force(centerX, centerY);
        force.nodes(nodes);
        force.force("link").links(links);

        let svg = d3.select('body').select('#chartId').append("svg")
            .attr('id', 'svgId')
            .attr("width", w)
            .attr("height", h);
        let g = svg.append('g')
            .attr("width", w)
            .attr("height", h);
        //整体拖拽 移动
        setSvg(svg, g, force, centerX, centerY);

        var link = g.selectAll(".link");
        var node = g.selectAll(".node");
        link = link.data(links)
            .enter().append("path")
            .attr('d', function (d) { return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y })
            .attr('id', function (d, i) { return 'path' + i; })
            .attr("class", "link")
            .on("click", function (d) {
                _this.showPathText(d.id)
            });
        //节点
        node = node.data(nodes)
            .enter().append("circle")
            .attr("r", function (d) {
                if (d.type === 'Person' || d.type === 'Main') {//根据type判断圈的大小
                    return 38;
                } else {
                    return 32;
                }
            })
            .style("fill", function (node, i) {
                return _this.fillColor(node);
            })
            .attr('stroke', function (d) {
                return _this.strColor(d);
            })
            .attr('stroke-width', '3px')
            .call(d3.drag()
                .on("start", (d) => { dragstarted(d, force) })
                .on("drag", dragged)
                .on("end", (d) => { dragended(d, force) }))
            .on('click', function (d) {
                _this.nodeClick.call(this, d, this);
                _this.nodeColor(d);
            });
        this.nodes = node;

        //节点上的文字
        var svg_texts = g.selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .style("fill", "#fff")
            .attr("x", 0)
            .attr("y", 0)
            .text(function (d) {
                return d.name;
            })
            .attr('text-anchor', 'middle')
            .attr('class', 'nodesText')
            .call(d3.drag()
                .on("start", (d) => { dragstarted(d, force) })
                .on("drag", dragged)
                .on("end", (d) => { dragended(d, force) }))
            .on('click', function (d) {
                _this.nodeClick.call(this, d, this);
                _this.nodeColor(d);
            });
        //线上的文字
        /* let path_text = g.selectAll(".linetext")
            .data(links)
            .enter()
            .append("text")
            .attr("class", "linetext")
            .attr('x', '0')
            .attr('dy', '5')
            .attr('text-anchor', 'middle');
        path_text.append('textPath')
            .attr(
                'xlink:href', function (d, i) {
                    return '#path' + i;
                }
            )
            .attr('startOffset', '50%')
            .text(function (d) {
                return d.type;
            })
            .on('click', _this.lineClick); */
        let path_text_g = g.selectAll("rect")
            .data(links)
            .enter().append('g');
        let path_text = path_text_g.append("rect")
            .attr("id", (d) => `pathBg${d.id}`)
            .attr("width", '120').attr("height", 26) //每个矩形的宽高
            .attr("rx", "2").attr("ry", "2")
            .attr("fill", "#000000").attr("fill-opacity", "0.6")
            .attr("visibility", "hidden");
        let path_text_text = path_text_g.append("text").text(function (d) { //添加文字描述
            return d.type;
        }).attr("visibility", "hidden").style("fill", "#ffffff").style("font-size", "12px");

        this.setState({
            path_texts: path_text,
            path_text_texts: path_text_text,
        })

        force.on("tick", function () {
            tick(link, node, svg_texts, path_text, path_text_text)
        });

    }
    //点击线时候的操作
    showPathText(id) {
        this.state.path_texts.attr("visibility", function (d) {
            if (d.id === id) {
                return "visible"
            } else {
                return "hidden"
            }
        })
        this.state.path_text_texts.attr("visibility", function (d) {
            if (d.id === id) {
                return "visible"
            } else {
                return "hidden"
            }
        })
    }
    //颜色设置  根绝类型设置
    fillColor(node) {
        if (node.type === 'Person') {
            return '#8588ff'
        } else if (node.type === 'Main') {
            return '#82c3e8'
        } else if (node.type === 'Apply') {
            return '#f66f13'
        } else if (node.type === 'Address') {
            return '#c3e20e'
        } else if (node.type === 'Company') {
            return '#ed6cac'
        } else if (node.type === 'BankCard') {
            return '#50e3c2'
        } else if (node.type === 'SocialMediaId') {
            return '#69aef4'
        } else if (node.type === 'Device') {
            return '#ffbf2f'
        } else if (node.type === 'HouseProperty') {
            return '#8de0ff'
        } else if (node.type === 'Telephone') {
            return '#fbc999'
        } else {
            return '#ccc'
        }
    }
    strColor(node) {
        if (node.type === 'Person') {
            return 'rgb(194,195,255)'
        } else if (node.type === 'Main') {
            return 'rgb(182,228,254)'
        } else if (node.type === 'Apply') {
            return 'rgb(250,183,137)'
        } else if (node.type === 'Address') {
            return 'rgb(225,240,134)'
        } else if (node.type === 'Company') {
            return 'rgb(246,181,213)'
        } else if (node.type === 'BankCard') {
            return 'rgb(167,241,224)'
        } else if (node.type === 'SocialMediaId') {
            return 'rgb(180,214,249)'
        } else if (node.type === 'Device') {
            return 'rgb(255,223,151)'
        } else if (node.type === 'HouseProperty') {
            return 'rgb(198,239,255)'
        } else if (node.type === 'Telephone') {
            return 'rgb(254,220,187)'
        }
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
                        {this.state.persionMain.map((item, index) =>
                            <li key={index}>
                                <label>{item.property}</label>
                                <span>{item.value}</span>
                                {index === this.state.persionMain.length - 1 ? <i onClick={this.showAppDetaiFn.bind(this)}>查看详情</i> : ''}
                            </li>
                        )}

                        {/* <li>
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
                        </li> */}
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
                            <div className="chartWrap box-shadow" id="chartId">

                            </div>
                        </div>
                    </div>
                </div>
                {/* 右侧大块  end */}
            </section>
        )
    }
}