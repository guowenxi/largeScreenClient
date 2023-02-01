import React from "react";
import Scrollbars from "react-custom-scrollbars";
import cssStyle from "./peopleFive.module.css";

export default class PeopleFive extends React.Component {
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

    getSpecialDetail(detail){
        if(detail.actualState === '脱管'){
            return (
                <React.Fragment>
                    <div className={cssStyle.line}>
                        <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                            <div className={cssStyle.title}>脱管原因：</div>
                            <div className={cssStyle.content}>{detail.detachedReason}</div>
                        </div>
                    </div>
                    <div className={cssStyle.line}>
                        <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                            <div className={cssStyle.title}>存在风险点：</div>
                            <div className={cssStyle.content}>{detail.risk}</div>
                        </div>
                    </div>
                    <div className={cssStyle.line}>
                        <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                            <div className={cssStyle.title}>工作进度：</div>
                            <div className={cssStyle.content}>{detail.progress}</div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }else if(detail.actualState === '外出'){
            return (
                <React.Fragment>
                    <div className={cssStyle.line}>
                        <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                            <div className={cssStyle.title}>外出事由：</div>
                            <div className={cssStyle.content}>{detail.outReason}</div>
                        </div>
                    </div>
                    <div className={cssStyle.line}>
                        <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                            <div className={cssStyle.title}>外出地点：</div>
                            <div className={cssStyle.content}>{detail.outAddress}</div>
                        </div>
                    </div>
                    <div className={cssStyle.line}>
                        <div className={cssStyle.itemBox}>
                            <div className={cssStyle.title}>外出年限：</div>
                            <div className={cssStyle.content}>{detail.yearLimit}</div>
                        </div>
                        <div className={cssStyle.itemBox}>
                            <div className={cssStyle.title}>是否函告：</div>
                            <div className={cssStyle.content}>{detail.isInform}</div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }else{
            return null;
        }
    }

    render() {
        const { detail, loading } = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                {
                    JSON.stringify(detail) === '{}' ? (
                        <div className={cssStyle.noData}>{loading ? '数据加载中...' : '暂无数据'}</div>
                    ) : (
                        <Scrollbars>
                            <div className={cssStyle.line}>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>姓名：</div>
                                    <div className={cssStyle.content}>{detail.name}</div>
                                </div>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>身份证号：</div>
                                    <div className={cssStyle.content}>{detail.cardId}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>随访状态：</div>
                                    <div className={cssStyle.content}>{detail.followUpState}</div>
                                </div>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>管控类型：</div>
                                    <div className={cssStyle.content}>{detail.controlStatus}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                {/*<div className={cssStyle.itemBox}>*/}
                                {/*    <div className={cssStyle.title}>是否双管控：</div>*/}
                                {/*    <div className={cssStyle.content}>{detail.isTwoControl}</div>*/}
                                {/*</div>*/}
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>监护人姓名：</div>
                                    <div className={cssStyle.content}>{detail.guardian}</div>
                                </div>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>监护人电话：</div>
                                    <div className={cssStyle.content}>{detail.guardianPhone}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>监护人　<br />与患者关系：</div>
                                    <div className={cssStyle.content}>{detail.guardianRelation}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>随访周期要求：</div>
                                    <div className={cssStyle.content}>{detail.followUpPeriod}</div>
                                </div>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>要求随访时间：</div>
                                    <div className={cssStyle.content}>{detail.followUpTime}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.title}>人员现实状态：</div>
                                    <div className={cssStyle.content}>{detail.actualState}</div>
                                </div>
                            </div>
                            {/*{this.getSpecialDetail(detail)}*/}
                            <div className={cssStyle.line}>
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>所属管理辖区：</div>
                                    <div className={cssStyle.content}>{detail.roadName}</div>
                                </div>
                            </div>
                            <div className={cssStyle.line}>
                                <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                    <div className={cssStyle.title}>人员现住址：</div>
                                    <div className={cssStyle.content}>{detail.address}</div>
                                </div>
                            </div>
                        </Scrollbars>
                    )
                }
            </div>
        );
    }
}