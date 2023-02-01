import React from "react";

import ComponentBox from "../component_box";
import cssStyle from '../../common/css/detail.module.css';
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import Emitter from "../../common/eventBus";
import {
    getCompatibleData,
    getCloseDom, changeState
} from "../../common/detailUtil";
import iconTriangleOne from "../../common/images/lanjiao_black.svg";
import iconTriangleTwo from "../../common/images/lanjiao_blue.svg";
import {getCompatibleSizeList, interactData} from "../../common/util";
import {getData} from "../../common/getDataUtil";

export default class DetailCar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showComponent: false, visible: false, operateType: null, lifeCycleIndex: 0, dispatchRecordIndex: 0, addOilIndex: 0};
        this.keyParams = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getCompatibleSizeList = getCompatibleSizeList.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.themeList = ['',cssStyle.themeOne];
        this.themeImgList = [iconTriangleOne,iconTriangleTwo];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        // this.p = new Promise((resolve) => {
        //     this.getData(this.callBack.bind(this, resolve))
        // });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //挂载数据到页面显示
    animateOn() {
        this.reGetData();
        // this.p.then((data) => {
        //     this.setState({data});
        // });
        // this.getData();
        // this.changeThisShow(true);
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            // case "changeKey" :
            //     //修改请求条件
            //     for (let key in data.data) {
            //         this.keyParams[key] = data.data[key];
            //     }
            //     this.reGetData();
            //     break;
            case "animateOn":
                this.animateOn();
                break;
            case "changeKey" :
            case "showComponent":
                //修改请求条件
                let hasKey = false;
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                    hasKey = true;
                }
                if(hasKey){
                    this.reGetData();
                }
                if(data.type === 'showComponent'){
                    this.changeThisShow(true);
                }
                break;
            default:
                break;
        }
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (result) {
            if (resolve) {
                resolve(result);
            } else {
                this.setState({data: result});
            }
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

    getListContent(list,iconTriangle,name,indexName,contentFun){
        return list && list.length>0 && (
            <div className={cssStyle.itemBox}>
                <div className={cssStyle.itemHead}>
                    <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
                    <div className={cssStyle.itemTitle}>{name}</div>
                </div>
                <div className={cssStyle.tabBox}>
                    {list.map((item,index) =>
                        <div key={index} className={`${cssStyle.tabItem} ${index === this.state[indexName] ? cssStyle.selectedTab:''}`} onClick={changeState.bind(this,indexName,index)}>
                            <div className={cssStyle.tabName}>{'记录'+(index+1)}</div>
                        </div>
                    )}
                </div>
                {contentFun(list[this.state[indexName]])}
            </div>
        );
    }

    getLifeCycle(detail){
        if(detail){
            return (
                <table className={cssStyle.itemContent}>
                    <tbody>
                    <tr>
                        <td className={cssStyle.tdTitle}>时间</td>
                        <td className={cssStyle.tdContent}>{detail.time}</td>
                        <td className={cssStyle.tdTitle}>项目</td>
                        <td className={cssStyle.tdContent}>{detail.type}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>费用</td>
                        <td className={cssStyle.tdContent}>{detail.price ? '¥'+detail.price:''}</td>
                        <td className={cssStyle.tdTitle}>申请人</td>
                        <td className={cssStyle.tdContent}>{detail.user}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>备注</td>
                        <td className={cssStyle.tdContent} colSpan={3}>{detail.remark}</td>
                    </tr>
                    </tbody>
                </table>
            );
        }
    }

    getDispatchRecord(detail){
        if(detail){
            return (
                <table className={cssStyle.itemContent}>
                    <tbody>
                    <tr>
                        <td className={cssStyle.tdTitle}>时间</td>
                        <td className={cssStyle.tdContent}>{detail.time}</td>
                        <td className={cssStyle.tdTitle}>部门</td>
                        <td className={cssStyle.tdContent}>{detail.dep}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>申请人</td>
                        <td className={cssStyle.tdContent}>{detail.user}</td>
                        <td className={cssStyle.tdTitle}>司机</td>
                        <td className={cssStyle.tdContent}>{detail.driver}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>始发地</td>
                        <td className={cssStyle.tdContent}>{detail.addressStart}</td>
                        <td className={cssStyle.tdTitle}>目的地</td>
                        <td className={cssStyle.tdContent}>{detail.addressEnd}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>行驶路程数</td>
                        <td className={cssStyle.tdContent} colSpan={3}>{detail.mileage}</td>
                    </tr>
                    </tbody>
                </table>
            );
        }
    }

    getAddOil(detail){
        if(detail){
            return (
                <table className={cssStyle.itemContent}>
                    <tbody>
                    <tr>
                        <td className={cssStyle.tdTitle}>时间</td>
                        <td className={cssStyle.tdContent}>{detail.time}</td>
                        <td className={cssStyle.tdTitle}>申请人</td>
                        <td className={cssStyle.tdContent}>{detail.user}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>上次里程数</td>
                        <td className={cssStyle.tdContent}>{detail.lastMileage}</td>
                        <td className={cssStyle.tdTitle}>加油量（升）</td>
                        <td className={cssStyle.tdContent}>{detail.addNum}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>油费</td>
                        <td className={cssStyle.tdContent}>{detail.price ? '¥'+detail.price:''}</td>
                        <td className={cssStyle.tdTitle}>里程数</td>
                        <td className={cssStyle.tdContent}>{detail.mileage}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>范围</td>
                        <td className={cssStyle.tdContent} colSpan={3}>{detail.range}</td>
                    </tr>
                    </tbody>
                </table>
            );
        }
    }

    render() {
        const detail = this.state.data ? this.state.data : {};
        const {style} = this.props.thisData;
        const compatibleSize = this.getCompatibleData(style);
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
                                style={{backgroundColor: style.bgColor, top: -top + '%', padding:compatibleSize.padding}}
                            >
                                <div className={cssStyle.headBox} style={{height:compatibleSize.titleHeight}}>
                                    <div className={cssStyle.head} style={{fontSize:compatibleSize.titleSize,color: style.titleColor,width:style.titleWidth}}>{detail.licensePlateNumber}</div>
                                </div>
                                {this.getCloseDom(style,compatibleSize)}
                                <Scrollbars style={{height: 'calc(100% - ' + compatibleSize.titleHeight + ')',fontSize:compatibleSize.fontSize}}>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead}>
                                            <img alt='' src={this.themeImgList[style.theme]} className={cssStyle.itemHeadIcon}/>
                                            <div className={cssStyle.itemTitle}>基本信息</div>
                                        </div>
                                        <table className={cssStyle.itemContent}>
                                            <tbody>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>类型</td>
                                                <td className={cssStyle.tdContent}>{detail.type}</td>
                                                <td className={cssStyle.tdTitle}>车辆品牌</td>
                                                <td className={cssStyle.tdContent}>{detail.brand}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>颜色</td>
                                                <td className={cssStyle.tdContent}>{detail.color}</td>
                                                <td className={cssStyle.tdTitle}>车牌号</td>
                                                <td className={cssStyle.tdContent}>{detail.licensePlateNumber}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>单价</td>
                                                <td className={cssStyle.tdContent}>{detail.price ? '¥'+detail.price:''}</td>
                                                <td className={cssStyle.tdTitle}>当前状态</td>
                                                <td className={cssStyle.tdContent}>{detail.status}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>账面价格</td>
                                                <td className={cssStyle.tdContent}>{detail.price}</td>
                                                <td className={cssStyle.tdTitle}>购车价格</td>
                                                <td className={cssStyle.tdContent}>{detail.carPrice}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>年检时间</td>
                                                <td className={cssStyle.tdContent}>{detail.inspectTime}</td>
                                                <td className={cssStyle.tdTitle}>维修保养费</td>
                                                <td className={cssStyle.tdContent}>{detail.repairPrice}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>燃油费</td>
                                                <td className={cssStyle.tdContent}>{detail.fuelPrice}</td>
                                                <td className={cssStyle.tdTitle}>保险费</td>
                                                <td className={cssStyle.tdContent}>{detail.insurancePrice}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>过路过桥费</td>
                                                <td className={cssStyle.tdContent}>{detail.paddPrice}</td>
                                                <td className={cssStyle.tdTitle}>充电费</td>
                                                <td className={cssStyle.tdContent}>{detail.chargePrice}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {this.getListContent(detail.lifeCycleList,this.themeImgList[style.theme],'生命周期','lifeCycleIndex',this.getLifeCycle)}
                                    {this.getListContent(detail.dispatchRecordList,this.themeImgList[style.theme],'调派记录','dispatchRecordIndex',this.getDispatchRecord)}
                                    {/*{this.getListContent(detail.addOilList,this.themeImgList[style.theme],'加油记录','addOilIndex',this.getAddOil)}*/}
                                </Scrollbars>
                            </div>
                        )
                    }}
                </Motion>
            </ComponentBox>
        )
    }
}