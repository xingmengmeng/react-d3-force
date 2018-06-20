import React, { Component } from 'react';
import './index.less';
export default class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: Number(this.props.current) || 1,
            conCount: Number(this.props.conCount) || 1,//数据总条数
            pageCount: Number(this.props.pageCount) || 1,//页码总页数
            curPage:1,
        }
    }
    componentDidMount(){
        this.setState({
            curPage:this.state.current,
        })
    }
    //输入框的双向绑定
    enterPage(e) {
        this.setState({
            curPage: e.target.value
        })
    }
    //重新查询  分页回头第一页
    newSearch(){
        this.setState({
            curPage:1,
        });
    }
    //文本框跳转
    pageFn(event) {
        var targ = event.target.innerHTML;
        if (targ === '上一页' || targ === '下一页' || targ === '第一页' || targ === '末页') {
            if (targ === '上一页') {
                if (this.state.curPage === 1) return;
                let newPage = this.state.curPage - 1;
                this.setState({
                    curPage: newPage,
                })
            } else if (targ === '下一页') {
                if (this.state.curPage >= this.state.pageCount) return;
                let newPage = this.state.curPage + 1;
                this.setState({
                    curPage: newPage,
                })
            } else if (targ === '第一页') {
                if (this.state.curPage <= 1) return;
                this.setState({
                    curPage: 1
                })
            } else if (targ === '末页') {
                if (this.state.curPage >= this.state.pageCount) return;
                this.setState({
                    curPage: this.state.pageCount
                })
            }
            setTimeout(()=>{
                this.props.goFn(this.state.curPage);
            },0)
        }
    }
    //回车跳转
    pageFn2(event) {
        if (event.keyCode === 13) {
            if (isNaN(Number(this.state.curPage))) {
                this.setState({
                    curPage: this.state.current
                })
                return;
            }
            if (this.state.curPage > this.state.pageCount || this.state.curPage <= 0) {
                this.setState({
                    curPage: this.state.current
                })
                return;
            }
            this.props.goFn(this.state.curPage);
        }
    }
    //失去焦点  如果为非数字  则返回原页码
    getPage() {
        if (isNaN(this.state.curPage)) {
            this.setState({
                curPage: this.state.current
            })
        }
    }
    render() {
        return (
            <div className="right pages" onClick={this.pageFn.bind(this)}>
                <span className="firstPage">第一页</span>
                <span className="prevPage">上一页</span>
                <span>第</span>
                <input type="text" className="goTo" value={this.state.curPage} onChange={this.enterPage.bind(this)} onKeyUp={this.pageFn2.bind(this)} onBlur={this.getPage.bind(this)} />
                <span>页</span>
                <span>共{this.state.conCount}条记录</span>
                <span>共{this.state.pageCount}页</span>
                <span className="nextPage">下一页</span>
                <span className="lastPage">末页</span>
            </div>
        )
    }
}