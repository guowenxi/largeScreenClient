import React from "react";
import ComponentBox from "../component_box"
import * as THREE from 'three';
import cssStyle from "./three_pyramid.module.css";
import { Motion, spring } from "react-motion";
import {getData} from "../../common/getDataUtil";
import {getSumByKey} from "../../common/util";
import {initThreeDom} from "../../common/threeUtil";


export default class ThreePyramid extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity:0,resultData:[] };
        this.saveRef = ref => {this.refDom = ref};
        this.getData = getData.bind(this);
        this.initThreeDom = initThreeDom.bind(this);
        this.geometryList = [];
        this.materialList = [];
        this.meshList = [];
        this.keyParams = {};
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
            this.addPyramid(result);
            if(resolve){
                resolve(result);
            }
        }
    }

    //删除旧图形
    destroyOld(){
        if(this.group){
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
        }
    }

    //初始化
    initThree(){
        this.initThreeDom();

        const { style } = this.props.thisData;
        //金字塔
        this.group = new THREE.Group();
        this.group.position.y = style.positionY ? style.positionY : -25;
        this.scene.add(this.group);
        const animate = () => {
            requestAnimationFrame(animate);

            // mesh.rotation.y += 0.01;
            // mesh.rotation.y += 0.01;
            this.group.rotation.y += 0.008;

            this.renderer.render(this.scene, this.camera);
            //clock.getDelta()方法获得两帧的时间间隔
        };
        animate();
    }

    addPyramid(result){
        // console.log(new THREE.Color('rgba(255,156,0,0.5)'));
        // var rectWidth = 65;
        // var rectHeight = 100;
        // this.addFloor(rectWidth,rectHeight,0,0.20,new THREE.Color(0xE880DF),new THREE.Color(0xCD5CDF));
        // this.addFloor(rectWidth,rectHeight,0.25,0.40,new THREE.Color(0xF27749),new THREE.Color(0xE73F2C));
        // this.addFloor(rectWidth,rectHeight,0.45,0.60,new THREE.Color(0x53E16A),new THREE.Color(0x32CE32));
        // this.addFloor(rectWidth,rectHeight,0.65,1,new THREE.Color(0x3F90E4),new THREE.Color(0x2458D3));
        const { style } = this.props.thisData;
        if(style.key){
            const sum = getSumByKey(result,style.key);
            let zeroNum = 0;
            result.forEach((item)=>{
                if(!item[style.key]){
                    zeroNum ++;
                }
            });
            if(zeroNum < result.length){
                const gap = style.gap ? style.gap : 0;
                const allPer = 1 - gap*(result.length - 1 - zeroNum);
                let startPer = 0;
                result.forEach((item,index)=>{
                    const thisNum = item[style.key];
                    const thisColor = style.colorList && style.colorList[index] ? style.colorList[index] : {start:0xE880DF,end:0xCD5CDF};
                    const thisPer = thisNum*allPer/sum;
                    this.addFloor(style.width,style.height,startPer,startPer+thisPer,new THREE.Color(thisColor.start),new THREE.Color(thisColor.end));
                    startPer = startPer+thisPer+gap;
                });
            }
        }
    }

    addFloor(width,height,start,end,startColor,endColor){
        var geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
        var vertices = new Float32Array([
            end*width,height*(1-end),end*width,
            -end*width,height*(1-end),end*width,
            -end*width,height*(1-end),-end*width,

            end*width,height*(1-end),end*width,
            -end*width,height*(1-end),-end*width,
            end*width,height*(1-end),-end*width,

            start*width,height*(1-start),start*width,
            -start*width,height*(1-start),start*width,
            -start*width,height*(1-start),-start*width,

            start*width,height*(1-start),start*width,
            -start*width,height*(1-start),-start*width,
            start*width,height*(1-start),-start*width,

            end*width,height*(1-end),end*width,
            start*width,height*(1-start),start*width,
            -start*width,height*(1-start),start*width,

            -end*width,height*(1-end),end*width,
            end*width,height*(1-end),end*width,
            -start*width,height*(1-start),start*width,

            end*width,height*(1-end),end*width,
            end*width,height*(1-end),-end*width,
            start*width,height*(1-start),start*width,

            end*width,height*(1-end),-end*width,
            start*width,height*(1-start),-start*width,
            start*width,height*(1-start),start*width,

            end*width,height*(1-end),-end*width,
            -end*width,height*(1-end),-end*width,
            start*width,height*(1-start),-start*width,

            -end*width,height*(1-end),-end*width,
            -start*width,height*(1-start),-start*width,
            start*width,height*(1-start),-start*width,

            -end*width,height*(1-end),-end*width,
            -end*width,height*(1-end),end*width,
            -start*width,height*(1-start),-start*width,

            -end*width,height*(1-end),end*width,
            -start*width,height*(1-start),start*width,
            -start*width,height*(1-start),-start*width,
        ]);
        // 创建属性缓冲区对象
        var attribute = new THREE.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
        // 设置几何体attributes属性的位置属性
        geometry.attributes.position = attribute;
        this.geometryList.push(geometry);

        var colors = new Float32Array([
            endColor.r,endColor.g,endColor.b,
            endColor.r,endColor.g,endColor.b,
            endColor.r,endColor.g,endColor.b,

            endColor.r,endColor.g,endColor.b,
            endColor.r,endColor.g,endColor.b,
            endColor.r,endColor.g,endColor.b,

            startColor.r,startColor.g,startColor.b,
            startColor.r,startColor.g,startColor.b,
            startColor.r,startColor.g,startColor.b,

            startColor.r,startColor.g,startColor.b,
            startColor.r,startColor.g,startColor.b,
            startColor.r,startColor.g,startColor.b,

            endColor.r,endColor.g,endColor.b,
            startColor.r,startColor.g,startColor.b,
            startColor.r,startColor.g,startColor.b,

            endColor.r,endColor.g,endColor.b,
            endColor.r,endColor.g,endColor.b,
            startColor.r,startColor.g,startColor.b,

            endColor.r,endColor.g,endColor.b,
            endColor.r,endColor.g,endColor.b,
            startColor.r,startColor.g,startColor.b,

            endColor.r,endColor.g,endColor.b,
            startColor.r,startColor.g,startColor.b,
            startColor.r,startColor.g,startColor.b,

            endColor.r,endColor.g,endColor.b,
            endColor.r,endColor.g,endColor.b,
            startColor.r,startColor.g,startColor.b,

            endColor.r,endColor.g,endColor.b,
            startColor.r,startColor.g,startColor.b,
            startColor.r,startColor.g,startColor.b,

            endColor.r,endColor.g,endColor.b,
            endColor.r,endColor.g,endColor.b,
            startColor.r,startColor.g,startColor.b,

            endColor.r,endColor.g,endColor.b,
            startColor.r,startColor.g,startColor.b,
            startColor.r,startColor.g,startColor.b,
        ]);
        // 设置几何体attributes属性的颜色color属性
        geometry.attributes.color = new THREE.BufferAttribute(colors, 3); //3个为一组,表示一个顶点的颜色数据RGB

        //法向量
        var normals = new Float32Array([
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            0, 1, 1,
            0, 1, 1,
            0, 1, 1,

            0, 1, 1,
            0, 1, 1,
            0, 1, 1,

            1, 1, 0,
            1, 1, 0,
            1, 1, 0,

            1, 1, 0,
            1, 1, 0,
            1, 1, 0,

            0, 1, -1,
            0, 1, -1,
            0, 1, -1,

            0, 1, -1,
            0, 1, -1,
            0, 1, -1,

            -1, 1, 0,
            -1, 1, 0,
            -1, 1, 0,

            -1, 1, 0,
            -1, 1, 0,
            -1, 1, 0,
        ]);
        // 设置几何体attributes属性的位置normal属性
        geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

        const { style } = this.props.thisData;
        var material = new THREE.MeshLambertMaterial( {
            // color: 0xD39428,
            // vertexColors: THREE.FaceColors,
            vertexColors: THREE.VertexColors, //以顶点颜色为准
            side: THREE.DoubleSide , //两面可见
            transparent: true,
            opacity:style.opacity ? style.opacity : 1
        } );
        this.materialList.push(material);
        var mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.y += -Math.PI*3/2;
        this.meshList.push(mesh);
        this.group.add(mesh);
    }

    render() {
        // const { style } = this.props.thisData;
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