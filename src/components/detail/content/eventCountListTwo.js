import React from "react";
import cssStyle from "./eventCountListOne.module.css";
import {Scrollbars} from "react-custom-scrollbars";

export default class EventCountListTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.numNameList = ['','一','二','三','四','五','六','七','八','九']
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    getNumName(num){
        const numStr = num.toString();
        return numStr.split('').map((num,index)=>{
            if(numStr.length === 2 && index === 0){
                if(this.numNameList[num] === '一'){
                    return '十';
                }else{
                    return this.numNameList[num]+'十';
                }
            }else{
                return this.numNameList[num];
            }
        }).join('')
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <Scrollbars >
                    {detail && Array.isArray(detail) && detail.map((item,index)=>
                        <div key={index} className={cssStyle.itemBox}>
                            <div className={cssStyle.head}>{`${this.getNumName(index+1)}、${item.type}事件情况：`}</div>
                            {item.content && item.content.map((content,contentIndex)=>
                                <React.Fragment key={contentIndex}>
                                    <div>
                                        {contentIndex+1}、{content.name}：本期
                                        {content.content && content.content.map((line,lineIndex)=>
                                            <span key={contentIndex+'_'+lineIndex}>{line.name}<span className={cssStyle.yellowFont}>{line.num}</span>件{lineIndex === content.content.length - 1 ? '。':'；'}</span>
                                        )}
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    )}
                    {detail && Array.isArray(detail) && detail.map((item,index)=>
                        <div key={index} className={cssStyle.itemBox}>
                            <div className={cssStyle.head}>{item.type}</div>
                            <table className={cssStyle.table}>
                                <tbody>
                                {item.content && item.content.map((content,contentIndex)=>
                                    <React.Fragment key={contentIndex}>
                                        {content.content && content.content.map((line,lineIndex)=>
                                            <tr key={contentIndex+'_'+lineIndex}>
                                                {lineIndex === 0 && (
                                                    <td rowSpan={content.content.length} style={{width:'35%'}}>{content.name}</td>
                                                )}
                                                <td style={{width:'35%'}}>{line.name}</td>
                                                <td style={{width:'30%'}}>{line.num}</td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Scrollbars>
            </div>
        );
    }
}