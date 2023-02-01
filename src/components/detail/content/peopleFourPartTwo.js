import React from "react";
import Scrollbars from "react-custom-scrollbars";
import cssStyle from "./peopleFour.module.css";

export default class PeopleFourPartTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.titleOne = [{
            name: '管控次数',
            key: 'controlTimes'
        }, {
            name: '管控次数占比',
            key: 'controlTimesPer'
        }];
        this.titleTwo = [{
            name: '管控信息',
            key: 'controlList',
            dataType: 3
        }];
        this.titleThree = [{
            name: '排查信息',
            key: 'checkList',
            dataType: 3
        }];
        this.titleFour = [{
            name: '预警信息',
            key: 'warningList',
            dataType: 3
        }];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }
    componentDidUpdate() {

    }
    getHead(title) {
        return (
            <div className={cssStyle.headBox}>
                <div className={cssStyle.lineTwo} />
                <div className={cssStyle.headName}>{title}</div>
            </div>
        );
    }

    getContent(titleList) {
        const { detail } = this.props;
        return (
            <div className={cssStyle.content}>
                {titleList.map((title, index) => {
                    if(title.dataType === 3){
                        return detail[title.key] && detail[title.key].map((item,itemIndex)=>
                            <div className={cssStyle.controlRow} style={{ width: '100%' }} key={index+'_'+itemIndex}>
                                <div>{item.time}</div>
                                <div>{item.type}：</div>
                                <div>{item.content}</div>
                            </div>
                        )
                    }else{
                        return (
                            <div className={cssStyle.rowPart} style={{ width: title.width }} key={index}>
                                <div className={cssStyle.title} style={{ width: title.name.length + 'em' }}>{title.name.split('').map((item,index)=>{return <span key={index}>{item}</span>})}</div>
                                <div className={cssStyle.dataContent} style={{ width: `calc(100% - ${title.name.length + 'em'})` }}>{detail[title.key]}</div>
                            </div>
                        )
                    }
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
                            {this.getHead('统计信息')}
                            {this.getContent(this.titleOne)}
                            {this.getHead('管控信息')}
                            {this.getContent(this.titleTwo)}
                            {this.getHead('排查信息')}
                            {this.getContent(this.titleThree)}
                            {this.getHead('预警信息')}
                            {this.getContent(this.titleFour)}
                        </Scrollbars>
                    )
                }
            </div>
        );
    }
}