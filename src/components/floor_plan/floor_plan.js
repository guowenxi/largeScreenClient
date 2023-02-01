import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./floor_plan.module.css";
import { Motion, spring } from "react-motion";
import { getCompatibleSize, interactData } from "../../common/util";
import Select from "../../common/select";
import { Scrollbars } from "react-custom-scrollbars";
import GoodsItem from "./goodsItem";

import { roomData } from "./roomData";
import { getData } from "../../common/getDataUtil";

import icon1 from './images/head_icon1.svg';
import icon2 from './images/head_icon2.svg';
import icon3 from './images/head_icon3.svg';
import borderBox from './images/box.svg'

export default class FloorPlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = { src: '', show: false, opacity: 0, areaId: 1, buildingId: 1, floorIndex: 10, typeId: -1, typeTwoId: -1, selectIndex: 0 };
        this.interactData = interactData.bind(this);
        this.getData = getData.bind(this);
        this.areaList = [{ id: 1, name: "区域1" }, { id: 2, name: "区域2" }, { id: 3, name: "区域3" }];
        this.buildingList = [{ id: 1, name: "1幢" }, { id: 2, name: "2幢" }, { id: 3, name: "3幢" }];
        this.floorList = [-2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        this.stateList = [{ "name": "楼宇数量(个)", "count": "2" }, { "name": "建筑面积(平米)", "count": "11400" }, { "name": "房间总数(个)", "count": "2228" }, { "name": "其他用房", "count": "144" }, { "name": "办公用房", "count": "87" }, { "name": "业务技术用房", "count": "31" }];
        this.stateColor = ['rgb(242,175,24)', 'rgb(162,251,121)', 'rgb(120,197,246)'];
        this.floorData = [
            { roomId: 1, name: '项目办', type: 0 },
            { roomId: 2, name: '项目办', type: 1 },
            { roomId: 3, name: '项目办', type: 2 },
            { roomId: 4, name: '监控室', type: 2 },
            { roomId: 5, name: '第四会议室', type: 2 },
            { roomId: 6, name: '第三会议室', type: 2 },
            { roomId: 7, name: '第二会议室', type: 2 },
            { roomId: 8, name: '第一会议室', type: 2 },
            { roomId: 9, name: '多功能培训室', type: 2 },
        ];
        this.typeList = [{ "id": 1, "name": "便携式电脑(5)" }, { "id": 2, "name": "专用装备(5)" }, { "id": 3, "name": "办公用品(24)" }];
        this.typeTwoList = [];
        this.typeTwoParams = {};
        this.goodsList = [
            { "id": 1, "type": 1, "typeName": "便携式电脑", "no": "C9483_001", "model": "DELL-29193X", "date": "2020-04-24", "userName": "张三", "status": "使用中" },
            { "id": 2, "type": 1, "typeName": "便携式电脑", "no": "C9483_001", "model": "DELL-29193X", "date": "2020-04-24", "userName": "张三", "status": "使用中" },
            { "id": 3, "type": 1, "typeName": "便携式电脑", "no": "C9483_001", "model": "DELL-29193X", "date": "2020-04-24", "userName": "张三", "status": "使用中" },
            { "id": 4, "type": 1, "typeName": "便携式电脑", "no": "C9483_001", "model": "DELL-29193X", "date": "2020-04-24", "userName": "张三", "status": "使用中" },
            { "id": 5, "type": 1, "typeName": "便携式电脑", "no": "C9483_001", "model": "DELL-29193X", "date": "2020-04-24", "userName": "张三", "status": "使用中" },
        ];
        this.goodsListParams = {};
        this.headIcon = [icon1, icon2, icon3];
        this.headNumColor = ['rgb(242,175,24)', 'rgb(139,244,77)', 'rgb(115,198,255)']
    }

    //组件加载触发函数
    componentDidMount() {
        this.getAllData();
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.thisData.updateTime !== this.props.thisData.updateTime) {
            //组件数据源变更时刷新数据
            this.reGetData();
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "showComponent":
                //显示当前组件
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.setState({ opacity: 1 });
    }

    //选择区域响应函数
    selectArea(id) {
        this.setState({ areaId: id });
    }

    //选择区域响应函数
    selectBuilding(id) {
        this.setState({ buildingId: id });
    }

    //选择楼层
    selectFloor(index) {
        this.setState({ floorIndex: index });
    }

    //选择设备类型
    selectType(id) {
        const { style } = this.props.thisData;
        this.setState({ typeId: id });
        const goodsTypeKey = style.goodsTypeKey ? style.goodsTypeKey : 'typeId';
        this.typeTwoParams[goodsTypeKey] = id;
        this.getGoodsTypeTwoList();
    }

    selectTypeTwo(id) {
        const { style } = this.props.thisData;
        this.setState({ typeTwoId: id });
        const goodsTypeTwoKey = style.goodsTypeTwoKey ? style.goodsTypeTwoKey : 'typeId';
        this.goodsListParams[goodsTypeTwoKey] = id;
        this.getGoodsList();
    }

    //获取楼层平面图
    getFloorImg() {
        const { areaId, buildingId, floorIndex } = this.state;
        // const floorData = this.getFloorData();
        if (areaId !== '' && buildingId !== '' && floorIndex !== '') {
            let img;
            try {
                img = require(`./images/${areaId}-${buildingId}-${floorIndex}.png`);
            } catch (e) { }
            return (
                <div className={cssStyle.content}>
                    <img alt='' src={img} className={cssStyle.floorImg} />
                    {/* {floorData && floorData.map((item, index) =>
                        <div key={index} className={cssStyle.room} style={{ width: item.width, height: item.height, left: item.left, top: item.top, backgroundColor: this.stateColor[item.type], flexDirection: item.nameType === 1 ? 'row' : 'column' }}>
                            {this.getName(item.name)}
                        </div>
                    )} */}
                </div>
            );
        } else {
            return null;
        }
    }

    getName(name) {
        return name.split('').map((item, index) => <span key={index}>{item}</span>);
    }

    //获取楼层内房间布局数据
    getFloorData() {
        const { areaId, buildingId, floorIndex } = this.state;
        if (roomData[areaId] && roomData[areaId][buildingId] && roomData[areaId][buildingId][this.floorList[floorIndex]]) {
            return roomData[areaId][buildingId][this.floorList[floorIndex]];
        } else {
            return null;
        }
    }

    //物品点击响应
    itemClick(item) {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }

    reGetData() {
        this.getAllData();
    }

    getAllData() {
        this.getGoodsTypeList();
    }

    getGoodsTypeList() {
        const { style } = this.props.thisData;
        this.getData(this.getGoodsTypeListCallback.bind(this), style.goodsTypeSource);
    }
    getGoodsTypeListCallback(result) {
        if (result && result.length > 0) {
            this.typeList = result;
            this.selectType(result[0].id);
        } else {
            this.typeList = [];
            this.typeTwoList = [];
            this.goodsList = [];
            this.setState({ typeTwoId: -1 });
        }
    }

    getGoodsTypeTwoList() {
        const { style } = this.props.thisData;
        this.getData(this.getGoodsTypeTwoListCallback.bind(this), style.goodsTypeTwoSource, this.typeTwoParams);
    }
    getGoodsTypeTwoListCallback(result) {
        if (result && result.length > 0) {
            this.typeTwoList = result;
            this.selectTypeTwo(result[0].id);
        } else {
            this.typeTwoList = [];
            this.goodsList = [];
            this.setState({});
        }
    }

    getGoodsList() {
        const { style } = this.props.thisData;
        this.getData(this.getGoodsListCallback.bind(this), style.goodsListSource, this.goodsListParams);
    }
    getGoodsListCallback(result) {
        if (result) {
            this.goodsList = result;
        } else {
            this.goodsList = [];
        }
        this.setState({});
    }

    selectClick(index) {
        this.setState({ selectIndex: index });
    }

    render() {
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData} reGetData={this.reGetData.bind(this)}>
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div style={{ opacity: opacity, fontSize }} className={cssStyle.box}>
                            <div className={cssStyle.left}>
                                <div className={cssStyle.head}>
                                    <div className={cssStyle.headLeft}>
                                        <div className={cssStyle.selectedFloor}>{`F${this.floorList[this.state.floorIndex]}`}</div>
                                        <div className={cssStyle.partName}>警保部门</div>
                                    </div>
                                    <div className={cssStyle.stateList}>
                                        {this.stateList && this.stateList.map((item, index) =>
                                            <div className={cssStyle.statusItem} key={index}>
                                                {/* <img alt="" src={this.headIcon[index]} className={cssStyle.itemImg} /> */}
                                                <div className={cssStyle.itemBox}>
                                                    <div className={cssStyle.name} >{item.name}</div>
                                                    <div className={cssStyle.count} style={{ color: this.headNumColor[index] }}>{item.count}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {this.getFloorImg()}
                                <div className={cssStyle.bottom}>
                                    <div className={cssStyle.bottomLeft}>
                                        <div className={cssStyle.bottomLeftBox}>
                                            <div className={cssStyle.bottomItem} style={{
                                                backgroundImage: 'url(' + borderBox + ')',
                                                width: this.state.selectIndex === 0 ? '70%' : "50%",
                                                height: this.state.selectIndex === 0 ? '70%' : "60%",
                                                fontSize: this.state.selectIndex === 0 ? '0.8em' : "0.6em",
                                                opacity:this.state.selectIndex === 0?"1":'0.7'
                                            }} onClick={this.selectClick.bind(this, 0)}>主楼</div>
                                        </div>
                                        <div className={cssStyle.bottomLeftBox}>
                                            <div className={cssStyle.bottomItem} style={{
                                                backgroundImage: 'url(' + borderBox + ')',
                                                width: this.state.selectIndex === 1 ? '70%' : "50%",
                                                height: this.state.selectIndex === 1 ? '70%' : "60%",
                                                fontSize: this.state.selectIndex === 1 ? '0.8em' : "0.6em",
                                                opacity:this.state.selectIndex === 1?"1":'0.7'
                                            }} onClick={this.selectClick.bind(this, 1)}>副楼</div>
                                        </div>
                                    </div>
                                    <div className={cssStyle.bottomRight}>
                                        <div className={cssStyle.floorList}>
                                            {this.floorList && this.floorList.map((item, index) =>
                                                <div key={index} className={`${cssStyle.floorItem} ${this.state.floorIndex === index ? cssStyle.floorSelected : ''}`} onClick={this.selectFloor.bind(this, index)}>{item}</div>
                                            )}
                                        </div>
                                        <div className={cssStyle.barBox}>
                                            {this.floorList && <div className={cssStyle.bar} style={{ width: this.state.floorIndex * 100 / (this.floorList.length - 1) + '%' }} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Select className={cssStyle.selectRight} theme='themeTwo' data={this.typeList} nameKey='name' valueKey='id' value={this.state.typeId} placeholder='选择设备大类' onChange={this.selectType.bind(this)}/>
                            <Select className={cssStyle.selectRightTwo} theme='themeTwo' data={this.typeTwoList} nameKey='name' valueKey='id' value={this.state.typeTwoId} placeholder='选择设备小类' onChange={this.selectTypeTwo.bind(this)}/>
                            <div className={cssStyle.goodsBox}>
                                <Scrollbars>
                                    {this.goodsList && this.goodsList.map((item, index) =>
                                        <GoodsItem key={index} className={cssStyle.goodsItem} data={item} itemClick={this.itemClick.bind(this)} />
                                    )}
                                </Scrollbars>
                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}