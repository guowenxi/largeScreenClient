import React from "react";
import ComponentBox from "../component_box"
import * as THREE from 'three';
import cssStyle from "./three_liushi_build.module.css";
import { Motion, spring } from "react-motion";
import {getData} from "../../common/getDataUtil";
import {initThreeDom} from "../../common/threeUtil";
import {setBottomMaterial, setCenterMaterial, setSpMaterial} from "./imgMaterial";
import {interactData} from "../../common/util";

export default class ThreeLiushiBuild extends React.Component {
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
        //字体加载器
        const loader = new THREE.FontLoader();
        loader.load( './font/font_Regular.json',  ( font ) => {
            this.font = font;
            this.addBuildAbout();
            this.addBuild();
        });

        //点击射线
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.textureLoader = new THREE.TextureLoader();
        //建筑存储组
        this.group = new THREE.Group();
        this.group.position.set(-25, 0, -10);
        this.group.name = 'buildGroup';
        this.scene.add(this.group);
        //地图上其他元素存储组
        this.groupMapAbout = new THREE.Group();
        this.groupMapAbout.position.set(-25, 0, -10);
        this.groupMapAbout.name = 'mapAboutGroup';
        this.scene.add(this.groupMapAbout);
        //圆圈存储组
        this.groupCircle = new THREE.Group();
        this.groupCircle.name = 'circleGroup';
        // this.groupCircle.rotation.y = Math.PI/4;
        this.scene.add(this.groupCircle);
        this.circleGroupList = [];

        this.clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);

            this.closeTo();
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
            if(this.buildRotate){
                this.group.rotateY(-0.01);
            }

            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    closeTo(){
        if(this.needClose){
            if(this.mapMat && this.mapMat.opacity > 0){
                this.mapMat.opacity -= 0.02;
            }
            if(this.group.position.x < 0){
                this.group.position.x += 0.5;
            }
            if(this.group.position.z < 0){
                this.group.position.z += 0.2;
            }
            if(this.group.position.y > -8){
                this.group.position.y -= 0.16;
            }
            if(this.camera.position.z >= 30){
                this.camera.position.z -= 5.4;
                this.camera.position.y -= 5.8;
                if(this.camera.position.x >= 30){
                    this.camera.position.x -= 0.4;
                }
                this.camera.lookAt(this.scene.position);
            }else{
                this.needClose = false;
            }
        }
    }

    addBuild(){
        //添加底图
        // const { style } = this.props.thisData;
        const mapGeometry = new THREE.PlaneGeometry(163, 200);
        this.mapMat = new THREE.MeshStandardMaterial( {
            roughness: 0.8,
            color: 0xffffff,
            metalness: 0.2,
            bumpScale: 0.0005,
            transparent: true,
            opacity:1
        });
        this.textureLoader.load( "./images/three/liushi/map.png", ( map ) => {
            this.mapMat.map = map;
            this.mapMat.needsUpdate = true;
        } );
        const mapMesh = new THREE.Mesh(mapGeometry, this.mapMat);
        mapMesh.rotation.x = -Math.PI / 2.0;
        mapMesh.name = 'mapMesh';
        mapMesh.position.set(25,0,10);
        // mapMesh.position.x = 25;
        // mapMesh.position.z = 5;
        this.group.add(mapMesh);
        // this.scene.add(mapMesh);
        // this.clickObjects.push(mapMesh);

        //缩小倍数
        const zoom = 10;
        //材质
        const colorMaterialOne = new THREE.MeshLambertMaterial({
            color: 0x2F5DD2,
            side: THREE.DoubleSide,
            // wireframe:true
        });
        //添加建筑底盘
        const circleR = Math.sqrt(30*30+30*30)/2;
        const circle1 = new THREE.ArcCurve(15/zoom, -15/zoom, circleR/zoom, -Math.PI*3/4, Math.PI/4, false);
        const bLine1 = new THREE.LineCurve(new THREE.Vector2(30/zoom, 0/zoom), new THREE.Vector2(30/zoom, 70/zoom));
        const circle2 = new THREE.ArcCurve(60/zoom, 70/zoom, 30/zoom, Math.PI, Math.PI/2, true);
        const bLine2 = new THREE.LineCurve(new THREE.Vector2(60/zoom, 100/zoom), new THREE.Vector2(-40/zoom, 100/zoom));
        const bLine3 = new THREE.LineCurve(new THREE.Vector2(-40/zoom, 100/zoom), new THREE.Vector2(-40/zoom, -30/zoom));
        const bLine4 = new THREE.LineCurve(new THREE.Vector2(-40/zoom, -30/zoom), new THREE.Vector2(0/zoom, -30/zoom));
        const CurvePathB = new THREE.CurvePath();
        CurvePathB.curves.push(circle1, bLine1, circle2, bLine2, bLine3, bLine4);
        //getPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
        const pointsBottom = CurvePathB.getPoints(50);//分段数50，返回51个顶点
        // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
        const geometryBottom = new THREE.ExtrudeGeometry(//拉伸造型
            new THREE.Shape(pointsBottom),//二维轮廓
            //拉伸参数
            {
                amount:25/zoom,//拉伸长度
                bevelEnabled:false//无倒角
            }
        );
        // geometryBottom.center();


        const bottomMatArr = [colorMaterialOne];
        setBottomMaterial(geometryBottom,bottomMatArr);
        const meshBottom = new THREE.Mesh(geometryBottom, bottomMatArr);
        meshBottom.rotateX(-Math.PI/2);
        meshBottom.position.set(0,0,3);
        meshBottom.name = 'meshBottom';
        this.group.add(meshBottom);
        this.clickObjects.push(meshBottom);


        //中心大主体
        const lineCenter1 = new THREE.LineCurve(new THREE.Vector2(30/zoom, 0), new THREE.Vector2(30/zoom, 30/zoom));
        const lineCenter2 = new THREE.LineCurve(new THREE.Vector2(30/zoom, 30/zoom), new THREE.Vector2(20/zoom, 30/zoom));
        const lineCenter3 = new THREE.LineCurve(new THREE.Vector2(20/zoom, 30/zoom), new THREE.Vector2(20/zoom, 70/zoom));
        const lineCenter4 = new THREE.LineCurve(new THREE.Vector2(20/zoom, 70/zoom), new THREE.Vector2(-30/zoom, 70/zoom));
        const lineCenter5 = new THREE.LineCurve(new THREE.Vector2(-30/zoom, 70/zoom), new THREE.Vector2(-30/zoom, 0));
        const lineCenter6 = new THREE.LineCurve(new THREE.Vector2(-30/zoom, 0), new THREE.Vector2(-25/zoom, 0));
        const lineCenter7 = new THREE.LineCurve(new THREE.Vector2(-25/zoom, -5/zoom), new THREE.Vector2(0, -5/zoom));
        const lineCenter8 = new THREE.LineCurve(new THREE.Vector2(0, -5/zoom), new THREE.Vector2(0, 0));
        const lineCenter9 = new THREE.LineCurve(new THREE.Vector2(0, 0), new THREE.Vector2(30/zoom, 0));
        const CurvePathC = new THREE.CurvePath();
        CurvePathC.curves.push(lineCenter1, lineCenter2, lineCenter3, lineCenter4, lineCenter5, lineCenter6, lineCenter7, lineCenter8, lineCenter9);
        const pointsCenter = CurvePathC.getPoints(50);//分段数50，返回51个顶点
        const geometryCenter = new THREE.ExtrudeGeometry(//拉伸造型
            new THREE.Shape(pointsCenter),//二维轮廓
            //拉伸参数
            {
                amount:120/zoom,//拉伸长度
                bevelEnabled:false//无倒角
            }
        );
        const centerMatArr = [colorMaterialOne];
        setCenterMaterial(geometryCenter,centerMatArr);
        const meshCenter = new THREE.Mesh(geometryCenter, centerMatArr);
        meshCenter.name = 'meshCenter';
        meshCenter.rotateX(-Math.PI/2);
        meshCenter.position.set(0,2.5,3);
        this.group.add(meshCenter);
        this.clickObjects.push(meshCenter);


        const textureImg = new THREE.TextureLoader().load( './images/three/liushi/3.png' );
        textureImg.wrapS = THREE.RepeatWrapping;
        textureImg.wrapT = THREE.RepeatWrapping;
        textureImg.rotation = Math.PI;
        const spMatImg = new THREE.MeshLambertMaterial({
            color: 0x00ffff,
            map: textureImg
        });

        //顶部小方块
        const geometryBoxTop1 = new THREE.BoxGeometry(30/zoom, 30/zoom, 30/zoom); //立方体
        const rectMeshBoxTop1 = new THREE.Mesh(geometryBoxTop1, spMatImg);
        rectMeshBoxTop1.position.set(-1.5, 16, 1.5);
        rectMeshBoxTop1.name = 'rectMeshBoxTop1';
        this.group.add(rectMeshBoxTop1);
        this.clickObjects.push(rectMeshBoxTop1);

        //三个圆弧组合
        const radius = 0.33333;
        //参数：0, 0圆弧坐标原点x，y  100：圆弧半径    0, 2 * Math.PI：圆弧起始角度
        const arc1 = new THREE.ArcCurve(0, radius*2, radius, Math.PI/2, 0, true);
        const arc2 = new THREE.ArcCurve(radius, radius, radius, Math.PI/2, 0, true);
        const arc3 = new THREE.ArcCurve(radius*2, 0, radius, Math.PI/2, 0, true);
        const line1 = new THREE.LineCurve(new THREE.Vector2(radius*3, 0, 0), new THREE.Vector2(0, 0, 0));
        const line2 = new THREE.LineCurve(new THREE.Vector2(0, 0, 0), new THREE.Vector2(0, radius*3, 0));
        // 把多个线条插入到CurvePath中
        const CurvePath = new THREE.CurvePath();
        CurvePath.curves.push(arc1, arc2, arc3, line1, line2);
        //getPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
        const pointsSp = CurvePath.getPoints(100);//分段数50，返回51个顶点
        // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
        const geometrySp = new THREE.ExtrudeGeometry(//拉伸造型
            new THREE.Shape(pointsSp),//二维轮廓
            //拉伸参数
            {
                amount:3,//拉伸长度
                bevelEnabled:false//无倒角
            }
        );
        const spMatArr = [spMatImg];
        setSpMaterial(geometrySp,spMatArr);
        const meshSp = new THREE.Mesh(geometrySp, spMatArr);
        geometrySp.scale(3, 3, 1);
        meshSp.position.set(0, 14.5, 0);
        meshSp.name = 'meshSp';
        this.group.add(meshSp);
        this.clickObjects.push(meshSp);
    }

    addBuildAbout(){
        const material = new THREE.MeshLambertMaterial({
            color: 0x2F5DD2,
            side: THREE.DoubleSide,
            transparent: true,
            opacity:0.5
        });
        this.mapAboutMatList.push(material);
        const geometryOne = new THREE.BoxGeometry(18, 14, 4); //立方体
        const meshOne = new THREE.Mesh(geometryOne, material);
        meshOne.position.set(25,7.01,88);
        meshOne.rotation.y=-0.1;
        this.groupMapAbout.add(meshOne);
        const geometryTwo = new THREE.BoxGeometry(14, 14, 4); //立方体
        const meshTwo = new THREE.Mesh(geometryTwo, material);
        meshTwo.position.set(22,7.01,98);
        meshTwo.rotation.y=-0.1;
        this.groupMapAbout.add(meshTwo);
        const geometryThree = new THREE.BoxGeometry(4, 14, 4); //立方体
        const meshThree = new THREE.Mesh(geometryThree, material);
        meshThree.position.set(34,7.01,98);
        meshThree.rotation.y=-0.1;
        this.groupMapAbout.add(meshThree);
        const geometryFour = new THREE.BoxGeometry(12, 14, 3); //立方体
        const meshFour = new THREE.Mesh(geometryFour, material);
        meshFour.position.set(-18,7.01,68);
        meshFour.rotation.y=-0.1;
        this.groupMapAbout.add(meshFour);
        const geometryFive = new THREE.BoxGeometry(8, 14, 3); //立方体
        const meshFive = new THREE.Mesh(geometryFive, material);
        meshFive.position.set(-12,7.01,74);
        meshFive.rotation.y=-0.1;
        this.groupMapAbout.add(meshFive);
        const geometrySix = new THREE.BoxGeometry(3, 14, 3); //立方体
        const meshSix = new THREE.Mesh(geometrySix, material);
        meshSix.position.set(-22,7.01,74);
        meshSix.rotation.y=-0.1;
        this.groupMapAbout.add(meshSix);
        const geometrySeven = new THREE.BoxGeometry(12, 14, 3); //立方体
        const meshSeven = new THREE.Mesh(geometrySeven, material);
        meshSeven.position.set(36,7.01,50);
        meshSeven.rotation.y=-0.1;
        this.groupMapAbout.add(meshSeven);
        const geometryEight = new THREE.BoxGeometry(8, 10, 3); //立方体
        const meshEight = new THREE.Mesh(geometryEight, material);
        meshEight.position.set(32,5.01,55);
        meshEight.rotation.y=-0.1;
        this.groupMapAbout.add(meshEight);
        const geometryNine = new THREE.BoxGeometry(10, 14, 3); //立方体
        const meshNine = new THREE.Mesh(geometryNine, material);
        meshNine.position.set(-27,7.01,19);
        meshNine.rotation.y=-0.15;
        this.groupMapAbout.add(meshNine);
        const geometryTen = new THREE.BoxGeometry(10, 14, 3); //立方体
        const meshTen = new THREE.Mesh(geometryTen, material);
        meshTen.position.set(-22,7.01,23);
        meshTen.rotation.y=-0.15;
        this.groupMapAbout.add(meshTen);
        const geometryEleven = new THREE.BoxGeometry(14, 4, 14); //立方体
        const meshEleven = new THREE.Mesh(geometryEleven, material);
        meshEleven.position.set(-6,2.01,23);
        meshEleven.rotation.y=-0.15;
        this.groupMapAbout.add(meshEleven);
        const geometryTwelve = new THREE.BoxGeometry(3, 10, 3); //立方体
        const meshTwelve = new THREE.Mesh(geometryTwelve, material);
        meshTwelve.position.set(7,5.01,-22);
        this.groupMapAbout.add(meshTwelve);
        const geometryThirteen = new THREE.BoxGeometry(3, 8, 3); //立方体
        const meshThirteen = new THREE.Mesh(geometryThirteen, material);
        meshThirteen.position.set(3.9,4.01,-22);
        this.groupMapAbout.add(meshThirteen);
        const geometryFourteen = new THREE.BoxGeometry(3, 6, 3); //立方体
        const meshFourteen = new THREE.Mesh(geometryFourteen, material);
        meshFourteen.position.set(10.1,3.01,-22);
        this.groupMapAbout.add(meshFourteen);

        //图片
        const imgMatOne = new THREE.MeshBasicMaterial( {
            transparent: true,
            opacity:1
        });
        this.mapAboutMatList.push(imgMatOne);
        this.textureLoader.load( "./images/three/liushi/star.png", ( map ) => {
            imgMatOne.map = map;
            imgMatOne.needsUpdate = true;
        } );
        const imgMatTwo = new THREE.MeshBasicMaterial( {
            transparent: true,
            opacity:1
        });
        this.mapAboutMatList.push(imgMatTwo);
        this.textureLoader.load( "./images/three/liushi/aircraft.png", ( map ) => {
            imgMatTwo.map = map;
            imgMatTwo.needsUpdate = true;
        } );
        const imgMatThree = new THREE.MeshBasicMaterial( {
            transparent: true,
            opacity:1
        });
        this.mapAboutMatList.push(imgMatThree);
        this.textureLoader.load( "./images/three/liushi/station.png", ( map ) => {
            imgMatThree.map = map;
            imgMatThree.needsUpdate = true;
        } );
        const imgMatFour = new THREE.MeshBasicMaterial( {
            transparent: true,
            opacity:1
        });
        this.mapAboutMatList.push(imgMatFour);
        this.textureLoader.load( "./images/three/liushi/train.png", ( map ) => {
            imgMatFour.map = map;
            imgMatFour.needsUpdate = true;
        } );

        const imgGeometryOne = new THREE.PlaneGeometry(8, 8);
        const imgMeshOne = new THREE.Mesh(imgGeometryOne, imgMatOne);
        imgMeshOne.rotation.x = -Math.PI / 2.0;
        imgMeshOne.position.set(-15,0.01,43);
        this.groupMapAbout.add(imgMeshOne);
        const imgGeometryTwo = new THREE.PlaneGeometry(8, 8);
        const imgMeshTwo = new THREE.Mesh(imgGeometryTwo, imgMatOne);
        imgMeshTwo.rotation.x = -Math.PI / 2.0;
        imgMeshTwo.position.set(70,0.01,-120);
        this.groupMapAbout.add(imgMeshTwo);
        const imgGeometryThree = new THREE.PlaneGeometry(13, 8);
        const imgMeshThree = new THREE.Mesh(imgGeometryThree, imgMatFour);
        imgMeshThree.rotation.x = -Math.PI / 2.0;
        imgMeshThree.position.set(-70,0.01,-90);
        this.groupMapAbout.add(imgMeshThree);
        const imgGeometryFour = new THREE.PlaneGeometry(6, 6);
        const imgMeshFour = new THREE.Mesh(imgGeometryFour, imgMatTwo);
        imgMeshFour.rotation.x = -Math.PI / 2.0;
        imgMeshFour.position.set(110,0.01,118);
        this.groupMapAbout.add(imgMeshFour);
        const imgGeometryFive = new THREE.PlaneGeometry(8, 4);
        const imgMeshFive = new THREE.Mesh(imgGeometryFive, imgMatThree);
        imgMeshFive.rotation.x = -Math.PI / 2.0;
        imgMeshFive.position.set(85,0.01,105);
        this.groupMapAbout.add(imgMeshFive);
        const imgGeometrySix = new THREE.PlaneGeometry(8, 4);
        const imgMeshSix = new THREE.Mesh(imgGeometrySix, imgMatThree);
        imgMeshSix.rotation.x = -Math.PI / 2.0;
        imgMeshSix.position.set(-18,0.01,105);
        this.groupMapAbout.add(imgMeshSix);


        //字
        const matText = new THREE.LineBasicMaterial( {
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
        } );
        this.mapAboutMatList.push(matText);
        const shapesOne = this.font.generateShapes( '云谷互联网创新中心', 2, 2 );
        const geometryTextOne = new THREE.ShapeGeometry( shapesOne );
        const meshTextOne = new THREE.Mesh(geometryTextOne, matText);
        meshTextOne.position.set(14,15,88);
        meshTextOne.rotation.y=-0.1;
        // meshTextOne.rotation.x = -Math.PI / 2.0;
        this.groupMapAbout.add(meshTextOne);
        const shapesTwo = this.font.generateShapes( '中国电工电器城', 2, 2 );
        const geometryTextTwo = new THREE.ShapeGeometry( shapesTwo );
        const meshTextTwo = new THREE.Mesh(geometryTextTwo, matText);
        meshTextTwo.position.set(-25,15,68);
        meshTextTwo.rotation.y=-0.1;
        this.groupMapAbout.add(meshTextTwo);
        const shapesThree = this.font.generateShapes( '德力西集团', 2, 2 );
        const geometryTextThree = new THREE.ShapeGeometry( shapesThree );
        const meshTextThree = new THREE.Mesh(geometryTextThree, matText);
        meshTextThree.position.set(29.2,15,50);
        meshTextThree.rotation.y=-0.1;
        this.groupMapAbout.add(meshTextThree);
        const shapesFour = this.font.generateShapes( '正泰集团', 2, 2 );
        const geometryTextFour = new THREE.ShapeGeometry( shapesFour );
        const meshTextFour = new THREE.Mesh(geometryTextFour, matText);
        meshTextFour.position.set(2,11,-22);
        this.groupMapAbout.add(meshTextFour);
        const shapesFive = this.font.generateShapes( '柳市镇政府', 2, 2 );
        const geometryTextFive = new THREE.ShapeGeometry( shapesFive );
        const meshTextFive = new THREE.Mesh(geometryTextFive, matText);
        meshTextFive.position.set(-22,1,38);
        // meshTextFive.rotation.y=-0.15;
        meshTextFive.rotation.x = -Math.PI / 2.0;
        this.groupMapAbout.add(meshTextFive);
        const shapesSix = this.font.generateShapes( '乐清市人民政府（13公里）', 2, 2 );
        const geometryTextSix = new THREE.ShapeGeometry( shapesSix );
        const meshTextSix = new THREE.Mesh(geometryTextSix, matText);
        meshTextSix.position.set(55,1,-125);
        this.groupMapAbout.add(meshTextSix);
        const shapesSeven = this.font.generateShapes( '乐清动车站（8公里）', 2, 2 );
        const geometryTextSeven = new THREE.ShapeGeometry( shapesSeven );
        const meshTextSeven = new THREE.Mesh(geometryTextSeven, matText);
        meshTextSeven.position.set(-80,1,-95);
        this.groupMapAbout.add(meshTextSeven);
        const shapesEight = this.font.generateShapes( '龙港国际机场（37公里）', 2, 2 );
        const geometryTextEight = new THREE.ShapeGeometry( shapesEight );
        const meshTextEight = new THREE.Mesh(geometryTextEight, matText);
        meshTextEight.position.set(95,1,113);
        meshTextEight.rotation.x = -Math.PI / 2.0;
        this.groupMapAbout.add(meshTextEight);
        const shapesNine = this.font.generateShapes( '黄龙收费站（6公里）', 2, 2 );
        const geometryTextNine = new THREE.ShapeGeometry( shapesNine );
        const meshTextNine = new THREE.Mesh(geometryTextNine, matText);
        meshTextNine.position.set(73,1,100);
        meshTextNine.rotation.x = -Math.PI / 2.0;
        this.groupMapAbout.add(meshTextNine);
        const shapesTen = this.font.generateShapes( '七里港收费站（6公里）', 2, 2 );
        const geometryTextTen = new THREE.ShapeGeometry( shapesTen );
        const meshTextTen = new THREE.Mesh(geometryTextTen, matText);
        meshTextTen.rotation.x = -Math.PI / 2.0;
        meshTextTen.position.set(-30,1,101);
        this.groupMapAbout.add(meshTextTen);
    }

    addMoveCircle(){
        this.moveCircleMaterialList = [];
        // 通过类CatmullRomCurve3创建一个3D样条曲线
        const curve = new THREE.EllipseCurve(
            0,  0,            // ax, aY
            14, 10,           // xRadius, yRadius
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
        geometry.rotateX(-Math.PI/3);
        geometry.rotateY(Math.PI/4);
        // console.log(geometry);
        // var material = new THREE.LineBasicMaterial({
        //     color: 0x4488ff
        // });
        // var line = new THREE.Line(geometry, material);
        // this.scene.add(line);

        this.mixer = new THREE.AnimationMixer(this.groupCircle);

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
        this.moveCircleMaterialList.push(materialOne);
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
        this.moveCircleMaterialList.push(materialTwo);

        const nameList = ['物联网综合体','科技创新与人才引进','教育培训','服务平台','数字经济','楼宇经济','总部经济'];

        for(let i = 0;i < 7;i ++){
            // setTimeout(()=>{
            // },i*1460+100);
            this.addOnePart(i,times,geometry.attributes.position.array,i%2===0?materialOne:materialTwo,nameList[i]);
        }
        this.showMoveCircle = true;
    }

    addOnePart(index,timeArr,posArr,iconMaterial,name){
        const zoom = 0.8;
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
        const iconGeometry = new THREE.PlaneGeometry(4, 4);
        iconGeometry.rotateX(Math.PI/2);
        iconGeometry.rotateZ(Math.PI/4);
        const iconMesh = new THREE.Mesh(iconGeometry, iconMaterial);
        iconMesh.name = 'icon_'+name+'_'+index;
        iconMesh.position.set(0,0,3);
        thisGroup.add(iconMesh);
        this.clickObjects.push(iconMesh);

        //文字
        if(this.font){
            const textShape = new THREE.BufferGeometry();
            const shapes = this.font.generateShapes( name, 0.7, 2 );
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
        AnimationAction.timeScale = 10;
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
            if(!this.afterClose){
                this.scene.remove(this.groupMapAbout);
                this.needClose = true;
                const {buildClickInteract} = this.props.thisData.style;
                this.interactData(buildClickInteract);
                setTimeout(()=>{
                    this.addMoveCircle();
                },1000);
                this.afterClose = true;
            }else{
                let clickIcon;
                for(let i = 0;i < intersects.length;i ++){
                    if(intersects[i].object.name && intersects[i].object.name.indexOf('icon') >= 0){
                        clickIcon = intersects[i].object.name;
                        break;
                    }
                }
                if(clickIcon){
                    this.scene.remove(this.groupCircle);
                    this.setState({left:13.2});
                    const {iconClickInteract} = this.props.thisData.style;
                    this.interactData(iconClickInteract);
                    setTimeout(()=>{
                        const {moveEndInteract} = this.props.thisData.style;
                        this.interactData(moveEndInteract,{name:clickIcon.split('_')[1]});
                        this.buildRotate = true;
                    },500)
                }
            }
        }
    }

    render() {
        const { style } = this.props.thisData;
        const canvasWidth = style.canvasWidth ? style.canvasWidth : 50;
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