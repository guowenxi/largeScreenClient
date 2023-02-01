import React from "react";
import ComponentBox from "../component_box";

import cssStyle from "./svg_map_ex.module.css";
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {getMinNum, getMaxNum, getCompatibleSize, interactData} from "../../common/util";
import NumberShowTypeOne from "./numberShowTypeOne/numberShowTypeOne";
import NumberShowTypeTwo from "./numberShowTypeTwo/numberShowTypeTwo";
import {addClusterPoints, getPointsData} from "../../common/svgMapUtil";
import {getSpecialStyle} from "../../common/nameNumUtil";
import circleIcon from "../svg_map_linan_two/images/circleIcon.png";
import additionBgWZ2Icon from "./images/wenzhou2.png";
import axios from "axios";
import DetailFive from "./detailFive";
import DetailSix from "./detailSix";
import {areaCode} from "./areaCode";

export default class SvgMapEx extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:[],showIndex:-1,detail:{},dateType:1,hideType:[],numOpacity:1,clusterOpacity:0,points:[],mapSize:'',selectedIndex:-1,scale:1,movementX:0,movementY:0};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.getPointsData = getPointsData.bind(this);
        this.addClusterPoints = addClusterPoints.bind(this);
        this.boxRef = React.createRef();
        this.keyParams = {};
        this.pointsParams = {};
        this.svgAllData = {};
        this.moveStore = {};
        this.lastScale = 1;
        this.lastMovementX = 0;
        this.lastMovementY = 0;
    }

    //组件加载触发函数
    componentDidMount() {
        const {style} = this.props.thisData;
        if(style.firstShowCluster){
            this.setState({clusterOpacity:1})
        }
        this.p = new Promise((resolve) => {
            this.area = style.area ? style.area :'yongjia';
            axios.get('./json/svgMap/'+this.area+'.json').then((response) => {
                this.svgData = response.data;
                this.svgAllData[this.area] = response.data;
                this.getPointsData();
                if(this.props.thisData.firstLoad){
                    this.getData(this.callBack.bind(this,resolve));
                }else{
                    this.callBack(resolve);
                }
                // const area = this.state.area ? this.state.area : (style.area ? style.area :'yongjia');
                this.getMapSize(this.area);
            }).catch(function(error){
                // 处理请求出错的情况
            });
        });
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey" :
                for(let key in data.data){
                    this.keyParams[key] = data.data[key];
                    this.pointsParams[key] = data.data[key];
                }
                this.reGetData();
                this.getPointsData();
                break;
            case "showComponent":
                break;
            case "messageSend":
                if(data.data){
                    if(data.data.actionType === 'changeShow'){
                        const {numShow,clusterShow} = data.data;
                        this.setState({clusterOpacity:clusterShow?1:0,numOpacity:numShow?1:0});
                    }else if(data.data.actionType === 'changeMapArea'){
                        if(data.data.areaId){
                            this.area = areaCode[data.data.areaId];
                        }else{
                            this.area = data.data.area;
                        }
                        if(this.svgAllData[this.area]){
                            this.svgData = this.svgAllData[this.area];
                            this.getMapSize(this.area);
                        }else{
                            this.loadSvgData(this.area);
                        }
                    }
                }
                break;
            case "cancelSelect":
                this.setState({ selectedIndex: -1 });
                break;
            case "changeSelected":
                const {resultData} = this.state;
                let hasFind = false;
                for(let key in data.data){
                    for(let i = 0;i < resultData.length;i ++){
                        if(resultData[i][key] === data.data[key]){
                            hasFind = true;
                            this.areaClick(resultData[i],i);
                            break;
                        }
                    }
                    if(hasFind){
                        break;
                    }
                }
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
        this.p.then(() => {
            this.setState({opacity:1});
        })
    }

    //重新获取数据
    reGetData(){
        this.setState({resultData:[]});
        this.getData(this.callBack.bind(this,''));
    }

    //获取数据后回调
    callBack(resolve,result){
        if(resolve){
            resolve(result);
        }
        if(result){
            this.setState({resultData:result});
        }
    }

    numClick(clickItem){
        const {numClickInteract} = this.props.thisData.style;
        this.interactData(numClickInteract,clickItem);
    }

    areaClick(clickItem,index){
        const {style} = this.props.thisData;
        const {selectedIndex} = this.state;
        if(style.repeatClickType === 2 && selectedIndex === index){
            const {cancelSelectInteract} = this.props.thisData.style;
            this.interactData(cancelSelectInteract,clickItem);
            this.setState({selectedIndex:-1});
        }else{
            const {areaClickInteract} = this.props.thisData.style;
            this.interactData(areaClickInteract,clickItem);
            this.setState({selectedIndex:index});
        }
    }

    getNumberShow(area){
        const {style} = this.props.thisData;
        const {resultData} = this.state;
        const thisRoadPosition = this.svgData.roadPosition[area];
        if(thisRoadPosition){
            switch (style.showType) {
                case 1:
                    const max = getMaxNum(resultData,style.numKey);
                    const min = getMinNum(resultData,style.numKey);
                    return resultData.map((item,index) => {
                        if(thisRoadPosition[item[style.nameKey]]){
                            const data = item[style.numKey];
                            const height = (data - min)*(style.maxheight - style.minheight)/(max - min)+style.minheight;
                            return <NumberShowTypeOne key={index} height={height} styleData={style} data={data} style={thisRoadPosition[item[style.nameKey]]} onClick={this.numClick.bind(this,item)}/>;
                        }else{
                            return null;
                        }
                    });
                case 2:
                    return resultData.map((item,index) => {
                        if(thisRoadPosition[item[style.nameKey]]){
                            return <NumberShowTypeTwo key={index} styleData={style} data={item} style={thisRoadPosition[item[style.nameKey]]} onClick={this.numClick.bind(this,item)}/>;
                        }else{
                            return null;
                        }
                    });
                case 3:
                    return resultData.map((item,index) => {
                        if(thisRoadPosition[item[style.nameKey]]){
                            return <div key={index} style={thisRoadPosition[item[style.nameKey]]} >{item[style.numKey]}</div>;
                        }else{
                            return null;
                        }
                    });
                default:
            }
        }else{
            return null;
        }
    }

    getMapBg(area){
        if(area === 'yongjia'){
            return (
                <React.Fragment key={area+'bg'}>
                    <img alt={''} src='./images/svgMap/yongjia_map.svg' className={`${cssStyle.box}`}/>
                    <img alt={''} src='./images/svgMap/yongjia_guiji.svg' className={`${cssStyle.boxSvg}`} />
                </React.Fragment>
            );
        }else if(this.svgData.mapBgImg[area]){
            return <img key={area+'bg'} alt={''} src={this.svgData.mapBgImg[area]} className={`${cssStyle.box}`}/>;
        }else{
            return null;
        }
    }

    getMapRoad(area){
        if(this.svgData.mapRoadImg[area]){
            return <img key={area+'name'} alt={''} src={this.svgData.mapRoadImg[area]} className={`${cssStyle.roadImg}`}/>;
        }else {
            return null;
        }
    }

    getMapMask(area){
        if(this.svgData.maskImg && this.svgData.maskImg[area]){
            return <img key={area+'mask'} alt={''} src={this.svgData.maskImg[area]} className={`${cssStyle.maskImg}`}/>;
        }else {
            return null;
        }
    }

    getSvgArea(area){
        if(this.svgData.areaPath[area]){
            const {style} = this.props.thisData;
            const {resultData,selectedIndex} = this.state;
            const thisAreaPath = this.svgData.areaPath[area];
            const nameKey = style.nameKey ? style.nameKey : 'name';
            const stdDeviation = style.stdDeviation ? style.stdDeviation : 10;
            const shadowLineWidth = style.shadowLineWidth ? style.shadowLineWidth : 10;
            return (
                <svg viewBox={this.svgData.areaBoxSize[area]} x="0px" y="0px" className={`${cssStyle.box} ${style.hideLine ? cssStyle.hideLine:''}`} preserveAspectRatio="none">
                    <filter id={`filter_part_${this.props.thisData.id}`} x="0" y="0">
                        <feGaussianBlur in="SourceGraphic" stdDeviation={stdDeviation} />
                    </filter>
                    <g onMouseLeave={this.changeIndex.bind(this,-1)}>
                    {/*<g >*/}
                        {((resultData == null || resultData.length === 0) && this.svgData.defaultData ? this.svgData.defaultData:resultData).map((areaPart,index)=>{
                            const partPath = thisAreaPath[areaPart[nameKey]];
                            const data = areaPart[style.areaNumKey];
                            let thisColor;
                            if(selectedIndex === index && style.areaSelectedColor){
                                thisColor = {color:style.areaSelectedColor};
                            }else{
                                thisColor = data != null ? getSpecialStyle(style.areaStyleList,data,2) : null;
                            }
                            if(thisColor == null && style.areaDefaultColor){
                                thisColor = {color:style.areaDefaultColor};
                            }
                            let shadowColor = data != null ? getSpecialStyle(style.shadowStyleList,data,2) : null;
                            if(shadowColor == null && style.shadowDefaultColor){
                                shadowColor = {color:style.shadowDefaultColor};
                            }
                            if(partPath){
                                if(partPath.type === 2){
                                    return <polyline onMouseOver={this.changeIndex.bind(this,index)} key={index} points={partPath.path} transform={partPath.transform} className={`${cssStyle.svgPart} ${thisColor ? cssStyle.fillPart:''}`} style={thisColor?{fill:thisColor.color}:{}} onClick={this.areaClick.bind(this,areaPart,index)}/>;
                                }else if(typeof(partPath.path) === 'string'){
                                    return (
                                        <g
                                            onMouseOver={this.changeIndex.bind(this,index)}
                                            key={index}
                                            onClick={this.areaClick.bind(this,areaPart,index)}
                                            clipPath={`url(#clipPath_${areaPart[nameKey]+index})`}
                                        >
                                            <path
                                                d={partPath.path} transform={partPath.transform}
                                                className={`${cssStyle.svgPart} ${thisColor ? cssStyle.fillPart:''}`}
                                                style={thisColor?{fill:thisColor.color}:{}}
                                            />
                                            {shadowColor && (
                                                <>
                                                    <clipPath id={`clipPath_${areaPart[nameKey]+index}`}>
                                                        <path d={partPath.path} />
                                                    </clipPath>
                                                    <path
                                                        filter={`url(#filter_part_${this.props.thisData.id})`}
                                                        d={partPath.path} transform={partPath.transform}
                                                        className={`${cssStyle.clipPath}`}
                                                        style={{stroke:shadowColor.color,strokeWidth:shadowLineWidth}}
                                                    />
                                                </>
                                            )}
                                        </g>
                                    );
                                }else{
                                    return partPath.path.map((path,pathIndex)=>
                                        <path onMouseOver={this.changeIndex.bind(this,index)} key={index+'path'+pathIndex} d={path} transform={partPath.transform} className={`${cssStyle.svgPart} ${thisColor ? cssStyle.fillPart:''}`} style={thisColor?{fill:thisColor.color}:{}} onClick={this.areaClick.bind(this,areaPart,index)}/>
                                    );
                                }
                            }else{
                                return '';
                            }
                        })}
                    </g>
                </svg>
            );
        }
    }

    changeIndex(index){
        if(this.timer){
            clearTimeout(this.timer);
        }
        if(!this.state.keepSelect){
            this.setState({showIndex:index});
        }
    }

    getClusterPoint(){
        const { thisData } = this.props;
        const { points } = this.state;
        // console.log(thisData.style);
        // console.log(this._clusterLayer);
        return this.addClusterPoints(points,thisData);
    }

    getMapSize(area){
        if(this.boxRef && this.boxRef.current && this.boxRef.current.clientWidth && this.boxRef.current.clientHeight && this.svgData.mapBgSize[area]){
            const width = this.boxRef.current.clientWidth;
            const height = this.boxRef.current.clientHeight;
            const thisMapSize = this.svgData.mapBgSize[area];
            if(thisMapSize.width/width > thisMapSize.height/height){
                // this.setState({mapSize:{width:'100%',height:(width/thisMapSize.width)*thisMapSize.height*100/height+'%'}});
                this.setState({mapSize:{width:(width/thisMapSize.width)*thisMapSize.width+'px',height:(width/thisMapSize.width)*thisMapSize.height+'px'}});
            }else{
                // this.setState({mapSize:{height:'100%',width:(height/thisMapSize.height)*thisMapSize.width*100/width+'%'}});
                this.setState({mapSize:{height:(height/thisMapSize.height)*thisMapSize.height+'px',width:(height/thisMapSize.height)*thisMapSize.width+'px'}});
            }
        }
    }

    getCirclePoint(area){
        const thisCirclePointPosition = this.svgData.circlePointPosition[area];
        if(!thisCirclePointPosition){
            return;
        }
        const {resultData,showIndex} = this.state;
        const {style} = this.props.thisData;
        const nameKey = style.nameKey ? style.nameKey : 'name';
        return (
            <div className={cssStyle.circlePointBox}>
                {thisCirclePointPosition && resultData && resultData.map((road,index)=>
                    <img
                        alt={''} key={index} src={circleIcon}
                        style={{...thisCirclePointPosition[road[nameKey]],display:index === showIndex ? 'block':'none'}}
                        className={cssStyle.circlePoint}
                    />
                )}
            </div>
        );
    }


    getSelectedContent(area){
        const {resultData,showIndex} = this.state;
        const roadData = resultData[showIndex];
        const {style} = this.props.thisData;
        const nameKey = style.nameKey ? style.nameKey : 'name';
        const thisDetailPosition = this.svgData.detailPosition[area];
        if(!thisDetailPosition || !roadData || !thisDetailPosition[roadData[nameKey]]){
            return null;
        }
        if(roadData){
            if(style.detailType === 1){
                return (
                    <div className={cssStyle.detailOneBox} style={thisDetailPosition[roadData[nameKey]]}>
                        <div>管控人员数：{roadData.controlPersonnel}</div>
                        <div>异常人员数：{roadData.num}</div>
                        <div>风险等级人数：</div>
                        <div className={cssStyle.red}>危险：{roadData.red}</div>
                        <div className={cssStyle.orange}>风险：{roadData.orange}</div>
                        <div className={cssStyle.yellow}>异常：{roadData.yellow}</div>
                        <div className={cssStyle.green}>无异常：{roadData.green}</div>
                    </div>
                );
            }else if(style.detailType === 2){
                return (
                    <div className={cssStyle.detailOneBox} style={thisDetailPosition[roadData[nameKey]]}>
                        <div>管控人员数：{roadData.controlPersonnel}</div>
                        <div>异常人员数：{roadData.num}</div>
                        <div>风险等级人数：</div>
                        <div className={cssStyle.red}>管控：{roadData.red}</div>
                        <div className={cssStyle.orange}>风险：{roadData.orange}</div>
                        <div className={cssStyle.yellow}>关注：{roadData.yellow}</div>
                        <div className={cssStyle.green}>无异常：{roadData.green}</div>
                    </div>
                );
            }else if(style.detailType === 3){
                return (
                    <div className={`${cssStyle.detailOneBox} ${cssStyle.detailTwoBox}`} style={thisDetailPosition[roadData[nameKey]]}>
                        <div>{roadData.month}月</div>
                        <div>高发事件类型：{roadData.type}</div>
                    </div>
                );
            }else if(style.detailType === 4){
                return (
                    <div className={cssStyle.detailOneBox} style={thisDetailPosition[roadData[nameKey]]}>
                        <div>{roadData.name}：{roadData.num}</div>
                        <div className={cssStyle.red}>卫健管控人数：{roadData.controlOne}</div>
                        <div className={cssStyle.orange}>公安管控人数：{roadData.controlTwo}</div>
                        <div className={cssStyle.yellow}>镇街关注人数：{roadData.controlThree}</div>
                        <div>预警处置率：{roadData.dispose}%</div>
                        <div>按期随访率：{roadData.followUp}%</div>
                        <div>肇事肇祸数：{roadData.event}起</div>
                    </div>
                );
            }else if(style.detailType === 5){
                return <DetailFive name={roadData[nameKey]} roadData={roadData} style={thisDetailPosition[roadData[nameKey]]}/>
            }else if(style.detailType === 6){
                return <DetailSix name={roadData[nameKey]} roadData={roadData} style={thisDetailPosition[roadData[nameKey]]}/>
            }else if(style.detailType === 7 && this.keyParams.id === '2022-10'){//只显示10月时的泽国镇固定内容，后续续修改代码从接口返回数据里获取内容
                return (
                    <div className={`${cssStyle.detailOneBox} ${cssStyle.detailThreeBox}`} style={thisDetailPosition[roadData[nameKey]]}>
                        <div>挂牌整治事件：<span className={cssStyle.red}>1</span>起</div>
                        <div>电信诈骗事件：<span className={cssStyle.red}>42</span>起</div>
                        <div>信访事件：赴省访<span className={cssStyle.red}>1</span>起<span className={cssStyle.red}>4</span>人</div>
                        <div>交通亡人事故：<span className={cssStyle.red}>2</span>起<span className={cssStyle.red}>2</span>亡人</div>
                        <div>工贸事故：火灾<span className={cssStyle.red}>6</span>起</div>
                    </div>
                );
            }
        }
        return null;
    }

    getAdditionBg(area){
        if(area === '温州2'){
            return (
                <div className={cssStyle.additionBgWZ2}>
                    <img alt={''} src={additionBgWZ2Icon} />
                </div>
            );
        }else{
            return null;
        }
    }

    loadSvgData(){
        axios.get('./json/svgMap/'+this.area+'.json').then((response) => {
            this.svgData = response.data;
            this.svgAllData[this.area] = response.data;
            this.getMapSize(this.area);
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    handleTouchStart(event){
        let touches = event.touches;
        let events = touches[0];//单指
        let events2 = touches[1];//双指
        if(touches.length === 1){
            // 单指操作
            this.moveStore.pageX = Number(events.pageX);
            this.moveStore.pageY = Number(events.pageY);
            this.moveStore.moveable = true;
        }else{
            // 第一个触摸点的坐标
            this.moveStore.pageX = events.pageX;
            this.moveStore.pageY = events.pageY;
            this.moveStore.moveable = true;
            if (events2) {
                this.moveStore.pageX2 = events2.pageX;
                this.moveStore.pageY2 = events2.pageY;
            }
        }
    }
    handleTouchMove(event){
        if (!this.moveStore.moveable) {
            return;
        }
        event.stopPropagation();
        let touches = event.touches;
        let events = touches[0];
        let events2 = touches[1];
        if (touches.length === 1) {
            let pageX2 = Number(events.pageX);
            let pageY2 = Number(events.pageY);
            //控制图片移动
            this.setState({movementX:this.lastMovementX + pageX2 - this.moveStore.pageX,movementY:this.lastMovementY + pageY2 - this.moveStore.pageY});
        } else {
            // 双指移动
            if (events2) {
                // 第2个指头坐标在touchmove时候获取
                if (!this.moveStore.pageX2) {
                    this.moveStore.pageX2 = events2.pageX;
                }
                if (!this.moveStore.pageY2) {
                    this.moveStore.pageY2 = events2.pageY;
                }

                // 获取坐标之间的距离
                let getDistance = function(start, stop) {
                    //用到三角函数
                    return Math.hypot(stop.x - start.x,
                        stop.y - start.y);
                };
                // 双指缩放比例计算
                let zoom = getDistance({
                    x : events.pageX,
                    y : events.pageY
                }, {
                    x : events2.pageX,
                    y : events2.pageY
                }) / getDistance({
                    x : this.moveStore.pageX,
                    y : this.moveStore.pageY
                }, {
                    x : this.moveStore.pageX2,
                    y : this.moveStore.pageY2
                });
                // 应用在元素上的缩放比例
                let newScale = this.lastScale * zoom;
                // 最大缩放比例限制
                if (newScale > 8) {
                    newScale = 8;
                }
                this.setState({scale:newScale});
            }
        }
    }
    handleTouchEnd(){
        this.moveStore.moveable = false;
        delete this.moveStore.pageX2;
        delete this.moveStore.pageY2;
        const {movementX,movementY,scale} = this.state;
        this.lastMovementX = movementX;
        this.lastMovementY = movementY;
        this.lastScale = scale;
    }

    // handleTouchCancel(){
    //     this.moveStore.moveable = false;
    //     delete this.moveStore.pageX2;
    //     delete this.moveStore.pageY2;
    //     const {movementX,movementY,scale} = this.state;
    //     this.lastMovementX = movementX;
    //     this.lastMovementY = movementY;
    //     this.lastScale = scale;
    // }

    scrollFunc(e){
        const {style} = this.props.thisData;
        if(style && style.scaleAction){
            let {scale} = this.state;
            if (e.deltaY < 0) { //当滑轮向上滚动时
                scale += 0.2;
            }else if (e.deltaY > 0) { //当滑轮向下滚动时
                scale -= 0.2;
            }
            if(scale <= 8 && scale >= 0.4){
                e.stopPropagation();
                this.setState({scale});
            }
        }
    };

    changeMoveFlag(moveFlag){
        this.setState({moveFlag});
    }

    moveImg(e){
        const {style} = this.props.thisData;
        if(this.state.moveFlag && style && style.moveAction){
            let {movementX,movementY} = this.state;
            movementX += e.movementX;
            movementY += e.movementY;
            this.setState({movementX,movementY});
        }
    }

    render() {
        const {style} = this.props.thisData;
        // const area = this.state.area ? this.state.area : (style.area ? style.area :'yongjia');
        const area = this.area;
        const fontSize = getCompatibleSize(style.fontSize);
        const {mapSize} = this.state;
        // const mapSize = this.getMapSize(area);
        const pointBoxStyle = {
            width:style.pointAreaWidth+'%',
            height:style.pointAreaHeight+'%',
            left:style.pointAreaLeft+'%',
            top:style.pointAreaTop+'%',
        };
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={cssStyle.allBox} style={{opacity,fontSize}} ref={this.boxRef}>
                            {mapSize && this.svgData && (
                                <div className={cssStyle.mapBox} style={mapSize} >
                                    <div
                                        className={cssStyle.mapContent}
                                        style={{transform:`scale(${this.state.scale})`,left:this.state.movementX+'px',top:this.state.movementY+'px'}}
                                        onTouchStart={this.handleTouchStart.bind(this)}
                                        onTouchMove={this.handleTouchMove.bind(this)}
                                        onTouchEnd={this.handleTouchEnd.bind(this)}
                                        onTouchCancel={this.handleTouchEnd.bind(this)}
                                        onWheel={this.scrollFunc.bind(this)}
                                        onMouseDown={this.changeMoveFlag.bind(this,true)}
                                        onMouseUp={this.changeMoveFlag.bind(this,false)}
                                        onMouseMove={this.moveImg.bind(this)}
                                    >
                                        {this.getAdditionBg(area)}
                                        {this.getMapBg(area)}
                                        {this.getMapMask(area)}
                                        {this.getSvgArea(area)}
                                        {this.getMapRoad(area)}
                                        <Motion style={{numOpacity:spring(this.state.numOpacity)}}>
                                            {({numOpacity}) =>
                                                <div className={cssStyle.numBox} style={{opacity:numOpacity}}>
                                                    {numOpacity !== 0 && style.numKey && this.getNumberShow(area)}
                                                </div>
                                            }
                                        </Motion>
                                        <Motion style={{clusterOpacity:spring(this.state.clusterOpacity)}}>
                                            {({clusterOpacity}) =>
                                                <div className={cssStyle.clusterBox} style={{opacity:clusterOpacity,...pointBoxStyle}}>
                                                    {this.getClusterPoint()}
                                                </div>
                                            }
                                        </Motion>
                                        {(style.detailType != null && style.detailType !== 0) && this.getSelectedContent(area)}
                                        {(style.detailType != null && style.detailType !== 0) && this.getCirclePoint(area)}
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}