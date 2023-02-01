import * as THREE from 'three';

export function addPiePart(startColor,endColor,startPer,endPer,index){
    const subPer = endPer - startPer;
    const splitNum = parseInt(subPer*1000);

    const arc = new THREE.ArcCurve(0, 0, 50, Math.PI*2*startPer, Math.PI*2*endPer);
    const points = arc.getPoints(splitNum);
    const points3d = [];
    points.forEach((point)=>{
        points3d.push(new THREE.Vector3( point.x, point.y,0));
    });
    const curve = new THREE.CatmullRomCurve3(points3d);
    const geometry = new THREE.ExtrudeGeometry(//拉伸造型
        this.rectShape,//二维轮廓
        //拉伸参数
        {
            bevelEnabled:false,//无倒角
            extrudePath:curve,//选择扫描轨迹
            steps:splitNum//扫描方向细分数
        }
    );
    for(let i = 0;i < 4; i ++){
        if(i%2 === 0){
            geometry.faces[i].vertexColors = [
                new THREE.Color(startColor),
                new THREE.Color(endColor),
                new THREE.Color(endColor),
            ]
        }else{
            geometry.faces[i].vertexColors = [
                new THREE.Color(endColor),
                new THREE.Color(startColor),
                new THREE.Color(startColor),
            ]
        }
    }
    for(let i = 4;i < geometry.faces.length; i ++){
        if(i%2 === 0){
            geometry.faces[i].vertexColors = [
                new THREE.Color(startColor),
                new THREE.Color(endColor),
                new THREE.Color(startColor),
            ]
        }else{
            geometry.faces[i].vertexColors = [
                new THREE.Color(endColor),
                new THREE.Color(endColor),
                new THREE.Color(startColor),
            ]
        }
    }

    const material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.FaceColors,
    });
    const mesh = new THREE.Mesh(geometry, material);
    // mesh.position.set(0,0,0);
    mesh.rotation.x = Math.PI / 2.0;
    // mesh.rotation.z = Math.PI*0.6;
    // if(move){
    //     mesh.translateX(-1.5);
    //     mesh.translateY(5);
    //     // mesh.scale.set(1, 1, 1.5);
    //     mesh.scale.set(1.05, 1.05, 1.5);
    // }
    mesh.name = 'pieName'+index;
    this.materialList.push(material);
    this.geometryList.push(geometry);
    this.meshList.push(mesh);
    this.group.add(mesh);
}