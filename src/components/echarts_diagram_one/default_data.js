const defaultData = {
    "position": {
        "left": "10%",
        "top": "10%",
        "width": "45%",
        "height": "30%",
    },
    "moduleName": "echarts_diagram_one",
    "delayTime": 1000,
    "style": {
        nodeList: [{x: 0, y: 0}],
        lineList: [{lineStyle: {color: '#fff', type: 'solid', width: 1}}],
    },
    "dataSources": {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": JSON.stringify([
            {
                "name": "刘德 步行1",
                "id": 0,
                "target": [
                    {
                        "targetId": 1,
                        "label": "朋友"
                    },
                    {
                        "targetId": 2,
                        "label": "家庭"
                    },
                    {
                        "targetId": 3,
                        "label": "属地"
                    },
                    {
                        "targetId": 4,
                        "label": "事件"
                    },
                    {
                        "targetId": 5,
                        "label": "同行"
                    }
                ]
            },
            {
                "name": "刘德 步行2",
                "id": 1,
                "target": []
            },
            {
                "name": "刘德 步行3",
                "id": 2,
                "target": []
            },
            {
                "name": "刘德 步行4",
                "id": 3,
                "target": []
            },
            {
                "name": "刘德 步行5",
                "id": 4,
                "target": []
            },
            {
                "name": "刘德 步行6",
                "id": 5,
                "target": []
            }
        ])
    },
};
export default defaultData;