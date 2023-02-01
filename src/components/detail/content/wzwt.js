import React from "react";
import cssStyle from "./wzwt.module.css";
import up from "../images/up.svg"
import down from "../images/down.svg"
import yujingjiankong from "../images/yujingjiankong.svg"
import { Scrollbars } from "react-custom-scrollbars";
import closeTypeOne from "../../../common/images/closeTypeOne.svg";
import { interactData } from "../../../common/util";
export default class CheckTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showEdit: false, pageIndex: 0 };
        this.refDom = React.createRef();
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    interact() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {});
    }

    render() {
        const { detail } = this.props;
        return (
            <div className={cssStyle.box} style={this.props.style}>
                <div className={cssStyle.titleBox}>
                    <div className={cssStyle.title}>{detail.road}</div>
                </div>
                <img
                    alt="" style={{ width: '2.5vh',height:'2.5vh', right: '2vh', position: 'absolute', top: '1.5vh' }}
                    src={closeTypeOne}
                    onClick={this.interact.bind(this)}
                />
                <div className={cssStyle.contentBox}>
                    <Scrollbars>
                        {detail.pic && <img alt="" src={detail.pic} className={cssStyle.img} />}
                        <div className={cssStyle.monitorDetail}>
                            <div className={cssStyle.monitorDetailItem}>
                                <div className={cssStyle.monitorDetailItemOne}>
                                    <div className={cssStyle.question}>抓拍数量：</div>
                                    <div className={cssStyle.answer}>{detail.capture}</div>
                                </div>
                                <div className={cssStyle.monitorDetailItemOne}>
                                    <div className={cssStyle.question}>类型：</div>
                                    <div className={cssStyle.answer}>{detail.monitorType}</div>
                                </div>
                            </div>
                            <div className={cssStyle.monitorDetailItem}>
                                <div style={{ display: 'flex' }}>
                                    <div className={cssStyle.question}>地点：</div>
                                    <div className={cssStyle.answer}>{detail.address}</div>
                                </div>
                            </div>
                        </div>
                        <div className={cssStyle.statisticsDetial}>
                            <div className={cssStyle.monthBox} style={{padding:'0.5em 1em 0em'}}>
                                <div className={cssStyle.rectOne} />
                                <div className={cssStyle.statisticsTitle}>本月违停统计</div>
                                <div className={cssStyle.statisticsContent}>
                                    <img alt="" src={detail.monthType === 0 ? up : down} className={cssStyle.icon} />
                                    <div className={cssStyle.numOne}>{detail.monthCompare}</div>
                                    <div className={cssStyle.compare}>{detail.monthType === 0 ? '较上月增加' : '较上月减少'}</div>
                                </div>
                            </div>
                            <div className={cssStyle.detailItem} style={{padding:'0em 0.5em'}}>
                                <div className={cssStyle.item}>
                                    <div className={cssStyle.numOne}>{detail.monthWarningNum}</div>
                                    <div className={cssStyle.question}>预警总数</div>
                                </div>
                                <div className={cssStyle.item}>
                                    <div className={cssStyle.numOne}>{detail.monthRectificationNum}</div>
                                    <div className={cssStyle.question}>整改数量</div>
                                </div>
                                <div className={cssStyle.item}>
                                    <div className={cssStyle.numOne}>{detail.monthParkingNum}</div>
                                    <div className={cssStyle.question}>违停数量</div>
                                </div>
                            </div>
                            <div className={cssStyle.monthBox} style={{padding:'0em 1em'}}>
                                <div className={cssStyle.rectTwo} />
                                <div className={cssStyle.statisticsTitle}>今日违停统计</div>
                                <div className={cssStyle.statisticsContent}>
                                    <img alt="" src={detail.dayType === 0 ? up : down} className={cssStyle.icon} />
                                    <div className={cssStyle.numTwo}>{detail.dayCompare}</div>
                                    <div className={cssStyle.compare}>{detail.dayType === 0 ? '较昨日增加' : '较昨日减少'}</div>
                                </div>
                            </div>
                            <div className={cssStyle.detailItem} style={{padding:'0em 0.5em 0.5em'}}>
                                <div className={cssStyle.item}>
                                    <div className={cssStyle.numTwo}>{detail.dayWarningNum}</div>
                                    <div className={cssStyle.question}>预警总数</div>
                                </div>
                                <div className={cssStyle.item}>
                                    <div className={cssStyle.numTwo}>{detail.dayRectificationNum}</div>
                                    <div className={cssStyle.question}>整改数量</div>
                                </div>
                                <div className={cssStyle.item}>
                                    <div className={cssStyle.numTwo}>{detail.dayParkingNum}</div>
                                    <div className={cssStyle.question}>违停数量</div>
                                </div>
                            </div>
                        </div>
                        <div className={cssStyle.warningBox}>
                            <div className={cssStyle.warningTitle}>
                                <img alt="" src={yujingjiankong} className={cssStyle.warningImg} />
                                <div className={cssStyle.question}>智能预警</div>
                            </div>
                        </div>
                        <div>
                            {detail.warningStop && detail.warningStop.map((item, index) => {
                                return (
                                    <div className={cssStyle.scrollBox} key={index}>
                                        <div className={cssStyle.carNumber}>{item.carNumber}</div>
                                        <div className={cssStyle.stop}>本月共计违停<span style={{ color: 'rgb(254,184,81)' }}>{item.num}</span>次</div>
                                        <div className={cssStyle.time}>{item.time}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </Scrollbars>
                </div>

            </div>
        );
    }
}