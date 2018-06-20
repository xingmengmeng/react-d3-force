import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
            resData: [1,2],
            selectAray:[
                {name:'电话',value:'phone'},
                {name:'身份证',value:'cards'},
                {name:'进件编号',value:'pushId'},
            ],
            selected:'电话',
        }
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
            left:'0',
            display: this.state.showTxtDisplay,
            top: Number(this.props.txtHeight) + 5 + 'px',
        }
        let errorSty2={
            width:'120px',
            display: this.state.showTxtDisplay,
            left:(Number(this.props.btnWidth)+Number(this.props.txtWidth)+10+'px'),
            top:'10px',
        }
        return (
            <div className="searchInputWrap">
                <div className='left searchPrv' style={preWrapStyle}>
                    <span onClick={this.showNext.bind(this)} style={preSpanStyle}>{this.state.selected}</span>
                    <ul className='clearfix' style={preUlStyle}>
                        {this.state.selectAray.map(item=><li key={item.value} onClick={this.changeSelcet.bind(this,item)}>{item.name}</li>)}
                    </ul>
                </div>
                <div className="left listWrap" style={txtWSty}>
                    <input type="text" value={this.state.value} onChange={this.change.bind(this)} onKeyUp={this.search.bind(this)} placeholder="请输入" style={txtWSty} />
                    {!this.state.resData.length ?
                        <span className='errorF' style={this.props.position==='relt'?errorSty2:errorSty}>查询结果不存在！</span> :
                        <ul style={txtUlSty}>
                            <li> sdf  <Link to="/persons/22" className="right">查看图谱</Link> </li>
                            <li> sdf  <Link to="/persons/22" className="right">查看图谱</Link> </li>
                            <li> sdf  <Link to="/persons/22" className="right">查看图谱</Link> </li>
                            <li> sdf  <Link to="/persons/22" className="right">查看图谱</Link> </li>
                            <li> sdf  <Link to="/persons/22" className="right">查看图谱</Link> </li>
                            <li> sdf  <Link to="/persons/22" className="right">查看图谱</Link> </li>
                            <li> sdf  <Link to="/persons/22" className="right">查看图谱</Link> </li>
                            <li> sdf  <Link to="/persons/22" className="right">查看图谱</Link> </li>
                        </ul>
                    }
                </div>
                <input type="button" value='搜索' style={btnSty} onClick={this.getList.bind(this)} />
            </div>
        )
    }
    //显示隐藏下拉菜单
    showNext() {
        if (this.state.showPrvDisplay === 'none') {
            this.setState({
                showPrvDisplay: 'block',
            })
        } else {
            this.setState({
                showPrvDisplay: 'none',
            })
        }
    }
    //文本框变化
    change(e) {
        this.setState({
            value: e.target.value
        })
    }
    //点击下拉菜单选择
    changeSelcet(item){
        this.setState({
            selected:item.name,
        },res=>{
            this.setState({
                showPrvDisplay: 'none',
                showTxtDisplay: 'none',
            })
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
        this.setState({
            showPrvDisplay: 'none',
            showTxtDisplay: 'block',
        })
    }
}
export default SearchInput;