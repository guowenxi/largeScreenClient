import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";

export default class Detail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.detailAttributeList = [
            {name:'事件名称',key:'title'},
            {name:'事件类别',key:'eventTypeName'},
            {name:'事发时间',key:'incidentTime'},
            {name:'所属街道',key:'roadName'},
            {name:'事发地点',key:'incidentAddress'},
            {name:'事件等级',key:'warningLevelName'},
            {name:'事件来源',key:'sourceTypeName'},
            {name:'影响范围',key:'influence'},
            {name:'事件发展趋势',key:'trends'},
            {name:'已采取措施',key:'measuresTaken'},
            {name:'备注',key:'remark'},
        ];
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        const {show,detail,changeEditShow} = this.props;
        return (
            <Motion style={{left:spring(show ? 0 : -100)}}>
                {({left}) =>
                    <div style={{left:left+'%'}} className={cssStyle.detailContent}>
                        {this.detailAttributeList.map((item,index) =>
                            <div className={cssStyle.detailAttribute} key={index}>
                                <div className={cssStyle.attributeTitle}>{item.name}</div>
                                <div className={cssStyle.attributeContent}>{detail[item.key]}</div>
                            </div>
                        )}
                        {detail.isstart === 0 && (
                            <div className={cssStyle.discussButton} onClick={changeEditShow}>
                                分析研判
                            </div>
                        )}
                    </div>
                }
            </Motion>
        );
    }
}