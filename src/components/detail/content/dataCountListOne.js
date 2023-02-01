import React from "react";
import cssStyle from "./dataCountListOne.module.css";

export default class DataCountListOne extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={`${cssStyle.box} ${cssStyle.flex}`} >
                {detail && Array.isArray(detail) && detail.map((item,index)=>
                    <div className={cssStyle.rowBox} key={index}>
                        <div className={`${cssStyle.titleBox} ${cssStyle.flex}`} key={index}>
                            <div className={cssStyle.title}>{item.name}：</div>
                            <div className={cssStyle.allNum}>{item.num}</div>
                        </div>
                        <div className={`${cssStyle.barBox} ${cssStyle.flex}`}>
                            <div style={{width:item.finishNum*100/item.num+'%'}} className={cssStyle.finishBar}>
                                {!!item.finishNum && <div className={cssStyle.num}>{item.finishNum}</div>}
                            </div>
                            <div style={{width:item.unFinishNum*100/item.num+'%'}} className={cssStyle.unFinishBar}>
                                {!!item.unFinishNum && <div className={cssStyle.num}>{item.unFinishNum}</div>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}