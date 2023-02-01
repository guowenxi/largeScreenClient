import React from "react";
import cssStyle from "./importantPlace.module.css";
import RectTypeSix from "../../../common/svg/rectTypeSix";
import RectTypeSeven from "../../../common/svg/rectTypeSeven";
import BoxTypeOne from "../../../common/svg/boxTypeOne";
import RectTypeEight from "../../../common/svg/rectTypeEight";
import closeIcon from "../images/closeTypeOne.svg";
import {Scrollbars} from "react-custom-scrollbars";
import RectTypeFive from "../../../common/svg/rectTypeFive";
import itemBgOne from "../images/itemBgOne.svg";

export default class ImportantPlace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {contentType:0};
        this.menuList = ['水电气使用情况','银行账户','税收情况','诉讼情况','工伤及其他事故','安全生产事故','社保缴纳在册员工','信用信息'];
        this.levelColor = ['#14e8f2','#e80723','#eec759','#eec759'];
        this.levelName = ['关注','一级','二级','三级'];
        this.listOneTitle = [
            {name:'月份',key:'month',width:'15%'},
            {name:'抄表日期',key:'date',width:'15%'},
            {name:'电表数（度）',key:'electricNum',width:'15%'},
            {name:'电费（元）',key:'electricPrice',width:'15%'},
            {name:'水表数（m³）',key:'waterNum',width:'15%'},
            {name:'水费（元）',key:'waterPrice',width:'15%'},
            {name:'气表数（m³）',key:'gasNum',width:'15%'},
            {name:'气费（元）',key:'gasPrice',width:'15%'},
            {name:'当月总计',key:'total',width:'15%'},
        ];
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
                    <div className={cssStyle.menuButton} >
                        <RectTypeSix className={cssStyle.bgImg}/>
                        <span>基本信息</span>
                    </div>
                    <div className={cssStyle.headMessage}>
                        <div>监管等级：<span style={{color: this.levelColor[detail.regLevel]}}>{this.levelName[detail.regLevel]}</span></div>
                    </div>
                    <img alt='' src={closeIcon} className={cssStyle.closeIcon} onClick={this.closeDetail.bind(this)}/>
                </div>
                <div className={cssStyle.contentBox}>
                    <div className={cssStyle.boxOne}>
                        <RectTypeEight className={cssStyle.bgImg}/>
                        <table className={cssStyle.tableOne}>
                            <tbody>
                            <tr>
                                <td className={cssStyle.trTitle}>场所名称：</td>
                                <td className={cssStyle.trContent}>{detail.name}</td>
                                <td className={cssStyle.trTitle}>联系人：</td>
                                <td className={cssStyle.trContent}>{detail.user}</td>
                                <td className={cssStyle.trTitle}>联系方式：</td>
                                <td className={cssStyle.trContent}>{detail.phone}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.trTitle}>场所类型：</td>
                                <td className={cssStyle.trContent}>{detail.type}</td>
                                <td className={cssStyle.trTitle}>所属街道：</td>
                                <td className={cssStyle.trContent} colSpan={3}>{detail.road}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.trTitle}>登记时间：</td>
                                <td className={cssStyle.trContent}>{detail.time}</td>
                                <td className={cssStyle.trTitle}>经营范围：</td>
                                <td className={cssStyle.trContent} colSpan={3}>{detail.range}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.trTitle}>场所地址：</td>
                                <td className={cssStyle.trContent} colSpan={5}>{detail.address}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={cssStyle.boxTwo}>
                        <BoxTypeOne className={cssStyle.bgImg} headHeight={0}/>
                        <div className={cssStyle.menuBox}>
                            {this.menuList.map((text,index) =>
                                <div key={index} className={cssStyle.menuButton} onClick={this.changeContent.bind(this,index)}>
                                    {index === contentType ? <RectTypeSix className={cssStyle.bgImg}/>:<RectTypeSeven className={cssStyle.bgImg}/>}
                                    <span>{text}</span>
                                </div>
                            )}
                        </div>
                        <div className={cssStyle.listBox}>
                            <div className={`${cssStyle.listRow} ${cssStyle.listHead}`}>
                                {this.listOneTitle.map((item,index) =>
                                    <div className={cssStyle.listTd} key={index} style={{width:item.width}}>
                                        {item.name}
                                    </div>
                                )}
                            </div>
                            <Scrollbars style={{height:'calc(100% - 3em)'}}>
                                {detail.userList && detail.userList.map((item,index) =>
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
                    <div className={cssStyle.boxThree}>
                        <BoxTypeOne className={cssStyle.bgImg} headHeight={0}/>
                        <div className={`${cssStyle.menuButton} ${cssStyle.boxThreeTitle}`} >
                            <RectTypeFive className={cssStyle.bgImg}/>
                            <span>风险画像</span>
                        </div>
                        <div className={cssStyle.contentThree}>
                            <Scrollbars>
                                {detail.risk && detail.risk.map((item,index) =>
                                    <div key={index} className={cssStyle.contentThreeItem}>
                                        <img alt='' src={itemBgOne} className={cssStyle.bgImg}/>
                                        <span>{item}</span>
                                    </div>
                                )}
                            </Scrollbars>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}