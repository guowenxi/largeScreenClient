import React from "react";
import cssStyle from "./eventCountListFive.module.css";
import {Scrollbars} from "react-custom-scrollbars";

export default class EventCountListFive extends React.Component {
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
            <div style={this.props.style} className={cssStyle.box} >
                <table className={cssStyle.table}>
                    <tbody>
                    <tr>
                        <td style={{width:'35%'}}>二级指标(权重)</td>
                        <td style={{width:'30%'}}>三级指标(权重)</td>
                        <td style={{width:'10%'}}>得分</td>
                        <td style={{width:'25%'}}>统计日期</td>
                    </tr>
                    </tbody>
                </table>
                <div className={cssStyle.contentBox}>
                    <Scrollbars >
                        <table className={cssStyle.table}>
                            <tbody>
                            {detail && Array.isArray(detail) && detail.map((item,index)=>
                                item.content && item.content.map((content,contentIndex)=>
                                    <tr key={contentIndex+'_'+index}>
                                        {contentIndex === 0 && (
                                            <td rowSpan={item.content.length} style={{width:'35%'}}>
                                                <span>{item.type}（{item.weight}）</span>
                                            </td>
                                        )}
                                        <td style={{width:'30%'}}>{content.name}（{content.weight}）</td>
                                        <td style={{width:'10%'}}>{content.num}</td>
                                        <td style={{width:'25%'}}>{content.time ? content.time.substr(0,16):''}</td>
                                    </tr>
                                )
                            )}
                            </tbody>
                        </table>
                    </Scrollbars>
                </div>
            </div>
        );
    }
}