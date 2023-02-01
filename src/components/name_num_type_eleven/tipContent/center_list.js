import React from "react";
import cssStyle from "./center_list.module.css";

export default class CenterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,pageIndex:0};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        const {data} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.content}>
                <div className={cssStyle.box}>
                    <div className={cssStyle.title}>常驻</div>
                    {data && data.cz && data.cz.map((item,index) =>
                        <div key={index} className={cssStyle.yellow}>{item}</div>
                    )}
                </div>
                <div className={cssStyle.box}>
                    <div className={cssStyle.title}>轮驻</div>
                    {data && data.lz && data.lz.map((item,index) =>
                        <div key={index} className={cssStyle.blue}>{item}</div>
                    )}
                </div>
            </div>
        );
    }
}