import * as THREE from "three";

export function setBottomMaterial(geometryBottom,bottomMatArr){
    //前面1
    const textureBottomOne = new THREE.TextureLoader().load( './images/three/liushi/2-1.png' );
    textureBottomOne.wrapS = THREE.RepeatWrapping;
    textureBottomOne.wrapT = THREE.RepeatWrapping;
    const bottomMatOne = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureBottomOne
    });
    bottomMatArr.push(bottomMatOne);
    for (let i = 808; i < 810; i++) {
        geometryBottom.faces[i].materialIndex = 1;
        geometryBottom.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = uvItem.x/4;
            uvItem.y = 1-(uvItem.y+1.5)/2.5;
        })
    }
    //圆弧1
    const textureBottomTwo = new THREE.TextureLoader().load( './images/three/liushi/2-2.png' );
    textureBottomTwo.wrapS = THREE.RepeatWrapping;
    textureBottomTwo.wrapT = THREE.RepeatWrapping;
    const bottomMatTwo = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureBottomTwo
    });
    bottomMatArr.push(bottomMatTwo);
    for (let i = 404; i < 602; i++) {
        geometryBottom.faces[i].materialIndex = 2;
        geometryBottom.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = 1-(uvItem.x+3.6)/5.43;
            uvItem.y = 1-(uvItem.y+1.5)/2.5;
        })
    }
    for (let i = 810; i < 812; i++) {
        geometryBottom.faces[i].materialIndex = 2;
        geometryBottom.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = 1-(uvItem.x+3.6)/5.43;
            uvItem.y = 1-(uvItem.y+1.5)/2.5;
        })
    }
    //右面
    const textureBottomThree = new THREE.TextureLoader().load( './images/three/liushi/2-3.png' );
    textureBottomThree.wrapS = THREE.RepeatWrapping;
    textureBottomThree.wrapT = THREE.RepeatWrapping;
    const bottomMatThree = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureBottomThree
    });
    bottomMatArr.push(bottomMatThree);
    for (let i = 602; i < 604; i++) {
        geometryBottom.faces[i].materialIndex = 3;
        geometryBottom.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = uvItem.x/7;
            uvItem.y = 1-(uvItem.y+1.5)/2.5;
        })
    }
    //圆弧2
    const textureBottomFour = new THREE.TextureLoader().load( './images/three/liushi/2-4.png' );
    textureBottomFour.wrapS = THREE.RepeatWrapping;
    textureBottomFour.wrapT = THREE.RepeatWrapping;
    const bottomMatFour = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureBottomFour
    });
    bottomMatArr.push(bottomMatFour);
    for (let i = 604; i < 776; i++) {
        geometryBottom.faces[i].materialIndex = 4;
        geometryBottom.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = (uvItem.x-7)/3.5821805000305176;
            uvItem.y = 1-(uvItem.y+1.5)/2.5;
        });
    }
    for (let i = 776; i < 804; i++) {
        geometryBottom.faces[i].materialIndex = 4;
        geometryBottom.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = 1-(6-uvItem.x)/3.5821805000305176;
            uvItem.y = 1-(uvItem.y+1.5)/2.5;
        });
    }
    // let min = 100;
    // let max = -100;
    // if(min > uvItem.x){
    //     min = uvItem.x
    // }
    // if(max < uvItem.x){
    //     max = uvItem.x
    // }
    // console.log(min,max);
    //后面
    const textureBottomFive = new THREE.TextureLoader().load( './images/three/liushi/2-5.png' );
    textureBottomFive.wrapS = THREE.RepeatWrapping;
    textureBottomFive.wrapT = THREE.RepeatWrapping;
    const bottomMatFive = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureBottomFive
    });
    bottomMatArr.push(bottomMatFive);
    for (let i = 804; i < 806; i++) {
        geometryBottom.faces[i].materialIndex = 5;
        geometryBottom.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = 1-(uvItem.x+4)/10;
            uvItem.y = 1-(uvItem.y+1.5)/2.5;
        })
    }
    //左边
    const textureBottomSix = new THREE.TextureLoader().load( './images/three/liushi/2-6.png' );
    textureBottomSix.wrapS = THREE.RepeatWrapping;
    textureBottomSix.wrapT = THREE.RepeatWrapping;
    const bottomMatSix = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureBottomSix
    });
    bottomMatArr.push(bottomMatSix);
    for (let i = 806; i <808; i++) {
        geometryBottom.faces[i].materialIndex = 6;
        geometryBottom.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = (uvItem.x+3)/13;
            uvItem.y = 1-(uvItem.y+1.5)/2.5;
        })
    }

    // global.geometryBottom = geometryBottom;
}
export function setCenterMaterial(geometryCenter,centerMatArr){
    for (let i = 0; i < 36; i++) {
        geometryCenter.faces[i].materialIndex = 0;
    }
    //前面1
    const textureCenterOne = new THREE.TextureLoader().load( './images/three/liushi/1-1.png' );
    textureCenterOne.wrapS = THREE.RepeatWrapping;
    textureCenterOne.wrapT = THREE.RepeatWrapping;
    const centerMatOne = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureCenterOne
    });
    centerMatArr.push(centerMatOne);
    for (let i = 28; i < 30; i++) {
        geometryCenter.faces[i].materialIndex = 1;
        geometryCenter.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = uvItem.x/2.5;
            uvItem.y = (1-uvItem.y)/12;
        })
    }
    //前面2
    const textureCenterTwo = new THREE.TextureLoader().load( './images/three/liushi/1-2.png' );
    textureCenterTwo.wrapS = THREE.RepeatWrapping;
    textureCenterTwo.wrapT = THREE.RepeatWrapping;
    const centerMatTwo = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureCenterTwo
    });
    centerMatArr.push(centerMatTwo);
    for (let i = 32; i < 34; i++) {
        geometryCenter.faces[i].materialIndex = 2;
        geometryCenter.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = uvItem.x/3;
            uvItem.y = (1-uvItem.y)/12;
        })
    }
    //右边1
    const textureCenterThree = new THREE.TextureLoader().load( './images/three/liushi/1-3.png' );
    textureCenterThree.wrapS = THREE.RepeatWrapping;
    textureCenterThree.wrapT = THREE.RepeatWrapping;
    const centerMatThree = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureCenterThree
    });
    centerMatArr.push(centerMatThree);
    for (let i = 34; i < 36; i++) {
        geometryCenter.faces[i].materialIndex = 3;
        geometryCenter.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = uvItem.x/3;
            uvItem.y = (1-uvItem.y)/12;
        })
    }
    //右边2
    const textureCenterFour = new THREE.TextureLoader().load( './images/three/liushi/1-4.png' );
    textureCenterFour.wrapS = THREE.RepeatWrapping;
    textureCenterFour.wrapT = THREE.RepeatWrapping;
    const centerMatFour = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureCenterFour
    });
    centerMatArr.push(centerMatFour);
    for (let i = 18; i < 20; i++) {
        geometryCenter.faces[i].materialIndex = 4;
        geometryCenter.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = (uvItem.x-3)/4;
            uvItem.y = (1-uvItem.y)/12;
        })
    }
    //后边
    const textureCenterFive = new THREE.TextureLoader().load( './images/three/liushi/1-5.png' );
    textureCenterFive.wrapS = THREE.RepeatWrapping;
    textureCenterFive.wrapT = THREE.RepeatWrapping;
    const centerMatFive = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureCenterFive
    });
    centerMatArr.push(centerMatFive);
    for (let i = 20; i < 22; i++) {
        geometryCenter.faces[i].materialIndex = 5;
        geometryCenter.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = 1-(uvItem.x+3)/5;
            uvItem.y = (1-uvItem.y)/12;
        })
    }
    //左边
    const textureCenterSix = new THREE.TextureLoader().load( './images/three/liushi/1-6.png' );
    textureCenterSix.wrapS = THREE.RepeatWrapping;
    textureCenterSix.wrapT = THREE.RepeatWrapping;
    const centerMatSix = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureCenterSix
    });
    centerMatArr.push(centerMatSix);
    for (let i = 22; i < 28; i++) {
        geometryCenter.faces[i].materialIndex = 6;
        geometryCenter.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = uvItem.x/7;
            uvItem.y = (1-uvItem.y)/12;
        })
    }
    for (let i = 16; i < 18; i++) {
        geometryCenter.faces[i].materialIndex = 6;
        geometryCenter.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = uvItem.x/7;
            uvItem.y = (1-uvItem.y)/12;
        })
    }
    for (let i = 30; i < 32; i++) {
        geometryCenter.faces[i].materialIndex = 6;
        geometryCenter.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = uvItem.x/7;
            uvItem.y = (1-uvItem.y)/12;
        })
    }

    // global.geometryCenter = geometryCenter;
}
export function setSpMaterial(geometrySp,spMatArr){
    //侧边
    const textureSpOne = new THREE.TextureLoader().load( './images/three/liushi/3-4.png' );
    textureSpOne.wrapS = THREE.RepeatWrapping;
    textureSpOne.wrapT = THREE.RepeatWrapping;
    textureSpOne.rotation = Math.PI/2;
    const spMatOne = new THREE.MeshLambertMaterial({
        color: 0x00ffff,
        map: textureSpOne
    });
    spMatArr.push(spMatOne);
    for (let i = 1204; i < geometrySp.faces.length; i++) {
        geometrySp.faces[i].materialIndex = 1;
        geometrySp.faceVertexUvs[0][i].forEach((uvItem)=>{
            uvItem.x = uvItem.x-0.004;
            uvItem.y = (2+uvItem.y)/3;
        })
    }
    // const textureSpTwo = new THREE.TextureLoader().load( './images/three/liushi/3.png' );
    // textureSpTwo.wrapS = THREE.RepeatWrapping;
    // textureSpTwo.wrapT = THREE.RepeatWrapping;
    // textureSpTwo.rotation = Math.PI;
    // const spMatTwo = new THREE.MeshLambertMaterial({
    //     color: 0x00ffff,
    //     map: textureSpTwo
    // });
    // spMatArr.push(spMatTwo);
    // for (let i = 0; i < 1200; i++) {
    //     geometrySp.faces[i].materialIndex = 2;
    //     // geometrySp.faceVertexUvs[0][i].forEach((uvItem,index)=>{
    //     //     uvItem.x = geometrySp.faceVertexUvs[0][1218][index].x;
    //     //     uvItem.y = geometrySp.faceVertexUvs[0][1218][index].y;
    //     // })
    // }
    // geometrySp.faceVertexUvs[0][2402][1].x=0;
    // geometrySp.faceVertexUvs[0][2403][0].x=0;
    // geometrySp.faceVertexUvs[0][2403][1].x=0;
    // global.geometrySp = geometrySp;
}