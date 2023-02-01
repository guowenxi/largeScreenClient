import axios from "axios";
import {GPS} from "../components/arc_gis_map/locationChange";

export function getAllGrid(map, style) {
    if(style.showAllGrid){
        if(this.allGridLayer == null){
            this.allGridLayer = [];
            this.allGridLayerData = [
                {name:'镇街',num:0,key:'',checked:!!this.allGridParams.roadId},
                {name:'村社',num:0,key:'',checked:!!this.allGridParams.communityId},
                {name:'网格',num:0,key:'',checked:!!this.allGridParams.gridId},
                {name:'微网格',num:0,key:'',checked:!!this.allGridParams.areaId}
            ];
            for(let i = 3;i >= 0;i --){
                // eslint-disable-next-line no-undef
                const gridLayer = new esri.layers.GraphicsLayer();
                gridLayer.className = 'arc-gis-map-layer-none-event';
                map.addLayer(gridLayer,4-i+style.allGridZoom);
                this.allGridLayer[i] = gridLayer;
            }
        }
        let allGridLevel = 0;
        if(this.allGridParams.areaId){
            allGridLevel = 4;
        }else if(this.allGridParams.gridId){
            allGridLevel = 3;
        }else if(this.allGridParams.communityId){
            allGridLevel = 2;
        }else if(this.allGridParams.roadId){
            allGridLevel = 1;
        }
        const {roadGridUrl,communityGridUrl,partGridUrl,smallPartGridUrl} = this.props.thisData.style;
        const urlList = [roadGridUrl,communityGridUrl,partGridUrl,smallPartGridUrl];
        const colorList = ['#174c75','#edf7ff','#174c75','#edf7ff'];
        const lineWidthList = [5,3,2,1];
        const lineTypeList = ['solid','solid','solid','dash'];
        const params = {...this.allGridParams,rbacToken:this.props.token};
        this.allGridLayer.forEach((layer,index)=>{
            this.allGridLayerData[index].checked = (index === 3 && allGridLevel === 4) || index === allGridLevel;
            if(!this.allGridLayerData[index].checked){
                layer.hide();
            }else{
                layer.show();
            }
            getAllGridData(layer,urlList[index],params,colorList[index],lineWidthList[index],lineTypeList[index],this.allGridLayerData[index]);
        });
        this.setState({allGridLevel});
    }
}
function getAllGridData(layer,url,params,color,width,lineType,layerData){
    layer.clear();
    if(url){
        axios.get(url,{params}).then((response) => {
            const result = response.data.data;
            if(result && result.length > 0){
                layerData.num = result.length;
                drawAllGrid(result,layer,url,params,color,width,lineType);
            }else{
                layerData.num = 0;
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }
}
function drawAllGrid(result,layer,url,params,color,width,lineType){
    // eslint-disable-next-line no-undef
    const symbolFill = new esri.symbol.SimpleFillSymbol(
        // eslint-disable-next-line no-undef
        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        // eslint-disable-next-line no-undef
        new esri.symbol.SimpleLineSymbol(lineType, new esri.Color(color), width),
        // eslint-disable-next-line no-undef
        new esri.Color('rgba(255,255,255,0)'));
    result.forEach((item)=>{
        //网格边界格式处理
        if(item.polygon){
            item.polygonData = [item.polygon.split(',').map((point)=>{
                return point.split(' ').map((part)=>{return part});
            })];
        }
        //坐标系转换
        const wkid = item.wkid ? item.wkid : '2';
        if(item.polygonData && wkid+'' === '2'){
            let changePolygonData = [];
            item.polygonData.forEach((oneGrid)=>{
                let changeOneGrid = [];
                oneGrid.forEach((point)=>{
                    const changePoint = GPS.gcj_decrypt_exact(parseFloat(point[1]),parseFloat(point[0]));
                    changeOneGrid.push([changePoint.lon,changePoint.lat]);
                });
                changePolygonData.push(changeOneGrid);
                if(item.longitude && item.latitude){
                    const newPoint = GPS.gcj_decrypt_exact(parseFloat(item.latitude),parseFloat(item.longitude));
                    item.longitude = newPoint.lon;
                    item.latitude = newPoint.lat;
                }
            });
            item.polygonData = changePolygonData;
        }
        //画边界
        // eslint-disable-next-line no-undef
        let polygon = new esri.geometry.Polygon();
        let polygonData = [];
        if(item.polygonData){
            polygonData = item.polygonData;
        }else{
            try {
                polygonData = JSON.parse(item.arcgisPoints);
            }catch (e) {}
        }
        if(!polygonData || polygonData.length === 0){
            return;
        }
        polygonData.forEach((ring) => {
            polygon.addRing(ring);
        });
        // eslint-disable-next-line no-undef
        let graphic = new esri.Graphic(polygon,symbolFill);
        layer.add(graphic);
    });
}
export function changeAllGridShow(item,index){
    item.checked = !item.checked;
    if(item.checked){
        this.allGridLayer[index].show();
    }else{
        this.allGridLayer[index].hide();
    }
    this.setState({});
}