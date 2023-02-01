import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";

export default class PeopleTaizhou extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,pageIndex:0};
        this.refDom = React.createRef();
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
            <div ref={this.refDom} className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={150}/>
                <table>
                    <tbody className={`${cssStyle.itemContent} ${cssStyle.sameWidth}`}>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'5.5em'}}>
                            <span>姓</span>
                            <span>名：</span>
                        </td>
                        <td style={{minWidth:'12em'}}>{attributes.name}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>
                            <span>身</span>
                            <span>份</span>
                            <span>证：</span>
                        </td>
                        <td>{attributes.idCard}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>
                            <span>电</span>
                            <span>话：</span>
                        </td>
                        <td >{attributes.phone}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>
                            <span>现</span>
                            <span>住</span>
                            <span>址：</span>
                        </td>
                        <td >{attributes.address}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>
                            <span>涉</span>
                            <span>事</span>
                            <span>类</span>
                            <span>别：</span>
                        </td>
                        <td >{attributes.eventType}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}