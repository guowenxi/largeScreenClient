import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import {Icon} from "antd";

import {interactData} from "../../../../common/util";

export default class SanitationTruck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showTrail:false,pageIndex:0};
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //搜索点击响应
    itemClick(){
        const {attributes} = this.props;
        this.interactData(attributes.interactWindow,attributes);
    }

    render() {
        const {attributes} = this.props;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={150}/>
                <div className={cssStyle.headOneBox} onClick={this.itemClick.bind(this)}>
                <div className={cssStyle.headName}></div>
                    <div className={cssStyle.No} >{'事件详情'}</div>
                    <Icon type="right-circle" theme="filled" className={cssStyle.rightIcon}/>
                </div>
                <table>
                    <tbody className={`${cssStyle.itemContent} ${cssStyle.sameWidth}`}>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>事</span>
                            <span>件</span>
                            <span>类</span>
                            <span>别：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.thingType}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>事</span>
                            <span>发</span>
                            <span>时</span>
                            <span>间：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.time}</td>
                    </tr>
                    <tr>
                    <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>事</span>
                            <span>发</span>
                            <span>地</span>
                            <span>点：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.address}</td>
                    </tr>
                    <tr>
                    <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>流</span>
                            <span>转</span>
                            <span>状</span>
                            <span>态：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.status}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}