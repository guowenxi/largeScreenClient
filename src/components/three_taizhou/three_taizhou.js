import React from "react";
import ComponentBox from "../component_box"
import * as THREE from 'three';
import cssStyle from "./three_taizhou.module.css";
import { Motion, spring } from "react-motion";
import {getData} from "../../common/getDataUtil";
import {initThreeDom} from "../../common/threeUtil";
import {interactData} from "../../common/util";

export default class ThreeTaizhou extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity:0,resultData:[],hideBg:false};
        this.saveRef = ref => {this.refDom = ref};
        this.getData = getData.bind(this);
        this.initThreeDom = initThreeDom.bind(this);
        this.interactData = interactData.bind(this);
        this.geometryList = [];
        this.materialList = [];
        this.meshList = [];
    }

    componentDidMount() {
        this.p = new Promise((resolve) => {this.getData(this.callBack.bind(this,resolve))});
        setTimeout(()=>{
            this.initThree();
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
            case "changeSelected":
                this.setState({top:-90,hideBg:true});
                break;
            case "cancelSelect":
                this.setState({top:0,hideBg:false});
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
            resolve(result);
        }
        if(result){
            // this.setState({resultData:result});
            this.destroyOld();
        }
    }

    //删除旧图形
    destroyOld(){
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
    }

    //初始化
    initThree(){
        this.initThreeDom();

        // this.camera.position.set(0, 30, 30); //设置相机位置

        this.textureLoader = new THREE.TextureLoader();

        this.group = new THREE.Group();
        this.group.position.set(1,0,0);
        // this.group.rotation.x = -Math.PI/2;
        this.scene.add(this.group);

        this.addBaseLine();

        const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    addBaseLine(){
        const geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
        geometry.setFromPoints([new THREE.Vector3(0, 0,5), new THREE.Vector3(0, 0,0)]);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x0A68D4,
            transparent: true,
            opacity:1
        });
        //线条模型对象
        const line = new THREE.Line(geometry, lineMaterial);
        this.group.add(line);


    }

    render() {
        const { style } = this.props.thisData;
        const canvasWidth = style.canvasWidth ? style.canvasWidth : 100;
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.box} style={{opacity,width:canvasWidth+'%'}} ref={this.saveRef} id={'three_div_'+this.props.thisData.id} >
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}