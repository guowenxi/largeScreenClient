import React from "react";
import cssStyle from "./planDetailOne.module.css";

import Icon from "../images/iconFive.png";

export default class PlanDetailOne extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {time:[]};
        this.unit = ['天','小时','分','秒'];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.startTime();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime && this.props.thisData.showStatus){
            //组件数据源变更时重新计算时间
            this.startTime();
        }
    }

    startTime(){
        clearTimeout(this.timer);
        const {detail} = this.props;
        if(detail.startTime){
            const startTime = new Date(detail.startTime).getTime();
            const nowTime = new Date().getTime();
            const subTime = nowTime - startTime;
            const day = Math.floor(subTime/(24*60*60*1000));
            const remainHour = subTime%(24*60*60*1000);
            const hour = Math.floor(remainHour/(60*60*1000));
            const remainMin = remainHour%(60*60*1000);
            const min =  Math.floor(remainMin/(60*1000));
            const sec = Math.floor((remainMin%(60*1000))/1000);
            this.setState({time:[day,hour,min,sec]})
        }
        this.timer = setTimeout(()=>{
            this.startTime();
        },1000);
    }

    render() {
        const {detail} = this.props;
        const {time} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.headBox}>
                    <div className={cssStyle.headIcon}>
                        <img alt={''} src={Icon} />
                    </div>
                    <div className={cssStyle.headTextBox}>
                        <div>{detail.name}</div>
                        <div>预案指挥长：{detail.leader}</div>
                    </div>
                    <div className={cssStyle.statusButton}>启动中</div>
                </div>
                <div className={cssStyle.line} />
                <div className={cssStyle.row}>
                    <div className={`${cssStyle.tag} ${cssStyle.red}`}>牵头部门</div>
                </div>
                {detail.leaderDep && Array.isArray(detail.leaderDep) && detail.leaderDep.map((dep,index)=>
                    <div className={cssStyle.row} key={index}>
                        <div className={cssStyle.dep}>{dep.depName}</div>
                        <div className={cssStyle.type}>负责人</div>
                        <div className={cssStyle.name}>{dep.name}</div>
                        <div className={cssStyle.phone}>{dep.phone}</div>
                    </div>
                )}
                <div className={cssStyle.row}>
                    <div className={`${cssStyle.tag} ${cssStyle.green}`}>协同部门</div>
                </div>
                {detail.assistDep && Array.isArray(detail.assistDep) && detail.assistDep.map((dep,index)=>
                    <div className={cssStyle.row} key={index}>
                        <div className={cssStyle.dep}>{dep.depName}</div>
                        <div className={cssStyle.type}>负责人</div>
                        <div className={cssStyle.name}>{dep.name}</div>
                        <div className={cssStyle.phone}>{dep.phone}</div>
                    </div>
                )}
                <div className={cssStyle.row}>
                    <div className={`${cssStyle.tag} ${cssStyle.yellow}`}>预案已运行时间</div>
                </div>
                <div className={cssStyle.timeRow}>
                    {time.map((item,index)=>{
                        return item ? (
                            <React.Fragment key={index}>
                                <div>{item}</div>
                                <div className={cssStyle.unit}>{this.unit[index]}</div>
                            </React.Fragment>
                        ):null;
                    })}
                </div>
            </div>
        );
    }
}