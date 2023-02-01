import React from "react";
import ComponentBox from "../component_box"
import * as THREE from 'three';
import cssStyle from "./three_bar.module.css";
import { Motion, spring } from "react-motion";
import {getData} from "../../common/getDataUtil";
import {initThreeDom} from "../../common/threeUtil";


export default class ThreeBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity:0,resultData:[] };
        this.saveRef = ref => {this.refDom = ref};
        this.getData = getData.bind(this);
        this.initThreeDom = initThreeDom.bind(this);
        this.geometryList = [];
        this.materialList = [];
    }

    componentDidMount() {
        setTimeout(()=>{
            this.initThree();
            this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
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
        if(result){
            // this.setState({resultData:result});
            this.destroyOld();
            this.addBar(result);
            if(resolve){
                resolve(result);
            }
        }
    }

    //删除旧图形
    destroyOld(){
        this.group.clear();
        this.geometryList.forEach((item)=>{
            item.dispose();
        });
        this.materialList.forEach((item)=>{
            item.dispose();
        });
        this.geometryList = [];
        this.materialList = [];
    }

    //初始化
    initThree(){
        this.initThreeDom();
        //饼图存储组
        this.group = new THREE.Group();
        this.group.name = 'barGroup';
        this.scene.add(this.group);
        const animate = () => {
            requestAnimationFrame(animate);

            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    addBar(result){
        // const { style } = this.props.thisData;

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