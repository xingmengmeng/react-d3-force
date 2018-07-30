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
import { deleteNode } from '../../components/D3Set/toggles';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default class Persons extends Component {
    constructor() {
        super();
        this.state = {
            id: '',//导航过来的id
            nodeId: '',//主体属性的id
            showLeft: true,//左侧信息是否显示
            showAppDetail: false,//是否显示进件详情
            appDetailData: [],//进件详情数据
            LeftTabListResData: [],//预警提示数据
            persionMain: [],// 主体属性
            graph: [],
            path_texts: '',//存储的线上文字背景集合
            path_text_texts: '',//存储的线上文字背景
            applyChannelInfo: {},//产品类型
            applyStatusInfo: {},//关联层级
        }
    }
    componentDidMount() {
        let id = this.props.match.params.id;
        let nodeId = id.split(':')[0];
        this.setState({
            id: id,
            nodeId: `Person@${nodeId}`,
        }, () => {
            this.getPersonGraph();
        })
        document.querySelector('.mainDetail').addEventListener('scroll', function () {
            this.querySelector('thead').style.transform = 'translate(0, ' + this.scrollTop + 'px)';
        })
        window.onresize = throttle(this.drawChart.bind(this), 200);
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
                    persionMain: resData.persionMains,
                    graph: resData,
                }, () => {
                    this.drawChart();
                })
            }
        })
        post('/graphNew/personInit.gm').then(res => {
            if (res.data.code === '200') {
                this.setState({
                    applyChannelInfo: res.data.data.applyChannelInfo,
                    applyStatusInfo: res.data.data.applyStatusInfo
                })
            }
        })
    }
    //查询进件详细信息
    getListAppInfo() {
        post('/graphNew/listAppInfo.gm', { 'nodeId': this.state.nodeId }).then(res => {
            this.setState({
                appDetailData: res.data.data,
                showAppDetail: true,
            })
        })
    }
    //显示进件信息详情
    showAppDetaiFn() {
        this.getListAppInfo();
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
        //每次请求完重新加载显示图
        d3.select('#svgId').remove();   //删除整个SVG
        d3.select('#svgId').selectAll('*').remove();                    //清空SVG中的内容
        //开始设置
        let nodes = JSON.parse(JSON.stringify(this.state.graph.nodes)),
            links = JSON.parse(JSON.stringify(this.state.graph.links));
        //设置连线  双向及多条  处理数据
        setLinks(links);

        //设置 引入力导向图
        const w = document.querySelector('.drowImgDiv').clientWidth,//后期改为整块区域的宽高，待修改
            h = document.querySelector('.drowImgDiv').clientHeight;
        let centerX, centerY;
        centerX = w / 2;
        centerY = h / 2;

        let force = _force(centerX, centerY);
        this.update(force, nodes, links, w, h, centerX, centerY);
    }
    //画图  数据渲染及更新
    update(force, nodes, links, w, h, centerX, centerY) {
        const _this = this;
        force.nodes(nodes);
        force.force("link").links(links);

        let svg = d3.select('body').select('#chartId').append("svg")
            .attr('id', 'svgId')
            .attr("width", w)
            .attr("height", h);
        let g = svg.append('g').attr("width", w).attr("height", h);
        //整体拖拽 移动
        setSvg(svg, g, force, centerX, centerY);

        let link = g.selectAll(".link").data(links);
        link.exit().remove();
        link = link.enter().append("path")
            .attr('d', function (d) { return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y })
            .attr('id', function (d, i) { return 'path' + i; })
            .attr("class", "link")
            .on("click", function (d) {
                _this.showPathText(d.id)
            });
        //节点
        let node = g.selectAll(".node").data(nodes);
        node.exit().remove();
        node = node.enter().append("circle")
            .attr("r", function (d) {
                switch (d.depth) {
                    case '0':
                        return 36;
                    case '1':
                        return 34;
                    case '2':
                        return 30;
                    case '3':
                        return 26;
                    default:
                        return 24;
                }
            })
            .style("fill", function (node, i) {
                return _this.fillColor(node);
            })
            .attr("class", "node")
            .attr('stroke', d => {
                if (d.depth === '0') {
                    return '#659bff'
                }
            })
            .attr('stroke-width', '5px')
            .call(d3.drag()
                .on("start", d => { dragstarted(d, force) })
                .on("drag", dragged)
                .on("end", d => { dragended(d, force) }))
            .on('click', function (d) {
                _this.nodeClick(d);
                _this.nodeColor(d);
                //console.log(deleteNode.call(this, nodes));
            });
        this.nodes = node;

        //节点上的文字
        var svg_texts = g.selectAll("text").data(nodes);
        svg_texts.exit().remove();
        svg_texts = svg_texts.enter()
            .append("text")
            .style("fill", "#fff")
            .attr("x", 0)
            .attr("y", 0)
            .text(d => d.name)
            .attr('text-anchor', 'middle')
            .attr('class', 'nodesText')
            .style('pointer-events', 'none')
            .call(d3.drag()
                .on("start", d => { dragstarted(d, force) })
                .on("drag", dragged)
                .on("end", d => { dragended(d, force) }))

        force.on("tick", function () {
            tick(link, node, svg_texts, )
        });
        //线上的文字
        /* let path_text_g = g.selectAll("rect").data(links);
        path_text_g.exit().remove();
        path_text_g = path_text_g.enter().append('g');
        let path_text = path_text_g.append("rect")
            .attr("id", d => `pathBg${d.id}`)
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
        }); */
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
        if (node.status === '放款成功') {
            return '#a9cf54'
        } else if (node.status === '拒绝') {
            return '#febf29'
        } else if (node.status === '逾期') {
            return '#ff3008'
        } else if (node.status === '待审核') {
            return '#36c8e3'
        } else if (node.status === '黑名单') {
            return '#2a3842'
        }
    }
    strColor(node) {
        if (node.status === '放款成功') {
            return '#a9cf54'
        } else if (node.status === '拒绝') {
            return '#febf29'
        } else if (node.status === '逾期') {
            return '#ff3008'
        } else if (node.status === '待审核') {
            return '#36c8e3'
        } else if (node.status === '黑名单') {
            return '#2a3842'
        }
    }
    nodeClick(d, cur) {
        let nodeId = d.id;
        this.setState({
            nodeId: d.id,
        })
        post('/graphNew/personMain.gm', { 'nodeId': nodeId }).then(res => {
            if (res.data.code === '200') {
                this.setState({
                    persionMain: res.data.data,
                    showAppDetail: false,
                })
            }
        })
    }
    //点击力导向图中的点   改变颜色
    nodeColor(d) {
        var _this = this;
        this.nodes.attr("class", function (node) {
            if (d.id === node.id) {
                return 'circleActive';
            } else {
                return 'circle';
            }
        });
    }
    //点击预警提示信息
    showDetailNode(ids){
        for(let i=0;i<ids.length;i++){
            this.nodes.attr("class", function (node) {
                if (ids[i] === node.id) {
                    return 'circleActive';
                } else {
                    return 'circle';
                }
            });
        }
    }
    render() {
        return (
            <section className="containers">
                <div className="leftSide" style={{ display: this.state.showLeft ? 'block' : 'none' }}>
                    <h5 className="hTit">预警提示</h5>
                    <div className="leftUlWraps">
                        <LeftTabList LeftTabListData={this.state.LeftTabListResData} showDetailNode={this.showDetailNode.bind(this)}></LeftTabList>
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