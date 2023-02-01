import React from "react";
import ComponentBox from "../component_box"
import * as THREE from 'three';
import cssStyle from "./three_map.module.css";
import { Motion, spring } from "react-motion";
import {getData} from "../../common/getDataUtil";
import {initThreeDom} from "../../common/threeUtil";
import {namePosition,dataPosition} from './mapData/mapPosition';
// import {mapData} from './mapData/ruian_new';

// import lineImg from "./images/line.png";
// import redBlueImg from "./images/red_blue.png";
// import orangeBlueImg from "./images/orange_blue.png";
// import yellowBlueImg from "./images/yellow_blue.png";
// import blueBlueImg from "./images/blue_blue.png";
// import greenBlueImg from "./images/green_blue.png";
import pointImg from "./images/point.svg";
import axios from "axios";


export default class ThreeMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity:0,resultData:[] };
        this.saveRef = ref => {this.refDom = ref};
        this.getData = getData.bind(this);
        this.initThreeDom = initThreeDom.bind(this);
        this.geometryList = [];
        this.materialList = [];
        this.imgMaterialArr = [];
        this.uniformsList = [];
        this.moveSubZ = 0.0005;
        this.moveSubY = 0.001;
        this.moveSubX = 0.0005;
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
            // this.destroyOld();
            axios.get('./json/ruian_mapData.json').then((response) => {
                // 在这儿实现 setState
                this.mapData = response.data.data;
                this.addMap(result);
            }).catch(function(error){
                // 处理请求出错的情况
            });
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
        this.group.name = 'mapGroup';
        this.group.rotation.x=-Math.PI/2;//几何体缩放
        this.scene.add(this.group);
        const animate = () => {
            requestAnimationFrame(animate);

            // if(this.uniformsList.length > 0){
            //     this.uniformsList.forEach((uniforms)=>{
            //         uniforms.time.value += 0.01;
            //     });
            // }
            // mesh.rotation.y += 0.01;
            // mesh.rotation.y += 0.01;
            // this.group.rotation.z += this.moveSubZ;
            // if(this.group.rotation.z > Math.PI/8){
            //     this.moveSubZ = -0.0005;
            // }else if(this.group.rotation.z < -Math.PI/8){
            //     this.moveSubZ = 0.0005;
            // }
            // this.group.rotation.y += this.moveSubY;
            // if(this.group.rotation.y > Math.PI/18){
            //     this.moveSubY = -0.001;
            // }else if(this.group.rotation.y < -Math.PI/18){
            //     this.moveSubY = 0.001;
            // }
            // this.group.rotation.x += this.moveSubX;
            // if(this.group.rotation.x > Math.PI/18-Math.PI/2){
            //     this.moveSubX = -0.0005;
            // }else if(this.group.rotation.x < -Math.PI/18-Math.PI/2){
            //     this.moveSubX = 0.0005;
            // }

            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    addMap(result){
        console.log('版本号',THREE.REVISION);
        const { style } = this.props.thisData;
        const amplifyNum = style.amplifyNum ? style.amplifyNum:500;
        const centerX = this.mapData[0].centerPoint[0];
        const centerY = this.mapData[0].centerPoint[1];

        // this.getImgMaterial(redBlueImg);
        // this.getImgMaterial(orangeBlueImg);
        // this.getImgMaterial(yellowBlueImg);
        // this.getImgMaterial(blueBlueImg);
        // this.getImgMaterial(greenBlueImg);
        this.getImgMaterial("./images/red_blue.png");
        this.getImgMaterial("./images/orange_blue.png");
        this.getImgMaterial("./images/yellow_blue.png");
        this.getImgMaterial("./images/blue_blue.png");
        this.getImgMaterial("./images/green_blue.png");
        this.getImgMaterial("./images/gray_blue.png");


        const lineColorList = ['rgb(244,82,70)','rgb(227,127,21)','rgb(255,204,0)','rgb(19,130,255)','rgb(66,202,131)','rgb(222,222,222)'];
        const colorList = ['rgb(251,84,71)','rgb(227,127,21)','rgb(247,214,75)','rgb(67,186,254)','rgb(66,202,131)','rgb(119,120,120)','rgb(255,255,255)'];
        let colorMaterialArr = [];
        for(let i = 0;i < 5;i ++){
            const colorMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color(colorList[i]),
                // side: THREE.BackSide, //两面可见
                side: THREE.DoubleSide,
                // depthTest: false,
                // opacity: 0.8,
                // transparent:true
            }); //材质对象
            colorMaterialArr.push(colorMaterial);
        }
        const colorMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(colorList[5]),
            // side: THREE.BackSide, //两面可见
            side: THREE.DoubleSide,
            // depthTest: false,
            // opacity: 0.8,
            // transparent:true
        }); //材质对象
        colorMaterialArr.push(colorMaterial);
        let lineColorMaterialArr = [];
        for(let i = 0;i < 6;i ++){
            const lineColorMaterial = new THREE.LineBasicMaterial({
                color: new THREE.Color(lineColorList[i]),
                linewidth: 10
            });
            lineColorMaterialArr.push(lineColorMaterial);
        }

        this.mapData.forEach((area,areaIndex)=>{
            if(areaIndex === 0 ){

            }else{
                let roadData;
                for(let i = 0;i < result.length;i ++){
                    if(result[i].name === area.name){
                        roadData = result[i];
                    }
                }
                let mapShape = [];
                const materialIndex = roadData ? (roadData.level ? roadData.level-1:5) : areaIndex%5;
                area.points.forEach((part,partIndex)=>{
                    let areaPoints = [];
                    part.forEach((point)=>{
                        const pointX = (point[0]-centerX)*amplifyNum;
                        const pointY = (point[1]-centerY)*amplifyNum;
                        areaPoints.push(new THREE.Vector2(pointX,pointY));
                    });
                    let newPoints;
                    let maxPoints = 1000;
                    if(part.length > maxPoints){
                        const curve = new THREE.SplineCurve(areaPoints);
                        newPoints = curve.getPoints(maxPoints);
                    }else{
                        newPoints = areaPoints;
                    }

                    mapShape.push(new THREE.Shape(newPoints));
                    //画线
                    const geometryLine = new THREE.BufferGeometry(); //声明一个几何体对象Geometry
                    geometryLine.setFromPoints(newPoints);
                    //线条模型对象
                    const line = new THREE.Line(geometryLine, lineColorMaterialArr[materialIndex]);
                    this.group.add(line); //线条对象添加到场景中
                });
                const geometry = new THREE.ExtrudeGeometry(//拉伸造型
                    mapShape,//二维轮廓
                    //拉伸参数
                    {
                        amount:-12,//拉伸长度
                        bevelEnabled:false//无倒角
                    }
                );
                global.geometry = geometry;
                const materialArr = [colorMaterialArr[materialIndex], this.imgMaterialArr[materialIndex], colorMaterialArr[materialIndex]];
                const mesh = new THREE.Mesh(geometry, materialArr);
                this.group.add(mesh); //网格模型添加到场景中


                const canvasName =  this.getRoadCanvas(area.name);
                const textureName = new THREE.CanvasTexture(canvasName);
                const spriteMaterialName = new THREE.SpriteMaterial({
                    // color:0xff00ff,//设置精灵矩形区域颜色
                    // rotation:Math.PI/4,//旋转精灵对象45度，弧度值
                    map: textureName,//设置精灵纹理贴图
                });
                // 创建精灵模型对象，不需要几何体geometry参数
                const spriteName = new THREE.Sprite(spriteMaterialName);
                spriteName.scale.set(24, 6.5, 1);
                const namePoint = namePosition[area.name].length > 0 ? namePosition[area.name] : area.centerPoint;
                spriteName.position.set( (namePoint[0]-centerX)*amplifyNum, (namePoint[1]-centerY)*amplifyNum, 3.25 );
                this.group.add(spriteName);

                const roadNum = roadData ? roadData.num : 0;
                this.getNumCanvas(roadNum).then((canvasNum)=>{
                    const textureNum = new THREE.CanvasTexture(canvasNum);
                    const spriteMaterialNum = new THREE.SpriteMaterial({
                        // color:0xff00ff,//设置精灵矩形区域颜色
                        // rotation:Math.PI/4,//旋转精灵对象45度，弧度值
                        map: textureNum,//设置精灵纹理贴图
                    });
                    // 创建精灵模型对象，不需要几何体geometry参数
                    const spriteNum = new THREE.Sprite(spriteMaterialNum);
                    spriteNum.scale.set(12, 13.2, 1);
                    const numPoint = dataPosition[area.name].length > 0 ? dataPosition[area.name] : area.centerPoint;
                    spriteNum.position.set( (numPoint[0]-centerX)*amplifyNum, (numPoint[1]-centerY)*amplifyNum, 6.6 );
                    this.group.add(spriteNum);
                });
            }
        });
    }

    getImgMaterial(bgImg){
        const textureLine = new THREE.TextureLoader().load('./images/line.png');
        textureLine.wrapS = THREE.RepeatWrapping;
        textureLine.wrapT = THREE.RepeatWrapping;
        const textureBg = new THREE.TextureLoader().load(bgImg);
        textureBg.wrapS = THREE.RepeatWrapping;
        textureBg.wrapT = THREE.RepeatWrapping;
        const uniforms = {
            time: {value: 1.1},
            type: {value: 4},
            // width: {value: 0.1},
            // height: {value: 0.1},
            width: {value: 0.1},
            height: {value: 0.07},
            offsetY : {value: -1.0},
            amplitude: {value: 1.0},
            color: {value: new THREE.Color(0xff2200)},
            colorTexture1: {value: textureLine},
            colorTexture2: {value: textureBg},
        };
        this.uniformsList.push(uniforms);
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('vertexShader_'+this.props.thisData.id).textContent,
            fragmentShader: document.getElementById('fragmentShader_'+this.props.thisData.id).textContent,
            // opacity: 1,
            // transparent: imgTransparent,
            // depthTest: false,
            side: THREE.DoubleSide,
            // blending: THREE.AdditiveBlending,
        });
        this.imgMaterialArr.push(shaderMaterial)
    }

    getRoadCanvas(roadName){
        const width = 360;
        const height = 97.5;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const c = canvas.getContext('2d');
        // 矩形区域填充背景
        c.fillStyle = "#09F9F8";
        c.beginPath();
        c.moveTo(width*0.92,height);
        c.lineTo(0,height);
        c.lineTo(width*0.08,0);
        c.lineTo(width,0);
        c.fill();
        // 文字
        // c.beginPath();
        c.fillStyle = "#000000"; //文本填充颜色
        c.font = "bold "+(height*0.75)+"px 宋体"; //字体样式设置
        c.textBaseline = "middle"; //文本与fillText定义的纵坐标
        c.textAlign = "center"; //文本居中(以fillText定义的横坐标)
        c.fillText(roadName, width/2, height/2);
        c.closePath();
        return canvas;
    }

    getNumCanvas(num){
        const zoom = 2;
        const canvas = document.createElement("canvas");
        canvas.width = 58*zoom;
        canvas.height = 64*zoom;
        const c = canvas.getContext('2d');
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = pointImg;
            //图片加载完后，将其显示在canvas中
            img.onload = ()=>{
                c.drawImage(img, 0,0,58*zoom, 64*zoom);
                // context.drawImage(this, 0, 0, 1080, 980)改变图片大小到1080*980
                c.fillStyle = "#ffffff"; //文本填充颜色
                c.font = "bold "+(30*zoom)+"px 宋体"; //字体样式设置
                c.textBaseline = "middle"; //文本与fillText定义的纵坐标
                c.textAlign = "center"; //文本居中(以fillText定义的横坐标)
                c.fillText(num, 29*zoom, 29*zoom);
                resolve(canvas)
            };
            //图片加载失败的方法
            img.onerror = (e)=>{
                reject(e)
            }
        });
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
                <div className={cssStyle.esCode} id={'vertexShader_'+this.props.thisData.id}>
                    {`varying vec2 vUv;
                    varying vec3 fNormal;
                    varying vec3 vPosition;
                    void main()
                    {
                        vUv = uv;
                        fNormal=normal;
                        vPosition=position;
                        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                        gl_Position = projectionMatrix * mvPosition;
                    }`}
                </div>
                <div className={cssStyle.esCode} id={'fragmentShader_'+this.props.thisData.id}>
                    {`uniform float time;
                    uniform float width;
                    uniform float height;
                    uniform float offsetY;
                    uniform int type;
                    varying vec2 vUv;
                    uniform sampler2D colorTexture1;
                    uniform sampler2D colorTexture2;
                    varying vec3 fNormal;
                    varying vec3 vPosition;
                    void main( void ) {
                        vec4 colora;
                        vec4 colorb;
                        //float offsetY = 0.0;
                        if(type == 1){
                            colora = texture2D(colorTexture1,vec2(vUv.x*width,fract((vUv.y+offsetY)*height-time)));
                            colorb = texture2D(colorTexture2,vec2(vUv.x*width,(vUv.y+offsetY)*height));
                        }else if(type == 2){
                            colora = texture2D(colorTexture1,vec2((vUv.y+offsetY)*width,fract(vUv.x*height-time)));
                            colorb = texture2D(colorTexture2,vec2((vUv.y+offsetY)*width,vUv.x*height));
                        }else if(type == 3){
                            colora = texture2D(colorTexture1,vec2((1.0 - (vUv.y+offsetY)*width),fract(1.0 - vUv.x*height - time)));
                            colorb = texture2D(colorTexture2,vec2((1.0 - (vUv.y+offsetY)*width),(1.0 - vUv.x*height)));
                        }else{
                            colora = texture2D(colorTexture1,vec2(1.0-vUv.x*width,fract(1.0-(vUv.y+offsetY)*height-time)));
                            colorb = texture2D(colorTexture2,vec2(1.0-vUv.x*width,1.0-(vUv.y+offsetY)*height));
                        }
                        if(colora.a > 0.0 && colora.r > 0.0){
                            gl_FragColor = colorb;
                            //gl_FragColor = colorb*colora+colorb;
                        }else{
                            gl_FragColor = colorb;
                        }
                    }`}
                </div>
            </ComponentBox>
        );
    }
}