import React from "react";
import cssStyle from "./blankBackground.module.css";
import CloseIcon from "../images/closeOne.png";

export default class BlankBackground extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.planName = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    closeThis(){
        this.props.changeThisShow(false);
    }

    render() {
        const {styleData} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.backgroundBox} style={{width:styleData.width,height:styleData.height,left:styleData.left,top:styleData.top}}>
                    <div className={cssStyle.contentBox} />
                    <img src={CloseIcon} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)}/>
                </div>
            </div>
        );
    }
}