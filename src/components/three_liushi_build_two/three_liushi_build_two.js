import React from "react";
import ComponentBox from "../component_box"
import * as THREE from 'three';
import cssStyle from "./three_liushi_build_two.module.css";
import { Motion, spring } from "react-motion";
import {getData} from "../../common/getDataUtil";
import {initThreeDom} from "../../common/threeUtil";
import {interactData} from "../../common/util";

export default class ThreeLiushiBuildTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity:0,resultData:[],left:0 };
        this.saveRef = ref => {this.refDom = ref};
        this.getData = getData.bind(this);
        this.initThreeDom = initThreeDom.bind(this);
        this.interactData = interactData.bind(this);
        this.geometryList = [];
        this.materialList = [];
        this.meshList = [];
        this.clickObjects = [];
    }

    componentDidMount() {
        setTimeout(()=>{
            this.initThree();
            document.getElementById('three_div_' + this.props.thisData.id).addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
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
            case "cancelSelect":
                this.scene.add(this.groupCircle);
                this.scene.add(this.meshRectRing);
                this.setState({left:0});
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

        this.mapAboutMatList = [];
        // this.camera.position.set(0, 30, 30); //设置相机位置

        //点击射线
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.textureLoader = new THREE.TextureLoader();

        this.group = new THREE.Group();
        this.group.rotation.x = -Math.PI/2;
        this.scene.add(this.group);

        //字体加载器
        const loader = new THREE.FontLoader();
        loader.load( './font/font_Regular.json',  ( font ) => {
            this.font = font;
            this.addMoveCircle();
            this.addRect();
        });
        //圆圈存储组
        this.groupCircle = new THREE.Group();
        this.groupCircle.name = 'circleGroup';
        // this.groupCircle.rotation.y = Math.PI/4;
        this.scene.add(this.groupCircle);
        this.circleGroupList = [];

        this.clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);

            if(this.mixer){
                this.mixer.update(this.clock.getDelta());
            }
            if(this.showMoveCircle && this.moveCircleMaterialList){
                this.moveCircleMaterialList.forEach((item)=>{
                    item.opacity += 0.02;
                    if(item.opacity >= 1){
                        this.showMoveCircle = false;
                    }
                })
            }

            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }


    addMoveCircle(){
        this.moveCircleMaterialList = [];
        // 通过类CatmullRomCurve3创建一个3D样条曲线
        const curve = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            14, 14,           // xRadius, yRadius
            0,  2 * Math.PI,  // aStartAngle, aEndAngle
            false,            // aClockwise
            0                 // aRotation
        );
        // 样条曲线均匀分割100分，返回51个顶点坐标
        const points = curve.getPoints(100);
        let posArr = [];
        points.forEach(elem => {
            posArr.push(elem.x, elem.y, 0);
        });
        let timeArr = [];
        for (let i = 0; i < 101; i++) {
            timeArr.push(i);
        }
        const times = new Float32Array(timeArr);
        const values = new Float32Array(posArr);
        let geometry = new THREE.BufferGeometry();
        // 把从曲线轨迹上获得的顶点坐标赋值给几何体
        geometry.setAttribute( 'position', new THREE.BufferAttribute( values, 3 ) );
        geometry.rotateX(-Math.PI/2);
        geometry.rotateY(Math.PI/4);
        // console.log(geometry);
        // var material = new THREE.LineBasicMaterial({
        //     color: 0x4488ff
        // });
        // var line = new THREE.Line(geometry, material);
        // this.scene.add(line);

        this.mixer = new THREE.AnimationMixer(this.scene);

        //图标材质
        const materialOne = new THREE.MeshStandardMaterial( {
            color: 0x00ffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity:0
        });
        this.textureLoader.load( "./images/three/liushi/icon01.png", ( map ) => {
            materialOne.map = map;
            materialOne.needsUpdate = true;
        } );
        // this.moveCircleMaterialList.push(materialOne);
        const materialTwo = new THREE.MeshStandardMaterial( {
            color: 0x00ffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity:0
        });
        this.textureLoader.load( "./images/three/liushi/icon02.png", ( map ) => {
            materialTwo.map = map;
            materialTwo.needsUpdate = true;
        } );
        // this.moveCircleMaterialList.push(materialTwo);

        const nameList = ['物联网综合体','科技创新与人才引进','教育培训','服务平台','数字经济','楼宇经济','总部经济'];

        for(let i = 0;i < 7;i ++){
            // setTimeout(()=>{
            // },i*1460+100);
            this.addOnePart(i,times,geometry.attributes.position.array,nameList[i]);
        }
        this.showMoveCircle = true;
    }

    addOnePart(index,timeArr,posArr,name){
        //图标材质
        const iconMaterial = new THREE.MeshStandardMaterial( {
            color: 0x00ffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity:0
        });
        this.textureLoader.load( "./images/three/liushi/"+name+".png", ( map ) => {
            iconMaterial.map = map;
            iconMaterial.needsUpdate = true;
        } );
        this.moveCircleMaterialList.push(iconMaterial);

        const zoom = 0.5;
        const thisGroup = new THREE.Group();
        thisGroup.name = 'circleGroup'+index;
        //动态圆环
        let circle = this.scatterCircle(5*zoom, 2.5*zoom, 1.5*zoom, new THREE.Color(0x0A68D4), 0.03);
        thisGroup.add(circle);

        //中心圆
        const circleSmall = new THREE.ArcCurve(0, 0, 2.5*zoom, 0, 2 * Math.PI);
        const shape = new THREE.Shape(circleSmall.getPoints(50));
        const shapeGeometry = new THREE.ShapeGeometry(shape, 25);
        const colorMaterial = new THREE.MeshLambertMaterial({
            color: 0x0A68D4,
            side: THREE.DoubleSide,
            transparent: true,
            opacity:0
        });
        this.moveCircleMaterialList.push(colorMaterial);
        const circleMesh = new THREE.Mesh(shapeGeometry, colorMaterial);
        circleMesh.position.set(0,0,0.1);
        thisGroup.add(circleMesh);

        //圆线
        const geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
        //参数：0, 0圆弧坐标原点x，y  100：圆弧半径    0, 2 * Math.PI：圆弧起始角度
        const arc = new THREE.ArcCurve(0, 0, 5*zoom, 0, 2 * Math.PI);
        //getPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
        const arcPoints = arc.getPoints(50);//分段数50，返回51个顶点
        // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
        geometry.setFromPoints(arcPoints);
        //材质对象
        const material = new THREE.LineBasicMaterial({
            color: 0x0A68D4,
            transparent: true,
            opacity:0
        });
        this.moveCircleMaterialList.push(material);
        //线条模型对象
        const line = new THREE.Line(geometry, material);
        thisGroup.add(line);

        //图标
        const iconGeometry = new THREE.PlaneGeometry(name === '物联网综合体' ? 2.4:3, 2.4);
        iconGeometry.rotateX(Math.PI/2);
        iconGeometry.rotateZ(Math.PI/4);
        const iconMesh = new THREE.Mesh(iconGeometry, iconMaterial);
        iconMesh.name = 'icon_'+name+'_'+index;
        iconMesh.position.set(0,0,2.5);
        thisGroup.add(iconMesh);
        this.clickObjects.push(iconMesh);

        //文字
        if(this.font){
            const textShape = new THREE.BufferGeometry();
            const shapes = this.font.generateShapes( name, 0.5, 2 );
            const geometryText = new THREE.ShapeGeometry( shapes );
            geometryText.computeBoundingBox();
            const xMid = - 0.5 * ( geometryText.boundingBox.max.x - geometryText.boundingBox.min.x );
            geometryText.translate( xMid, 0, 0 );
            textShape.fromGeometry( geometryText );
            const matText = new THREE.LineBasicMaterial( {
                color: 0xffffff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity:0
            } );
            this.moveCircleMaterialList.push(matText);
            textShape.rotateX(Math.PI/2);
            textShape.rotateZ(Math.PI/4);
            const text = new THREE.Mesh( textShape, matText );
            text.position.set(0,0,0.5);
            thisGroup.add(text);
        }

        thisGroup.rotation.x = -Math.PI/2;
        // thisGroup.rotation.y = Math.PI/4;
        // thisGroup.rotation.z = -Math.PI/2;
        this.groupCircle.add(thisGroup);

        const posTrack = new THREE.KeyframeTrack('circleGroup'+index+'.position', timeArr, posArr);
        let duration = 100;
        let clip = new THREE.AnimationClip("animateCircleGroup"+index, duration, [posTrack]);
        let AnimationAction = this.mixer.clipAction(clip,thisGroup);
        AnimationAction.timeScale = 5;
        AnimationAction.time = 100/7*index;
        AnimationAction.play();
    }

    scatterCircle(r, init, ring, color, speed) {
        const uniform = {
            u_color: { value: color },
            u_r: { value: init },
            u_ring: {
                value: ring,
            },
        };

        const vs = `
            varying vec3 vPosition;
            void main(){
                vPosition=position;
                gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        const fs = `
            varying vec3 vPosition;
            uniform vec3 u_color;
            uniform float u_r;
            uniform float u_ring;
        
            void main(){
                float pct=distance(vec2(vPosition.x,vPosition.y),vec2(0.0));
                if(pct>u_r || pct<(u_r-u_ring)){
                    gl_FragColor = vec4(1.0,0.0,0.0,0);
                }else{
                    float dis=(pct-(u_r-u_ring))/(u_r-u_ring);
                    gl_FragColor = vec4(u_color,dis);
                }
            }
        `;
        const geometry = new THREE.CircleGeometry(r, 120);
        const material = new THREE.ShaderMaterial({
            vertexShader: vs,
            fragmentShader: fs,
            side: THREE.DoubleSide,
            uniforms: uniform,
            transparent: true,
            depthWrite: false,
            opacity:0
        });
        this.moveCircleMaterialList.push(material);
        const circle = new THREE.Mesh(geometry, material);

        function render() {
            uniform.u_r.value += speed || 0.1;
            if (uniform.u_r.value >= r) {
                uniform.u_r.value = init;
            }
            requestAnimationFrame(render);
        }
        render();

        return circle;
    }

    addRect(){
        let rect1 = this.scatterRect(11, 2, 2, 1, new THREE.Color("rgb(4,132,198)"), 0.05);
        let rect2 = this.scatterRect(11, 5, 2, 1, new THREE.Color("rgb(4,132,198)"), 0.05);
        let rect3 = this.scatterRect(11, 8, 2, 1, new THREE.Color("rgb(4,132,198)"), 0.05);
        let rect4 = this.scatterRect(11, 2.2, 2, 1, new THREE.Color("rgb(4,132,198)"), 0);
        let rect5 = this.scatterRect(11, 2.2, 2, 1, new THREE.Color("rgb(4,132,198)"), 0);
        rect1.position.set(0,0,0);
        rect2.position.set(0,0,0);
        rect3.position.set(0,0,0);
        rect4.position.set(0,0,0);
        rect5.position.set(0,0,2);
        this.group.add(rect1);
        this.group.add(rect2);
        this.group.add(rect3);
        this.group.add(rect4);
        this.group.add(rect5);
        //中间矩形
        const materialRectOne = new THREE.MeshStandardMaterial( {
            color: 0x00ffff,
            side: THREE.DoubleSide,
            transparent: true,
            // opacity:0
        });
        this.textureLoader.load( "./images/three/liushi/rect_side.png", ( map ) => {
            materialRectOne.map = map;
            materialRectOne.needsUpdate = true;
        } );
        const materialRectTwo = new THREE.MeshStandardMaterial( {
            color: 0x00ffff,
            side: THREE.DoubleSide,
            transparent: true,
            // opacity:0
        });
        this.textureLoader.load( "./images/three/liushi/rect_top.png", ( map ) => {
            materialRectTwo.map = map;
            materialRectTwo.needsUpdate = true;
        } );
        const materialRectThree = new THREE.MeshStandardMaterial( {
            color: 0x00ffff,
            // side: THREE.DoubleSide,
            transparent: true,
            // opacity:0
        });
        this.textureLoader.load( "./images/three/liushi/rect_other.png", ( map ) => {
            materialRectThree.map = map;
            materialRectThree.needsUpdate = true;
        } );
        const materialArrOne = [materialRectOne,materialRectOne,materialRectOne,materialRectOne,materialRectTwo];
        const materialArrTwo = [materialRectThree,materialRectThree,null,null,materialRectThree,materialRectThree];
        const geometryRectOne = new THREE.BoxGeometry( 5, 5, 2 );
        const meshRectOne = new THREE.Mesh(geometryRectOne, materialArrOne);
        meshRectOne.position.set(0,0,1);
        this.group.add(meshRectOne);
        const geometryRectTwo = new THREE.BoxGeometry( 5, 5, 2 );
        const meshRectTwo = new THREE.Mesh(geometryRectTwo, materialArrOne);
        meshRectTwo.position.set(0,0,3);
        this.group.add(meshRectTwo);
        const geometryRectThree = new THREE.BoxGeometry( 5, 5, 5 );
        const meshRectThree = new THREE.Mesh(geometryRectThree, materialArrTwo);
        meshRectThree.position.set(0,0,6.5);
        meshRectThree.rotation.x = Math.PI/2;
        this.group.add(meshRectThree);

        for(let i = 0;i < 4;i ++){
            this.addRectLine(i);
        }

        this.addRing(materialRectOne);
    }

    addRectLine(index){
        const materialRectLine = new THREE.MeshStandardMaterial( {
            color: 0x00ffff,
            side: THREE.DoubleSide,
            transparent: true,
            // opacity:0
        });
        this.textureLoader.load( "./images/three/liushi/rect_line.png", ( map ) => {
            // map.center.set(0.5,0.5);
            // map.rotation = Math.PI/4;
            materialRectLine.map = map;
            materialRectLine.needsUpdate = true;
        } );

        // const geometryRectLine = new THREE.PlaneGeometry(7, 7);
        const geometryRectLine = new THREE.RingGeometry(5.1, 5.9,4,8,0);
        const meshRectLine = new THREE.Mesh(geometryRectLine, materialRectLine);
        meshRectLine.position.set(0,0,1);
        meshRectLine.rotation.z = Math.PI/4;
        meshRectLine.name = 'rectLine'+index;
        this.group.add(meshRectLine);

        const posTrack = new THREE.KeyframeTrack('rectLine'+index+'.position', [0,100], [0,0,0,0,0,4]);
        const opacityTrack = new THREE.KeyframeTrack('rectLine'+index+'.material.opacity', [0,80,100], [1,1,0]);
        let duration = 100;
        let clip = new THREE.AnimationClip("animateCircleGroup"+index, duration, [posTrack,opacityTrack]);
        let AnimationAction = this.mixer.clipAction(clip,meshRectLine);
        AnimationAction.timeScale = 40;
        AnimationAction.time = 100/4*index;
        AnimationAction.play();
    }

    addRing(){
        //外轮廓
        const path1 = new THREE.Path();
        path1.arc(0, 0, 15.5, 0, 2 * Math.PI);
        const shape = new THREE.Shape(path1.getPoints(100)); //Shape对象
        // 内轮廓1
        const path2 = new THREE.Path();
        path2.arc(0, 0, 12.6, 0, 2 * Math.PI);
        shape.holes.push(new THREE.Path(path2.getPoints(50)));

        const geometry = new THREE.ExtrudeGeometry(//拉伸造型
            // new THREE.Shape(shape.getPoints(50)),//二维轮廓
            shape,
            //拉伸参数
            {
                amount:0.2,//拉伸长度
                bevelEnabled:false,//无倒角
            }
        );
        const materialRing = new THREE.MeshStandardMaterial( {
            // color: 0x00ffff,
            color:new THREE.Color("rgb(4,132,198)"),
            side: THREE.DoubleSide,
            transparent: true,
            opacity:0.5
        });
        this.meshRectRing = new THREE.Mesh(geometry, materialRing);
        this.meshRectRing.rotation.x = -Math.PI/2;
        this.meshRectRing.position.set(0,-0.3,0);
        this.scene.add(this.meshRectRing);
    }

    scatterRect(r, start,init, ring, color, speed) {
        var uniform = {
            u_color: { value: color },
            u_r: { value: start },
            u_ring: {
                value: ring,
            },
            u_radius:{ value: r },
            u_init_r:{ value: init },
        };

        var vs = `
		varying vec3 vPosition;
		void main(){
			vPosition=position;
			gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`;
        var fs = `
		varying vec3 vPosition;
		uniform vec3 u_color;
		uniform float u_r;
		uniform float u_ring;
		uniform float u_radius;
		uniform float u_init_r;

		void main(){
			float pct=abs(vPosition.x) > abs(vPosition.y)?abs(vPosition.x):abs(vPosition.y);
			if(pct > u_r+u_ring || pct < u_r || pct > u_r+u_ring){
				gl_FragColor = vec4(1.0,0.0,0.0,0);
			}else{
				float dis = ((pct-u_r)/u_ring)*((u_radius-pct)/(u_radius-u_init_r));
				gl_FragColor = vec4(u_color,dis);
			}
		}
	`;
        const geometry = new THREE.PlaneGeometry(r*2, r*2);
        var material = new THREE.ShaderMaterial({
            vertexShader: vs,
            fragmentShader: fs,
            side: THREE.DoubleSide,
            uniforms: uniform,
            transparent: true,
            depthWrite: false,
        });
        const rect = new THREE.Mesh(geometry, material);

        function render() {
            uniform.u_r.value += speed || 0;
            if (uniform.u_r.value >= r) {
                uniform.u_r.value = init;
            }
            requestAnimationFrame(render);
        }
        render();

        return rect;
    }


    onDocumentMouseDown(event){
        event.preventDefault();
        this.mouse.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        //总结一下，这里必须装网格，mesh，装入组是没有效果的
        //所以我们将所有的盒子的网格放入对象就可以了
        // 需要被监听的对象要存储在clickObjects中。
        const intersects = this.raycaster.intersectObjects(this.clickObjects);

        if(intersects.length > 0) {
            let clickIcon;
            for(let i = 0;i < intersects.length;i ++){
                if(intersects[i].object.name && intersects[i].object.name.indexOf('icon') >= 0){
                    clickIcon = intersects[i].object.name;
                    break;
                }
            }
            if(clickIcon){
                this.scene.remove(this.groupCircle);
                this.scene.remove(this.meshRectRing);
                this.setState({left:-40});
                const {iconClickInteract} = this.props.thisData.style;
                this.interactData(iconClickInteract);
                setTimeout(()=>{
                    const {moveEndInteract} = this.props.thisData.style;
                    this.interactData(moveEndInteract,{name:clickIcon.split('_')[1]});
                },500)
            }
        }
    }

    render() {
        const { style } = this.props.thisData;
        const canvasWidth = style.canvasWidth ? style.canvasWidth : 100;
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}>
                <Motion style={{ opacity: spring(this.state.opacity),left:spring(this.state.left) }}>
                    {({ opacity,left }) =>
                        <div ref={this.saveRef} className={cssStyle.box} style={{opacity,left:left+'%',width:canvasWidth+'%'}} id={'three_div_'+this.props.thisData.id} >
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}