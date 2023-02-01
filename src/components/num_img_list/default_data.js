const defaultData = {
    "position": {
        "left": "5%",
        "top": "5%",
        "width": "14%",
        "height": "35%",
    },
    "moduleName": "num_img_list",
    "delayTime": 1000,
    "style": {
        "list": [{"numKey": "totalNum", "nameKey": "title"}, {"numKey": "inscrNum", "nameKey": "subTitle"}],
        "typeList": [{"id": 1}, {"id": 2}, {"id": 3}, {"id": 4}],
        "itemHeight": "8.5vh",
        "normalColor": "#797979",
        "selectedColor": "#1296DB",
        "columnNum": 1,
        "columnGap": "1vw",
        "rowGap": "1vh",
        "headerLineHeight": "3vh",
        "headerFontSize": "1.6vh",
        "headerFontWeight": "bold",
        "mainLineHeight": "5vh",
        "mainFontSize": "2.6vh",
        "mainFontWeight": "bold",
        "mainColor": "#FF9933",
        "shadowColor":"rgba(0,0,0,0.3)",
        "coverImgList": [
            {"id": 1, "normalImg": "", "selectedImg": "", interact: [],"itemBgColor": "#FFFFFF","selectedBgColor":"",canMove:false,liLeft:0,liTop:0},
            {"id": 2, "normalImg": "", "selectedImg": "", interact: [],"itemBgColor": "#FFFFFF","selectedBgColor":"",canMove:false,liLeft:0,liTop:0},
            {"id": 3, "normalImg": "", "selectedImg": "", interact: [],"itemBgColor": "#FFFFFF","selectedBgColor":"",canMove:false,liLeft:0,liTop:0},
            {"id": 4, "normalImg": "", "selectedImg": "", interact: [],"itemBgColor": "#FFFFFF","selectedBgColor":"",canMove:false,liLeft:0,liTop:0}
        ],
        "coverImgTop": "1vh",
        "coverImgLeft": "1vh",
        "coverImgWidth": "5vh",
        "coverImgHeight": "5vh",
        "textTop":"0",
        "textRight":"2%",
        "numTop":"3vh",
        "numRight":"2%"
    },
    "dataSources": {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": '[{"totalNum": 32, "inscrNum": 8, "title": "预警人员总量", "subTitle": "今日增量"},{"totalNum": 164,"inscrNum": 28,"title": "预警事件总量","subTitle": "今日增量"},{"totalNum": 13,"inscrNum": 2,"title": "重点部位总量","subTitle": "今日增量"},{"totalNum": 64,"inscrNum": 13,"title":"重点企业总量","subTitle":"今日增量"}]'
    }
};
export default defaultData;