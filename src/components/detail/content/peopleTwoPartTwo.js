import React from "react";
import cssStyle from "./peopleTwoPartOne.module.css";
import { Scrollbars } from "react-custom-scrollbars";

export default class PeopleTwoPartTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.titleOne = [{
            name: '系统研判：',
            key: 'systemJudge',
            dataType: 2,
            subKey:"score"
        }, {
            name: '人工复核：',
            key: 'artificialJudge',
            dataType: 2
        }, {
            name: '家庭风险：',
            key: 'familyRisk',
            dataType: 2,
            subKey:"familyRiskType",
            subKeyTwo:"familyRiskScore"
        }, {
            name: '风险事由：',
            key: 'familyRiskReason'
        }, {
            name: '心理评估：',
            key: 'psychologicalAssessment',
            dataType: 2
        }, {
            name: '评估事由：',
            key: 'psychologicalAssessmentReason'
        }, {
            name: '特殊人群：',
            key: 'specialGroup',
            width: '100%'
        }];
        this.titleTwo = [{
            name: '性格：',
            key: 'character',
            width: '100%'
        }, {
            name: '行为：',
            key: 'action',
            width: '100%'
        }, {
            name: '事件：',
            key: 'event',
            width: '100%'
        }];
        this.titleThree = [{
            name: '',
            key: 'warningContent',
            width: '100%',
            dataType: 3
        }];
        this.titleFour = [{
            name: '',
            key: 'aboutEvent',
            width: '100%',
            dataType: 4
        }];
        this.levelColor = ['', 'rgb(208, 2, 27)', 'rgb(245, 166, 35)', 'rgb(248, 231, 28)', 'rgb(18, 183, 150)'];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    getHead(title) {
        return (
            <div className={cssStyle.headBox}>
                <div className={cssStyle.lineOne} />
                <div className={cssStyle.lineTwo} />
                <div className={cssStyle.headName}>{title}</div>
            </div>
        );
    }

    getTablePart(item,itemIndex){
        if(item.child && Array.isArray(item.child) && item.child.length > 0){
            return item.child.map((part,partIndex)=>
                <tr key={itemIndex+'_'+partIndex}>
                    {partIndex === 0 && <td rowSpan={item.child.length} >{item.name}</td>}
                    <td>{part.type}</td>
                    <td>{part.content}</td>
                    {partIndex === 0 && <td rowSpan={item.child.length} >{item.score}</td>}
                </tr>
            );
        }else if(item.score && parseFloat(item.score)){
            return (
                <tr key={itemIndex}>
                    <td>{item.name}</td>
                    <td />
                    <td />
                    <td>{item.score}</td>
                </tr>
            );
        }else{
            return null;
        }
    }

    getContent(titleList) {
        const { detail } = this.props;
        return (
            <div className={cssStyle.content}>
                {titleList.map((title, index) => {
                    let content;
                    if (title.dataType === 4) {
                        const list = detail[title.key];
                        if(list && Array.isArray(list)){
                            return list.map((event,eventIndex)=>
                                <React.Fragment key={index+'_'+eventIndex}>
                                    <div className={cssStyle.rowPart} >
                                        <div className={cssStyle.title} style={{color:'#389fee'}}>事件{eventIndex+1}</div>
                                    </div>
                                    <div className={cssStyle.rowPart} >
                                        <div className={cssStyle.title} style={{ width: '5em' }} >事发时间：</div>
                                        <div style={{ width: 'calc(100% - 5em)' }} >{event.time}</div>
                                    </div>
                                    <div className={cssStyle.rowPart} >
                                        <div className={cssStyle.title} style={{ width: '5em' }} >事件来源：</div>
                                        <div style={{ width: 'calc(100% - 5em)' }} >{event.source}</div>
                                    </div>
                                    <div className={cssStyle.rowPart} >
                                        <div className={cssStyle.title} style={{ width: '5em' }} >事件类型：</div>
                                        <div style={{ width: 'calc(100% - 5em)' }} >{event.type}</div>
                                    </div>
                                    <div className={cssStyle.rowPart} style={{ width: '100%' }} >
                                        <div className={cssStyle.title} style={{ width: '5em' }} >事件内容：</div>
                                        <div style={{ width: 'calc(100% - 5em)' }} >{event.content}</div>
                                    </div>
                                    <div className={cssStyle.rowPart} style={{ width: '100%' }} >
                                        <div className={cssStyle.title} style={{ width: '5em' }} >处置结果：</div>
                                        <div style={{ width: 'calc(100% - 5em)' }} >{event.result}</div>
                                    </div>
                                </React.Fragment>
                            );
                        }else{
                            return (
                                <div className={cssStyle.rowPart} style={{ width: '100%' }} key={index}>
                                    <div className={cssStyle.title} style={{ width: '4em' }}>暂无</div>
                                </div>
                            );
                        }
                    } else if (title.dataType === 3) {
                        let data;
                        try {
                            data = JSON.parse(detail[title.key]);
                        }catch (e) {}
                        if(data){
                            content = (
                                <table className={cssStyle.tableOne}>
                                    <tbody>
                                    <tr>
                                        <td width={'13%'}>识别要素</td>
                                        <td width={'20%'}>类型</td>
                                        <td width={'57%'}>内容</td>
                                        <td width={'10%'}>分数</td>
                                    </tr>
                                    {data.map((item,itemIndex)=>{
                                        return this.getTablePart(item,itemIndex);
                                    })}
                                    </tbody>
                                </table>
                            );
                        }
                    } else if (title.dataType === 2) {
                        content = <div className={cssStyle.levelRect} style={{ backgroundColor: this.levelColor[detail[title.key]] }} />
                    } else {
                        content = detail[title.key];
                    }
                    return (
                        <div className={cssStyle.rowPart} style={{ width: title.width }} key={index}>
                            {title.dataType !== 3 && <div className={cssStyle.title} style={{ width: title.name.length + 'em' }}>{title.name}</div>}
                            <div style={{ width: `calc(100% - ${title.name.length + 'em'})` }}>
                                {content}
                                {title.subKey ? <span className={cssStyle.subData}>{detail[title.subKey]}</span>:''}
                                {title.subKeyTwo ? <span>{detail[title.subKeyTwo]}</span>:''}
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    }

    render() {
        const { detail, loading } = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                {
                    JSON.stringify(detail) === '{}' ? (
                        <div className={cssStyle.noData}>{loading ? '数据加载中...' : '暂无数据'}</div>
                    ) : (
                        <Scrollbars>
                            {this.getHead('风险等级')}
                            {this.getContent(this.titleOne)}
                            {this.getHead('识别要素')}
                            {this.getContent(this.titleTwo)}
                            {this.getHead('关联事件')}
                            {this.getContent(this.titleFour)}
                            {this.getHead('算法识别')}
                            {this.getContent(this.titleThree)}
                        </Scrollbars>
                    )
                }
            </div>
        );
    }
}