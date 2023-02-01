const defaultData = {
    "position": {
        "left": "0%",
        "top": "0%",
        "width": "52%",
        "height": "21%"
    },
    "moduleName": "menu_select_list",
    "delayTime": 0,
    "style": {
        menuList: [{ "name": "日", "value": 1, 'showImg': 2 }, { "name": "周", "value": 2, 'showImg': 2 }, { "name": "月", "value": 3, 'showImg': 2 }, { "name": "年", "value": 4, 'showImg': 2 }],
        fontSize: '2vh',
        fontColor: '#fff',
        textDecoration: false,
        selectedColor: '#fff',
        selectedIndex: 1,
        flexDirection:'row',
        inFlexDirection:'row',
        showUnderLine:false,
    },
    "dataSources": {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": ''
    },
};
export default defaultData;