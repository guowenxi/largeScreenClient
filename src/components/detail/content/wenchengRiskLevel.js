/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./wenchengRiskLevel.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { interactData } from "../../../common/util";
import icon1 from '../images/wenchengRiskLevelOne.png';
import icon2 from '../images/wenchengRiskLevelTwo.png';


export default class EventTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.interactData = interactData.bind(this);
        this.levelRef = React.createRef();
    }

    //组件加载触发函数
    componentDidMount() {
    }
    //组件删除时触发函数
    componentWillUnmount() {
    }
    getMarginLeft(score, levelWidth, gradeScoreList) {
        if (!Array.isArray(gradeScoreList)) {
            return 0;
        }
        const [a, b, c, d] = gradeScoreList;
        const offsetWidth = levelWidth / 3;
        score = Number(score);
        if (score > a && score <= b) {
            return (score - a) / (b - a) * offsetWidth + 'px';
        } else if (score > b && score <= c) {
            return (score - b) / (c - b) * offsetWidth + offsetWidth + 'px';
        } else if (score > c && score <= d) {
            return (score - c) / (d - c) * offsetWidth + offsetWidth * 2 + 'px';
        }
    }
    render() {
        const { detail } = this.props;
        const levelWidth = this.levelRef.current ? this.levelRef.current.offsetWidth : 0;
        return (
            <div style={this.props.style} className={cssStyle.container} >
                <div style={{ height: '50%' }}>
                    <span style={{ fontSize: '1.1em' }}>风险等级：</span>
                    <div className={cssStyle.levelBody}>
                        <div className={cssStyle.scoreBox} style={{ marginLeft: this.getMarginLeft(detail.eventRiskScore, levelWidth, detail.riskGradeScoreList), }}>
                            <div className={cssStyle.score}>{detail.eventRiskScore}分</div>
                            <img alt="" className={cssStyle.icon1} src={icon1} />
                        </div>
                        <div className={cssStyle.levelBox} ref={this.levelRef} >
                            <div className={cssStyle.levelBlue}>低</div>
                            <div className={cssStyle.levelOrange}>中</div>
                            <div className={cssStyle.levelRed}>高</div>
                        </div>
                        <div style={{ marginLeft: this.getMarginLeft(detail.eventRiskScore, levelWidth, detail.riskGradeScoreList), }}>
                            <img alt="" className={cssStyle.icon2} src={icon2} />
                        </div>
                        <div className={cssStyle.scoreList}>
                            {
                                Array.isArray(detail.riskGradeScoreList) && detail.riskGradeScoreList.map((item, index) => {
                                    return (
                                        <span className={cssStyle.scoreItem} key={index}>{item}</span>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div style={{ height: '50%' }}>
                    <span style={{ fontSize: '1.1em' }}>详细得分：</span>
                    <div className={cssStyle.listBody}>
                        <div className={cssStyle.listBox}
                            style={{
                                marginBottom: '1em',
                                color: '#00dcdf',
                                backgroundColor: '#063053',
                                fontSize: '1.1em',
                                lineHeight: '4vh'
                            }}
                        >
                            <div className={cssStyle.listItem}>纬度</div>
                            <div className={cssStyle.listItem}>内容</div>
                            <div className={cssStyle.listItem}>分数</div>
                        </div>
                        <Scrollbars style={{ width: '100%', height: 'calc(100% - 4vh)' }}>
                            {
                                Array.isArray(detail.eventRiskRecordList) && detail.eventRiskRecordList.map((item, index, arr) => {
                                    return (
                                        <div
                                            className={cssStyle.listBox}
                                            key={index}
                                            style={{ borderBottom: index !== arr.length - 1 ? '1px solid rgba(255,255,255,0.8)' : 'none' }}
                                        >
                                            <div className={cssStyle.listItem}>{item.dimension}</div>
                                            <div className={cssStyle.listItem}>{item.content}</div>
                                            <div className={cssStyle.listItem}>{item.score}</div>
                                        </div>
                                    )
                                })
                            }
                        </Scrollbars>
                    </div>
                </div>
            </div>
        );
    }
}