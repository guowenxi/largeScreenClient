import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./title_with_bg.module.css";
import {fileUrl} from "../../config";
import TitleBgTypeOne from "../../common/svg/titleBgTypeOne";

export default class TitleWithGg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {src:'',show:false};
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.firstLoad === false){
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
            case "showComponent":
                //显示当前组件
                break;
            case "changeKey":
                this.setState(data.data);
                break;
            case "deleteKey" :
                this.setState({part:''});
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
    }

    //获取背景图
    getBgImg(){
        const {style} = this.props.thisData;
        switch (style.bgType) {
            case 1:
                if(style.backgroundImage){
                    return <img alt={''} src={fileUrl + '/download/' + style.backgroundImage} className={cssStyle.backgroundImg}/>;
                }
                break;
            case 2:
                return <TitleBgTypeOne className={cssStyle.backgroundImg}/>;
            default:
                if(style.backgroundImage){
                    return <img alt={''} src={fileUrl + '/download/' + style.backgroundImage} className={cssStyle.backgroundImg}/>;
                }
        }
    }

    render() {
        const {style} = this.props.thisData;
        let background = {};
        // if(style.backgroundImage){
        //     background.backgroundImage = 'url('+fileUrl+'/download/'+style.backgroundImage+')';
        // }
        if(style.colorType === 2){
            background.background = 'linear-gradient(90deg,'+style.startColor+' 0%,'+style.endColor+' 100%)';
        }else{
            background.background = style.backgroundColor;
        }
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} >
                <div className={cssStyle.box} style={background}>
                    {this.getBgImg()}
                    <div className={cssStyle.font}
                         style={{fontFamily:style.fontFamily,width:style.width+'%',height:style.height+'%',left:style.left+'%',top:style.top+'%',fontSize:this.props.getCompatibleSize(style.fontSize),fontWeight:style.fontWeight,color:style.fontColor,alignItems:style.alignItems,justifyContent:style.justifyContent}}
                    >
                        {style.title}
                        {this.state.part && (
                            <React.Fragment>
                                <span className={cssStyle.split}>-</span>
                                <span className={cssStyle.part}>{this.state.part}</span>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </ComponentBox>
        );
    }
}