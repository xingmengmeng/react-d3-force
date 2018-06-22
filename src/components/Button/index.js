import React,{Component} from 'react';
import './index.less';
export default class Button extends Component{
    render(){
        return(
            <input className="button-btns" type="button" value={this.props.defaultValue}/>
        )
    }
} 