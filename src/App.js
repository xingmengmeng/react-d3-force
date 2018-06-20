import React, { Component } from 'react';

import RouterMap from './routers/index';
import Loading from './components/Loading'
import store from './store';
import {connect} from 'react-redux';


class App extends Component {
  constructor() {
    super();
    this.state = {
      showLoading: store.getState().showLoading
    }
  }
  componentDidMount() {
    this.setState({
      showLoading: store.getState().showLoading
    })
    // store.subscribe(() =>
    //   this.setState({
    //     showLoading: store.getState().showLoading
    //   })
    // )  如果不用react-redux的话需要redux中的此方法来订阅render函数
  }
  render() {
    return (
      <div className="allWrap">
        <RouterMap></RouterMap>
        {this.props.showLoading ? <Loading ></Loading> : ''}
      </div>
    );
  }
}

export default connect(
  state=>{   //state为形参  相当于store中的store.state  前面的key showLoading为当前页面中使用的参数名  如上this.props.showLoading
    return{
      showLoading:state.showLoading
    }
  }
)(App);
