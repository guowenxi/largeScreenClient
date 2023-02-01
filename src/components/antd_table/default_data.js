const defaultData = {
    "position": {
        "left": "10%",
        "top": "10%",
        "width": "45%",
        "height": "30%",
    },
    "moduleName": "antd_table",
    "delayTime": 1000,
    "style": {
        "searchHeight": "3.5vh",
        "padding": "1vh",
        "descriptionKey": "",
        "backgroundColor": "rgba(51,51,55,1)",
        "columns": [{
            "filterUrl": "",
            "sorter": false,
            "dataIndex": "name",
            "width": 19,
            "filtersJson": "[{\"text\":\"xxx\",\"value\":\"1\"},{\"text\":\"yyy\",\"value\":\"2\"}]",
            "filterOpen": false,
            "updateTime": 1578556972072,
            "align": "center",
            "title": "姓名",
            "filterType": 1
        }, {
            "filterUrl": "",
            "sorter": true,
            "dataIndex": "gender",
            "width": 20,
            "filtersJson": "[{\"text\":\"男\",\"value\":\"1\"},{\"text\":\"女\",\"value\":\"2\"}]",
            "filterOpen": true,
            "updateTime": 1578641465820,
            "align": "center",
            "title": "性别",
            "filterType": 1,
            "filterMultiple": true
        }, {
            "filterUrl": "",
            "sorter": false,
            "dataIndex": "Email",
            "width": 50,
            "filtersJson": "",
            "filterOpen": false,
            "updateTime": 1578556988424,
            "align": "left",
            "title": "邮箱",
            "filterType": 1
        }],
        "searchWidth": "20vh",
        "fontSize": "2vh",
        "rowKey": "id"
    },
    "dataSources" : {
        "interact": [],
        "dataType": 2,
        "dataUrl": 'http://localhost:3000/json/list.json',
        "dataParams": '',
        "defaultData": '{"data":[{"id":"1","name":"张某某","gender":"男","Email":"xxxxx@qq.com"},{"id":"2","name":"张某某","gender":"男","Email":"xxxxx@qq.com"}],"total":100}'
    },
};
export default defaultData;