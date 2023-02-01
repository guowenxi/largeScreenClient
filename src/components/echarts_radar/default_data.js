const defaultData = {
    "position": {
        "left": "10%",
        "top": "10%",
        "width": "30%",
        "height": "30%",
    },
    "moduleName": "echarts_radar",
    "delayTime": 1000,
    "style": {
        "bartType": 1,
        "stack": false,
        "orientations": 1,
        "legend": {
            "padding": 0,
            "itemGap": "10",
            "orient": "horizontal",
            "bottom": "auto",
            "itemHeight": "1.2vh",
            "show": true,
            "icon": "rect",
            "right": "0",
            "align": "auto",
            "top": "auto",
            "left": "auto",
            "width": "auto",
            "itemWidth": "1.2vh",
            "textStyle": {
                "color": "rgba(255,255,255,1)",
                "fontSize": "1.2vh",
                "lineHeight": "1.2vh"
            },
            "height": "auto"
        },
        "radar": {
            splitNumber: '3',
            centerX: '50%',
            centerY: '50%',
            radiusIn: '0%',
            radiusOut: '75%',
            startAngle: 90,
            nameGap: 15,
            shape: 'polygon',
            name: {
                show: true,
                fontFamily: 'sans-serif',
                colorType: '1',
                color: '#000',
                fontSize: '15',
                lineHeight: '0',
                borderWidth: '20',
                borderColor: '#fff',
            },
            axisLine: {
                show: true,
                symbolSizeX: '10',
                symbolSizeY: '10',
                symbolOffsetStart: '0',
                symbolOffsetEnd: '0',
                linearColor: [{
                    start: 'red',
                    end: 'blue'
                }],
                lineStyle:{
                    color:['#6495ED'],
                    colorType: '2'
                }
            },
            axisTick:{
                show:true,
                length:'5',
                lineStyle:{
                    color:'#000'
                }
            },
            axisLabel:{
                show:false,
                rotate:0,
                color:'#000',
                fontSize:'10',
                margin:'8',
                fontFamily: 'sans-serif',
            },
            splitLine: { 
                show: true, 
                lineStyle: {
                    width: '2'
                }
            },
            splitArea:{
                show:true,
                areaStyle:{
                    color:['rgba(250,250,250,0.3)','rgba(200,200,200,0.3)']
                }
            }
        },
        "series": [{
            type: 'radar',
            symbolSize: '10',
            symbol:'circle',
            colorType:1,
            color:['#6495ED'],
            linearColor: [{
                start: 'red',
                end: 'blue'
            }],
            areaStyle: {
                color: ['#6495ED'],
                width: '1',
                shadowColor: '#fff',
                shadowBlur: '0',
                colorType: 1,
            },
            lineStyle: {
                color: ['#6495ED'],
                width: '1',
                colorType: 1
            },
            itemStyle: {
                borderColor: '#000',
                shadowColor: '#fff',
                shadowBlur: '10',
                color:['#6495ED'],
                colorType: 1,
            },
            label:{
                show:false,
                positionX:'0',
                positionY:'0',
                rotate:0,
                color:'#fff'
            }
        }]
    },
    "dataSources": {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": '{ "createTime":null, "idList":null, "ids":[], "legends":[], "pageNo":null, "pageSize":null, "rbacToken":"", "series":[ 12, 23, 23 ], "title":"", "type":null, "updateTime":null, "xAxis":[ "预警数据", "未预警数据", "已排除数据" ] }'
    },
};
export default defaultData;