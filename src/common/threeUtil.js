import * as THREE from "three";
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// import Stats from 'three/examples/jsm/libs/stats.module.js';

export function initThreeDom() {
    const {style} = this.props.thisData;
    /**
     * 创建场景对象Scene
     */
    this.scene = new THREE.Scene();
    //光源设置
    //点光源
    if(style.lightList){
        style.lightList.forEach((lightStyle)=>{
            switch (lightStyle.type) {
                case 1:
                    //点光源
                    const pointLightColor = lightStyle.lightColor ? lightStyle.lightColor : '#ffffff';
                    const pointLight = new THREE.PointLight(new THREE.Color(pointLightColor),1,lightStyle.distance ? lightStyle.distance : 0);
                    pointLight.position.set(lightStyle.x, lightStyle.y, lightStyle.z); //点光源位置
                    this.scene.add(pointLight); //点光源添加到场景中
                    // var sphereSize = 1;
                    // var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
                    // this.scene.add( pointLightHelper );
                    break;
                case 2:
                    //环境光
                    const ambientLightColor = lightStyle.lightColor ? lightStyle.lightColor : '#cccccc';
                    const ambientLight = new THREE.AmbientLight(new THREE.Color(ambientLightColor));
                    this.scene.add(ambientLight);
                    break;
                case 3:
                    //方向光
                    const directionalLightColor = lightStyle.lightColor ? lightStyle.lightColor : '#ffffff';
                    const directionalLight = new THREE.DirectionalLight(new THREE.Color(directionalLightColor), 1);
                    // 设置光源位置
                    directionalLight.position.set(lightStyle.x, lightStyle.y, lightStyle.z);
                    this.scene.add(directionalLight);
                    break;
                case 4:
                    //聚光灯
                    const spotLightColor = lightStyle.lightColor ? lightStyle.lightColor : '#ffffff';
                    const spotLight = new THREE.SpotLight(new THREE.Color(spotLightColor));
                    spotLight.position.set(lightStyle.x, lightStyle.y, lightStyle.z); //点光源位置
                    this.scene.add(spotLight);
                    break;
                default:
            }
        });
    }
    // if(style.pointLightShow){
    //     const pointLightColor = style.pointLightColor ? style.pointLightColor : '#ffffff';
    //     const point = new THREE.PointLight(new THREE.Color(pointLightColor));
    //     point.position.set(50, 110, 50); //点光源位置
    //     this.scene.add(point); //点光源添加到场景中
    // }
    // //环境光
    // if(style.ambientLightShow){
    //     const ambientLightColor = style.pointLightColor ? style.pointLightColor : '#ffffff';
    //
    //     const ambient = new THREE.AmbientLight(0xcccccc);
    //     this.scene.add(ambient);
    // }
    // // 方向光
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // // 设置光源位置
    // directionalLight.position.set(-200, 200, 200);
    // this.scene.add(directionalLight);

    const {clientWidth, clientHeight} = this.refDom;
    /**
     * 相机设置
     */
    const width = clientWidth; //窗口宽度
    const height = clientHeight; //窗口高度
    const k = width / height; //窗口宽高比
    const s = style.s ? style.s : 70; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    if(style.cameraType === 2){
        this.camera = new THREE.PerspectiveCamera(30, k, 1, 10000);
    }else{
        this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    }
    const cameraX = style.cameraX != null ? style.cameraX : 300;
    const cameraY = style.cameraY != null ? style.cameraY : 300;
    const cameraZ = style.cameraZ != null ? style.cameraZ : 300;
    this.camera.position.set(cameraX, cameraY, cameraZ); //设置相机位置
    this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
    // this.camera.lookAt(new THREE.Vector3(300, 300, 0));
    /**
     * 创建渲染器对象
     */
    this.renderer = new THREE.WebGLRenderer({
        //增加下面两个属性，可以抗锯齿
        antialias: true,
        alpha: true
        //precision:"lowp"  //着色器的精度。可以是"highp", "mediump" 或 "lowp". 默认为"highp"，如果设备支持的话。
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(width, height);//设置渲染区域尺寸
    this.renderer.setClearColor(0x000000, 0); //设置背景颜色
    document.getElementById('three_div_' + this.props.thisData.id).appendChild(this.renderer.domElement); //body元素中插入canvas对象stats = new Stats();
    // const stats = new Stats();
    // document.getElementById('three_div_' + this.props.thisData.id).appendChild( stats.dom );
    // new OrbitControls(this.camera, this.renderer.domElement);//创建控件对象
    // var axisHelper = new THREE.AxesHelper(250);
    // this.scene.add(axisHelper);
}