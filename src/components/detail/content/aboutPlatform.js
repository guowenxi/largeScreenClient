import React from "react";
import cssStyle from "./aboutPlatform.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {getCompatibleData} from "../../../common/detailUtil";

import Icon from "../images/triangle.png";
import pointIcon from "../images/pointIcon.png";
import {interactData} from "../../../common/util";

export default class AboutPlatform extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    peopleClick(people){
        if(people.type === 1){
            const {interact} = this.props.thisData.dataSources;
            this.interactData(interact,people);
        }
    }

    render() {
        const { detail } = this.props;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        if(JSON.stringify(detail) === '{}'){
            return '';
        }
        return (
            <div
                className={`${cssStyle.detailBox}`}
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding }}
            >
                <Scrollbars >
                    {detail && detail.map && detail.map((platform,index)=>{
                        return (
                            <div className={cssStyle.itemBox} key={index}>
                                <div className={cssStyle.platformName}>
                                    <img alt={''} src={pointIcon} className={cssStyle.headIcon} />
                                    {platform.name}
                                    {platform.type === 1 && <span>(主平台)</span>}
                                </div>
                                {platform.reasonList && platform.reasonList.map((reason,reasonIndex)=>{
                                    let reasonName;
                                    let reasonContent;
                                    switch (reason.type) {
                                        case 1:
                                            reasonName = '涉及同一人员';
                                            if(reason.peopleList){
                                                reasonContent = reason.peopleList.map((people,peopleIndex)=>{
                                                    return (
                                                        <React.Fragment key={peopleIndex}>
                                                            <div className={people.type === 1 ? cssStyle.special : ''} onClick={this.peopleClick.bind(this,people)}>
                                                                {people.name+(people.type === 1 ? '(重点人)':'')}
                                                            </div>
                                                            <div className={cssStyle.symbol}>、</div>
                                                        </React.Fragment>
                                                    );
                                                })
                                            }
                                            break;
                                        case 2:
                                            reasonName = '涉及到同一事件类别';
                                            reasonContent = <div>{reason.name}</div>;
                                            break;
                                        case 3:
                                            reasonName = '发生在同一街道';
                                            reasonContent = <div>{reason.name}</div>;
                                            break;
                                        default:
                                            reasonContent = <div>{reason.name}</div>;
                                    }
                                    return (
                                        <div key={reasonIndex} className={cssStyle.reasonItem}>
                                            <img alt={''} src={Icon} />
                                            <div>{reasonName}</div>
                                            {reasonName && <div className={cssStyle.split}>---</div>}
                                            {reasonContent}
                                        </div>
                                    )
                                })}
                            </div>
                        );
                    })}
                </Scrollbars>
            </div>
        );
    }
}