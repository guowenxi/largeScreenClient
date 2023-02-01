export const bodyData = {
    "data": [{
        "id":1,
        "position":{
            "left": "40%",
            "top" : "10%",
            "width" : "25%",
            "height" : "80%",
        },
        "moduleName" : "bar_type_one",
        "delayTime":1000,
        "style" : {
            "columnNum":"1",
            "columnGap":"10",
            "rowGap":"4",
            "fontColor":"#fff",
            "itemBackground":"#5179bb",
            "barColor":"#ff9079",
            "nameFloat":"left",
            "numFloat":"right",
            "itemPaddingLeft":"5px",
            "itemPaddingRight":"5px",
            "nameFontSize":"1.8vh",
            "nameFontColor":"#000",
            "numFontSize":"1vh",
            "numFontColor":"#fff",
            "border":"2px",
            "borderColor":"#0ff",
            "borderStyle":"solid"
        },
        "dataSources" : {
            "interact" : [{type:1,dataType:1,receiveId:'2',keyName:'roadId'}],
            "dataType" : 1,
            "dataUrl" : 'http://localhost:8080/fyDisplaySystem/olap/getOlapData',
            "dataParams" : '{"id":62}',
            "defaultData" : '{"ids":["330102000000","330102001000","330102003000","330102004000","330102008000","330102009000","330102010000"],"legends":null,"series":[4,1,0,1,2,0,0],"title":"","xAxis":["全区","清波街道","湖滨街道","小营街道","南星街道","紫阳街道","望江街道"]}'
        },
        "nickName":"统计1",
    },{
        "id":2,
        "position":{
            "left": "68%",
            "top" : "50%",
            "width" : "30%",
            "height" : "40%",
        },
        "moduleName" : "bar_type_one",
        "delayTime":1000,
        "style" : {
            "columnNum":"2",
            "columnGap":"10",
            "rowGap":"4",
            "fontColor":"#fff",
            "itemBackground":"#5179bb",
            "barColor":"#ff9079",
            "nameFloat":"left",
            "numFloat":"right",
            "itemPaddingLeft":"5px",
            "itemPaddingRight":"5px",
            "nameFontSize":"1.8vh",
            "nameFontColor":"#000",
            "numFontSize":"1vh",
            "numFontColor":"#fff",
            "border":"0",
            "borderColor":"#0ff",
            "borderStyle":"solid"
        },
        "dataSources" : {
            "interact" : [],
            "dataType" : 1,
            "dataUrl" : 'http://localhost:8080/fyDisplaySystem/olap/getOlapData',
            "dataParams" : '{"id":"78","roadId":"330102001000"}',
            "defaultData" : '{"ids":["330102001000","330102003000","330102004000","330102008000","330102009000","330102010000"],"legends":null,"series":[4,1,0,1,2,0],"title":"","xAxis":["清波街道","湖滨街道","小营街道","南星街道","紫阳街道","望江街道"]}'
        },
        "nickName":"统计2",
    }]
};

