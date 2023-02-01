import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";

export default class PeopleShangcheng extends React.Component {
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
                    <tbody className={cssStyle.itemContent}>
                    <tr>
                        <td className={cssStyle.itemBox}>
                            <div className={cssStyle.title}>姓名</div>
                            <div className={cssStyle.content}>{attributes.name}</div>
                        </td>
                        <td className={cssStyle.itemBox}>
                            <div className={cssStyle.title}>统一地址码</div>
                            <div className={cssStyle.content}>{attributes.addressCode}</div>
                        </td>
                    </tr>
                    <tr>
                        <td className={`${cssStyle.itemBox}`} colSpan={2}>
                            <div className={cssStyle.title}>统一地址库</div>
                            <div className={cssStyle.content}>{attributes.address}</div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}