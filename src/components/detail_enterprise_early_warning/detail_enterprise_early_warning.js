import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from '../../common/css/detail.module.css';
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import {Button} from "antd";
import Emitter from "../../common/eventBus";
import {
    getCompatibleData,
    getEventAboutBox, getPeopleAboutBox, getGoodsAboutBox,
    operation, sendMessage, getCloseDom
} from "../../common/detailUtil";
import {getCompatibleSizeList, interactData} from "../../common/util";
import iconTriangleOne from "../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../common/images/lanjiao_blue.svg";
import {systemArea} from "../../config";

export default class DetailEventEarlyWarning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showComponent: false, visible: false, operateType: null, aboutEventIndex: 0, aboutPeopleIndex: 0, aboutGoodsIndex:0, companyType: 0};
        this.keyParams = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getEventAboutBox = getEventAboutBox.bind(this);
        this.getPeopleAboutBox = getPeopleAboutBox.bind(this);
        this.getGoodsAboutBox = getGoodsAboutBox.bind(this);
        this.sendMessage = sendMessage.bind(this);
        this.interactData = interactData.bind(this);
        this.getCompatibleSizeList = getCompatibleSizeList.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.themeList = ['',cssStyle.themeOne];
        this.themeImgList = [iconTriangleOne,iconTriangleTwo];
        // this.warningLevelList = ["六级","一级", "二级", "三级", "四级", "五级", "六级"];
        // this.levelColor = ["#232349","rgb(221,80,80)","rgb(221,157,44)","rgb(219,199,15)","rgb(6,78,136)","rgb(30,155,41)","#232349"];
        this.warningLevelList = ["无风险","高风险", "中风险", "中风险", "低风险", "低风险", "无风险"];
        // this.levelColor = ["#232349","rgb(221,80,80)","rgb(221,157,44)","rgb(219,199,15)","rgb(6,78,136)","rgb(30,155,41)","#232349"];
        this.levelColor = ["#232349","rgb(221,80,80)","rgb(221,157,44)","rgb(221,157,44)","rgb(6,78,136)","rgb(6,78,136)","#232349"];
        this.warningTypeName = {"-1":"已结束","0":"未预警","1":"预警中"};
        this.warningTypeColor = {"-1":"#2bc8a1","0":"#1572e8","1":"#e60012"};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        // this.p = new Promise((resolve) => {
        //     this.getData(resolve)
        // });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        // this.p.then((data) => {
        //     this.setState({data});
        // });
        // this.getData();
        // this.changeThisShow(true);
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "changeKey" :
                //修改请求条件
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "animateOn":
                this.animateOn();
                break;
            case "showComponent":
                //修改请求条件
                let hasKey = false;
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                    hasKey = true;
                }
                this.detailId = data.data.id;
                this.setState({companyType:data.data.companyType});
                if(hasKey){
                    this.getData();
                }
                this.changeThisShow(true);
                break;
            default:
                break;
        }
    }

    //重新获取数据
    reGetData() {
        this.getData();
    }

    // 获取数据
    getData(resolve) {
        if (this.props.thisData.dataSources.dataType === 1) {
            let defaultData = {};
            try {
                defaultData = JSON.parse(this.props.thisData.dataSources.defaultData);
            } catch (e) {
            }
            if (resolve) {
                resolve(defaultData);
            } else {
                this.setState({data: defaultData});
            }
        } else if (this.props.thisData.dataSources.dataType === 2) {
            let params = {};
            try {
                params = JSON.parse(this.props.thisData.dataSources.dataParams);
            } catch (e) {
            }
            for (let key in this.keyParams) {
                params[key] = this.keyParams[key];
            }
            axios.get(this.props.thisData.dataSources.dataUrl, {params: params}).then((response) => {
                const result = response.data.data;
                if (resolve) {
                    resolve(result);
                } else {
                    this.setState({data: result, aboutEventIndex: 0, aboutPeopleIndex: 0, aboutGoodsIndex:0, hasRemove: false});
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    //当前组件显示隐藏
    changeThisShow(type) {
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: {showStatus: type, id: this.props.thisData.id}
        });
        this.setState({showComponent: type});
        if(!type){
            this.setState({data:{}});
            const {closeInteract} = this.props.thisData.style;
            this.interactData(closeInteract);
        }
    }

    render() {
        const detail = this.state.data ? this.state.data : {};
        const {style} = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
        this.iconTriangle = this.themeImgList[style.theme];
        const {wfssMap,eyqsMap} = detail;
        const border = {borderStyle: style.borderStyle, borderWidth: style.borderWidth, borderColor: style.borderColor, borderRadius: style.borderRadius};
        return (
            <ComponentBox
                id={this.props.thisData.id}
                thisData={this.props.thisData}
                receiveMessage={this.receiveMessage.bind(this)}
                reGetData={this.reGetData.bind(this)}
                style={this.props.style}
            >
                <Motion style={{top: spring(this.props.thisData.showStatus ? 0 : 100)}}>
                    {({top}) => {
                        return (
                            <div
                                className={`${cssStyle.detailBox} ${this.themeList[style.theme]}`}
                                style={{backgroundColor: style.bgColor, top: -top + '%', padding:compatibleSize.padding,...border}}
                            >
                                <div className={cssStyle.headBox} style={{minHeight:compatibleSize.titleHeight}}>
                                    <div className={cssStyle.head} style={{fontSize:compatibleSize.titleSize,color: style.titleColor,width:style.titleWidth}}>{detail.companyName}</div>
                                    <div className={cssStyle.headGap} style={{backgroundColor: style.bgColor}}/>
                                </div>
                                {this.getCloseDom(style,compatibleSize)}
                                <Scrollbars style={{fontSize:compatibleSize.fontSize,flex:1}}>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead}>
                                            <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
                                            <div className={cssStyle.itemTitle}>基本信息</div>
                                        </div>
                                        <table className={cssStyle.itemContent}>
                                            <tbody>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>预警类型</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>{detail.companyTypeName}</td>
                                                {/*<td className={cssStyle.tdTitle}>预警状态</td>*/}
                                                {/*<td className={cssStyle.tdContent} style={{color:this.warningTypeColor[detail.isWarning]}}>{this.warningTypeName[detail.isWarning]}</td>*/}
                                            </tr>
                                           {/* <tr>
                                                <td className={cssStyle.tdTitle}>相似度</td>
                                                <td className={cssStyle.tdContent} >{detail.similarity ? detail.similarity+'%':''}</td>
                                                <td className={cssStyle.tdTitle}>研判时间</td>
                                                <td className={cssStyle.tdContent}>{detail.createTime}</td>
                                            </tr>*/}
                                            <tr>
                                                <td className={cssStyle.tdTitle}>预警等级</td>
                                                <td className={cssStyle.tdContent} style={{color:this.levelColor[detail.warningLevel]}}>{this.warningLevelList[detail.warningLevel]}</td>
                                                <td className={cssStyle.tdTitle}>预警时间</td>
                                                <td className={cssStyle.tdContent}>{detail.warningTime}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>电话</td>
                                                <td className={cssStyle.tdContent}>{detail.phone}</td>
                                                <td className={cssStyle.tdTitle}>邮箱</td>
                                                <td className={cssStyle.tdContent}>{detail.email}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>官网</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.website}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>地址</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.companyAddress}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>简介</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.companyDesc}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {wfssMap && (
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.itemHead}>
                                                <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
                                                <div className={cssStyle.itemTitle}>严重违法失信相关信息</div>
                                            </div>
                                            <table className={cssStyle.itemContent}>
                                                <tbody>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>营业执照<br/>注册号</td>
                                                    <td className={cssStyle.tdContent} >{wfssMap.regno}</td>
                                                    <td className={cssStyle.tdTitle}>主体身份<br/>代码</td>
                                                    <td className={cssStyle.tdContent} >{wfssMap.pripid}</td>
                                                </tr>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>统一社会<br/>信用代码</td>
                                                    <td className={cssStyle.tdContent} colSpan={3}>{wfssMap.uniscid}</td>
                                                </tr>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>决定机关<br/>(列入)</td>
                                                    <td className={cssStyle.tdContent}>{wfssMap.decorg_cn}</td>
                                                    <td className={cssStyle.tdTitle}>列入日期</td>
                                                    <td className={cssStyle.tdContent}>{wfssMap.abntime}</td>
                                                </tr>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>列入原因</td>
                                                    <td className={cssStyle.tdContent} colSpan={3}>{wfssMap.serillrea_cn}</td>
                                                </tr>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>决定机关<br/>(移出)</td>
                                                    <td className={cssStyle.tdContent}>{wfssMap.recorg_cn}</td>
                                                    <td className={cssStyle.tdTitle}>移出日期</td>
                                                    <td className={cssStyle.tdContent}>{wfssMap.remdate}</td>
                                                </tr>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>移出原因</td>
                                                    <td className={cssStyle.tdContent} colSpan={3}>{wfssMap.remexcpres_cn}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {eyqsMap && (
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.itemHead}>
                                                <img alt='' src={this.iconTriangle} className={cssStyle.itemHeadIcon}/>
                                                <div className={cssStyle.itemTitle}>恶意欠税相关信息</div>
                                            </div>
                                            <table className={cssStyle.itemContent}>
                                                <tbody>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>签名机关</td>
                                                    <td className={cssStyle.tdContent} >{eyqsMap.qmjg}</td>
                                                    <td className={cssStyle.tdTitle}>登记序号</td>
                                                    <td className={cssStyle.tdContent} >{eyqsMap.djxh}</td>
                                                </tr>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>统一社会<br/>信用代码</td>
                                                    <td className={cssStyle.tdContent} colSpan={3}>{eyqsMap.shxydm}</td>
                                                </tr>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>纳税人<br/>识别号</td>
                                                    <td className={cssStyle.tdContent}>{eyqsMap.nsrsbh}</td>
                                                    <td className={cssStyle.tdTitle}>纳税人<br/>名称</td>
                                                    <td className={cssStyle.tdContent}>{eyqsMap.nsrmc}</td>
                                                </tr>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>生产经营<br/>地址</td>
                                                    <td className={cssStyle.tdContent} colSpan={3}>{eyqsMap.scjydz}</td>
                                                </tr>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>法定代表人</td>
                                                    <td className={cssStyle.tdContent}>{eyqsMap.xm}</td>
                                                    <td className={cssStyle.tdTitle}>证件号码</td>
                                                    <td className={cssStyle.tdContent}>{eyqsMap.zjhm}</td>
                                                </tr>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>欠税金额</td>
                                                    <td className={cssStyle.tdContent} colSpan={3}>{eyqsMap.qsjehj}</td>
                                                </tr>
                                                <tr>
                                                    <td className={cssStyle.tdTitle}>统计截止<br/>年月</td>
                                                    <td className={cssStyle.tdContent}>{eyqsMap.tjjzny}</td>
                                                    <td className={cssStyle.tdTitle}>统计时间</td>
                                                    <td className={cssStyle.tdContent}>{eyqsMap.tjsj}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {this.getEventAboutBox(detail.emphasesEventEventVoList,this.detailId,3)}
                                    {this.getPeopleAboutBox(detail.emphasesCompanyPeopleVoList,this.detailId,3)}
                                    {this.getGoodsAboutBox(detail.companyGoodsList,this.detailId,5)}
                                </Scrollbars>
                                {detail.isDetermine === -1 && !this.state.hasRemove && (
                                    <div className={cssStyle.bottomBox} style={{fontSize:compatibleSize.fontSize}}>
                                        <Button type="danger" style={{fontSize:compatibleSize.fontSize}} onClick={operation.bind(this,this.detailId,4)}>排除</Button>
                                        {systemArea !== 'linan' && systemArea !== 'ruian' && (
                                            <Button type="primary" style={{fontSize:compatibleSize.fontSize,marginLeft:'1em'}} onClick={operation.bind(this,this.detailId,5)} >转为重点企业</Button>
                                        )}
                                    </div>
                                )}
                                {this.state.hasRemove && (
                                    <div className={cssStyle.bottomBox} style={{fontSize:compatibleSize.fontSize}}>
                                        <Button type="danger" style={{fontSize:compatibleSize.fontSize}} >已排除</Button>
                                    </div>
                                )}
                            </div>
                        )
                    }}
                </Motion>
            </ComponentBox>
        )
    }
}