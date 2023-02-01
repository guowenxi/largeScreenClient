import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";

export default class CarUser extends React.Component {
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

    //搜索点击响应
    itemClick(){
        const {attributes} = this.props;
        this.interactData(attributes.interactWindow,attributes);
    }

    render() {
        const {attributes} = this.props;
        return (
            <div ref={this.refDom} className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={80}/>
                <table>
                    <tbody className={`${cssStyle.itemContent} ${cssStyle.sameWidth}`}>
                    <tr>
                        <td  style={{minWidth:'15em',display:'flex',justifyContent:'center',alignContent:'center',wordBreak:'keep-all'}}>{attributes.companyName}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}