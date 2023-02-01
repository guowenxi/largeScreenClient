import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./name_num_type_fourteen.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import backg from '../name_num_type_fourteen/images/circle.svg';
import {positionData} from "./positionData";
import {interactData} from "../../common/util";
import OnePart from "./onePart";

export default class NameNumTypeFourteen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [] };
        this.keyParams = {};
        this.refreshTimer = [];
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.size = [cssStyle.sizeOne,cssStyle.sizeTwo,cssStyle.sizeThree,cssStyle.sizeFour,cssStyle.sizeFive];
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
        if (result) {
            this.setState({ resultData: result });
            if (resolve) {
                resolve(result);
            }
        }
    }

    //点击响应
    selItem(selectedItem) {
        const {interact} = this.props.thisData.dataSources;
        this.interactData(interact,selectedItem);
    }

    render() {
        const { style } = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        const { resultData } = this.state;
        const positionList = style.partList && style.partList.length > 0 ? style.partList:positionData;
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{ opacity, fontSize: fontSize }} >
                            {!style.hideBg && <img src={backg} alt={''} className={cssStyle.background}/>}
                            {positionList.map((item, index) => {
                                const name = resultData[index] && style.key ? resultData[index][style.key]:'';
                                if(name == null){
                                    return null;
                                }
                                return (
                                    <OnePart
                                        key={index} className={`${item.zoom !== null ? this.size[item.zoom]:''}`}
                                        style={{width:style.partWidth,height:style.partHeight}}
                                        selItem={this.selItem.bind(this,resultData[index])}
                                        partStyle={item} name={name} move={style.move}
                                    />
                                );
                            })}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}