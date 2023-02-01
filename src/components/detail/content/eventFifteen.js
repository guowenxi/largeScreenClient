import React from "react";
import cssStyle from './eventThirteen.module.css';
import {Scrollbars} from "react-custom-scrollbars";

export default class EventFifteen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const { detail } = this.props;
        if (detail == null) {
            return '';
        }
        return (
            <div style={this.props.style} className={`${cssStyle.box} ${cssStyle.boxTwo}`} >
                <div className={cssStyle.contentBox}>
                    <Scrollbars>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>事件名称：</div>
                            <div className={cssStyle.contentOne}>{detail.title}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>来源编号：</div>
                            <div className={cssStyle.contentOne}>{detail.sourceId}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>预警等级：</div>
                            <div className={cssStyle.contentOne}>{detail.warningLevelName}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>事件类别：</div>
                            <div className={cssStyle.contentOne}>{detail.eventTypesName}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>事发时间：</div>
                            <div className={cssStyle.contentOne}>{detail.incidentTime}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>所属街道：</div>
                            <div className={cssStyle.contentOne}>{detail.roadName}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>事发地点：</div>
                            <div className={cssStyle.contentOne}>{detail.incidentAddress}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>事件来源：</div>
                            <div className={cssStyle.contentOne}>{detail.sourceTypeName}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div className={cssStyle.title}>事件概述：</div>
                            <div className={cssStyle.contentOne}>{detail.incidentContent}</div>
                        </div>
                    </Scrollbars>
                </div>
                <div className={cssStyle.contentBox}>
                    <div className={cssStyle.row}>
                        <div className={cssStyle.title}>处置进展：</div>
                    </div>
                    <div className={cssStyle.listBox}>
                        <div className={`${cssStyle.listRow} ${cssStyle.titleRow}`}>
                            <div>处理人</div>
                            <div>处理时间</div>
                            <div>部门</div>
                            <div>联系方式</div>
                            <div>处理意见</div>
                        </div>
                        <div className={cssStyle.listScrollBox}>
                            <Scrollbars >
                                {detail.eventFlowList && detail.eventFlowList.map((item,index)=>
                                    <div className={cssStyle.listRow} key={index}>
                                        <div>{item.createUser}</div>
                                        <div>{item.createDate}</div>
                                        <div>{item.source}</div>
                                        <div>{item.phone}</div>
                                        <div>{item.dealDescription}</div>
                                    </div>
                                )}
                            </Scrollbars>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}