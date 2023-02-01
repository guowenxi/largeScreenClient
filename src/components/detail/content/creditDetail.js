import React from "react";
import {Scrollbars} from "react-custom-scrollbars";
import cssStyle from "./creditDetail.module.css";
import {Icon} from "antd";

export default class CreditDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.titleList = [
            {name:'一级指标',key:'firstTitle',style:{width:'14%',color:'#87cdfb'}},
            {name:'二级指标',key:'secondTitle',style:{width:'14%'}},
            {name:'三级指标',key:'thirdTitle',style:{width:'30%'}},
            {name:'三级数量',key:'thirdNum',style:{width:'7%'}},
            {name:'二级数量',key:'secondNum',style:{width:'7%'}},
            {name:'三级分数',key:'thirdScore',style:{width:'7%'}},
            {name:'二级分数',key:'secondScore',style:{width:'7%'}},
            {name:'一级排行',key:'firstOrder',style:{width:'14%',color:'#3efff4',fontSize:'2em'}}
        ];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    // calculateRowNum(list){
    //     if(list){
    //         let num = 0;
    //         list.forEach((item)=>{
    //             if(item.child){
    //                 item.rowNum = this.calculateRowNum(item.child);
    //                 num += item.rowNum;
    //             }else{
    //                 item.rowNum = 1;
    //                 num += 1;
    //             }
    //         });
    //         return num;
    //     }else{
    //         return 0;
    //     }
    // }

    getSameTitleNum(list){
        if(list){
            let sameOneNum = 1;
            let sameTwoNum = 1;
            for(let i = list.length-1;i >= 0;i --){
                if(i > 0 && list[i].firstTitle === list[i-1].firstTitle){
                    list[i].contentOneShow = false;
                    sameOneNum ++;
                }else{
                    list[i].contentOneShow = true;
                    list[i].sameOneNum = sameOneNum;
                    sameOneNum = 1;
                }
                if(i > 0 && list[i].secondTitle === list[i-1].secondTitle){
                    list[i].contentTwoShow = false;
                    sameTwoNum ++;
                }else{
                    list[i].contentTwoShow = true;
                    list[i].sameTwoNum = sameTwoNum;
                    sameTwoNum = 1;
                }
            }
        }
    }

    render() {
        const {detail} = this.props;
        this.getSameTitleNum(detail.list);
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <Icon type="close" onClick={this.props.changeThisShow.bind(this,false)} className={cssStyle.closeIcon} />
                <div className={cssStyle.leftTableBox}>
                    <table className={cssStyle.headTable}>
                        <tbody>
                        <tr>
                            <td style={{width:'14%'}} >一级指标</td>
                            <td style={{width:'14%'}} >二级指标</td>
                            <td style={{width:'30%'}} >三级指标</td>
                            <td style={{width:'14%'}} >数量</td>
                            <td style={{width:'14%'}} >得分</td>
                            <td style={{width:'14%'}} >排行</td>
                        </tr>
                        </tbody>
                    </table>
                    <div className={cssStyle.contentTableBox}>
                        <Scrollbars>
                            <table className={cssStyle.contentTable}>
                                <tbody>
                                {detail.list && detail.list.map((item,rowIndex)=>
                                    <tr key={rowIndex}>
                                        {this.titleList.map((title,titleIndex)=>{
                                            let rowSpan = 1;
                                            let tdShow = false;
                                            if('一级指标,一级数量,一级分数,一级排行'.indexOf(title.name) >= 0){
                                                tdShow = item.contentOneShow;
                                                rowSpan = item.sameOneNum;
                                            }else if('二级指标,二级数量,二级分数'.indexOf(title.name) >= 0){
                                                tdShow = item.contentTwoShow;
                                                rowSpan = item.sameTwoNum;
                                            }else{
                                                tdShow = true;
                                                rowSpan = 1;
                                            }
                                            if(tdShow){
                                                return <td key={titleIndex} style={title.style} rowSpan={rowSpan}>{item[title.key]}</td>;
                                            }else{
                                                return null;
                                            }
                                        })}
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </Scrollbars>
                    </div>
                </div>
                <div className={cssStyle.rightTableBox}>
                    <table className={cssStyle.headTable}>
                        <tbody>
                        <tr>
                            <td>综合信用分</td>
                        </tr>
                        </tbody>
                    </table>
                    <div className={cssStyle.contentTableBox}>
                        <table className={cssStyle.rightTable}>
                            <tbody>
                            <tr>
                                <td>{detail.allScore}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}