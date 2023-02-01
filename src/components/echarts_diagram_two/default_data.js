const defaultData = {
    "position": {
        "left": "10%",
        "top": "10%",
        "width": "45%",
        "height": "30%",
    },
    "moduleName": "echarts_diagram_two",
    "delayTime": 1000,
    "style": {
        nodeList: [{ x: 0, y: 0 }],
        lineList: [{ lineStyle: { color: '#fff', type: 'solid', width: 1 } }],
    },
    "dataSources": {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": JSON.stringify([
            {
                "name": "A",
                "type": "",
                "imgSrc": ""
            },
            {
                "name": "B",
                "imgSrc": "",
                "type": "朋友"
            },
            {
                "name": "C",
                "imgSrc": "",
                "type": "家庭"
            },
            {
                "name": "D",
                "imgSrc": "",
                "type": "属地"
            },
            {
                "name": "E",
                "imgSrc": "",
                "type": "事件"
            },
            {
                "name": "F",
                "imgSrc": "",
                "type": "同行"
            }
        ])
    },
};
export default defaultData;