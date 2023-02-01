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
import {getCompatibleSizeList} from "../../common/util";
import {getData} from "../../common/getDataUtil";

export default class DetailGoods extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showComponent: false, visible: false, operateType: null, maintainIndex: 0, repairIndex: 0, dispatchIndex: 0};
        this.keyParams = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.getCompatibleSizeList = getCompatibleSizeList.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.getData = getData.bind(this);
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
                if(hasKey){
                    this.reGetData();
                }
                this.changeThisShow(true);
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
        }
    }

    getListContent(list,iconTriangle,name,type){
        const indexName = type === 1 ? 'maintainIndex' : (type === 2 ? 'repairIndex':'dispatchIndex');
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
                {this.getMaintainContent(list[this.state[indexName]])}
            </div>
        );
    }

    getMaintainContent(detail){
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
                        <td className={cssStyle.tdTitle}>联系方式</td>
                        <td className={cssStyle.tdContent}>{detail.phone}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle}>存放地点</td>
                        <td className={cssStyle.tdContent} colSpan={3}>{detail.address}</td>
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
                                    <div className={cssStyle.head} style={{fontSize:compatibleSize.titleSize,color: style.titleColor,width:style.titleWidth}}>{detail.name}</div>
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
                                                <td className={cssStyle.tdTitle}>型号</td>
                                                <td className={cssStyle.tdContent}>{detail.model}</td>
                                                <td className={cssStyle.tdTitle}>所属区县</td>
                                                <td className={cssStyle.tdContent}>{detail.area}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>所属类别</td>
                                                <td className={cssStyle.tdContent}>{detail.type}</td>
                                                <td className={cssStyle.tdTitle}>物品编号</td>
                                                <td className={cssStyle.tdContent}>{detail.no}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>当前状态</td>
                                                <td className={cssStyle.tdContent}>{detail.status}</td>
                                                <td className={cssStyle.tdTitle}>采购来源</td>
                                                <td className={cssStyle.tdContent}>{detail.source}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>存放地址</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.address}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {this.getListContent(detail.maintainList,this.themeImgList[style.theme],'维修记录',1)}
                                    {this.getListContent(detail.repairList,this.themeImgList[style.theme],'保养记录',2)}
                                    {this.getListContent(detail.dispatchList,this.themeImgList[style.theme],'调派记录',3)}
                                </Scrollbars>
                            </div>
                        )
                    }}
                </Motion>
            </ComponentBox>
        )
    }
}