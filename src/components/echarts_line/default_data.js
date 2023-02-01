const defaultData = {
    "position": {
        "left": "10%",
        "top": "10%",
        "width": "30%",
        "height": "30%",
    },
    "moduleName": "echarts_line",
    "delayTime": 1000,
    "style": {
        "stack":false,
        "orientations":1,
        "grid":[{
            containLabel:true,
            left: '0',
            top: '10',
            right: '0',
            bottom: '0',
            width: 'auto',
            height: 'auto',
        }],
        "legend":{
            show:true,
            left: 'auto',
            top: 'auto',
            right: 'auto',
            bottom: 'auto',
            width: 'auto',
            height: 'auto',
            orient: 'horizontal',
            align: 'auto',
            padding: 0,
            itemGap: '10',
            icon:'rect',
            itemWidth: '25',
            itemHeight: '14',
            textStyle:{
                color: '#333',
                fontSize: '12',
                lineHeight: '12',
            },
            symbolType:'1',
        },
        "xAxis":[{
            show:true,
            gridIndex:0,
            position:'bottom',
            inverse:false,
            boundaryGap:true,
            scale:false,
            axisLine:{
                show:true,
                lineStyle:{
                    color:'#333',
                    width:1,
                    type:'solid'
                }
            },
            axisTick:{
                show:true,
                alignWithLabel:false,
                interval:0,
                inside:false,
                length:5,
                lineStyle:{
                    color:'#333',
                    width:1,
                    type:'solid'
                }
            },
            splitLine:{
                show:true,
                interval:0,
                lineStyle:{
                    color:'#333',
                    width:1,
                    type:'solid'
                }
            },
            axisLabel:{
                show:true,
                interval:0,
                inside:false,
                margin:8,
                rotate:0,
                color:'#333',
                fontSize:'12',
                align:'center',
                verticalAlign:'middle'
            },
        }],
        "yAxis":[{
            show:true,
            gridIndex:0,
            position:'left',
            inverse:false,
            boundaryGap:true,
            scale:false,
            axisLine:{
                show:true,
                lineStyle:{
                    color:'#333',
                    width:1,
                    type:'solid'
                }
            },
            axisTick:{
                show:true,
                alignWithLabel:false,
                interval:0,
                inside:false,
                length:5,
                lineStyle:{
                    color:'#333',
                    width:1,
                    type:'solid'
                }
            },
            splitLine:{
                show:true,
                interval:0,
                lineStyle:{
                    color:'#333',
                    width:1,
                    type:'solid'
                }
            },
            axisLabel:{
                show:true,
                interval:0,
                inside:false,
                margin:8,
                rotate:0,
                color:'#333',
                fontSize:'12',
                align:'center',
                verticalAlign:'middle'
            },
        }],
        "series":[{
            type:'line',
            xAxisIndex: 0,
            yAxisIndex: 0,
            symbol:'emptyCircle',
            symbolSize:'1vh',
            showAllSymbol:true,
            step:false,
            smooth:0,
            itemStyle:{
                opacity:true,
                color:['#0ff'],
                borderColor:'rgba(0,0,0,0)',
                borderWidth:0,
                borderType:'solid',
                barBorderRadius:0,
            },
            lineStyle:{
                opacity:true,
                colorType:1,
                color:['#0ff'],
                width:'2',
                type:'solid'
            },
            areaStyle:{
                opacity:true,
                colorType:1,
                color:['#0ff'],
                linearColor:[{
                    start:'red',
                    end:'blue'
                }]
            },
            label:{
                show:true,
                color:'#fff',
                positionType:'inside',
                position:'',
                distance:'5',
                rotate:0,
                fontSize:'12',
                align:'center',
                verticalAlign:'middle',
            },
            barWidth:'30%',
            barMaxWidth:'100%',
            barMinWidth:'1%',
            barGap:'-50%',
            colorType:1,
            color:['#0ff'],
            linearColor:[{
                start:'red',
                end:'blue'
            }],
        }],
        "tooltip":{
            show: true
        },
    },
    "dataSources" : {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": '{"ids":["330102001000","330102003000","330102004000","330102008000","330102009000","330102010000"],"legends":["成本","总收入"],"series":[[4,1,0,1,2,0],[2,4,0,1,1,0]],"title":"","xAxis":["清波街道","湖滨街道","小营街道","南星街道","紫阳街道","望江街道"]}'
    },
};
export default defaultData;