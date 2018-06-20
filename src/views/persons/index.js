import React, { Component } from 'react';
import './index.less';
export default class Persons extends Component {
    constructor() {
        super();
        this.state = {
            id: '',
        }
    }
    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({
            id: id,
        }, () => {
            console.log(this.state.id);
        })
    }
    render() {
        return (
            <section>
               人群查询：id为：{this.state.id}
            </section>
        )
    }
}