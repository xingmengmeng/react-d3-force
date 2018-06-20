import React,{Component} from 'react';
import './index.less';
export default class LeftTabList extends Component{
    render(){
        return(
            <section className="tabWrap">
                <table width="100%">
                    <thead>
                        <tr>
                            <th width="60">关联类型</th>
                            <th>关联<br/>进件数</th>
                            <th>关联<br/>客户数</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>一级关联</td>
                            <td className="blueF">3</td>
                            <td className="blueF">1</td>
                        </tr>
                        <tr>
                            <td>二级关联</td>
                            <td className="blueF">3</td>
                            <td className="blueF">1</td>
                        </tr>
                        <tr>
                            <td>审核关联</td>
                            <td className="blueF">3</td>
                            <td className="blueF">1</td>
                        </tr>
                        <tr>
                            <td>逾期关联</td>
                            <td className="blueF">3</td>
                            <td className="blueF">1</td>
                        </tr>
                        <tr>
                            <td>拒绝关联</td>
                            <td className="blueF">3</td>
                            <td className="blueF">1</td>
                        </tr>
                        <tr>
                            <td>黑名单关联</td>
                            <td className="blueF">3</td>
                            <td className="blueF">1</td>
                        </tr>
                        <tr>
                            <td>灰名单关联</td>
                            <td className="blueF">3</td>
                            <td className="blueF">1</td>
                        </tr>
                        <tr>
                            <td>审批通过关联</td>
                            <td className="blueF">3</td>
                            <td className="blueF">1</td>
                        </tr>
                        <tr>
                            <td>正常还款关联</td>
                            <td className="blueF">3</td>
                            <td className="blueF">1</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        )
    }
}