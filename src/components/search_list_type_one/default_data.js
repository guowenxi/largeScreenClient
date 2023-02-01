const defaultData = {
    "position": {
        "left": "8%",
        "top": "10%",
        "width": "75%",
        "height": "40%",
    },
    "moduleName": "search_list_type_one",
    "delayTime": 1000,
    "style": {
        columnNum:3,
        columnGap:'24',
        rowGap:'24',
        backgroundColor:'#fff',
        searchList:[
            {
                name:'人员',
                keyList:[{name:'人员类型',key:'peopleType',url:'',dataType:1,data:'[{"value":"1","name":"类型1"},{"value":"2","name":"类型2"}]'},{name:'重点等级',key:'peopleLevel',url:'',dataType:1,data:[]}],
                "column": [
                    {"keyName": "name", "showName": "姓名", "columnWidth": "15%", "textAlign": "center"},
                    {"keyName": "time", "showName": "最新异动时间", "columnWidth": "25%", "textAlign": "left"},
                    {"keyName": "type", "showName": "人员类型", "columnWidth": "20%", "textAlign": "left"},
                    {"keyName": "road", "showName": "街道", "columnWidth": "20%", "textAlign": "left"},
                    {"keyName": "number", "showName": "异动次数", "columnWidth": "20%", "textAlign": "left"}
                ],
            },
            {
                name:'事件',
                keyList:[{name:'事件类型',key:'eventType',url:'',dataType:1,data:[]},{name:'重点等级',key:'eventLevel',url:'',dataType:1,data:[]}],
                "column": [
                    {"keyName": "name", "showName": "事件名称", "columnWidth": "15%", "textAlign": "center"},
                    {"keyName": "time", "showName": "事发时间", "columnWidth": "25%", "textAlign": "left"},
                    {"keyName": "type", "showName": "事件类型", "columnWidth": "20%", "textAlign": "left"},
                    {"keyName": "road", "showName": "街道", "columnWidth": "20%", "textAlign": "left"},
                    {"keyName": "number", "showName": "异动次数", "columnWidth": "20%", "textAlign": "left"}
                ],
            }
        ],
        listStyle: {
            "backgroundColor": "rgba(35,35,85,1)",
            "titleShow": 1,
            "titleFontSize": "1.8vh",
            "titleFontWeight": "bold",
            "titleColor": "#333333",
            "titleBg": "rgba(255,255,255,1)",
            "rowNum": 5,
            "contentFontSize": "1.8vh",
            "contentFontWeight": "normal",
            "contentColor": "rgba(255,255,255,1)",
            "contentBg": "rgba(35,35,85,0)",
            "contentHoverShow": true,
            "contentHoverColor": "#666666",
            "contentHoverBg": "rgba(245,247,250,1)",
            "paginationShow": 0,
            "paginationAlign": "right",
            "paginationColor": "rgba(0,0,0,1)",
            "paginationActiveColor": "#232355",
            "paginationBg": "rgba(255,255,255,1)",
            "lineHeight": "0px",
            "contentHeight": "0px",
        }
    },
    "dataSources" : {
        "listDataSources": {
            "interact": [],
            "dataType": 1,
            "dataUrl": '',
            "dataParams": '',
            "defaultData": '{"total": "7","list": [{"name": "张三", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 3},{"name": "李四", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 1},{"name": "王五", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 2},{"name": "赵六", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 1},{"name": "孙七", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 1},{"name": "周八", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 1},{"name": "吴九", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 2}]}'
        },
        "interact": [],
        "dataType": 1,
        "dataUrl": 'http://localhost:8080/fyDisplaySystem/olap/getOlapData',
        "dataParams": '{"id":62}',
        "defaultData": '{"ids":["330102001000","330102003000","330102004000","330102008000","330102009000","330102010000"],"legends":null,"series":[4,1,0,1,2,0],"title":"","xAxis":["清波街道","湖滨街道","小营街道","南星街道","紫阳街道","望江街道"]}'
    },
};
export default defaultData;