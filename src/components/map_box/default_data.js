const defaultData = {
    "position": {
        "left": "0%",
        "top": "0%",
        "width": "50%",
        "height": "50%",
    },
    "moduleName": "map_box",
    "delayTime": 1000,
    "style": {
        //中国
        // lon:111.02,
        // lat:33.09,
        //杭州
        // lon:120.10731,
        // lat:30.28965,
        lon:120.72,
        lat:27.92,
        zoom:3,
        select:{
            left:'',
            right:'',
            top:'',
        },
        legend:{
            img:'',
            width:'',
            height:'',
            left:'',
            top:'',
            right:'',
            bottom:''
        },
        grid:{
            open:false,
            url:'',
            urlParams:'',
            treeOpen:false,
            treeUrl:'',
            backgroundColor:'rgba(0,255,255,0.2)',
            lineColor:'#0ff',
            lineWidth:'2',
            lineType:'',
            interact:[]
        },
        layer : [{
            url:'http://localhost:3000/json/people.json',
            params:'',
            name:'',
            whole: {
                img:'',
                width:44,
                height:48,
                top:22,
                left:0,
                clusterImg:'',
                clusterWidth:44,
                clusterHeight:48,
                clusterTop:22,
                clusterLeft:0,
                fontSize:20,
                fontTop:22,
                fontLeft:0,
                fontColor:'#0ff'
            },
            cluster:false,
            renderer:[],
            key:'type',
            icon:[],
            categoryKey:'',
            category:[],
            interact:[]
        }]
    },
    "dataSources" : {
        "interact": [],
        "dataType": 1,
        "dataUrl": '',
        "dataParams": '',
        "defaultData": ''
    },
};
export default defaultData;