import React from "react";
import cssStyle from "./eventCountListOne.module.css";
import {Scrollbars} from "react-custom-scrollbars";

export default class EventCountListOne extends React.Component {
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
                <Scrollbars >
                    {detail && Array.isArray(detail) && detail.map((item,index)=>
                        <div key={index} className={cssStyle.itemBox}>
                            <div className={cssStyle.head}>{`NO${index+1}：${item.type}类事件，需特别关注如下内容：`}</div>
                            {item.content && item.content.map((content,contentIndex)=>
                                <React.Fragment key={contentIndex}>
                                    <div>{content.name}子类事件发生了<span className={cssStyle.yellowFont}>{content.num}</span>件，占比<span className={cssStyle.yellowFont}>{content.per}</span>；</div>
                                    <div className={cssStyle.part}>
                                        <span>事件相关热词：</span>
                                        {content.content && content.content.map((line,lineIndex)=>
                                            <span key={contentIndex+'_'+lineIndex}>{line.name}<span className={cssStyle.yellowFont}>{line.num}</span>次　</span>
                                        )}
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    )}
                    {detail && Array.isArray(detail) && detail.map((item,index)=>
                        <div key={index} className={cssStyle.itemBox}>
                            <div className={cssStyle.head}>{`NO${index+1} ${item.type}`}</div>
                            <table className={cssStyle.table}>
                                <tbody>
                                {item.content && item.content.map((content,contentIndex)=>
                                    <React.Fragment key={contentIndex}>
                                        {content.content && content.content.map((line,lineIndex)=>
                                            <tr key={contentIndex+'_'+lineIndex}>
                                                {lineIndex === 0 && (
                                                    <td rowSpan={content.content.length} style={{width:'35%'}}>
                                                        <span>{content.name}</span>
                                                        <br />
                                                        <span>{`${content.num}　${content.per}`}</span>
                                                    </td>
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