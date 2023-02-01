import React from "react";
import ComponentBox from "../component_box"
import * as THREE from 'three';
import cssStyle from "./three_pie.module.css";
import { Motion, spring } from "react-motion";
import {getData} from "../../common/getDataUtil";
import {getSumByKey} from "../../common/util";
import {addPiePart} from "./util";
import {initThreeDom} from "../../common/threeUtil";


export default class ThreePie extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity:0,resultData:[] };
        this.saveRef = ref => {this.refDom = ref};
        this.getData = getData.bind(this);
        this.initThreeDom = initThreeDom.bind(this);
        this.addPiePart = addPiePart.bind(this);
        this.geometryList = [];
        this.materialList = [];
        this.meshList = [];
        this.keyParams = {};
    }

    componentDidMount() {
        setTimeout(()=>{
            this.initThree();
            this.p = new Promise((resolve) => {
                if(this.props.thisData.firstLoad){
                    this.getData(this.callBack.bind(this,resolve));
                }else{
                    this.callBack(resolve);
                }
            });
            if (this.props.firstLoad === false) {
                this.animateOn();
            }
        });
    }

    componentWillUnmount() {
        this.destroyOld();
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "dataInterchange":
            case "changeKey" :
                for(let key in data.data){
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "changeSelected":
                for(let key in data.data){
                    const subData = data.data[key];
                    const {resultData} = this.state;
                    for(let i = 0;i < resultData.length;i ++){
                        if(subData+'' === resultData[i][key]+''){
                            const oneStep = 80;
                            this.AnimationAction.paused = true;
                            this.AnimationAction.time = i*oneStep;
                            this.clip.duration = (i+1)*oneStep;
                            this.AnimationAction.play();
                            this.AnimationAction.paused = false;
                            break;
                        }
                    }
                    break;
                }
                break;
            case "showComponent":
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
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
            resolve();
        }
        if(result){
            this.setState({resultData:result});
            this.destroyOld();
            this.addPie(result);
        }
    }

    //删除旧图形
    destroyOld(){
        // this.group.clear();
        this.meshList.forEach((mesh)=>{
            this.group.remove(mesh);
        });
        this.meshList = [];
        this.geometryList.forEach((item)=>{
            item.dispose();
        });
        this.materialList.forEach((item)=>{
            item.dispose();
        });
        this.geometryList = [];
        this.materialList = [];
        if(this.mixer){
            this.mixer.stopAllAction();
            this.mixer.uncacheClip(this.clip);
        }
    }

    //初始化
    initThree(){
        this.initThreeDom();

        const { style } = this.props.thisData;
        /**四条直线绘制一个矩形轮廓*/
        this.rectShape = new THREE.Shape();
        this.rectShape.moveTo(0,0);//起点
        this.rectShape.lineTo(0,20);//第2点
        this.rectShape.lineTo(20,20);//第3点
        this.rectShape.lineTo(20,0);//第4点
        this.rectShape.lineTo(0,0);
        //饼图存储组
        this.group = new THREE.Group();
        this.group.name = 'pieGroup';
        this.group.position.y = style.positionY != null ? style.positionY : -25;
        this.scene.add(this.group);
        // 创建一个时钟对象Clock
        var clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);

            // mesh.rotation.y += 0.01;
            // mesh.rotation.y += 0.01;
            // this.group.rotation.y += 0.008;

            this.renderer.render(this.scene, this.camera);
            // clock.getDelta();//方法获得两帧的时间间隔
            // 更新混合器相关的时间
            if(this.mixer){
                this.mixer.update(clock.getDelta());
            }
            // if(this.AnimationAction){
            //     console.log(this.AnimationAction.time);
            // }
        };
        animate();
    }

    addPie(result){
        // this.addPiePart(0x2AFADF,0x37CCEB,0,0.6);
        // this.addPiePart(0x009DF4,0x00C6FB,0.6,0.75);
        // this.addPiePart(0x1BDE88,0x3CFAB7,0.75,0.85);
        // this.addPiePart(0xD2DD69,0xE2F262,0.85,0.95);
        // this.addPiePart(0xE15D2B,0xE38159,0.95,1);
        const { style } = this.props.thisData;
        if(style.key){
            const sum = getSumByKey(result,style.key);
            const oneStep = 80;
            const moveStep = 5;
            let startPer = 0;
            let lastPer = 0;
            let firstPer = 0;
            let rotationTimes = [];
            let rotationValues = [];
            const trackList = [];
            let showPieIndex = 0;
            result.forEach((item,index)=>{
                const thisNum = item[style.key];
                if(thisNum){
                    const thisColor = style.colorList && style.colorList[index] ? style.colorList[index] : {start:0xE880DF,end:0xCD5CDF};
                    const thisPer = thisNum/sum;
                    const endPer = startPer+thisPer;
                    this.addPiePart(thisColor.start,thisColor.end,startPer,endPer,index);
                    let scaleTimes = [];
                    let scaleValues = [];
                    scaleTimes.push(showPieIndex*oneStep+20,40+showPieIndex*oneStep,60+showPieIndex*oneStep,80+showPieIndex*oneStep);
                    scaleValues.push(1, 1, 1, 1.05, 1.05, 1.4, 1.05, 1.05, 1.4, 1, 1, 1);
                    trackList.push(new THREE.KeyframeTrack('pieName'+index+'.scale', scaleTimes, scaleValues));
                    const centerPer = (startPer+endPer)/2;
                    const moveX = Math.cos(Math.PI*2*centerPer)*moveStep;
                    const moveZ = Math.sin(Math.PI*2*centerPer)*moveStep;
                    trackList.push(new THREE.KeyframeTrack('pieName'+index+'.position', scaleTimes, [0,0,0,moveX,0,moveZ,moveX,0,moveZ,0,0,0]));
                    if(showPieIndex === 0){
                        firstPer = thisPer;
                        this.group.rotation.y =  Math.PI*(3/4 + thisPer);
                    }else {
                        rotationTimes.push(showPieIndex*oneStep,20+showPieIndex*oneStep);
                        rotationValues.push(Math.PI*3/4+(startPer-lastPer/2)*2*Math.PI,Math.PI*3/4+(startPer+thisPer/2)*2*Math.PI);
                        // rotationTimes.push(60+(showPieIndex-1)*oneStep,80+(showPieIndex-1)*oneStep);
                        // rotationValues.push(Math.PI*3/4+(startPer-lastPer/2)*2*Math.PI,Math.PI*3/4+(startPer+thisPer/2)*2*Math.PI);
                        // trackList.push(new THREE.KeyframeTrack('pieGroup.rotation[y]', [20+index*40, 40+index*40], [Math.PI*3/4+(startPer-lastPer/2)*2*Math.PI,Math.PI*3/4+(startPer+thisPer/2)*2*Math.PI]));
                    }
                    startPer = endPer;
                    lastPer = thisPer;
                    showPieIndex ++;
                }
            });
            // rotationTimes.push(60+(this.meshList.length-1)*oneStep,80+(this.meshList.length-1)*oneStep);
            // rotationValues.push(Math.PI*3/4+(startPer-lastPer/2)*2*Math.PI,Math.PI*3/4+(startPer+firstPer/2)*2*Math.PI);
            rotationTimes.unshift(0,20);
            rotationValues.unshift(Math.PI*3/4+(startPer-lastPer/2)*2*Math.PI-2*Math.PI,Math.PI*3/4+(startPer+firstPer/2)*2*Math.PI-2*Math.PI);
            // this.group.rotation.y =  Math.PI*3/4+(startPer-lastPer/2)*2*Math.PI;
            // trackList.push(new THREE.KeyframeTrack('pieGroup.rotation[y]', [20+this.meshList.length*40, 40+this.meshList.length*40], [Math.PI*3/4+(startPer-lastPer/2)*2*Math.PI,Math.PI*3/4+(startPer+firstPer/2)*2*Math.PI]));
            trackList.push(new THREE.KeyframeTrack('pieGroup.rotation[y]', rotationTimes, rotationValues));
            // duration决定了默认的播放时间，一般取所有帧动画的最大时间
            // duration偏小，帧动画数据无法播放完，偏大，播放完帧动画会继续空播放
            var duration = 80+(this.meshList.length-1)*oneStep;
            // 多个帧动画作为元素创建一个剪辑clip对象，命名"default"，持续时间duration
            this.clip = new THREE.AnimationClip("default", duration, trackList);
            global.clip = this.clip;

            // group作为混合器的参数，可以播放group中所有子对象的帧动画
            this.mixer = new THREE.AnimationMixer(this.group);
            global.mixer = this.mixer;
            // 剪辑clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
            var AnimationAction = this.mixer.clipAction(this.clip);
            //通过操作Action设置播放方式
            AnimationAction.timeScale = 20;//默认1，可以调节播放速度
            if(style.animateOn){

            }else{
                AnimationAction.time = 40;
                AnimationAction.loop = THREE.LoopOnce; //不循环播放
                AnimationAction.clampWhenFinished = true; //不循环播放
                this.clip.duration = AnimationAction.time;
            }
            AnimationAction.play();//开始播放
            this.AnimationAction = AnimationAction;
            // global.AnimationAction = AnimationAction;
        }
    }

    render() {
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div ref={this.saveRef} className={cssStyle.box} style={{opacity}} id={'three_div_'+this.props.thisData.id}>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}