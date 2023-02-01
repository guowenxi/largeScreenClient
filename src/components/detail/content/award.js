import React from "react";
import cssStyle from "./eventStep.module.css";
import CloseIcon from "../images/closeOne.png";

export default class EventStepOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.planName = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    closeThis(){
        this.props.changeThisShow(false,true);
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.backgroundBox}>
                    <div className={cssStyle.contentBox}>
                        <table className={cssStyle.table}>
                            <tbody>
                            <tr>
                                <td width='25%' className={cssStyle.title}>MZX防控节点</td>
                                <td width='25%' >{detail.point}</td>
                                <td width='25%' className={cssStyle.title}>开始时间</td>
                                <td width='25%' >{detail.startTime}</td>
                            </tr>
                            <tr>
                                <td width='25%' className={cssStyle.title}>排查异常对象</td>
                                <td width='25%' >{detail.object}</td>
                                <td width='25%' className={cssStyle.title}>网格员</td>
                                <td width='25%' >{detail.grid}</td>
                            </tr>
                            <tr>
                                <td colSpan={4} className={cssStyle.title}>排查走访时，发现存在异常情况</td>
                            </tr>
                            {detail.abnormal && detail.abnormal.map((item,index)=>
                                <tr key={index}>
                                    <td colSpan={4} className={cssStyle.content}>{item}</td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan={4} className={cssStyle.title}>现场照片</td>
                            </tr>
                            <tr>
                                <td colSpan={4} >
                                    {detail.imgList && detail.imgList.map((item,index)=>
                                        <img alt={''} src={item} key={index} className={cssStyle.img}/>
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)}/>
                </div>
            </div>
        );
    }
}