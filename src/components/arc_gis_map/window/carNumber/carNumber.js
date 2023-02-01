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
                <div className={cssStyle.headOneBox} onClick={this.itemClick.bind(this)} style={{minWidth:'13em'}}>
                    <div className={cssStyle.headName}>{attributes.carNumber}</div>
                    <div className={cssStyle.No} >{this.state.showTrail ? '关闭轨迹':'查看轨迹'}</div>
                    <Icon type="right-circle" theme="filled" className={cssStyle.rightIcon}/>
                </div>
            </div>
        );
    }
}