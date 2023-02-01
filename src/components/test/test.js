import React from "react";
import { getData } from "../../common/getDataUtil";
import ComponentBox from "../component_box";
import { Motion, spring } from "react-motion";
import cssStyle from "./test.module.css";
// import RectTypeFive from "../../common/svg/rectTypeFive"
import RectTypeFour from "../../common/svg/rectTypeFour"

// import Rect from "./polygon";

export default class NameNumTypeThirteen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [] };
        this.keyParams = {};
        this.refreshTimer = [];
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
        if (result) {
            this.setState({ resultData: result });
            if (resolve) {
                resolve(result);
            }
            // this.drawSvg(result, this.props.thisData)
        }
    }

    render() {
        // const {resultData}=this.state
        const {id} = this.props.thisData
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div style={{ opacity}} className={cssStyle.box}>
                            {/* <Rect style={{width:'100%',height:'100%'}} data={resultData} allStyle={style} /> */}
                            <RectTypeFour style={{width:'100%',height:'100%'}} id={id} />
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}