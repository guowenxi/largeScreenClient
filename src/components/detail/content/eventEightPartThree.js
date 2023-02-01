import React from "react";
import cssStyle from './eventEightPartTwo.module.css';
import Scrollbars from "react-custom-scrollbars";
import {Steps} from 'antd';
import './eventEightPartTwo.css';

export default class EventEightPartTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.pointList = [{name:'预警事件流转',num:1,nowNum:[0]},{name:'预警事件分配',num:2,nowNum:[1]},{name:'预警事件处理',num:3,nowNum:[2]},{name:'调整风险等级',num:4,nowNum:[3]}];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    //组件加载触发函数
    componentDidMount() {
    }

    getItemContent(item){
        switch (item.type) {
            case 0:
                return (
                    <table className={cssStyle.table}>
                        <tbody>
                        <tr>
                            <td className={cssStyle.title}>预警楼盘</td>
                            <td className={cssStyle.tdContentTwo}>{item.buildingName}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.title}>预警开发商</td>
                            <td className={cssStyle.tdContentTwo}>{item.devName}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.title}>预警描述</td>
                            <td className={cssStyle.tdContentTwo}>{item.eventInfo}</td>
                        </tr>
                        </tbody>
                    </table>
                );
            case 1:
                return (
                    <table className={cssStyle.table}>
                        <tbody>
                        <tr>
                            <td className={cssStyle.title}>责任科室</td>
                            <td className={cssStyle.tdContentTwo} colSpan={3}>{item.deptName}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.title}>分配人</td>
                            <td className={cssStyle.tdContentOne}>{item.conductor}</td>
                            <td className={cssStyle.title}>联系方式</td>
                            <td className={cssStyle.tdContentOne}>{item.phone}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.title}>处理意见</td>
                            <td className={cssStyle.tdContentTwo} colSpan={3}>{item.opinion}</td>
                        </tr>
                        </tbody>
                    </table>
                );
            case 2:
                return (
                    <table className={cssStyle.table}>
                        <tbody>
                        <tr>
                            <td className={cssStyle.title}>责任科室</td>
                            <td className={cssStyle.tdContentTwo} colSpan={3}>{item.deptName}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.title}>处理人</td>
                            <td className={cssStyle.tdContentOne}>{item.conductor}</td>
                            <td className={cssStyle.title}>联系方式</td>
                            <td className={cssStyle.tdContentOne}>{item.phone}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.title}>处理结果</td>
                            <td className={cssStyle.tdContentTwo} colSpan={3}>{item.opinion}</td>
                        </tr>
                        </tbody>
                    </table>
                );
            case 3:
                return (
                    <table className={cssStyle.table}>
                        <tbody>
                        <tr>
                            <td className={cssStyle.title}>责任科室</td>
                            <td className={cssStyle.tdContentTwo} colSpan={3}>{item.deptName}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.title}>处理人</td>
                            <td className={cssStyle.tdContentOne}>{item.conductor}</td>
                            <td className={cssStyle.title}>联系方式</td>
                            <td className={cssStyle.tdContentOne}>{item.phone}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.title}>风险等级调整</td>
                            <td className={cssStyle.tdContentTwo} colSpan={3}>{item.changeState}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.title}>调整说明</td>
                            <td className={cssStyle.tdContentTwo} colSpan={3}>{item.opinion}</td>
                        </tr>
                        </tbody>
                    </table>
                );
            default:
        }
    }

    render() {
        const { detail } = this.props;
        const stepNum = detail && Array.isArray(detail) && detail.length > 0 ? detail[0].type : 0;
        return (
            <div style={this.props.style} className={`${cssStyle.box}`} >
                <div className={`${cssStyle.titleBox} eventEightPartTwoStep`}>
                    <Steps>
                        {this.pointList.map((item,index)=>
                            <Steps.Step title={item.name} key={index} status={stepNum >= item.num ? 'finish':(item.nowNum.indexOf(stepNum) >= 0 ? 'process':'wait')} />
                        )}
                    </Steps>
                </div>
                <div className={cssStyle.contentBox}>
                    <Scrollbars>
                        {detail && Array.isArray(detail) && detail.map((item,index)=>
                            <div className={cssStyle.itemBox} key={index}>
                                <div className={cssStyle.lineBox} >
                                    <div className={cssStyle.line} />
                                </div>
                                <div className={cssStyle.nodeName}>
                                    <div className={cssStyle.pointBox}>
                                        <div className={`${cssStyle.point} ${item.createTime ? cssStyle.pointEnd:''}`} />
                                    </div>
                                    <div>{item.title}</div>
                                </div>
                                <div className={cssStyle.time}>{item.createTime.split('T').join(' ')}</div>
                                {this.getItemContent(item)}
                            </div>
                        )}
                    </Scrollbars>
                </div>
            </div>
        );
    }
}