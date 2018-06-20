import React,{Component} from 'react';
export default class SliderItem extends Component{
    render(){
        let {item}=this.props;
        return(
            <li>
                <img src={item.src} alt=""/>
            </li>
        )
    }
}