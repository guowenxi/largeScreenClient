import React from "react";
import ComponentBox from "../component_box"
import * as THREE from 'three';
import cssStyle from "./three_earth.module.css";
import { Motion, spring } from "react-motion";
import {getData} from "../../common/getDataUtil";
import {initThreeDom} from "../../common/threeUtil";
import {getCompatibleSize, interactData} from "../../common/util";

import backgroundImg from "./images/background.png";
import earthImg from "./images/earth.jpg";
import bgThemeTwo from "./images/bgThemeTwo.png";

export default class ThreeEarth extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity:0,resultData:[],top:0,hideBg:false};
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
            // this.setState({opacity:1});
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
            if(resolve){
                resolve(result);
            }
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
        this.group.position.set(0,-0.2,0);
        // this.group.rotation.x = -Math.PI/2;
        this.scene.add(this.group);

        this.addEarth();

        const animate = () => {
            requestAnimationFrame(animate);
            this.group.rotation.y -= 0.008;
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    addEarth(){
        const { style } = this.props.thisData;
        const geometry = new THREE.SphereGeometry( 5, 64, 64 );
        let materialOption;
        let imgUrl;
        if(style.theme === 2){
            materialOption = {
                color: 0x00ffff,
                // color: 0x3E6AA6,
                // side: THREE.DoubleSide,
                transparent: true,
                blending: THREE.AdditiveBlending,
                opacity:1
            };
            imgUrl = "./images/three/liushi/earth_lights2.png";
        }else{
            materialOption = {
                color: 0x315586,
                // color: 0x3E6AA6,
                side: THREE.DoubleSide,
                transparent: true,
                // opacity:0
            };
            imgUrl = "./images/three/liushi/earth_lights.png";
        }
        const material = new THREE.MeshLambertMaterial( materialOption);
        this.textureLoader.load( imgUrl, ( map ) => {
            material.map = map;
            material.needsUpdate = true;
            const mesh = new THREE.Mesh(geometry, material);
            this.group.add(mesh);
            this.setState({opacity:1});
        } );
    }

    render() {
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const canvasWidth = style.canvasWidth ? style.canvasWidth : 100;
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{ opacity: spring(this.state.opacity),top:spring(this.state.top) }}>
                    {({ opacity,top }) =>
                        <div className={cssStyle.box} style={{opacity,width:canvasWidth+'%',fontSize}} >
                            {style.theme === 2 ? (
                                <React.Fragment>
                                    <img alt={''} src={bgThemeTwo} className={cssStyle.bgThemeTwo} />
                                </React.Fragment>
                            ):(
                                <React.Fragment>
                                    <img alt={''} src={earthImg} className={cssStyle.bgTwo}  style={{top:(top-89)+'%'}}/>
                                    <img alt={''} src={backgroundImg} className={`${cssStyle.bgOne} ${this.state.hideBg ? cssStyle.hide:cssStyle.show}`} style={{top:top+'%'}} />
                                </React.Fragment>
                            )}
                            <div ref={this.saveRef} className={`${cssStyle.earthBox} ${style.theme === 2 ? cssStyle.earthBoxTwo:''}`} id={'three_div_'+this.props.thisData.id} style={{top:top+'%'}}>

                            </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}