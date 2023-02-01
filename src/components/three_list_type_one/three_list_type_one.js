import React from "react";
import ComponentBox from "../component_box"
import * as THREE from 'three';
import cssStyle from "./three_list_type_one.module.css";
import { Motion, spring } from "react-motion";
import {getData} from "../../common/getDataUtil";
import {initThreeDom} from "../../common/threeUtil";
import {interactData} from "../../common/util";

export default class ThreeListTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity:0,resultData:[],left:50 };
        this.saveRef = ref => {this.refDom = ref};
        this.getData = getData.bind(this);
        this.initThreeDom = initThreeDom.bind(this);
        this.interactData = interactData.bind(this);
        this.geometryList = [];
        this.materialList = [];
        this.meshList = [];
        this.clickObjects = [];
        this.fontSize = 0.9;
    }

    componentDidMount() {
        setTimeout(()=>{
            //初始化
            this.initThree();
            //字体加载器
            this.loadFontP = new Promise((resolve)=>{
                const loader = new THREE.FontLoader();
                loader.load( './font/FZLanTingHeiS-R-GB_Regular.json',  ( font ) => {
                    this.font = font;
                    resolve();
                });
            });
            //获取数据
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
            this.loadFontP.then(()=>{
                // this.addRectList(result);
            });
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

        //存储组
        this.group = new THREE.Group();
        // this.group.position.set(25, 0, 10);
        this.scene.add(this.group);
        global.geometrySp = this.group;
        //圆圈存储组
        this.groupCircle = new THREE.Group();
        this.groupCircle.name = 'circleGroup';
        // this.groupCircle.rotation.y = Math.PI/4;
        this.scene.add(this.groupCircle);
        this.circleGroupList = [];

        this.addWaves();

        this.clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);

            if(this.mixer){
                this.mixer.update(this.clock.getDelta());
            }

            if(this.particles){
                const positions = this.particles.geometry.attributes.position.array;
                const scales = this.particles.geometry.attributes.scale.array;

                let i = 0, j = 0;

                for ( let ix = 0; ix < this.AMOUNTX; ix ++ ) {

                    for ( let iy = 0; iy < this.AMOUNTY; iy ++ ) {

                        positions[ i + 1 ] = (( Math.sin( ( ix + this.count ) * 0.3 ) * 50 ) +
                            ( Math.sin( ( iy + this.count ) * 0.5 ) * 50 ))/100;

                        scales[ j ] = (( Math.sin( ( ix + this.count ) * 0.3 ) + 1 ) * 20 +
                            ( Math.sin( ( iy + this.count ) * 0.5 ) + 1 ) * 20)/100;

                        i += 3;
                        j ++;

                    }

                }

                this.particles.geometry.attributes.position.needsUpdate = true;
                this.particles.geometry.attributes.scale.needsUpdate = true;

            }
            this.renderer.render(this.scene, this.camera);

            if(this.count != null){
                this.count += 0.1;
            }
        };
        animate();
    }

    addRectList(result){
        let clipList = [];
        for(let i = 0;i < 2;i ++){
            const curve = new THREE.EllipseCurve(
                0,  0,            // ax, aY
                12+i*1, 12+i*1,           // xRadius, yRadius
                0,  2 * Math.PI,  // aStartAngle, aEndAngle
                false,            // aClockwise
                0                 // aRotation
            );
            // 样条曲线均匀分割100分，返回51个顶点坐标
            const points = curve.getPoints(100);
            let posArr = [];
            let angleArr = [];
            points.forEach(elem => {
                posArr.push(elem.x, elem.y, 0);
                angleArr.push(elem.y < 0 ? Math.atan(elem.x / elem.y)-Math.PI:Math.atan(elem.x / elem.y));
            });
            let timeArr = [];
            for (let i = 0; i < 101; i++) {
                timeArr.push(i);
            }
            const times = new Float32Array(timeArr);
            const values = new Float32Array(posArr);
            const angles = new Float32Array(angleArr);
            let geometry = new THREE.BufferGeometry();
            // 把从曲线轨迹上获得的顶点坐标赋值给几何体
            geometry.setAttribute( 'position', new THREE.BufferAttribute( values, 3 ) );
            geometry.rotateX(Math.PI/2);
            // console.log(geometry);
            // var material = new THREE.PointsMaterial({
            //     color: 0x4488ff
            // });
            // var line = new THREE.Points(geometry, material);
            // this.group.add(line);
            clipList.push({timeArr:times,posArr:geometry.attributes.position.array,angleArr:angles});
        }

        this.mixer = new THREE.AnimationMixer(this.group);

        let rectList = [];
        if(result.length <= 8){
            for(let i = 0;i < Math.ceil(12/result.length);i ++){
                rectList.push(...result);
            }
        }else{
            rectList.push(...result);
        }
        rectList.forEach((item,index)=>{
            this.addOneRect(item.name,clipList[index%2],index,rectList.length);
            // setTimeout(()=>{
            // },800*index);
        });
    }

    addOneRect(name,clipData,index,rectNum){
        if(!name){
            return;
        }
        const nameLength = name.length;
        let nameList = [];
        let maxPartLength = 0;
        if(nameLength <= 5){
            nameList.push(name);
            maxPartLength = name.length;
        }else if(nameLength <= 8){
            nameList.push(name.substr(0,4),name.substr(4,4));
            maxPartLength = 4;
        }else if(nameLength <= 10){
            nameList.push(name.substr(0,5),name.substr(5,5));
            maxPartLength = 5;
        }else if(nameLength <= 12){
            nameList.push(name.substr(0,4),name.substr(4,4),name.substr(8,4));
            maxPartLength = 4;
        }else if(nameLength <= 15){
            nameList.push(name.substr(0,5),name.substr(5,5),name.substr(10,5));
            maxPartLength = 5;
        }else{
            const partLength = Math.ceil(nameLength/3);
            maxPartLength = partLength;
            for(let i = 0;i < 3;i ++){
                nameList.push(name.substr(partLength*i,partLength));
            }
        }
        this.addFont(nameList,maxPartLength,clipData,index,rectNum);
    }

    addFont(nameList,maxPartLength,clipData,rectIndex,rectNum){
        const thisGroup = new THREE.Group();
        thisGroup.name = 'rectGroup'+rectIndex;
        thisGroup.rotation.y = Math.PI/4;
        nameList.forEach((namePart,index)=>{
            const shapes = this.font.generateShapes( namePart, 0.5, 2 );
            const geometryText = new THREE.ShapeGeometry( shapes );
            geometryText.computeBoundingBox();
            const xMid = - 0.5 * ( geometryText.boundingBox.max.x - geometryText.boundingBox.min.x );
            geometryText.translate( xMid, ((nameList.length - 1)/2 - index - 0.3)*this.fontSize, 0 );
            const matText = new THREE.LineBasicMaterial( {
                color: 0xffffff,
                // side: THREE.DoubleSide
            } );
            const text = new THREE.Mesh( geometryText, matText );
            text.position.set(0,0,0.01);
            thisGroup.add(text);
        });
        //方框一
        const boxOne = new THREE.PlaneGeometry(maxPartLength*this.fontSize, (nameList.length+1)*this.fontSize);
        const boxOneMat = new THREE.MeshBasicMaterial( {
            color: 0x0d3550,
            side: THREE.FrontSide,
            transparent: true,
            opacity:0.6
        });
        const boxOneMesh = new THREE.Mesh(boxOne, boxOneMat);
        thisGroup.add(boxOneMesh);
        //方框二
        const boxTwo = new THREE.PlaneGeometry((maxPartLength+1)*this.fontSize, (nameList.length+2)*this.fontSize);
        const boxTwoMat = new THREE.MeshBasicMaterial( {
            color: 0x28b1c7,
            side: THREE.FrontSide,
            transparent: true,
            opacity:0.5
        });
        const boxTwoMesh = new THREE.Mesh(boxTwo, boxTwoMat);
        boxTwoMesh.position.set(0,0,-0.01);
        thisGroup.add(boxTwoMesh);
        this.group.add(thisGroup);
        //动画
        const posTrack = new THREE.KeyframeTrack('rectGroup'+rectIndex+'.position', clipData.timeArr, clipData.posArr);
        const angleTrack = new THREE.KeyframeTrack('rectGroup'+rectIndex+'.rotation[y]', clipData.timeArr, clipData.angleArr);
        let duration = 100;
        let clip = new THREE.AnimationClip("animateRectGroup"+rectIndex, duration, [posTrack,angleTrack]);
        let AnimationAction = this.mixer.clipAction(clip,thisGroup);
        AnimationAction.timeScale = 5;
        AnimationAction.time = duration*rectIndex/rectNum;
        AnimationAction.play();
    }

    addWaves(){
        this.SEPARATION = 1;
        this.AMOUNTX = 50;
        this.AMOUNTY = 50;
        this.count = 0;
        const numParticles = this.AMOUNTX * this.AMOUNTY;

        const positions = new Float32Array( numParticles * 3 );
        const scales = new Float32Array( numParticles );

        let i = 0, j = 0;

        for ( let ix = 0; ix < this.AMOUNTX; ix ++ ) {

            for ( let iy = 0; iy < this.AMOUNTY; iy ++ ) {

                positions[ i ] = ix * this.SEPARATION - ( ( this.AMOUNTX * this.SEPARATION ) / 2 ); // x
                positions[ i + 1 ] = 0; // y
                positions[ i + 2 ] = iy * this.SEPARATION - ( ( this.AMOUNTY * this.SEPARATION ) / 2 ); // z

                scales[ j ] = 1;

                i += 3;
                j ++;

            }

        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );

        const material = new THREE.ShaderMaterial( {

            uniforms: {
                color: { value: new THREE.Color( 0x4A90E2 ) },
            },
            vertexShader: document.getElementById( 'vertexShader_'+this.props.thisData.id ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader_'+this.props.thisData.id ).textContent

        } );

        //

        this.particles = new THREE.Points( geometry, material );
        this.particles.position.y = -6;
        this.scene.add( this.particles );
    }

    render() {
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div ref={this.saveRef} className={cssStyle.box} style={{opacity}} id={'three_div_'+this.props.thisData.id} >
                        </div>
                    }
                </Motion>
                <div className={cssStyle.esCode} id={'vertexShader_'+this.props.thisData.id}>
                    {`attribute float scale;
                    void main() {
                        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                        gl_PointSize = scale * ( 300.0 / - mvPosition.z );
                        gl_Position = projectionMatrix * mvPosition;
                    }`}
                </div>
                <div className={cssStyle.esCode} id={'fragmentShader_'+this.props.thisData.id}>
                    {`uniform vec3 color;
                    void main() {
                        if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
                        gl_FragColor = vec4( color, 1.0 );
                    }`}
                </div>
            </ComponentBox>
        );
    }
}