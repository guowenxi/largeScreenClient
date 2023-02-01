import React from "react";
import ComponentBox from "../component_box";
import PiePart from "./piePart";
import LegendPart from "./legendPart";

import style from './echarts_pie.module.css'
import {getData} from "../../common/getDataUtil";
import {Motion, spring} from "react-motion";
import {interactData} from "../../common/util";

export default class EchartsPie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:{},opacity:0};
        this.keyParams = {};
        this.saveRef = ref => {this.echartsDom = ref};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.onChartClick = this.onChartClick.bind(this);
        this.legendsClick = this.legendsClick.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if(this.props.thisData.firstLoad){
                this.getData(this.callBack.bind(this,resolve));
            }else{
                this.callBack(resolve);
            }
        });
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.timer){
            clearTimeout(this.timer);
        }
        if(this.refreshTimer){
            clearTimeout(this.refreshTimer);
        }
    }

    //挂载数据到页面显示
    animateOn(){
        this.p.then((data) => {
            this.setState({ opacity:1 });
        });
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                this.animateOn();
                break;
            case "changeKey" :
                for(let key in data.data){
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "changeUrl" :

                break;
            case "deleteKey" :
                this.keyParams = {};
                this.reGetData();
                break;
            case "reFresh":
                //刷新数据
                this.reGetData();
                break;
            default:
                break;
        }
    }

    //获取数据后回调
    callBack(resolve,result){
        if(result){
            this.getDataTime = new Date().getTime();
            this.cancelDownplay();
            this.selectedIndex = -1;
            if(this.timer){
                clearTimeout(this.timer);
            }
            if(result.legends && Array.isArray(result.legends) && result.legends.length > 0){
                this.series = result.series[0];
            }else{
                this.series = result.series;
            }
            this.setState({data:result});
        }
        if(resolve){
            resolve(result);
        }
    }

    //重新获取数据
    reGetData(){
        this.getData(this.callBack.bind(this,''));
    }

    //饼图点击响应
    onChartClick(e){
        const { interact } = this.props.thisData.dataSources;
        const selectItem = {name:e.name,num:e.value,id:this.state.data.ids?this.state.data.ids[e.dataIndex]:null,legend:e.seriesName};
        this.interactData(interact, selectItem);
    }

    //标注点击
    titleClick(actionInteract){
        if(actionInteract){
            const { interact } = this.props.thisData.dataSources;
            this.interactData(interact);
        }
    }

    //图例点击响应
    legendsClick(item,index){
        const { interact } = this.props.thisData.dataSources;
        const {data} = this.state;
        if(interact && data){
            const selectItem = {name:data.xAxis?data.xAxis[index]:null,id:data.ids?data.ids[index]:null};
            this.interactData(interact, selectItem);
        }
    }

    //内容格式器代码转化
    formatterChange = (label)=>{
        if(label){
            if(label.formatter){
                try{
                    // eslint-disable-next-line no-eval
                    label.formatter = eval(label.formatter);
                }catch (e) {}
            }
            if(label.rich){
                try{
                    label.rich = JSON.parse(label.rich);
                }catch (e) {}
            }
        }
    };

    startMove(){
        const thisStyle = this.props.thisData.style;
        const interval = thisStyle.interval ? thisStyle.interval : 2000;
        if(this.timer){
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(()=>{
            const {data} = this.state;
            if(this.echartsDom && data && data.xAxis){
                const echartsInstance = this.echartsDom.getEchartsInstance();
                if(this.selectedIndex >= 0){
                    echartsInstance.dispatchAction({
                        type: 'downplay',
                        dataIndex: this.selectedIndex,
                    });
                    this.selectedIndex ++;
                    if(this.selectedIndex >= data.xAxis.length){
                        this.selectedIndex = 0;
                    }
                }else{
                    this.selectedIndex = 0;
                }
                echartsInstance.dispatchAction({
                    type: 'highlight',
                    dataIndex: this.selectedIndex,
                });
                this.setState({});
                this.startMove();
            }
        },interval);
    }

    cancelDownplay(){
        if(this.echartsDom && this.selectedIndex >= 0){
            const echartsInstance = this.echartsDom.getEchartsInstance();
            echartsInstance.dispatchAction({
                type: 'downplay',
                dataIndex: this.selectedIndex,
            });
        }
    }

    selectedFirst = ()=>{
        setTimeout(()=>{
            const {data} = this.state;
            if(this.echartsDom && data && data.xAxis){
                const echartsInstance = this.echartsDom.getEchartsInstance();
                if(this.selectedIndex >= 0){
                    this.cancelDownplay();
                }
                this.selectedIndex = 0;
                echartsInstance.dispatchAction({
                    type: 'highlight',
                    dataIndex: this.selectedIndex,
                });
                this.setState({});
            }
            this.startMove();
        });
    };

    getTitle(){
        const thisStyle = this.props.thisData.style;
        const {data} = this.state;
        if(!thisStyle.titleShow || this.series == null || data == null || data.xAxis == null){
            return null;
        }
        const titleSize = this.props.getCompatibleSize(thisStyle.titleSize);
        const numSize = this.props.getCompatibleSize(thisStyle.numSize);
        let count = 0;
        this.series.forEach((num) =>{
            count += num;
        });
        let num = 0;
        if(thisStyle.numType === 'count'){
            num = count.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
        }else if(thisStyle.numType === 'selected'){
            num = this.series[this.selectedIndex];
            if(num){
                num = num.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
            }
        }else if(thisStyle.numType === 'partCount'){
            let numIndex;
            try{
                numIndex = JSON.parse(thisStyle.numIndex);
            }catch (e) {}
            let partCount = 0;
            if(numIndex && Array.isArray(numIndex) && numIndex.length > 0){
                this.series.forEach((num,index) =>{
                    if(numIndex.indexOf(index+1) >= 0){
                        partCount += num;
                    }
                });
            }
            num = partCount.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
        }else{
            const numIndex = thisStyle.numIndex != null ? thisStyle.numIndex : 0;
            num = this.series[numIndex];
            if(thisStyle.percentage){
                num = count === 0 ? '100%':(parseFloat(num)*100/count).toFixed(1)+'%'
            }
        }
        return (
            <div className={style.titleBox} style={{left:thisStyle.titleLeft,top:thisStyle.titleTop,cursor: thisStyle.actionInteract ? 'pointer':'default'}} onClick={this.titleClick.bind(this,thisStyle.actionInteract)}>
                <div style={{fontFamily:thisStyle.titleFontFamily,fontSize:titleSize,lineHeight:thisStyle.titleHeight+'em',color:thisStyle.titleColor,width:thisStyle.titleWidth}}>{thisStyle.titleType === 2 ? data.xAxis[this.selectedIndex] : thisStyle.title}</div>
                <div style={{fontFamily:thisStyle.numFontFamily,fontSize:numSize,lineHeight:thisStyle.numHeight+'em',color:thisStyle.numColor}}>{num}</div>
            </div>
        );
    }

    render() {
        return (
            <ComponentBox style={this.props.style} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={style.box} style={{opacity}} >
                            <PiePart
                                getDataTime={this.getDataTime}
                                data={this.state.data}
                                thisData={this.props.thisData}
                                formatterChange={this.formatterChange}
                                selectedFirst={this.selectedFirst}
                                isSelected={this.props.isSelected}
                                series={this.series}
                                saveRef={this.saveRef}
                                onChartClick={this.onChartClick}
                                keyParams={this.keyParams}
                            />
                            <LegendPart
                                data={this.state.data}
                                thisData={this.props.thisData}
                                formatterChange={this.formatterChange}
                                series={this.series}
                                legendsClick={this.legendsClick}
                            />
                            {this.getTitle()}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}