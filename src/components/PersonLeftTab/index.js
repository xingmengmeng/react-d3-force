import React, { Component } from 'react';
import './index.less';
export default class PersonLeftTab extends Component {
    render() {
        return (
            <section className="tabWrap" id="pleftT">
                <table width="100%">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>进件编号<br />产品类型</th>
                            <th>申请状态<br />申请时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                            <td>1</td>
                            <td>
                                <span>MJ002</span>
                                <span>美借</span>
                            </td>
                            <td>
                                <span>审核中</span>
                                <span className="time">2018-5-1</span>
                            </td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>
                                <span className="blueF">MJ002</span>
                                <span>美借</span>
                            </td>
                            <td>
                                <span>审核中</span>
                                <span className="time">2018-5-1</span>
                            </td>
                        </tr> */}
                        {this.props.detailData.map((item,index) =>
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>
                                    <span className={item.applyStatus==='通过'?'blueF':''}>{item.appNo}</span>
                                    <span>{item.productType}</span>
                                </td>
                                <td>
                                    <span>{item.applyStatus}</span>
                                    <span className="time">{item.examineTime}</span>
                                </td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </section>
        )
    }
}