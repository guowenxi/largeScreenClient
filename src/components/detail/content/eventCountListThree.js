import React from "react";
import cssStyle from "./eventCountListThree.module.css";
import "./eventCountList.css";
import {Scrollbars} from "react-custom-scrollbars";
import {interactData} from "../../../common/util";

export default class EventCountListThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    getTableContent(){
        const {detail} = this.props;
        let rowIndex = 0;
        return detail && Array.isArray(detail) && detail.map((content,contentIndex)=>
            <React.Fragment key={contentIndex}>
                {content.content && content.content.map((line,lineIndex)=>{
                    rowIndex ++;
                    return (
                        <tr key={contentIndex+'_'+lineIndex} className={cssStyle.dataRow} onClick={this.rowClick.bind(this,line)}>
                            <td style={{width:'25%'}}>{rowIndex}</td>
                            {lineIndex === 0 && <td rowSpan={content.content.length} style={{width:'25%'}} onClick={this.rowClick.bind(this,content)}>{content.type}</td>}
                            <td style={{width:'25%'}}>{line.name}</td>
                            <td style={{width:'25%'}}>{line.num}</td>
                        </tr>
                    )
                })}
            </React.Fragment>
        )
    }

    rowClick(data,e){
        e.stopPropagation();
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, data);
    }

    render() {
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <table className={cssStyle.table}>
                    <tbody>
                    <tr className={cssStyle.head}>
                        <td style={{width:'25%'}}>序号</td>
                        <td style={{width:'25%'}}>一级类型</td>
                        <td style={{width:'25%'}}>二级类型</td>
                        <td style={{width:'25%'}}>数量</td>
                    </tr>
                    </tbody>
                </table>
                <Scrollbars className={'EventCountListThreeScrollbars'}>
                    <table className={cssStyle.table}>
                        <tbody>
                        {this.getTableContent()}
                        </tbody>
                    </table>
                </Scrollbars>
                <div className={cssStyle.bgBorder} />
            </div>
        );
    }
}