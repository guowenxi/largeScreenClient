import axios from "axios";
import { GPS } from "./locationChange";

/*16进制颜色转为RGB格式*/
const getColorRgb = function (oldColor){
    //十六进制颜色值的正则表达式
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let sColor = oldColor.toLowerCase();
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            let sColorNew = "#";
            for(let i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        let sColorChange = [];
        for(let i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
        }
        return "RGBA(" + sColorChange.join(",") + ",0.3)";
    }else{
        return sColor;
    }
};

export function loadGridOne(id){
    const {gridOne} = this.props.thisData.style;
    if(gridOne && gridOne.url){
        axios.get(gridOne.url,{params:{rbacToken:this.props.token,id:id}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data;
            if(result.success && result.data && result.data.points){
                const data = result.data;
                const pointStrList = data.points.split(';');
                const line = [];
                pointStrList.forEach((point)=>{
                    const pointArr = point.split(',');
                    const changePoint = GPS.gcj_decrypt_exact(parseFloat(pointArr[1]),parseFloat(pointArr[0]));
                    line.push([changePoint.lon,changePoint.lat]);
                    // line.push([parseFloat(pointArr[0]),parseFloat(pointArr[1])]);
                });
                //修改颜色和透明度
                const colorRgb=getColorRgb('#'+ data.areaColor);
                // eslint-disable-next-line no-undef
                const symbolFill = new esri.symbol.SimpleFillSymbol(
                    // eslint-disable-next-line no-undef
                    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                    // eslint-disable-next-line no-undef
                    new esri.symbol.SimpleLineSymbol(gridOne.lineType, new esri.Color(data.lineColor), gridOne.lineWidth),
                    //修改颜色和透明度
                    // eslint-disable-next-line no-undef
                    new esri.Color(colorRgb));
                    //new esri.Color(data.areaColor));
                let polygon;
                if(data.graphType === 2){
                    // eslint-disable-next-line no-undef
                    polygon = new esri.geometry.Circle(line[0],{
                        "radius": data.radius
                    });
                }else {
                    if(data.graphType === 3){
                        const addOne = [line[0][0],line[1][1]];
                        const addTwo = [line[1][0],line[0][1]];
                        line.splice(1,0,addOne);
                        line.push(addTwo);
                    }
                    // eslint-disable-next-line no-undef
                    polygon = new esri.geometry.Polygon();
                    polygon.addRing(line);
                }
                // eslint-disable-next-line no-undef
                let graphic = new esri.Graphic(polygon,symbolFill);
                this.gridOneLayer.clear();
                this.gridOneLayer.add(graphic);
                this.map.setExtent(polygon.getExtent());
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }
}


