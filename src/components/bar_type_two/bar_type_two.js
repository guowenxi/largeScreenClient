import React from 'react';
import Util from '../../common/util';
import { getColumnNum} from "../../common/util";
import axios from 'axios';
import { Motion, StaggeredMotion, spring } from 'react-motion';
import { getData } from "../../common/getDataUtil";
import ComponentBox from "../component_box";
import Emitter from '../../common/eventBus';

import style from './bar_type_two.module.css';


export default class barTypeTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, color: '#000', isAnimate: false, resultData: [], maxNum: 100 };
        this.keyParams = {};
        this.getData = getData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => { this.getData(this.callBack.bind(this, resolve)) });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.thisData.updateTime !== this.props.thisData.updateTime) {
            //组件数据源变更时刷新数据
            this.getData();
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "showComponent":
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity: 1 });
        })
    }

    //重新获取数据
    reGetData() {
        this.setState({ resultData: [] });
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        //result是default_data的数据
        if (result) {
            if (this.props.thisData.dataSources.dataType === 1) {
                //通过Util.dataFormat方法获得一个list，里面是result解析后的数据
                let showData = Util.dataFormat(result);
                this.setState({ resultData: showData, maxNum: Util.getMaxNum(showData) });
                if (resolve) {
                    resolve(showData);
                }
            } else if (this.props.thisData.dataSources.dataType === 2) {
                let params = {};
                try {
                    params = JSON.parse(this.props.thisData.dataSources.dataParams);
                } catch (e) { }
                for (let key in this.keyParams) {
                    params[key] = this.keyParams[key];
                }
                axios.get(this.props.thisData.dataSources.dataUrl, { params: params }).then((response) => {
                    // 在这儿实现 setState
                    const result = response.data.data;
                    let showData = Util.dataFormat(result);
                    this.setState({ resultData: showData, maxNum: Util.getMaxNum(showData) });
                    if (resolve) {
                        resolve(showData);
                    }
                }).catch(function (error) {
                    // 处理请求出错的情况
                });
            }
        }
    }
    clickItem(clickItem) {
        // interactData(this.props.thisData.dataSources.interact, clickItem)
        if(this.props.thisData.dataSources.interact && this.props.thisData.dataSources.interact.length > 0){
            this.props.thisData.dataSources.interact.forEach((item,index) => {
                let sendData = {};
                switch (item.type) {
                    case 1:
                        sendData[item.keyName] = item.dataType === 1 ? clickItem.id : clickItem.name;
                        Emitter.emit(item.receiveId,{type:'changeKey',data:sendData});
                        break;
                    case 2:
                        break;
                    case 3:
                        sendData[item.keyName] = item.dataType === 1 ? clickItem.id : clickItem.name;
                        Emitter.emit(item.receiveId,{type:'showComponent',data:sendData});
                        break;
                    default:
                        break
                }
            });
        }
    }

    render() {
        const { resultData } = this.state;
        const thisStyle = this.props.thisData.style;
        const itemStyle = {
            width: getColumnNum(thisStyle, resultData).width,
            height: getColumnNum(thisStyle, resultData).height,
        };
        const centerStyle = {
            width: '100%',
            height: thisStyle.lineWidth
        }
        const leftStyle = {
            width: '100%',
            height: '16%'
        }
        const defaultStyle = resultData.map(() => ({ opacity: 0 }));
        return (
            <ComponentBox receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} style={this.props.style}>
                {resultData.length > 0 ?
                    <StaggeredMotion
                        key={defaultStyle.length}
                        defaultStyles={defaultStyle}
                        styles={prevStyles => prevStyles.map((item, i) => {
                            return i === 0
                                ? { opacity: this.state.opacity }
                                : {
                                    opacity: spring(prevStyles[i - 1].opacity)
                                };

                        })}>
                        {interpolatingStyles =>
                            <div className={style.barBox} >
                                {interpolatingStyles.map((item, i) => {
                                    let thisData = resultData[i];
                                    let color = [thisStyle.firstColor, thisStyle.secondColor, thisStyle.thirdColor, thisStyle.fourthColor]
                                    if (thisData == null || thisData.name == null) {
                                        return (
                                            <div key={i} className={style.hideItem} style={itemStyle} />
                                        );
                                    } else {
                                        return (
                                            <div key={i} className={style.itemBox} style={{
                                                ...itemStyle, opacity: item.opacity
                                            }}>
                                                <div className={style.leftBox}>
                                                    <div key={i} className={style.leftFontBox} style={{
                                                        ...leftStyle, opacity: item.opacity
                                                    }}>
                                                        <div key={i} style={{ fontSize: this.props.getCompatibleSize(thisStyle.nameFontSize), color: thisStyle.littleNameFontColor }}>{thisData.name}</div>
                                                    </div>
                                                </div>
                                                <div className={style.centerBox}>
                                                    {thisData.num.map((nums, j) => {
                                                        return (
                                                            <div key={j} className={style.itemBox} style={{ ...centerStyle, background: thisStyle.littleItemBackground, borderRadius: '10px' }}
                                                                onClick={this.clickItem.bind(this, thisData)}>
                                                                <Motion style={{ width: spring(nums) }} >
                                                                    {({ width }) =>
                                                                        <div style={{ width: width + '%', background: color[j], borderRadius: '10px' }} />
                                                                    }
                                                                </Motion>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className={style.rightBox}>
                                                    {thisData.num.map((nums, j) => {
                                                        return (
                                                            <div key={j} className={style.rightFontBox} style={{ ...centerStyle }}>
                                                                <div className={style.rightFontBox} style={{ fontSize: this.props.getCompatibleSize(thisStyle.numFontSize), color: thisStyle.numFontColor }}>{nums}</div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                        )
                                    }
                                })}

                            </div>
                        }
                    </StaggeredMotion>
                    : null}
            </ComponentBox>
        );
    }
}
