import React,{Component} from 'react';
import './index.less';
export default class Bounce extends Component{
    render(){
        return(
            <section className='overLay' style={{display:this.props.isShowBounce}}>
                <div className='boxWrap'>{this.props.content}</div>
            </section>
        )
    }
}