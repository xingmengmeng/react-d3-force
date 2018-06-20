import React, { Component } from 'react';
export default class SliderArrows extends Component {
    render() {
        return (
            <section>
                <a id="left" style={{ display: this.props.display }} className="left" onClick={this.props.clickFn.bind(this, -1)}>左</a>
                <a id="right" style={{ display: this.props.display }} className="right" onClick={this.props.clickFn.bind(this, 1)}>右</a>
            </section>
        )
    }
}