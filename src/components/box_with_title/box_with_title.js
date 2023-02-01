import React from "react";
import ComponentBox from "../component_box";
import cssStyle from './box_with_title.module.css';
import {Motion, spring} from "react-motion";

export default class BoxWithTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {},opacity:0};
        this.keyParams = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.setState({opacity:1});
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey" :
                this.keyParams[data.keyName] = data.data;
                this.reGetData();
                break;
            case "animateOn":
                this.animateOn();
                break;
            default:
                break;
        }
    }

    render() {
        const {style} = this.props.thisData;
        const headHeight = this.props.getCompatibleSize(style.headHeight);
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} id={this.props.thisData.id} style={this.props.style}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.box} style={{fontSize,opacity}}>
                            <div className={cssStyle.head} style={{height:headHeight,backgroundColor:style.headBackground}}>
                                <div className={cssStyle.title} style={{backgroundColor:style.titleBackground,color:style.color}}>{style.title}</div>
                                {style.iconType===1 && (
                                    <div className={cssStyle.triangle} style={{borderLeftColor:style.titleBackground,borderTopWidth:'calc('+headHeight+' / 2)',borderBottomWidth:'calc('+headHeight+' / 2)'}}/>
                                )}
                                {style.iconType===2 && (
                                    <div className={cssStyle.triangle2} style={{borderLeftColor:style.titleBackground,borderTopWidth:'calc('+headHeight+' * 0.9)',borderBottomWidth:'0'}}/>
                                )}
                            </div>
                            <div className={cssStyle.content} style={{height:'calc(100% - '+headHeight+')',backgroundColor:style.contentBackground}}>

                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}