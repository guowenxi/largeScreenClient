import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import {Icon} from "antd";

export default class SanitationTruck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showTrail:false,pageIndex:0};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //搜索点击响应
    itemClick(){
        const showTrail = !this.state.showTrail;
        if(showTrail){
            this.props.showTrail();
        }else{
            this.props.stopMoveTrail();
        }
        this.setState({showTrail});
    }

    render() {
        const {attributes} = this.props;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={150}/>
                <div className={cssStyle.headOneBox} onClick={this.itemClick.bind(this)}>
                    <div className={cssStyle.headName}>{attributes.licensePlateNumber}</div>
                    <div className={cssStyle.No} >{this.state.showTrail ? '关闭轨迹':'查看轨迹'}</div>
                    <Icon type="right-circle" theme="filled" className={cssStyle.rightIcon}/>
                </div>
                <table>
                    <tbody className={`${cssStyle.itemContent} ${cssStyle.sameWidth}`}>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>当</span>
                            <span>前</span>
                            <span>位</span>
                            <span>置：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.address}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>车</span>
                            <span>辆</span>
                            <span>类</span>
                            <span>型：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.carType}</td>
                    </tr>
                    <tr>
                    <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>司</span>
                            <span>机</span>
                            <span>姓</span>
                            <span>名：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.user}</td>
                    </tr>
                    <tr>
                    <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>联</span>
                            <span>系</span>
                            <span>方</span>
                            <span>式：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.telphone}</td>
                    </tr>
                    <tr>
                    <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>作</span>
                            <span>业</span>
                            <span>范</span>
                            <span>围：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.range}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}