const defaultData = {
    "position": {
        "left": "10%",
        "top": "10%",
        "width": "30%",
        "height": "30%",
    },
    "moduleName": "echarts_pie_list",
    "delayTime": 1000,
    "style": {
        "stack": false,
        "orientations": 1,
        "series": [{
            fillColor: [{
                color: "rgba(55,227,72,1)",
                percent: 0
            }, {
                color: "rgba(62,29,227,1)",
                percent: 100
            }],
            bgColor: "rgba(255,255,255,0.05)",
            angle: 0,
            lineColor: "rgba(80,227,194,1)",
            shadowColor: "rgba(57,21,235,0.8)",
            lineWidth: 1,
            minRadius: 54,
            maxRadius: 82,
        },{
            fillColor: [{
                color: "rgba(55,227,72,1)",
                percent: 0
            }, {
                color: "rgba(62,29,227,1)",
                percent: 100
            }],
            bgColor: "rgba(255,255,255,0.05)",
            angle: 0,
            lineColor: "rgba(80,227,194,1)",
            shadowColor: "rgba(57,21,235,0.8)",
            lineWidth: 1,
            minRadius: 54,
            maxRadius: 82,
        },{
            fillColor: [{
                color: "rgba(55,227,72,1)",
                percent: 0
            }, {
                color: "rgba(62,29,227,1)",
                percent: 100
            }],
            bgColor: "rgba(255,255,255,0.05)",
            angle: 0,
            lineColor: "rgba(80,227,194,1)",
            shadowColor: "rgba(57,21,235,0.8)",
            lineWidth: 1,
            minRadius: 54,
            maxRadius: 82,
        }],
        columnNum: 3,
        columnGap: 5,
        rowGap: 5,
        flexDirection: 'column',
        numColor:'#fff',
        numSize:'16',
        numShow:false,
        titleShow:true,
    },
    "dataSources": {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": '[{"name":"智安小区","value":5},{"name":"网格","value":6},{"name":"工作站","value":7}]'
    },
};
export default defaultData;