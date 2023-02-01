import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";

export default class SanitationWorker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showTrail:false};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }


    render() {
        const {attributes} = this.props;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={150}/>
                <div className={`${cssStyle.headName} `} style={{color:'red',fontSize:'1.5em'}}>
                    应急处置
                </div>
                <table>
                    <tbody className={`${cssStyle.itemContent} ${cssStyle.sameWidth}`}>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto',color:'white'}}>
                            <span>事</span>
                            <span>件</span>
                            <span>类</span>
                            <span>型：</span>
                        </td>
                        <td style={{minWidth:'10em',color:'white'}}>{attributes.thingType}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto',color:'white'}}>
                            <span>事</span>
                            <span>发</span>
                            <span>时</span>
                            <span>间：</span>
                        </td>
                        <td style={{minWidth:'10em',color:'white'}}>{attributes.time}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto',color:'white'}}>
                            <span>事</span>
                            <span>发</span>
                            <span>地</span>
                            <span>点：</span>
                        </td>
                        <td style={{minWidth:'10em',color:'white'}}>{attributes.address}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}