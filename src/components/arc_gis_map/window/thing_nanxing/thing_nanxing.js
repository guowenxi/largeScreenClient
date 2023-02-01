import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";

import {interactData} from "../../../../common/util";

export default class CarUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,pageIndex:0};
        this.refDom = React.createRef();
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
            <div ref={this.refDom} className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={150}/>
                <div className={cssStyle.headOneBox} onClick={this.itemClick.bind(this)}>
                    <div className={cssStyle.headName}>{attributes.title}</div>
                    <div className={cssStyle.No} />
                </div>
                <table>
                    <tbody className={`${cssStyle.itemContent} ${cssStyle.sameWidth}`}>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>报</span>
                            <span>警</span>
                            <span>时</span>
                            <span>间：</span>
                        </td>
                        <td style={{minWidth:'15em'}}>{attributes.time}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>
                            <span>报</span>
                            <span>警</span>
                            <span>人：</span>
                        </td>
                        <td >{attributes.person}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>
                            <span>起</span>
                            <span>火</span>
                            <span>地</span>
                            <span>址：</span>
                        </td>
                        <td >{attributes.address}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>
                            <span>详</span>
                            <span>细</span>
                            <span>描</span>
                            <span>述：</span>
                        </td>
                        <td >{attributes.content}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}