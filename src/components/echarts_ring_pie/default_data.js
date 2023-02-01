const defaultData = {
    "position": {
        "left": "10%",
        "top": "10%",
        "width": "30%",
        "height": "30%",
    },
    "moduleName": "echarts_ring_pie",
    "delayTime": 1000,
    "style": {
        "stack":false,
        "orientations":1,
        "legend":{
            styleType:1,
            show:true,
            left: 'auto',
            top: '0',
            right: '0',
            bottom: 'auto',
            width: '20%',
            height: '100%',
            flexDirection: 'row',
            align: 'row',
            numDirection:'row',
            verticalAlign: 'center',
            padding: 0,
            columnNum:1,
            itemWidth: '25',
            itemHeight: '14',
            distance: '8',
            textStyle:{
                color: '#333',
                fontSize: '12'
            }
        },
        "series":[{
            type:'pie',
            clockwise:true,
            startAngle:0,
            minShowLabelAngle:0,
            roseType:false,
            avoidLabelOverlap:true,
            centerX:'50%',
            centerY:'50%',
            radiusIn:'0',
            radiusOut:'75%',
            colorType:1,
            color:['rgb(169,58,55)','rgb(231,181,96)','rgb(46,116,194)','rgb(76,48,180)','rgb(192,209,101)','rgb(103,177,102)'],
            linearColor:[{
                start:'red',
                end:'blue'
            }],
            labelLine:{
                show:true,
                length:'20',
                length2:'20',
                smooth:0,
                lineStyle:{
                    color:'#0ff',
                    width:'2',
                    type:'solid'
                }
            },
            label:{
                show:true,
                color:'#fff',
                position:'outside',
                distance:'5',
                rotate:0,
                fontSize:'12',
                align:'center',
                verticalAlign:'middle'
            },
            itemStyle:{
                borderWidth:0,
            }
        },{
            type:'pie',
            clockwise:true,
            startAngle:0,
            minShowLabelAngle:0,
            roseType:false,
            avoidLabelOverlap:true,
            centerX:'50%',
            centerY:'50%',
            radiusIn:'0',
            radiusOut:'75%',
            colorType:1,
            color:['rgb(169,58,55)','rgb(231,181,96)','rgb(46,116,194)','rgb(76,48,180)','rgb(192,209,101)','rgb(103,177,102)'],
            linearColor:[{
                start:'red',
                end:'blue'
            }],
            labelLine:{
                show:true,
                length:'20',
                length2:'20',
                smooth:0,
                lineStyle:{
                    color:'#0ff',
                    width:'2',
                    type:'solid'
                }
            },
            label:{
                show:true,
                color:'#fff',
                position:'outside',
                distance:'5',
                rotate:0,
                fontSize:'12',
                align:'center',
                verticalAlign:'middle'
            },
            itemStyle:{
                borderWidth:0,
            }
        }],
    },
    "dataSources" : {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": '{"series":[4,1],"title":"","xAxis":["清波街道","湖滨街道"]}'
    },
};
export default defaultData;