import React from "react";
import axios from "axios";

import ComponentBox from "../component_box";
import cssStyle from '../../common/css/detail.module.css';
// import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import Emitter from "../../common/eventBus";
import iconTriangle from "../detail_event_early_warning/images/lanjiao_blue.svg";
import {getCloseDom, getCompatibleData} from "../../common/detailUtil";
import {interactData} from "../../common/util";

export default class DetailAreaCangnan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: {}, showComponent: false, visible: false, operateType: null};
        this.keyParams = {};
        this.getCompatibleData = getCompatibleData.bind(this);
        this.interactData = interactData.bind(this);
        this.getCloseDom = getCloseDom.bind(this);
        this.themeList = ['',cssStyle.themeOne];
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
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.getData();
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
                    this.setState({data: result});
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
        return (
            <ComponentBox
                id={this.props.thisData.id}
                thisData={this.props.thisData}
                receiveMessage={this.receiveMessage.bind(this)}
                reGetData={this.reGetData.bind(this)}
                style={this.props.style}
            >
                {/*<Motion style={{top: spring(this.props.thisData.showStatus ? 0 : 100)}}>*/}
                {/*    {({top}) => {*/}
                {/*        return (*/}
                            <div
                                className={`${cssStyle.detailBox} ${this.themeList[style.theme]}`}
                                style={{backgroundColor: style.bgColor, padding:compatibleSize.padding}}
                            >
                                <div className={cssStyle.headBox} style={{height:compatibleSize.titleHeight}}>
                                    <div className={cssStyle.head} style={{fontSize:compatibleSize.titleSize,color: style.titleColor,width:style.titleWidth}}>{detail.area_name}</div>
                                </div>
                                {this.getCloseDom(style,compatibleSize)}
                                <Scrollbars style={{height: 'calc(100% - ' + compatibleSize.titleHeight + ')',fontSize:compatibleSize.fontSize}}>
                                    <div className={cssStyle.itemBox}>
                                        <div className={cssStyle.itemHead}>
                                            <img alt='' src={iconTriangle} className={cssStyle.itemHeadIcon}/>
                                            <div className={cssStyle.itemTitle}>基本信息</div>
                                        </div>
                                        <table className={cssStyle.itemContent}>
                                            <tbody>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>部位类别</td>
                                                <td className={cssStyle.tdContent}>{detail.areaTypeName}</td>
                                                <td className={cssStyle.tdTitle}>所属街道</td>
                                                <td className={cssStyle.tdContent}>{detail.roadName}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>详细地址</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>{detail.area_address}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle}>负责人</td>
                                                <td className={cssStyle.tdContent}>{detail.leader_name}</td>
                                                <td className={cssStyle.tdTitle}>联系电话</td>
                                                <td className={cssStyle.tdContent}>{detail.leader_phone}</td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle} >参与部门</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.departmentName && (
                                                        detail.departmentName.map((item,index) =>
                                                            <span className={cssStyle.fileName} key={index}>{item}</span>
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className={cssStyle.tdTitle} >部位监控</td>
                                                <td className={cssStyle.tdContent} colSpan={3}>
                                                    {detail.poVideoList && (
                                                        detail.poVideoList.map((item,index) =>
                                                            <span className={cssStyle.fileName} key={index}>{item.mpName}</span>
                                                        )
                                                    )}
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Scrollbars>
                            </div>
                {/*        )*/}
                {/*    }}*/}
                {/*</Motion>*/}
            </ComponentBox>
        )
    }
}