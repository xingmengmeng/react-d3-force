import React, { Component } from 'react';
export default class SlideDots extends Component {
    render() {
        let dotNodes = [];
        let { count, curIndex } = this.props;
        for (let i = 0; i < count; i++) {
            dotNodes.push(<li key={i} className={i === curIndex ? 'on' : ''} onClick={this.props.turn.bind(this, i)}></li>)
        }
        return (
            <ul className="dots">
                {dotNodes}
            </ul>
        )
    }
}