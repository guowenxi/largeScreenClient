import React from "react";
import cssStyle from "./importantPeople.module.css";
import RectTypeSix from "../../../common/svg/rectTypeSix";
import RectTypeSeven from "../../../common/svg/rectTypeSeven";
import RectTypeFive from "../../../common/svg/rectTypeFive";
import RectTypeEight from "../../../common/svg/rectTypeEight";
import boxBgOne from "../images/boxBgOne.svg";
import boxBgTwo from "../images/boxBgTwo.svg";
import closeIcon from "../images/closeTypeOne.svg";
import {Scrollbars} from "react-custom-scrollbars";

export default class ImportantPeople extends React.Component {
    constructor(props) {
        super(props);
        this.state = {contentType:0};
        this.menuList = ['基本信息','化解情况','异动情况'];
        this.levelColor = ['#14e8f2','#e80723','#eec759','#eec759'];
        this.levelName = ['关注','一级','二级','三级'];
        this.menuListTwo = ['信访记录','交通违法','刑法信息','个人征信','缴纳情况'];
        this.listOneTitle = [{name:'事件编号',key:'no',width:'15%'},{name:'上访时间',key:'time',width:'15%'},{name:'问题',key:'content',width:'15%'},{name:'问题属地',key:'address',width:'15%'},{name:'方式',key:'way',width:'15%'},{name:'事件状态',key:'status',width:'15%'}];
        this.listTwoTitle = [{name:'姓名',key:'name',width:'15%'},{name:'关系',key:'relation',width:'15%'},{name:'手机号',key:'phone',width:'15%'},{name:'居住地',key:'address',width:'25%'},{name:'工作单位及职务',key:'workCompany',width:'25%'}];
        this.listThreeTitle = [{name:'姓名',key:'name',width:'15%'},{name:'工作单位',key:'department',width:'15%'},{name:'职务',key:'duty',width:'15%'},{name:'联系电话',key:'phone',width:'25%'}];
        this.listFourTitle = [{name:'时间',key:'time',width:'15%'},{name:'类型',key:'type',width:'10%'},{name:'批次/人次',key:'number',width:'10%'},{name:'列控事由',key:'reason',width:'65%'}];
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
        const {detail} = this.props;
        const {contentType} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.headBox}>
                    {this.menuList.map((text,index) =>
                        <div key={index} className={cssStyle.menuButton} onClick={this.changeContent.bind(this,index)}>
                            {index === contentType ? <RectTypeSix className={cssStyle.bgImg}/>:<RectTypeSeven className={cssStyle.bgImg}/>}
                            <span>{text}</span>
                        </div>
                    )}
                    <div className={cssStyle.headMessage}>
                        <div>化解状态：<span style={{color:detail.isSolve === 1 ? '#12cc5e':'#e80723'}}>{detail.isSolve === 1 ? '已化解':'未化解'}</span></div>
                        <div>类别：<span style={{color: '#eec759'}}>{detail.peopleType}</span></div>
                        <div>管控等级：<span style={{color: this.levelColor[detail.level]}}>{this.levelName[detail.level]}</span></div>
                    </div>
                    <img alt='' src={closeIcon} className={cssStyle.closeIcon} onClick={this.closeDetail.bind(this)}/>
                </div>
                <div className={cssStyle.contentBox}>
                    {contentType === 0 && (
                        <React.Fragment >
                            <img alt='' src={detail.headImg} className={cssStyle.headImg} />
                            <div className={cssStyle.detailBox}>
                                <img alt='' src={boxBgTwo} className={cssStyle.bgImg}/>
                                <table className={`${cssStyle.tableOne} ${cssStyle.detailOne}`}>
                                    <tbody>
                                    <tr>
                                        <td className={cssStyle.trTitle}>姓　　名：</td>
                                        <td className={cssStyle.trContent}>{detail.name}</td>
                                        <td className={cssStyle.trTitle}>民　　族：</td>
                                        <td className={cssStyle.trContent}>{detail.nation}</td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.trTitle}>性　　别：</td>
                                        <td className={cssStyle.trContent}>{detail.sex}</td>
                                        <td className={cssStyle.trTitle}>籍　　贯：</td>
                                        <td className={cssStyle.trContent}>{detail.nation}</td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.trTitle}>身份证号：</td>
                                        <td className={cssStyle.trContent} colSpan={3}>{detail.cardId}</td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.trTitle}>手机电话：</td>
                                        <td className={cssStyle.trContent} colSpan={3}>{detail.phone}</td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.trTitle}>详细地址：</td>
                                        <td className={cssStyle.trContent} colSpan={3}>{detail.address}</td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.trTitle}>车辆类型：</td>
                                        <td className={cssStyle.trContent}>{detail.carType}</td>
                                        <td className={cssStyle.trTitle}>车牌号码：</td>
                                        <td className={cssStyle.trContent}>{detail.carId}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <table className={`${cssStyle.tableOne} ${cssStyle.detailTwo}`}>
                                    <tbody>
                                    <tr>
                                        <td className={cssStyle.trTitle}>身份证号：</td>
                                        <td className={cssStyle.trContent} colSpan={3}>{detail.cardId}</td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.trTitle}>手机电话：</td>
                                        <td className={cssStyle.trContent} colSpan={3}>{detail.phone}</td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.trTitle}>详细地址：</td>
                                        <td className={cssStyle.trContent} colSpan={3}>{detail.address}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div className={cssStyle.menuBox}>
                                    {this.menuListTwo.map((text,index) =>
                                        <div key={index} className={cssStyle.menuButton} onClick={this.changeContent.bind(this,index)}>
                                            {index === contentType ? <RectTypeSix className={cssStyle.bgImg}/>:<RectTypeSeven className={cssStyle.bgImg}/>}
                                            <span>{text}</span>
                                        </div>
                                    )}
                                </div>
                                <div className={cssStyle.listOne}>
                                    <div className={`${cssStyle.listRow} ${cssStyle.listOneHead}`}>
                                        {this.listOneTitle.map((item,index) =>
                                            <div className={cssStyle.listTd} key={index} style={{width:item.width}}>
                                                {item.name}
                                            </div>
                                        )}
                                    </div>
                                    <Scrollbars style={{height:'calc(100% - 2em)'}}>
                                        {detail.reportList && detail.reportList.map((item,index) =>
                                            <div className={`${cssStyle.listRow}`} key={index}>
                                                {this.listOneTitle.map((title,titleIndex) =>
                                                    <div className={cssStyle.listTd} key={titleIndex} style={{width:title.width}}>
                                                        {item[title.key]}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Scrollbars>
                                </div>
                            </div>
                            <div className={cssStyle.listTwoBox}>
                                <img alt='' src={boxBgOne} className={cssStyle.bgImg}/>
                                <div className={`${cssStyle.menuButton} ${cssStyle.listTwoTitle}`} >
                                    <RectTypeFive className={cssStyle.bgImg}/>
                                    <span>关系人</span>
                                </div>
                                <div className={cssStyle.listTwo}>
                                    <div className={`${cssStyle.listRow} ${cssStyle.listOneHead}`}>
                                        {this.listTwoTitle.map((item,index) =>
                                            <div className={cssStyle.listTd} key={index} style={{width:item.width}}>
                                                {item.name}
                                            </div>
                                        )}
                                    </div>
                                    <Scrollbars style={{height:'calc(100% - 2em)'}}>
                                        {detail.aboutList && detail.aboutList.map((item,index) =>
                                            <div className={`${cssStyle.listRow}`} key={index}>
                                                {this.listTwoTitle.map((title,titleIndex) =>
                                                    <div className={cssStyle.listTd} key={titleIndex} style={{width:title.width}}>
                                                        {item[title.key]}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Scrollbars>
                                </div>
                            </div>
                            <div className={cssStyle.listThreeBox}>
                                <img alt='' src={boxBgOne} className={cssStyle.bgImg}/>
                                <div className={`${cssStyle.menuButton} ${cssStyle.listTwoTitle}`} >
                                    <RectTypeFive className={cssStyle.bgImg}/>
                                    <span>稳控专班</span>
                                </div>
                                <div className={cssStyle.listThree}>
                                    <Scrollbars>
                                        {detail.controlLeader && (
                                            <div className={cssStyle.listThreeItemOne}>
                                                <div className={cssStyle.itemOneTr}>
                                                    <div className={`${cssStyle.td} ${cssStyle.titleTd}`}>包案领导：</div>
                                                    <div className={`${cssStyle.td} ${cssStyle.blue}`}>{detail.controlLeader.name}</div>
                                                </div>
                                                <div className={cssStyle.itemOneTr}>
                                                    <div className={`${cssStyle.td} ${cssStyle.titleTd}`}>职务：</div>
                                                    <div className={`${cssStyle.td}`}>{detail.controlLeader.duty}</div>
                                                </div>
                                                <div className={cssStyle.itemOneTr}>
                                                    <div className={`${cssStyle.td} ${cssStyle.titleTd}`}>电话：</div>
                                                    <div className={`${cssStyle.td}`}>{detail.controlLeader.phone}</div>
                                                </div>
                                            </div>
                                        )}
                                        {detail.dutyLeader && (
                                            <div className={cssStyle.listThreeItemOne}>
                                                <div className={cssStyle.itemOneTr}>
                                                    <div className={`${cssStyle.td} ${cssStyle.titleTd}`}>责任领导：</div>
                                                    <div className={`${cssStyle.td} ${cssStyle.blue}`}>{detail.dutyLeader.name}</div>
                                                </div>
                                                <div className={cssStyle.itemOneTr}>
                                                    <div className={`${cssStyle.td} ${cssStyle.titleTd}`}>职务：</div>
                                                    <div className={`${cssStyle.td}`}>{detail.dutyLeader.duty}</div>
                                                </div>
                                                <div className={cssStyle.itemOneTr}>
                                                    <div className={`${cssStyle.td} ${cssStyle.titleTd}`}>电话：</div>
                                                    <div className={`${cssStyle.td}`}>{detail.dutyLeader.phone}</div>
                                                </div>
                                            </div>
                                        )}
                                        {detail.controlList && detail.controlList.map((item,index) =>
                                            <div className={cssStyle.listThreeItemTwo} key={index}>
                                                <div className={cssStyle.itemTwoTr}>
                                                    <div className={`${cssStyle.td} ${cssStyle.titleTd}`}>姓名：</div>
                                                    <div className={`${cssStyle.td} ${cssStyle.blue}`}>{item.name}</div>
                                                </div>
                                                <div className={cssStyle.itemTwoTr}>
                                                    <div className={`${cssStyle.td} ${cssStyle.titleTd}`}>职务：</div>
                                                    <div className={`${cssStyle.td}`}>{item.duty}</div>
                                                </div>
                                                <div className={cssStyle.itemTwoTr}>
                                                    <div className={`${cssStyle.td} ${cssStyle.titleTd}`}>电话：</div>
                                                    <div className={`${cssStyle.td}`}>{item.phone}</div>
                                                </div>
                                            </div>
                                        )}
                                    </Scrollbars>
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                    {contentType === 1 && (
                        <React.Fragment >
                            <table className={cssStyle.tableTwo}>
                                <tbody>
                                <tr style={{height:'20%'}}>
                                    <td className={cssStyle.tdTitle}>基本诉求</td>
                                    <td className={cssStyle.tdContent} colSpan={3} style={{width:'96%'}}>
                                        <Scrollbars>{detail.requireContent}</Scrollbars>
                                    </td>
                                </tr>
                                <tr style={{height:'25%'}}>
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
                                <tr style={{height:'30%'}}>
                                    <td className={cssStyle.tdTitle}>化解工作进展情况</td>
                                    <td className={cssStyle.tdContent} colSpan={3}>
                                        <Scrollbars>{detail.defuseEvolve}</Scrollbars>
                                    </td>
                                </tr>
                                <tr style={{height:'25%'}}>
                                    <td className={cssStyle.tdTitle}>化解难点</td>
                                    <td className={cssStyle.tdContent} colSpan={3}>
                                        <Scrollbars>{detail.dissovleDiff}</Scrollbars>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <table className={cssStyle.tableTwo}>
                                <tbody>
                                <tr style={{height:'25%'}}>
                                    <td className={cssStyle.tdTitle} style={{lineHeight:'1.2em'}}>化解的空间和余地</td>
                                    <td className={cssStyle.tdContent} colSpan={5}>
                                        <Scrollbars>{detail.dissovleAble}</Scrollbars>
                                    </td>
                                </tr>
                                <tr style={{height:'20%'}}>
                                    <td className={cssStyle.tdTitle}>处理情况</td>
                                    <td className={cssStyle.tdContent} style={{width:'24%'}}>
                                        <div className={cssStyle.contentTitle}>非理性维权及上访情况</div>
                                        <div className={cssStyle.contentDetail}>
                                            <Scrollbars>{detail.petitionContent}</Scrollbars>
                                        </div>
                                    </td>
                                    <td className={cssStyle.tdContent} style={{width:'24%'}} colSpan={2}>
                                        <div className={cssStyle.contentTitle}>前科劣迹记录</div>
                                        <div className={cssStyle.contentDetail}>
                                            <Scrollbars>{detail.criminalRecord}</Scrollbars>
                                        </div>
                                    </td>
                                    <td className={cssStyle.tdContent} style={{width:'24%'}}>
                                        <div className={cssStyle.contentTitle}>被打击处理情况</div>
                                        <div className={cssStyle.contentDetail}>
                                            <Scrollbars>{detail.dealtBlow}</Scrollbars>
                                        </div>
                                    </td>
                                    <td className={cssStyle.tdContent} style={{width:'24%'}}>
                                        <div className={cssStyle.contentTitle}>下一步措施</div>
                                        <div className={cssStyle.contentDetail}>
                                            <Scrollbars>{detail.nextStep}</Scrollbars>
                                        </div>
                                    </td>
                                </tr>
                                <tr style={{height:'13%'}} >
                                    <td className={cssStyle.tdTitle} style={{lineHeight:'1.2em'}}>责任单位</td>
                                    <td className={cssStyle.tdContent} style={{width:'44%'}} colSpan={2}>
                                        {detail.dutyDepartment}
                                    </td>
                                    <td className={cssStyle.tdTitle} style={{lineHeight:'1.2em'}}>责任人</td>
                                    <td className={cssStyle.tdContent} style={{width:'24%'}}>
                                        <div className={cssStyle.contentTitle}>姓名</div>
                                        <div className={cssStyle.contentDetail}>
                                            <Scrollbars>{detail.dutyDepartmentLeader}</Scrollbars>
                                        </div>
                                    </td>
                                    <td className={cssStyle.tdContent} style={{width:'24%'}}>
                                        <div className={cssStyle.contentTitle}>职务</div>
                                        <div className={cssStyle.contentDetail}>
                                            <Scrollbars>{detail.dutyDepartmentJob}</Scrollbars>
                                        </div>
                                    </td>
                                </tr>
                                <tr style={{height:'24%'}}>
                                    <td className={cssStyle.tdTitle} style={{lineHeight:'1.2em'}}>稳控专班成员</td>
                                    <td className={cssStyle.tdContent} colSpan={5}>
                                        <div className={`${cssStyle.listRow} ${cssStyle.lightWhite}`}>
                                            {this.listThreeTitle.map((item,index) =>
                                                <div className={cssStyle.listTd} key={index} style={{width:item.width}}>
                                                    {item.name}
                                                </div>
                                            )}
                                        </div>
                                        <Scrollbars style={{height:'calc(100% - 2em)'}}>
                                            {detail.allControlList && detail.allControlList.map((item,index) =>
                                                <div className={`${cssStyle.listRow}`} key={index}>
                                                    {this.listThreeTitle.map((title,titleIndex) =>
                                                        <div className={cssStyle.listTd} key={titleIndex} style={{width:title.width}}>
                                                            {item[title.key]}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Scrollbars>
                                    </td>
                                </tr>
                                <tr style={{height:'18%'}}>
                                    <td className={cssStyle.tdTitle} style={{lineHeight:'1em'}}>稳控期间表现</td>
                                    <td className={cssStyle.tdContent} colSpan={5}>
                                        <Scrollbars>{detail.controlTimePerfor}</Scrollbars>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </React.Fragment>
                    )}
                    {contentType === 2 && (
                        <React.Fragment >
                            <div className={`${cssStyle.listRow} ${cssStyle.listFourHead}`}>
                                {this.listFourTitle.map((item,index) =>
                                    <div className={cssStyle.listTd} key={index} style={{width:item.width}}>
                                        {item.name}
                                    </div>
                                )}
                            </div>
                            <Scrollbars style={{height:'calc(100% - 2em)'}}>
                                {detail.history && detail.history.map((item,index) =>
                                    <div className={`${cssStyle.listRow} ${cssStyle.listFourContent}`} key={index}>
                                        <RectTypeEight className={cssStyle.bgImg}/>
                                        {this.listFourTitle.map((title,titleIndex) =>
                                            <div className={cssStyle.listTd} key={titleIndex} style={{width:title.width}}>
                                                {item[title.key]}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Scrollbars>
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}