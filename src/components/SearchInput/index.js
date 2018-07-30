import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { post } from '../../api/http';
import './index.less';
/**
 * preWidth：搜索框前面的下拉菜单的宽
 * preHeight：搜索框前面的下拉菜单的高
 * txtWidth：搜索框宽
 * txtHeight：搜索框高
 * position: 提示语位置  默认在下  如果有值为relt  则位置在右侧
 */
class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || '',
            showPrvDisplay: 'none',
            showTxtDisplay: 'none',
            resData: [],
            selectAray: [
                { name: '电话', value: '1' },
                { name: '身份证', value: '2' },
                { name: '进件编号', value: '3' },
            ],
            selected: '电话',
            selectedId: '1',
            errorFont: '请输入查询内容！',//查询结果不存在！
        }
    }
    componentDidMount() {
        document.body.onclick = (e) => {
            this.setState({
                showTxtDisplay: 'none',
            })
        }
    }
    //很重要。。。。。
    componentWillUnmount() {
        document.body.onclick = null;
    }
    render() {
        let preWrapStyle = {
            width: this.props.preWidth + 'px',
            height: this.props.preHeight + 'px',
        }
        let preSpanStyle = {
            height: this.props.preHeight + 'px',
            lineHeight: this.props.preHeight + 'px'
        }
        let preUlStyle = {
            display: this.state.showPrvDisplay,
            width: this.props.preWidth + 'px',
            top: this.props.preHeight + 'px',
            transition: '2s',
        }
        let txtWSty = {
            width: this.props.txtWidth + 'px',
            height: this.props.txtHeight + 'px'
        }
        let txtUlSty = {
            display: this.state.showTxtDisplay,
            width: this.props.txtWidth + 'px',
            top: this.props.txtHeight + 'px',
        }
        let btnSty = {
            width: this.props.btnWidth + 'px',
            height: this.props.btnHeight + 'px',
            backgroundSize: this.props.btnBg
        }
        let errorSty = {
            left: '0',
            display: this.state.showTxtDisplay,
            top: Number(this.props.txtHeight) + 5 + 'px',
        }
        let errorSty2 = {
            width: '120px',
            display: this.state.showTxtDisplay,
            left: (Number(this.props.btnWidth) + Number(this.props.txtWidth) + 10 + 'px'),
            top: '10px',
        }
        return (
            <div className="searchInputWrap">
                <div className='left searchPrv' style={preWrapStyle} onMouseEnter={this.showNext.bind(this)} onMouseLeave={this.hideNext.bind(this)}>
                    <span id="showNext" style={preSpanStyle}>{this.state.selected}</span>
                    <ul className='clearfix' style={preUlStyle}>
                        {this.state.selectAray.map(item => <li key={item.value} onClick={this.changeSelcet.bind(this, item)}>{item.name}</li>)}
                    </ul>
                </div>
                <div className="left listWrap" style={txtWSty}>
                    <input type="text" value={this.state.value} onChange={this.change.bind(this)} onKeyUp={this.search.bind(this)} placeholder="请输入" style={txtWSty} />
                    {!this.state.resData.length || this.state.value === '' ?
                        <span className='errorF' style={this.props.position === 'relt' ? errorSty2 : errorSty}>{this.state.errorFont}</span> :
                        <ul className="searchUl" style={txtUlSty} onClick={this.hideSelf.bind(this)}>
                            {/* <li> sdf  <Link to="/persons/22" className="right">查看图谱</Link> </li> */}
                            {this.state.resData.map(item => <li key={item.data}> {item.value}  <Link to={`/persons/${item.data}`} className="right">查看图谱</Link> </li>)}
                        </ul>
                    }
                </div>
                <input type="button" value='搜索' style={btnSty} onClick={this.getList.bind(this)} />
            </div>
        )
    }
    //显示隐藏下拉菜单
    showNext() {
        this.setState({
            showPrvDisplay: 'block',
        })
    }
    hideNext() {
        this.setState({
            showPrvDisplay: 'none',
        })
    }
    //文本框变化
    change(e) {
        this.setState({
            value: e.target.value
        })
    }
    //点击下拉菜单选择
    changeSelcet(item) {
        let name = item.name;
        let changeSelcted = this.state.selected === name ? false : true;
        this.setState({
            selected: name,
            selectedId: item.value,
        }, res => {
            if (changeSelcted) {
                this.setState({
                    showPrvDisplay: 'none',
                    showTxtDisplay: 'none',
                })
            } else {
                this.setState({
                    showPrvDisplay: 'none',
                })
            }

        })
    }
    //搜索
    search(e) {
        if (e.keyCode === 13) {
            this.getList();
        }
    }
    //搜索
    getList() {
        if (this.state.value === '') {
            this.setState({
                showTxtDisplay: 'block',
                errorFont: '请输入查询内容！'
            });
            return;
        }
        post('/graphNew/search.gm', { 'searchType': this.state.selectedId, 'searchNo': this.state.value }).then(res => {
            if (res.data.code === '200') {
                this.setState({
                    resData: res.data.data,
                    showPrvDisplay: 'none',
                    showTxtDisplay: 'block',
                }, res => {
                    if (this.state.resData.length === 0) {
                        this.setState({
                            errorFont: '查询结果为空！'
                        })
                    }
                })
            }
        })
    }
    hideSelf() {
        this.setState({
            showTxtDisplay: 'none',
        })
    }
}
export default SearchInput;