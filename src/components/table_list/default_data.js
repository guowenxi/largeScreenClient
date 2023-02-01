const defaultData = {
    "position": {
        "left": "25%",
        "top": "25%",
        "width": "25%",
        "height": "25%",
    },
    "moduleName": "table_list",
    "delayTime": 1000,
    "style": {
        "column": [
            {"keyName": "name", "showName": "姓名", "columnWidth": "15%", "textAlign": "center", colorType:1,calculateType:1},
            {"keyName": "time", "showName": "最新异动时间", "columnWidth": "25%", "textAlign": "left", colorType:1,calculateType:1},
            {"keyName": "type", "showName": "人员类型", "columnWidth": "20%", "textAlign": "left", colorType:1,calculateType:1},
            {"keyName": "road", "showName": "街道", "columnWidth": "20%", "textAlign": "left", colorType:1,calculateType:1},
            {"keyName": "number", "showName": "异动次数", "columnWidth": "20%", "textAlign": "left", colorType:1,calculateType:1}
        ],
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
        "autoMove": false,
        "interval": 0
    },
    "dataSources": {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": '{"total": "7","list": [{"name": "张三", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 3},{"name": "李四", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 1},{"name": "王五", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 2},{"name": "赵六", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 1},{"name": "孙七", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 1},{"name": "周八", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 1},{"name": "吴九", "time": "2019-12-20", "type": "涉稳", "road": "××街道", "number": 2}]}'
    }
};
export default defaultData;