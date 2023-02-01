import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import { Icon } from "antd";

import carIcon1 from "./images/xiaoqiche.svg";
import carIcon2 from "./images/zhongbache.svg";
import carIcon3 from "./images/mianbaoche.svg";
import carIcon4 from "./images/huoche.svg";
import carIcon5 from "./images/keche.svg";
import carIcon6 from "./images/jipuche.svg";
import { interactData } from "../../../../common/util";
// import { Scrollbars } from "react-custom-scrollbars";

export default class CarUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showTrail:false, showEdit: false, pageIndex: 0 };
        this.refDom = React.createRef();
        this.interactData = interactData.bind(this);
        this.iconList = [carIcon1,carIcon6,carIcon2,carIcon3,carIcon5,carIcon4]
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //搜索点击响应
    itemClick() {
        const { attributes } = this.props;
        this.interactData(attributes.interactWindow, attributes);
    }

    trajectory(){
        const showTrail = !this.state.showTrail;
        if(showTrail){
            this.props.showTrail();
        }else{
            this.props.stopMoveTrail();
        }
        this.setState({showTrail});
    }

    render() {
        const { attributes } = this.props;

        return (
            <div ref={this.refDom} className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={150} />
                <div className={cssStyle.headOneBox} onClick={this.trajectory.bind(this)}>
                    <img alt="" src={this.iconList[attributes.type-1]} style={{width:'4vh',height:'4vh'}} /> 
                    <div className={cssStyle.headName}>{attributes.licensePlateNumber}</div>
                    <div className={cssStyle.No}>{this.state.showTrail ? '关闭轨迹':'查看轨迹'}</div>
                    <Icon type="right-circle" theme="filled" className={cssStyle.rightIcon} />
                </div>
                <table>
                    <tbody className={`${cssStyle.itemContent} ${cssStyle.sameWidth}`}>
                        <tr>
                            <td className={cssStyle.tdTitle} style={{ width: 'auto' }}>
                                <span>用</span>
                                <span>车</span>
                                <span>人：</span>
                            </td>
                            <td style={{ minWidth: '10em' }}>{attributes.user}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>
                                <span>始</span>
                                <span>发</span>
                                <span>地：</span>
                            </td>
                            <td >{attributes.addressStart}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>
                                <span>目</span>
                                <span>的</span>
                                <span>地：</span>
                            </td>
                            <td >{attributes.addressEnd}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.tdTitle}>
                                <span>用</span>
                                <span>车</span>
                                <span>事</span>
                                <span>由：</span>
                            </td>
                            <td >{attributes.reason}</td>
                        </tr>
                    </tbody>
                </table>
                <div className={cssStyle.headOneBox} onClick={this.itemClick.bind(this)}>
                    <div className={cssStyle.headName}></div>
                    <div className={cssStyle.No} style={{textAlign:'center',textDecorationLine:'underline',color:'rgb(67,167,203)'}}>详情</div>
                </div>
            </div>
        );
    }
}