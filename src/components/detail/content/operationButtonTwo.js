import React from "react";
import cssStyle from "./operationButtonTwo.module.css";

export default class operationButtonTwO extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,text:''};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    
    exportList(){
        window.open(this.props.styleData.fileUrl+"?rbacToken="+this.props.token+"&configId="+this.props.keyParams.configId);
    }
    render() {
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.exportButton} onClick={this.exportList.bind(this)}>导出分析报告</div>
            </div>
        );
    }
}