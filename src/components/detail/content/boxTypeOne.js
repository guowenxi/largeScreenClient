import React from "react";
import cssStyle from "./boxTypeOne.module.css";
import CloseIconOne from "../images/closeOne.png";
import CloseIconTwo from "../images/closeThree.png";

export default class BoxTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.planName = {};
        this.closeIconList = {
            "1":CloseIconOne,
            "2":CloseIconTwo,
        };
        this.themeList = {
            "2":cssStyle.themeTwo,
        };
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    closeThis() {
        this.props.changeThisShow(false, true);
    }

    render() {
        const {styleData} = this.props;
        const themeType = styleData.themeType ? styleData.themeType : 1;
        return (
            <div style={this.props.style} className={`${cssStyle.box} ${this.themeList[themeType]}`} >
                <div className={cssStyle.backgroundBox} style={{height:styleData.height,width:styleData.width}}>
                    <div className={cssStyle.contentBox} />
                    <img src={this.closeIconList[themeType]} alt={''} className={cssStyle.closeIcon} onClick={this.closeThis.bind(this)} />
                </div>
            </div>
        );
    }
}