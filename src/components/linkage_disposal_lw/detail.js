import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";

export default class Detail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.detailAttributeList = [
            {name:'事件名称',key:'eventTitle'},
            {name:'事件类别',key:'eventTypeList'},
            {name:'事发时间',key:'eventDate'},
            {name:'所属街道',key:'roadName'},
            {name:'事发地点',key:'eventLocation'},
            {name:'预警等级',key:'eventLevelValue'},
            {name:'事件来源',key:'eventSourceValue'},
            {name:'事件概述',key:'eventContent'},
            {name:'主持人',key:'dominatorsName',type:2},
            {name:'参与人员',key:'participatorsName',type:2},
            {name:'事件内容',key:'judgedEventContent',type:2},
            {name:'分析过程',key:'analysisProcedure',type:2},
            {name:'最终决策',key:'finalDecision',type:2},
            // {name:'影响范围',key:'influence'},
            // {name:'事件发展趋势',key:'trends'},
            // {name:'已采取措施',key:'measuresTaken'},
            // {name:'备注',key:'remark'},
        ];
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    getContent(key,detail){
        if(key === 'eventTypeList' && detail[key]){
            return detail[key].map((item)=>{return item.eventTypeName}).join('，');
        }else{
            return detail[key];
        }
    }

    render() {
        const {show,detail,changeEditShow} = this.props;
        return (
            <Motion style={{left:spring(show ? 0 : -100)}}>
                {({left}) =>
                    <div style={{left:left+'%'}} className={cssStyle.detailContent}>
                        <Scrollbars className={'blueScrollbars'} >
                            {detail.id && this.detailAttributeList.map((item,index) =>{
                                if((item.type === 2 && detail.eventState > 2) || item.type !== 2){
                                    return (
                                        <div className={cssStyle.detailAttribute} key={index}>
                                            <div className={cssStyle.attributeTitle}>{item.name}</div>
                                            <div className={cssStyle.attributeContent}>{this.getContent(item.key,detail)}</div>
                                        </div>
                                    )
                                }else{
                                    return null;
                                }
                            })}
                            {detail.eventState+'' === '2' && (
                                <div className={cssStyle.discussButton} onClick={changeEditShow}>
                                    分析研判
                                </div>
                            )}
                        </Scrollbars>
                    </div>
                }
            </Motion>
        );
    }
}