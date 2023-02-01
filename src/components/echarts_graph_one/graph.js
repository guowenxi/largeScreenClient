import React, { useState, useEffect } from 'react';
import { Descriptions ,Modal,Button,Tabs,Table} from 'antd';
// import echarts from 'echarts'
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import {Scrollbars} from "react-custom-scrollbars";
import "./graph.css";

const Template = (props) => {
    const { engineid ,engineData, dataTime, showLevel, contentType, interactData} = props;
    // console.log('contentType', contentType);
    const [DETAILlist, setDETAILlist] = useState([]);
    const [titles, setTitles] = useState([]);
    const [Dtitles, setDTitles] = useState('');
    const [modalImageStatus, setModalImageStatus] = useState(false);

    const { TabPane } = Tabs;

    useEffect(() => {
        setTimeout(()=>{
            getEchartImgs(engineData,engineid)
        })
    }, [engineData,engineid,dataTime]);//eslint-disable-line

    const getEchartImgs = (jsonData,moduleId) => {
        // var textTitle = '';
        var option;
        /*规则引擎*/
        var myChart;
        var _dom;
        //    初始化
        let countLevel=0;
        function initChart() {
            // if (!document.getElementById(moduleId) || myChart)
            //     myChart.dispose();
            _dom = document.getElementById(moduleId)
            myChart = echarts.init(document.getElementById(moduleId));

            // textTitle = '';

            countLevel=0;
            if(showLevel){
                countLevel = showLevel;
            }else{
                countLevelFn(JSON.parse(jsonData));//计算层级
            }


            loadCharts.call(this, JSON.parse(jsonData));
        };

        initChart();

        // 计算层级
        function countLevelFn(list){
            if(Array.isArray(list)&&list.length){
                countLevel++;
            }
            list.forEach(function(item,idex){
                if(Array.isArray(item.children)&&item.children.length){
                    countLevelFn(item.children)
                }
            })


        }
        function loadCharts(data) {
            // 基于准备好的dom，初始化echarts实例
            // var edgeLength = 50;@
            var _symbolSize =countLevel===2?100: 50;
            var _dom_w = _dom.offsetWidth / 2;
            var _dom_h = _dom.offsetHeight / 2;
            const radius = (_dom_w > _dom_h ? _dom_h : _dom_w)/4.5;
            // var l_size = _dom.offsetWidth > 1000 ? 1000 : 500;
            // var t_size = _dom.offsetWidth > 1000 ? 1000 : 500;
            var l_size = 0;
            var t_size = 0;
            var _node = [];
            var _link = [];
            var typeImg = [
                ["image://./images/graph/png/00.png", "image://./images/graph/png/00.png", "image://./images/graph/png/00.png"],
                ["image://./images/graph/png/10.png", "image://./images/graph/png/10.png", "image://./images/graph/png/10.png"],
                ["image://./images/graph/png/20.png", "image://./images/graph/png/21.png", "image://./images/graph/png/22.png"],
                ["image://./images/graph/png/20.png", "image://./images/graph/png/21.png", "image://./images/graph/png/22.png"],
            ];
            var levelImg = ["image://./images/graph/png/21.png", "image://./images/graph/png/00.png", "image://./images/graph/png/22.png","image://./images/graph/png/40.png","image://./images/graph/png/20.png"];
            var filterchildData = function (item, list, around) {
                if (!list && list.length === 0) return;
                if(showLevel && showLevel < around+1) return;
                list.forEach(function (it, idx) {
                    _node.push({
                        symbol: filterImg(around, it),
                        symbolSize: _symbolSize - 20,
                        name: it.name,
                        bindData: {
                            ...it,
                            children: null
                        },
                    })
                    _link.push({
                        source: item.name,
                        target: it.name,
                        label: {
                            show: false
                        }
                    });
                    // if(it.children.length>0){
                    //     around
                    //     debugger
                    // }
                    // console.log(it.children)
                    if (it.children.length > 0 && around < 3) filterchildData(it, it.children, around + 1)
                })
            }

            var filterImg = function (idx, _) {
                if(_.warningLevel != null){
                    return levelImg[_.warningLevel];
                }
                // debugger
                // return typeImg[idx][1]
                // return "image://img/00.png";
                // score  =0 无数据
                // score  >0 有数据
                // score  >0 &&   isLastPoint = 1   有预警
                //状态判断
                // eslint-disable-next-line eqeqeq
                if (_.score > 0 && _.isLastPoint == 1) {
                    return typeImg[idx][2];
                }
                if (_.score > 0&&_.nodeType===0) {
                    return typeImg[idx][2];
                }
                // eslint-disable-next-line eqeqeq
                if (_.score == 0&&_.nodeType===0) {
                    return typeImg[idx][0];
                }
                if (judgeColor(_).length) {
                    return typeImg[idx][1];
                } else {
                    return typeImg[idx][0]
                }
                // if (_.score > 0 && _.isLastPoint == 1) {
                //   return typeImg[idx][2];
                // }
                // if (_.detailList&&_.detailList.length>0) {
                //   return typeImg[idx][2];
                // }
                // if (judgeColor(_).length) {
                //   return typeImg[idx][0];
                // } else {
                //   return typeImg[idx][0]
                // }
            }

            //将人员姓名存下
            _node.push({
                symbol: filterImg(0, data[0]),
                symbolSize:countLevel===2?200: 70,
                fixed: true,
                name: displayName(data[0].name),
                bindData: {
                    ...data[0],
                    children: null
                },
                children: null,
                label: {
                    fontSize: 24,
                    verticalAlign :"middle"
                },
                x: _dom_w / 2 + l_size,
                y: _dom_h / 2 + t_size,
            });
            //将二级圈圈存下
            var sec_list = data[0].children;
            const sec_length = sec_list.length;
            sec_list.forEach(function (item, idx) {
                _node.push({
                    symbol: filterImg(1, item),
                    symbolSize: _symbolSize - 10,
                    fixed: true,
                    name: item.name,
                    bindData: {
                        ...item,
                        children: null
                    },
                    children: null,
                    // x: idx === 0 ? _dom_w / 2 - edgeLength + l_size : idx === 2 ? _dom_w / 2 + edgeLength + l_size : _dom_w / 2 + l_size,
                    // y: idx === 1 ? _dom_h / 2 - edgeLength + t_size : idx === 3 ? _dom_h / 2 + edgeLength + t_size : _dom_h / 2 + t_size,
                    x: _dom_w / 2 + radius*Math.cos(Math.PI*2*idx/sec_length),
                    y: _dom_h / 2 + radius*Math.sin(Math.PI*2*idx/sec_length),
                });
                //与一级圈关联
                _link.push({
                    source: sec_list[idx].name,
                    target: displayName(data[0].name),
                    lineStyle: {
                        width: 0
                    },
                    label: {
                        show: false
                    }
                });

                _link.push({
                    source: sec_list[idx].name,
                    target: idx === sec_list.length - 1 ? sec_list[0].name : sec_list[idx + 1].name,
                    lineStyle: {
                        curveness: 1/sec_length
                    },
                    label: {
                        show: false
                    }
                });
            });
            // //循环二级之后的数据
            sec_list.forEach(function (item, idx) {
                filterchildData(item, item.children, 2);
            });

            // console.log(_node)
            // console.log(_link)

            // let list=[];
            // _node.map((item)=>{
            //     if(list.indexOf(item.name)<0){
            //         list.push(item.name)
            //     }else{
            //         console.log(item.name)
            //     }
            // })
            // console.log(list)


            option = {
                series: [{
                    animation: false,
                    zoom: countLevel===2?0.8:2.5,
                    // nodeScaleRatio:0.7,
                    center: [_dom_w / 2 + l_size, _dom_h / 2 + t_size],
                    type: 'graph',
                    layout: 'force',
                    // symbolSize: 58, // 58
                    draggable: false,
                    roam: true,
                    focusNodeAdjacency: true,
                    // categories: categories,
                    // edgeSymbol: ['', 'arrow'], // 箭头
                    // edgeSymbolSize: [80, 10],
                    edgeLabel: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: 20
                            },
                            formatter(x) {
                                return x.data.name;
                            }
                        }
                    },
                    label: {
                        show: true,
                        // position: 'bottom',
                        // textStyle: {
                        //   fontSize: 12
                        // }
                    },
                    lineStyle: {
                        width: 2,
                        color: '#eee',
                    },
                    force: {
                        repulsion: 10, // 2000
                        gravity: 0,
                        // edgeLength:20,
                        layoutAnimation: false,
                    },
                    data: _node,
                    links: _link
                }]
            }
            myChart.setOption(option, true);
            if(contentType === 3 && data && data[0]){
                let dataNode = data[0].detailList;
                if(dataNode){
                    const rightData=[];
                    for (let datapart of dataNode) {
                        rightData.push(datapart[0]);
                    }
                    const centerData= [];
                    for(let key in rightData[0]){
                        var pattern = new RegExp("[\u4E00-\u9FA5]+");
                        var patternNum = new RegExp("[0-9]+");
                        if(pattern.test(key) || patternNum.test(key)){
                            centerData.push({label:key,value: rightData[0][key]})
                        }
                    }
                    setTitles(rightData);
                    setDETAILlist(centerData);
                    setDTitles(rightData[0].title);
                    setModalImageStatus(true)
                }
            }

            myChart.on("click", function (params) {
                if (params.data.bindData.detailList&&params.data.bindData.detailList.length>0) {

                    let data = params.data.bindData.detailList;

                    // console.log(data)
                    if(contentType === 2){
                        if(data && Array.isArray(data)){
                            let tableList = [];
                            data.forEach((tabItem)=>{
                                let tableName = [];
                                let tableData = [];
                                var pattern = new RegExp("[\u4E00-\u9FA5]+");
                                var patternNum = new RegExp("[0-9]+");
                                tabItem.forEach((item,itemIndex)=>{
                                    if(itemIndex === 0){
                                        for(let key in item){
                                            if(pattern.test(key) || patternNum.test(key)){
                                                tableName.push({
                                                    title: key,
                                                    dataIndex: key
                                                })
                                            }
                                        }
                                    }
                                    tableData.push({...item,row_index:itemIndex});
                                });
                                tableList.push({
                                    title:tabItem[0] ? tabItem[0].title:'',
                                    data:{tableName,tableData}
                                })
                            });
                            setTitles(tableList);
                            setDTitles(tableList[0].title);
                            setModalImageStatus(true)
                        }
                    }else{
                        const rightData=[]
                        // const centerData:any= []
                        for (let datapart of data) {
                            rightData.push(datapart[0]);
                            // centerData.push(datapart[0])
                        }
                        const centerData= []
                        // for (let item of rightData) {
                        for(let key in rightData[0]){
                            var pattern = new RegExp("[\u4E00-\u9FA5]+");
                            var patternNum = new RegExp("[0-9]+");
                            if(pattern.test(key) || patternNum.test(key)){
                                centerData.push({label:key,value: rightData[0][key]})
                            }
                        }
                        // }
                        setTitles(rightData);
                        setDETAILlist(centerData);
                        setDTitles(rightData[0].title)
                        // setModalImageName(params.data.name);
                        // setLeftData(data.one);
                        // setRightData(rightData ? rightData : []);
                        // setCenterData(centerData ? centerData : []);
                        setModalImageStatus(true)
                    }
                }

            });
        };

        // 分隔字段
        function displayName (name){
            let _string="";
            let _list=[];
            if(name){
                _list=name.split('');
                for(var i=0;i<_list.length;i++){
                    if(i%5===0&&i!==0){
                        _string=_string+_list[i]+'\n'
                    }else{
                        _string=_string+_list[i]
                    }
                }
            }else{
                _string=name;
            }

            return _string
        }

        //根据节点名称显示圆环颜色
        function judgeColor(item) {
            let _list = [];
            item.detailList && item.detailList.forEach(function (it, idx) {
                if (it[0].title !== '节点描述') {
                    _list.push(it)
                }
            })
            return _list
        }
    }

    function callbackModel(key) {
        setDTitles(key)
        if(contentType !== 2){
            // console.log(key);
            let arry=[];
            titles.forEach((item)=>{
                // eslint-disable-next-line eqeqeq
                if(item.title==key){
                    for(let keys in item){
                        var pattern = new RegExp("[\u4E00-\u9FA5]+");
                        var patternNum = new RegExp("[0-9]+");
                        if(pattern.test(keys) || patternNum.test(keys)){
                            arry.push({label:keys,value: item[keys]})
                        }
                    }
                }
            })
            setDETAILlist(arry);
        }
    }

    function getItemContent(item){
        if(contentType === 2){
            return <Table
                rowKey={'row_index'}
                columns={item.data.tableName}
                dataSource={item.data.tableData}
                className={`antModalContent`}
                onRow={record => {
                    return {
                        onClick: () => {
                            interactData(record)
                        }, // 点击行
                    };
                }}
            />
        }else if(contentType === 3){
            return (
                <Descriptions title="" bordered column={1} contentStyle={{width:"80%"}} labelStyle={{width:"20%"} }>
                    {
                        DETAILlist?DETAILlist.map((item_part,index_part)=>{
                            if(typeof(item_part.value) === 'string'){
                                return(
                                    <Descriptions.Item label={item_part.label} key={index_part}>{item_part.value}</Descriptions.Item>
                                )
                            }else{
                                return null;
                            }
                        }):null
                    }
                </Descriptions>
            );
        }else{
            return (
                <Descriptions title="" bordered column={2} contentStyle={{width:"27%"}} labelStyle={{width:"13%"}}>
                    {
                        DETAILlist?DETAILlist.map((item_part,index_part)=>{
                            if(typeof(item_part.value) === 'string'){
                                return(
                                    <Descriptions.Item label={item_part.label} key={index_part}>{item_part.value}</Descriptions.Item>
                                )
                            }else{
                                return null;
                            }
                        }):null
                    }
                </Descriptions>
            );
        }
    }

    function getDomContent(){
        let boxTheme = '';
        if(contentType === 3){
            boxTheme = 'graph_content_three';
        }
        return <Tabs onChange={callbackModel} activeKey={Dtitles} className={`${boxTheme} antModalContent`}>
            {
                titles?titles.map ((item,index)=>(
                    <TabPane tab={item.title} key={item.title}>
                        <div style={{padding:"20px 0px",height:'60vh',width:'100%'}} className={'antModalContent'} >
                            <Scrollbars>
                                {getItemContent(item)}
                            </Scrollbars>
                        </div>
                    </TabPane>)):null
            }
        </Tabs>
    }

    return (
        <React.Fragment>
            <div id={engineid} style={{
                width: contentType === 3 ? "50%":"100%",height:"100%",position:"absolute"
            }} />
            {/* 等数据过来了，要改成，哪个字段存在，就展示哪个字段的内容 */}
            {contentType === 3 ? (
                <div style={{
                    width: "50%",height:"100%",position:"absolute",right:0
                }} >
                    {getDomContent()}
                </div>
            ):(
                <Modal className={'antModalContent'} width={'60vw'} style={{top:'15vh'}}  visible={modalImageStatus}   onCancel={()=>{setModalImageStatus(false)}}
                       footer={[
                           <Button key="back" onClick={()=>{setModalImageStatus(false)}} 
                           >
                               关 闭
                           </Button>
                       ]}>
                    {getDomContent()}
                </Modal>
            )}
        </React.Fragment>
    )
}

export default Template