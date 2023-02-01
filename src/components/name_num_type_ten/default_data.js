const defaultData = {
    "position": {
        "left": "1%",
        "top": "7%",
        "width": "18%",
        "height": "22%"
    },
    "moduleName": "name_num_type_ten",
    "delayTime": 0,
    "style": {
        nameWidth:'100%',
        nameHeight:'50%',
        numWidth:'100%',
        numHeight:'50%',
        itemFlexDirection:'column',
        nameList:[{
            key:"name",
            fontSize:1,
            fontColorType:1,//1为固定色,2为根据某字段不同值不同色,3为根据序号不同值不同色
            fontColor:"#fff",
            fontColorKey:"type",
            fontColorList:[{num:1,color:'rgb(61,219,88)'},{num:2,color:'rgb(1,160,249)'},{num:3,color:'rgb(214,55,25)'}],
        }],
        nameSplit:{
            key:"",
            fontSize:1,
            fontColorType:1,//1为固定色,2为根据某字段不同值不同色,3为根据序号不同值不同色
            fontColor:"#fff",
            fontColorKey:"type",
            fontColorList:[{num:1,color:'rgb(61,219,88)'},{num:2,color:'rgb(1,160,249)'},{num:3,color:'rgb(214,55,25)'}],
        },
        numList:[{
            key:"num",
            fontSize:1,
            fontColorType:1,//1为固定色,2为根据某字段不同值不同色,3为根据序号不同值不同色
            fontColor:"#fff",
            fontColorKey:"type",
            fontColorList:[{num:1,color:'rgb(61,219,88)'},{num:2,color:'rgb(1,160,249)'},{num:3,color:'rgb(214,55,25)'}],
        }],
        numSplit:{
            key:"",
            fontSize:1,
            fontColorType:1,//1为固定色,2为根据某字段不同值不同色,3为根据序号不同值不同色
            fontColor:"#fff",
            fontColorKey:"type",
            fontColorList:[{num:1,color:'rgb(61,219,88)'},{num:2,color:'rgb(1,160,249)'},{num:3,color:'rgb(214,55,25)'}],
        },
        columnNum:3,
        columnGap:5,
        rowGap:5,
        flexDirection:'column',
        startLineLong:0,
        splitLineLong:0,
        endLineLong:0,
    },
    "dataSources" : {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": '[{"name":"总用户数","num":"699564"},{"name":"月度活跃数","num":"32564"},{"name":"今日活跃数","num":"9564"}]'
    },
};
export default defaultData;