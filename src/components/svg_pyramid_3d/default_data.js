const defaultData = {
    "position": {
        "left": "10%",
        "top": "10%",
        "width": "45%",
        "height": "30%",
    },
    "moduleName": "svg_pyramid_3d",
    "delayTime": 1000,
    "style": {
        colors:[
            {
                angle:0,
                colorList:[
                    { color: '#000', percent: 100 },
                ],
            },
            {
                angle:0,
                colorList:[
                    { color: '#000', percent: 100 },
                ],
            }
        ],
        fontSize:"22",
        blockSize:"",
        barHeight:"",
        flexDirection:"column",
        lineHeight:"",
        itemHeight:"",
        padding:"",
    },
    "dataSources" : {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": JSON.stringify({
            "legends":null,
            "series":[4,5],
            "title":"",
            "xAxis":["清波街道","清波街道"]
        })
    },
};
export default defaultData;