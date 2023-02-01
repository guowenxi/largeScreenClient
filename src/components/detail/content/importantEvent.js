import React from "react";
import cssStyle from "./importantEvent.module.css";
import RectTypeSix from "../../../common/svg/rectTypeSix";
import RectTypeSeven from "../../../common/svg/rectTypeSeven";
import closeIcon from "../images/closeTypeOne.svg";
import {Scrollbars} from "react-custom-scrollbars";

export default class ImportantEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {contentType:0};
        this.menuList = ['基本信息与诉求情况','化解情况'];
        if(props.styleData.contentType !== 2){
            this.menuList.push('处置及稳控情况');
        }
        this.levelColor = ['#14e8f2','#e80723','#eec759','#eec759'];
        this.levelName = ['关注','一级','二级','三级'];
        this.listOneTitle = [{name:'姓名',key:'name',width:'15%'},{name:'工作单位',key:'department',width:'15%'},{name:'职务',key:'duty',width:'15%'},{name:'联系电话',key:'phone',width:'25%'}];
        this.listTwoTitle = [{name:'姓名',key:'name',width:'15%'},{name:'工作单位',key:'department',width:'15%'},{name:'职务',key:'duty',width:'15%'},{name:'联系电话',key:'phone',width:'25%'}];
        this.listThreeTitle = [{name:'姓名',key:'name',width:'20%'},{name:'联系电话',key:'phone',width:'30%'},{name:'身份证号码',key:'cardId',width:'40%'}];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    changeContent(index){
        this.setState({contentType:index});
    }

    closeDetail(){
        this.props.changeThisShow(false);
        this.timer = setTimeout(()=>{
            this.setState({contentType:0});
        });
    }

    render() {
        const {detail,styleData} = this.props;
        const {contentType} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.headBox}>
                    <div className={cssStyle.headMessage}>
                        <div className={cssStyle.maxTitle}>涉稳问题名称：<span style={{color: '#eec759'}}>{detail.title}</span></div>
                        <div>事发时间：<span style={{color: '#eec759'}}>{detail.incidentTime}</span></div>
                        <div>类别：<span style={{color: '#eec759'}}>{detail.eventType}</span></div>
                        {styleData.contentType !== 2 && (<div>监管等级：<span style={{color: this.levelColor[detail.regLevel]}}>{this.levelName[detail.regLevel]}</span></div>)}
                        <div>化解状态：<span style={{color:detail.isSolve === 1 ? '#12cc5e':'#e80723'}}>{detail.isSolve === 1 ? '已化解':'未化解'}</span></div>
                    </div>
                    <img alt='' src={closeIcon} className={cssStyle.closeIcon} onClick={this.closeDetail.bind(this)}/>
                </div>
                <div className={cssStyle.menuBox}>
                    {this.menuList.map((text,index) =>
                        <div key={index} className={cssStyle.menuButton} onClick={this.changeContent.bind(this,index)}>
                            {index === contentType ? <RectTypeSix className={cssStyle.bgImg}/>:<RectTypeSeven className={cssStyle.bgImg}/>}
                            <span>{text}</span>
                        </div>
                    )}
                </div>
                <div className={cssStyle.contentBox}>
                    {contentType === 0 && (
                        <React.Fragment >
                            <table className={cssStyle.table}>
                                <tbody>
                                <tr style={{height:'25%'}}>
                                    <td className={cssStyle.tdTitle} >问题概述</td>
                                    <td className={cssStyle.tdContent} colSpan={3}>
                                        <Scrollbars>{detail.incidentContent}</Scrollbars>
                                    </td>
                                </tr>
                                <tr style={{height:'50%'}}>
                                    <td className={cssStyle.tdTitle} >群体重点挑头人员</td>
                                    {styleData.contentType === 2 ? (
                                        <td className={cssStyle.tdContent} colSpan={3}>
                                            <div className={`${cssStyle.listRow} ${cssStyle.lightWhite}`}>
                                                {this.listThreeTitle.map((item,index) =>
                                                    <div className={cssStyle.listTd} key={index} style={{width:item.width}}>
                                                        {item.name}
                                                    </div>
                                                )}
                                            </div>
                                            <Scrollbars style={{height:'calc(100% - 2em)'}}>
                                                {detail.leaderList && detail.leaderList.map((item,index) =>
                                                    <div className={`${cssStyle.listRow} ${cssStyle.listContent}`} key={index}>
                                                        {this.listThreeTitle.map((title,titleIndex) =>
                                                            <div className={cssStyle.listTd} key={titleIndex} style={{width:title.width}}>
                                                                {item[title.key]}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Scrollbars>
                                        </td>
                                    ):(
                                        <td className={cssStyle.tdContent} colSpan={3}>
                                            <div className={`${cssStyle.listRow} ${cssStyle.lightWhite}`}>
                                                {this.listOneTitle.map((item,index) =>
                                                    <div className={cssStyle.listTd} key={index} style={{width:item.width}}>
                                                        {item.name}
                                                    </div>
                                                )}
                                            </div>
                                            <Scrollbars style={{height:'calc(100% - 2em)'}}>
                                                {detail.leaderList && detail.leaderList.map((item,index) =>
                                                    <div className={`${cssStyle.listRow} ${cssStyle.listContent}`} key={index}>
                                                        {this.listOneTitle.map((title,titleIndex) =>
                                                            <div className={cssStyle.listTd} key={titleIndex} style={{width:title.width}}>
                                                                {item[title.key]}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Scrollbars>
                                        </td>
                                    )}
                                </tr>
                                {styleData.contentType === 2 ? (
                                    <tr style={{height:'25%'}}>
                                        <td className={cssStyle.tdTitle} >流转状态</td>
                                        <td className={cssStyle.tdContent} colSpan={3}>
                                            <div className={cssStyle.timeLineBox}>
                                                {detail.circulationStatus && detail.circulationStatus.map((circulation,index)=>{
                                                    return index === 2 ? null : <div key={index} className={`${cssStyle.timeLine} ${index === 1 ? cssStyle.timeLineTwo:''}`} style={{background:circulation.time ? 'rgb(0,191,191)':'rgb(170,170,170)'}}/>;
                                                })}
                                            </div>
                                            <div className={cssStyle.timeLineBox}>
                                                {detail.circulationStatus && detail.circulationStatus.map((circulation,index)=>{
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <div className={cssStyle.timePointBox}>
                                                                <div className={cssStyle.pointStatus}>{circulation.status}</div>
                                                                <div style={{background:circulation.time ? 'rgb(0,191,191)':'rgb(170,170,170)'}} className={cssStyle.timePoint}/>
                                                                <div className={cssStyle.pointTime}>{circulation.time}</div>
                                                            </div>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ):(
                                    <tr style={{height:'25%'}}>
                                        <td className={cssStyle.tdTitle} >上级主管部门</td>
                                        <td className={cssStyle.tdContent} style={{width:'46%'}}>
                                            <Scrollbars>{detail.unitInCharge}</Scrollbars>
                                        </td>
                                        <td className={cssStyle.tdTitle} >配合情况</td>
                                        <td className={cssStyle.tdContent} style={{width:'46%'}}>
                                            <Scrollbars>{detail.workSituation}</Scrollbars>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            {styleData.contentType === 2 ? (
                                <table className={cssStyle.table}>
                                    <tbody>
                                    <tr style={{height:'25%'}}>
                                        <td className={cssStyle.tdTitle}>涉事人数</td>
                                        <td className={cssStyle.tdContent} style={{width:'21%'}}>
                                            <Scrollbars>{detail.peopleNum}</Scrollbars>
                                        </td>
                                        <td className={cssStyle.tdTitle}>事件类别</td>
                                        <td className={cssStyle.tdContent} style={{width:'21%'}}>
                                            <Scrollbars>{detail.eventType}</Scrollbars>
                                        </td>
                                        <td className={cssStyle.tdTitle}>事发地点</td>
                                        <td className={cssStyle.tdContent} style={{width:'21%'}}>
                                            <Scrollbars>{detail.address}</Scrollbars>
                                        </td>
                                        <td className={cssStyle.tdTitle}>所属街道</td>
                                        <td className={cssStyle.tdContent} style={{width:'21%'}}>
                                            <Scrollbars>{detail.road}</Scrollbars>
                                        </td>
                                    </tr>
                                    <tr style={{height:'30%'}}>
                                        <td className={cssStyle.tdTitle}>是否重大</td>
                                        <td className={cssStyle.tdContent} colSpan={3} style={{width:'46%'}}>
                                            <Scrollbars>{detail.isGreat}</Scrollbars>
                                        </td>
                                        <td className={cssStyle.tdTitle}>是否紧急</td>
                                        <td className={cssStyle.tdContent} colSpan={3} style={{width:'46%'}}>
                                            <Scrollbars>{detail.isUrgent}</Scrollbars>
                                        </td>
                                    </tr>
                                    <tr style={{height:'45%'}}>
                                        <td className={cssStyle.tdTitle}>关联信息</td>
                                        <td className={cssStyle.tdContent} colSpan={7}>
                                            <Scrollbars>{detail.aboutMessage}</Scrollbars>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            ):(
                                <table className={cssStyle.table}>
                                    <tbody>
                                    <tr style={{height:'25%'}}>
                                        <td className={cssStyle.tdTitle}>基本诉求</td>
                                        <td className={cssStyle.tdContent} colSpan={3} style={{width:'96%'}}>
                                            <Scrollbars>{detail.basicAppeal}</Scrollbars>
                                        </td>
                                    </tr>
                                    <tr style={{height:'30%'}}>
                                        <td className={cssStyle.tdTitle}>诉求分析</td>
                                        <td className={cssStyle.tdContent} style={{width:'32%'}}>
                                            <div className={cssStyle.contentTitle}>合理诉求</div>
                                            <div className={cssStyle.contentDetail}>
                                                <Scrollbars>{detail.reasonableAppeal}</Scrollbars>
                                            </div>
                                        </td>
                                        <td className={cssStyle.tdContent} style={{width:'32%'}}>
                                            <div className={cssStyle.contentTitle}>无理诉求</div>
                                            <div className={cssStyle.contentDetail}>
                                                <Scrollbars>{detail.unreasonableAppeal}</Scrollbars>
                                            </div>
                                        </td>
                                        <td className={cssStyle.tdContent} style={{width:'32%'}}>
                                            <div className={cssStyle.contentTitle}>可协商诉求</div>
                                            <div className={cssStyle.contentDetail}>
                                                <Scrollbars>{detail.negotiableAppeal}</Scrollbars>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr style={{height:'45%'}}>
                                        <td className={cssStyle.tdTitle}>维权方式及群体动向</td>
                                        <td className={cssStyle.tdContent} colSpan={3}>
                                            <Scrollbars>{detail.safeguardWays}</Scrollbars>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            )}
                        </React.Fragment>
                    )}
                    {contentType === 1 && (
                        <React.Fragment >
                            <table className={cssStyle.table}>
                                <tbody>
                                <tr style={{height:'20%'}}>
                                    <td className={cssStyle.tdTitle} >责任单位</td>
                                    <td className={cssStyle.tdContent} style={{width:'46%'}}>
                                        <Scrollbars>{detail.department}</Scrollbars>
                                    </td>
                                    <td className={cssStyle.tdTitle} >包案领导</td>
                                    <td className={cssStyle.tdContent} style={{width:'23%'}}>
                                        <div className={cssStyle.contentTitle}>姓名</div>
                                        <div className={cssStyle.contentDetail}>
                                            <Scrollbars>{detail.dutyDepartmentLeader}</Scrollbars>
                                        </div>
                                    </td>
                                    <td className={cssStyle.tdContent} style={{width:'23%'}}>
                                        <div className={cssStyle.contentTitle}>职务</div>
                                        <div className={cssStyle.contentDetail}>
                                            <Scrollbars>{detail.dutyDepartmentJob}</Scrollbars>
                                        </div>
                                    </td>
                                </tr>
                                <tr style={{height:'30%'}}>
                                    <td className={cssStyle.tdTitle} >化解专班成员</td>
                                    <td className={cssStyle.tdContent} colSpan={4}>
                                        <div className={`${cssStyle.listRow} ${cssStyle.lightWhite}`}>
                                            {this.listTwoTitle.map((item,index) =>
                                                <div className={cssStyle.listTd} key={index} style={{width:item.width}}>
                                                    {item.name}
                                                </div>
                                            )}
                                        </div>
                                        <Scrollbars style={{height:'calc(100% - 2em)'}}>
                                            {detail.allControlList && detail.allControlList.map((item,index) =>
                                                <div className={`${cssStyle.listRow} ${cssStyle.listContent}`} key={index}>
                                                    {this.listTwoTitle.map((title,titleIndex) =>
                                                        <div className={cssStyle.listTd} key={titleIndex} style={{width:title.width}}>
                                                            {item[title.key]}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Scrollbars>
                                    </td>
                                </tr>
                                {styleData.contentType === 2 ? (
                                    <tr style={{height:'50%'}}>
                                        <td className={cssStyle.tdTitle} >稳控化解方案</td>
                                        <td className={cssStyle.tdContent} colSpan={4}>
                                            <Scrollbars>{detail.measure}</Scrollbars>
                                        </td>
                                    </tr>
                                ):(
                                    <tr style={{height:'50%'}}>
                                        <td className={cssStyle.tdTitle} >工作措施</td>
                                        <td className={cssStyle.tdContent} colSpan={4}>
                                            <Scrollbars>{detail.measure}</Scrollbars>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            <table className={cssStyle.table}>
                                {styleData.contentType === 2 ? (
                                    <tbody>
                                    <tr>
                                        <td className={cssStyle.tdTitle} >反馈内容</td>
                                        <td className={cssStyle.tdContent} >
                                            <Scrollbars>{detail.disposalSituation}</Scrollbars>
                                        </td>
                                    </tr>
                                    </tbody>
                                ):(
                                    <tbody>
                                    <tr style={{height:'40%'}}>
                                        <td className={cssStyle.tdTitle} >化解难点</td>
                                        <td className={cssStyle.tdContent} >
                                            <Scrollbars>{detail.dissovleDiff}</Scrollbars>
                                        </td>
                                    </tr>
                                    <tr style={{height:'40%'}}>
                                        <td className={cssStyle.tdTitle} >化解空间</td>
                                        <td className={cssStyle.tdContent} >
                                            <Scrollbars>{detail.dissovleAble}</Scrollbars>
                                        </td>
                                    </tr>
                                    <tr style={{height:'20%'}}>
                                        <td className={cssStyle.tdTitle} >化解期限</td>
                                        <td className={cssStyle.tdContent} >
                                            <Scrollbars>{detail.dissovleTimeLimit}</Scrollbars>
                                        </td>
                                    </tr>
                                    </tbody>
                                )}
                            </table>
                        </React.Fragment>
                    )}
                    {contentType === 2 && (
                        <React.Fragment >
                            <table className={cssStyle.table}>
                                <tbody>
                                <tr >
                                    <td className={cssStyle.tdTitle} >处置情况</td>
                                    <td className={cssStyle.tdContent} >
                                        <Scrollbars>{detail.disposalSituation}</Scrollbars>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <table className={cssStyle.table}>
                                <tbody>
                                <tr >
                                    <td className={cssStyle.tdTitle} >稳控情况</td>
                                    <td className={cssStyle.tdContent} >
                                        <Scrollbars>{detail.controlSituation}</Scrollbars>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}