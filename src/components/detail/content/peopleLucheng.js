import React from "react";
import cssStyle from "./peopleLucheng.module.css";
import {getCompatibleData} from "../../../common/detailUtil";

import {interactData} from "../../../common/util";

export default class PeopleLucheng extends React.Component {
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

    render() {
        const { detail } = this.props;
        const { style } = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        return (
            <div
                className={`${cssStyle.detailBox} ${style.contentType === 2 ? cssStyle.themeTwo : ''}`}
                style={{ ...this.props.style, backgroundColor: style.bgColor, padding: compatibleSize.padding }}
            >
                <img alt={''} src={detail.portrait} className={cssStyle.portrait}/>
                <div className={`${cssStyle.content}`}>
                    <div className={`${cssStyle.row} ${cssStyle.rowOne}`}>
                        <div className={`${cssStyle.title} ${cssStyle.titleOne}`}>{'姓名'.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                        <div>：</div>
                        <div className={cssStyle.contentOne}>{detail.name}</div>
                    </div>
                    <div className={`${cssStyle.row} ${cssStyle.rowTwo}`}>
                        <div className={`${cssStyle.title} ${cssStyle.titleTwo}`}>{'户籍地'.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                        <div>：</div>
                        <div className={cssStyle.contentTwo}>{detail.censusRegister}</div>
                    </div>
                    <div className={`${cssStyle.row} ${cssStyle.rowOne}`}>
                        <div className={`${cssStyle.title} ${cssStyle.titleOne}`}>{'身份证号'.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                        <div>：</div>
                        <div className={cssStyle.contentOne}>{detail.cardId}</div>
                    </div>
                    <div className={`${cssStyle.row} ${cssStyle.rowTwo}`}>
                        <div className={`${cssStyle.title} ${cssStyle.titleTwo}`}>{'户籍详细地址'.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                        <div>：</div>
                        <div className={cssStyle.contentTwo}>{detail.censusRegisterAddress}</div>
                    </div>
                    <div className={`${cssStyle.row} ${cssStyle.rowOne}`}>
                        <div className={`${cssStyle.title} ${cssStyle.titleOne}`}>{'婚姻情况'.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                        <div>：</div>
                        <div className={cssStyle.contentOne}>{detail.marriage}</div>
                    </div>
                    <div className={`${cssStyle.row} ${cssStyle.rowTwo}`}>
                        <div className={`${cssStyle.title} ${cssStyle.titleTwo}`}>{'现居住社区'.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                        <div>：</div>
                        <div className={cssStyle.contentTwo}>{detail.communityName}</div>
                    </div>
                    <div className={`${cssStyle.row} ${cssStyle.rowOne}`}>
                        <div className={`${cssStyle.title} ${cssStyle.titleOne}`}>{'护照号码'.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                        <div>：</div>
                        <div className={cssStyle.contentOne}>{detail.passport}</div>
                    </div>
                    <div className={`${cssStyle.row} ${cssStyle.rowTwo}`}>
                        <div className={`${cssStyle.title} ${cssStyle.titleTwo}`}>{'现住详细地址'.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                        <div>：</div>
                        <div className={cssStyle.contentTwo}>{detail.address}</div>
                    </div>
                    <div className={`${cssStyle.row} ${cssStyle.rowOne}`}>
                        <div className={`${cssStyle.title} ${cssStyle.titleOne}`}>{'手机号'.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                        <div>：</div>
                        <div className={cssStyle.contentOne}>{detail.phone}</div>
                    </div>
                    <div className={`${cssStyle.row} ${cssStyle.rowTwo}`}>
                        <div className={`${cssStyle.title} ${cssStyle.titleTwo}`}>{'职业'.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                        <div>：</div>
                        <div className={cssStyle.contentTwo}>{detail.occupation}</div>
                    </div>
                    <div className={`${cssStyle.row} ${cssStyle.rowOne}`}>
                        <div className={`${cssStyle.title} ${cssStyle.titleOne}`}>{'微信号'.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                        <div>：</div>
                        <div className={cssStyle.contentOne}>{detail.wxNum}</div>
                    </div>
                    <div className={`${cssStyle.row} ${cssStyle.rowTwo}`}>
                        <div className={`${cssStyle.title} ${cssStyle.titleTwo}`}>{'工作单位'.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                        <div>：</div>
                        <div className={cssStyle.contentTwo}>{detail.workUnit}</div>
                    </div>
                </div>
            </div>
        );
    }
}