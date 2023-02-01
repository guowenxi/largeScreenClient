import React from "react";
import cssStyle from "./eventCountListFour.module.css";
import "./eventCountList.css";
import {Scrollbars} from "react-custom-scrollbars";
import {interactData} from "../../../common/util";

export default class EventCountListFour extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {firstTypeList:[]};
        this.interactData = interactData.bind(this);
        this.scrollbarsHead = React.createRef();
        this.scrollbarsRoad = React.createRef();
        this.scrollbarsContent = React.createRef();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        this.getFirstTypeList();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime){
            this.getFirstTypeList();
        }
    }

    getFirstTypeList(){
        this.keyParams = this.props.keyParams;
        const {detail} = this.props;
        let firstTypeList = [];
        if(detail && Array.isArray(detail) && detail.length > 0){
            detail[0].content && detail[0].content.forEach((item,index)=>{
                if(index === 0 || item.parentName !== detail[0].content[index-1].parentName){
                    firstTypeList.push({name:item.parentName,num:1});
                }else{
                    firstTypeList[firstTypeList.length-1].num ++;
                }
            })
        }
        this.setState({firstTypeList});
    }

    getTableHead(detail){
        const {firstTypeList} = this.state;
        return (
            <React.Fragment>
                <tr className={cssStyle.head} >
                    {firstTypeList.map((item,index)=>
                        <td key={index} colSpan={item.num}>{item.name}</td>
                    )}
                </tr>
                <tr className={cssStyle.head} >
                    {detail[0].content && detail[0].content.map((item,index)=>{
                        return <td key={index} className={cssStyle.typeOne} >{item.name}</td>
                    })}
                </tr>
            </React.Fragment>
        )
    }

    getTableContent(detail){
        return detail.map((item,index)=>
            <tr key={index}>
                {item.content.map((typeOne,typeOneIndex)=>
                    <td key={index+'_'+typeOneIndex} className={cssStyle.typeOne} onClick={this.rowClick.bind(this,typeOne,item)}>{typeOne.num}</td>
                )}
            </tr>
        )
    }

    getTableRoad(detail){
        return detail.map((item,index)=>
            <tr key={index}>
                <td className={cssStyle.index}>{index+1}</td>
                <td className={cssStyle.typeOne}>{item.road}</td>
            </tr>
        )
    }

    rowClick(data,rowData,e){
        e.stopPropagation();
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {...rowData,...data});
    }

    handleScroll(){
        this.scrollbarsHead.current.scrollLeft(this.scrollbarsContent.current.getScrollLeft());
        this.scrollbarsRoad.current.scrollTop(this.scrollbarsContent.current.getScrollTop());
    }

    render() {
        const {detail} = this.props;
        if(detail && Array.isArray(detail) && detail.length > 0){
            return (
                <div style={this.props.style} className={cssStyle.box} >
                    <div className={cssStyle.rightTop}>
                        <Scrollbars
                            className={`hideScrollbars`}
                            ref={this.scrollbarsHead}
                        >
                            <table className={cssStyle.table}>
                                <tbody>
                                {this.getTableHead(detail)}
                                </tbody>
                            </table>
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.leftBottom}>
                        <Scrollbars
                            className={`hideScrollbars`}
                            ref={this.scrollbarsRoad}
                        >
                            <table className={cssStyle.table}>
                                <tbody>
                                {this.getTableRoad(detail)}
                                </tbody>
                            </table>
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.rightBottom}>
                        <Scrollbars
                            className={'EventCountListFourScrollbars'}
                            ref={this.scrollbarsContent}
                            onScroll={this.handleScroll.bind(this)}
                        >
                            <table className={cssStyle.table}>
                                <tbody>
                                {this.getTableContent(detail)}
                                </tbody>
                            </table>
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.leftTop}>
                        <table className={cssStyle.table}>
                            <tbody>
                            <tr className={cssStyle.head} >
                                <td className={cssStyle.index}>序号</td>
                                <td className={cssStyle.typeOne}>乡镇街道名称</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }else{
            return null;
        }
    }
}