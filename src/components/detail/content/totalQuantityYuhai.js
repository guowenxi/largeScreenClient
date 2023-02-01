import React from "react";
import cssStyle from "./totalQuantityYuhai.module.css";
import { getCompatibleData, getCloseDom, changeThisShow } from "../../../common/detailUtil";
import { interactData } from "../../../common/util";
import { Timeline, Button, Modal } from "antd";
import { Scrollbars } from "react-custom-scrollbars";
import axios from "axios";
export default class AboutPlatform extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.interactData = interactData.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.changeThisShow = changeThisShow.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    sendMessage() {
        const { style } = this.props.thisData;
        const { detail } = this.props;
        if (style.sendMessageUrl && detail && detail.petitionList) {
            const sendData = {
                rbacToken: this.props.token,
                petitionId: detail.petitionList.id,
                controlPeoples: detail.controlPeopleList
            };
            axios.post(style.sendMessageUrl, sendData, { params: { rbacToken: this.props.token } }).then((response) => {
                if (response.data.success) {
                    Modal.success({
                        content: "通知已发送。",
                    });
                } else {
                    Modal.error({
                        content: response.data.message,
                    });
                }
            }).catch((error) => {
                Modal.error({
                    content: '发送通知出错！',
                });
            });
        }
    }

    interactAction(type) {
        const { detail } = this.props;
        if (detail.petitionList) {
            const { warningInteract, urgingInteract, setEndInteract } = this.props.thisData.style;
            if (type === 1) {
                const sendData = { id: detail.detailInfo ? detail.detailInfo.id:null,petitionId:detail.petitionList ? detail.petitionList.id:null };
                this.interactData(warningInteract, sendData);
            } else if (type === 2) {
                const sendData = { id: detail.detailInfo ? detail.detailInfo.id:null,petitionId:detail.petitionList ? detail.petitionList.id:null };
                this.interactData(urgingInteract, sendData);
            } else if (type === 3) {
                const sendData = { id: detail.petitionList.id };
                this.interactData(setEndInteract, sendData);
            }
        }
    }

    render() {
        const { detail } = this.props;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        if (JSON.stringify(detail) === '{}') {
            return '';
        }
        const petitionList = detail.petitionList ? detail.petitionList : {};
        return (
            <div className={cssStyle.box} style={{ ...this.props.style }}>
                {this.getCloseDom(style, compatibleSize)}
                <div className={cssStyle.title} style={{ top: '4%' }}>异动行为</div>
                <div className={cssStyle.behaviorBox}>
                    <Scrollbars>
                        <div className={cssStyle.behaviorTime}>{petitionList.petitionTime}</div>
                        <div className={cssStyle.behaviorThing}>{petitionList.petitionContent}</div>
                    </Scrollbars>
                </div>
                <div className={cssStyle.title} style={{ top: '24%' }}>处置情况</div>
                <div className={cssStyle.disposalBox}>
                    <Scrollbars>
                        <Timeline className={cssStyle.timeline}>
                            {petitionList.recordList && petitionList.recordList.map((item, index) => {
                                return (
                                    <Timeline.Item color="blue" className={cssStyle.fontColor} key={index}>
                                        <div style={{ color: 'white' }}>{item.createTime}</div>
                                        <div style={{ color: 'rgb(0,255,255)' }}>{item.combineContent}</div>
                                    </Timeline.Item>
                                )
                            })}
                        </Timeline>
                    </Scrollbars>
                </div>
                <div className={cssStyle.title} style={{ top: '62%' }}>稳控专班</div>
                <div className={cssStyle.stabilityBox}>
                    <ul className={cssStyle.header}>
                        <li>
                            <p className={cssStyle.titleText}>身 份</p>
                        </li>
                        <li>
                            <p className={cssStyle.titleText}>单位职务</p>
                        </li>
                        <li style={{ width: '15%' }}>
                            <p className={cssStyle.titleText}>姓名</p>
                        </li>
                        <li style={{ width: '25%' }}>
                            <p className={cssStyle.titleText}>联系电话</p>
                        </li>
                        <li>
                            <p className={cssStyle.titleText}>市府短号</p>
                        </li>
                    </ul>
                    <Scrollbars style={{ height: 'calc(100% - 3vh)' }}>
                        {detail.controlPeopleList && detail.controlPeopleList.map((item, index) => {
                            return (
                                <ul key={index} className={cssStyle.content}>
                                    <li>
                                        <p className={cssStyle.titleText}>{item.peopleTypeName}</p>
                                    </li>
                                    <li>
                                        <p className={cssStyle.titleText}>{item.duty}</p>
                                    </li>
                                    <li style={{ width: '15%' }}>
                                        <p className={cssStyle.titleText}>{item.name}</p>
                                    </li>
                                    <li style={{ width: '25%' }}>
                                        <p className={cssStyle.titleText}>{item.phone}</p>
                                    </li>
                                    <li>
                                        <p className={cssStyle.titleText}>{item.goverCornet}</p>
                                    </li>
                                </ul>
                            )
                        })}
                    </Scrollbars>
                    {/* <Scrollbars>
                        <div className={cssStyle.peopleOutBox}>
                            {detail.controlPeopleList && detail.controlPeopleList.map((item, index) => {
                                return (
                                    <div className={cssStyle.peopleBox} key={index}>
                                        <div>{item.peopleTypeName}</div>
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.question}>姓名：</div>
                                            <div className={cssStyle.answer}>{item.name}</div>
                                        </div>
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.question}>单位职务：</div>
                                            <div className={cssStyle.answer}>{item.duty}</div>
                                        </div>
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.question}>手机：</div>
                                            <div className={cssStyle.answer}>{item.phone}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Scrollbars> */}
                </div>
                {petitionList.id && (
                    <div className={cssStyle.buttonBox}>
                        {/*<Button type="primary" onClick={this.sendMessage.bind(this)}>通知</Button>*/}
                        <Button className={cssStyle.floatLeft} type="primary" onClick={this.interactAction.bind(this, 1)}>预警</Button>
                        <Button className={cssStyle.floatLeft} type="danger" onClick={this.interactAction.bind(this, 2)}>催办</Button>
                        <Button className={cssStyle.floatRight} type="primary" onClick={this.interactAction.bind(this, 3)}>结束异动</Button>
                    </div>
                )}
            </div>
        );
    }
}