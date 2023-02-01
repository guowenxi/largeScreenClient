import React from "react";
import cssStyle from './formDetail.module.css';

export default class FormDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selected:0};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const { detail } = this.props;
        return (
            <div style={this.props.style} className={`${cssStyle.box}`} >
                <div className={cssStyle.titleBox}>
                    <div className={cssStyle.line} />
                    <div>基本信息</div>
                </div>
                <table>
                    <tbody>
                    <tr>
                        <td className={cssStyle.title}>姓名</td>
                        <td>{detail.name}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.title}>证件号码</td>
                        <td>{detail.cardId}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.title}>联系方式</td>
                        <td>{detail.phone}</td>
                    </tr>
                    </tbody>
                </table>
                <div className={cssStyle.titleBox}>
                    <div className={cssStyle.line} />
                    <div>流动信息</div>
                </div>
                <table>
                    <tbody>
                    <tr>
                        <td className={cssStyle.title}>是否境内</td>
                        <td>{detail.isTerritory+''==='1' ? '境内':'境外'}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.title}>出发地区</td>
                        {/*<td>{detail.isTerritory+''==='1' ? detail.fromArea:detail.fromOrgCountry}</td>*/}
                        {/*<td>{detail.fromOrgCountry}{detail.fromOrgProvinceName}{detail.fromOrgCityName}</td>*/}
                        <td>{detail.fromArea}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.title}>返乐时间</td>
                        <td>{detail.returnDate}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.title}>交通方式</td>
                        <td>{detail.transportationType}</td>
                    </tr>
                    </tbody>
                </table>
                <div className={cssStyle.titleBox}>
                    <div className={cssStyle.line} />
                    <div>居住信息</div>
                </div>
                <table>
                    <tbody>
                    <tr>
                        <td className={cssStyle.title}>现居住镇街</td>
                        <td>{detail.orgRoadName}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.title}>现居住村社</td>
                        <td>{detail.orgCommunityName}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.title}>在乐居住地址</td>
                        <td>{detail.livedAddress}</td>
                    </tr>
                    </tbody>
                </table>
                <div className={cssStyle.titleBox}>
                    <div className={cssStyle.line} />
                    <div>核酸检测信息</div>
                </div>
                <table>
                    <tbody>
                    <tr>
                        <td className={cssStyle.title}>是否核酸检测</td>
                        <td>{detail.fileId ? '是':'否'}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}