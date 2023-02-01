import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";

export default class EventTaizhou extends React.Component {
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
                        <td colSpan={2}>{attributes.eventTitle}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'5em'}}>事发时间:</td>
                        <td style={{minWidth:'12em'}}>{attributes.time}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>事发地点:</td>
                        <td >{attributes.address}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>事件描述:</td>
                        <td >{attributes.content}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}