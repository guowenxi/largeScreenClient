import React from "react";
import cssStyle from "./svg_map_ex.module.css";

export default class DetailFive extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        const {roadData,style} = this.props;
        return (
            <div className={`${cssStyle.detailOneBox} ${cssStyle.detailFiveBox}`} style={style}>
                <div className={cssStyle.roadName}>{roadData.name}</div>
                <div className={cssStyle.dataBox}>
                    {roadData.list && Array.isArray(roadData.list) && roadData.list.map((item,index)=>
                        <div className={cssStyle.dataItem} key={index}>{item.name}：{item.num}</div>
                    )}
                </div>
            </div>
        );
    }
}