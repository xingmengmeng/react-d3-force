import React, { Component } from 'react';
import SliderItem from './SliderItem';
import SlideDots from './SliderDot';
import SliderArrows from './SliderArrows';

import './index.less';
export default class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowLocal: 0,
            display: 'none',//左右箭头的显示
        }
        this.count = this.props.items.length + 1; //比原有图片数组+1 
        this.transition = this.props.speed + 's';
        this.timer = null;
    }
    componentDidMount() {
        this.goPlay();
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    //手动点击
    turn(index) {
        this.clearPlay();
        this.setState({
            nowLocal: index,
        })
    }
    // 开始自动轮播
    goPlay() {
        if (this.props.autoplay) {
            this.timer = setInterval(() => {
                this.goPlayFn(1);
            }, this.props.delay * 1000);
        }
        this.setState({
            display: 'none',
        })
    }
    //自动轮播及左右箭头的n值计算
    goPlayFn(n) {
        let _n = this.state.nowLocal;
        if (_n >= this.count - 1) { //右箭头及自动轮播
            this.transition = "none";
            this.setState({
                nowLocal: 0,
            })
        } else if (_n <= 0 && n === -1) {//左箭头情况  且n==-1为了保证第一次轮播时对于0的判断不出错
            this.transition = "none";
            this.setState({
                nowLocal: this.count - 1,
            })
        } else {
            this.transition = this.props.speed + 's';
        }
        setTimeout(() => {
            this.transition = this.props.speed + 's';
            _n = this.state.nowLocal + n;
            this.setState({
                nowLocal: _n,
            })
        }, 0)
    }

    //停止定时器
    clearPlay() {
        clearInterval(this.timer);
        this.timer = null;
        this.setState({
            display: 'block',
        })
    }
    render() {
        let nodeList = this.props.items;
        let nodeLength = nodeList.length;
        let liItem = nodeList.map((item, index) => {
            return <SliderItem item={item} key={index}></SliderItem>
        });
        liItem.push(<SliderItem item={nodeList[0]} key={nodeLength}></SliderItem>)
        return (
            <section id="box" className="box" onMouseOver={this.clearPlay.bind(this)} onMouseOut={this.goPlay.bind(this)}>
                <ul className="boxInner" style={
                    {
                        width: (nodeLength + 1) * 1000 + 'px',
                        left: -1000 * this.state.nowLocal + 'px',
                        transition: this.transition,
                    }
                }>
                    {liItem}
                </ul>
                {this.props.dots ? <SlideDots count={nodeLength} turn={this.turn.bind(this)} curIndex={this.state.nowLocal === (this.count - 1) ? 0 : this.state.nowLocal} /> : ''}
                {this.props.arrows ? <SliderArrows clickFn={this.goPlayFn.bind(this)} display={this.state.display}></SliderArrows> : ''}
            </section>
        )
    }
}
