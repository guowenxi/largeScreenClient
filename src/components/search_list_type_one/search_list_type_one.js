import React from 'react';
// import Emitter from '../../common/eventBus';
// import Util from '../../common/util';
import axios from 'axios';
// import { Motion, StaggeredMotion, spring } from 'react-motion';
import { Form, Row, Col, Select, Button} from 'antd';
// import ListWithTitle from "../list_with_title/list_with_title";
import TableList from "../table_list/table_list";

import ComponentBox from "../component_box";

import cssStyle from './search_list_type_one.module.css';
import {fileUrl} from "../../config";

export default class SearchListTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,isAnimate:false,resultData:[],maxNum:0,searchResult:{searchType:0},searchDataList:[]};
        this.keyParams = {};
    }

    //组件加载触发函数
    componentDidMount() {
        this.getData();
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件数据更新时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.updateTime !== this.props.thisData.updateTime){
            //组件数据源变更时刷新数据
            this.getData();
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey" :
                //修改请求条件
                this.keyParams[data.keyName] = data.data;
                this.reGetData();
                break;
            case "deleteKey":
                //删除请求条件
                delete this.keyParams[data.keyName];
                break;
            case "deselect":
                //取消当前选中
                break;
            case "showPart":
                //显示当前组件
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn(){
    }

    //重新获取数据
    reGetData(){

    }

    //获取数据
    getData(){
        const { searchList } = this.props.thisData.style;
        const { searchDataList } = this.state;
        searchList.forEach((search,searchIndex) => {
            if(searchDataList[searchIndex] == null){
                //若为未获取过的数据则直接添加
                searchDataList[searchIndex] = [];
                search.keyList.forEach((item,index) => {
                    searchDataList[searchIndex][index] = {updateTime:item.updateTime};
                    this.getSearchData(item,searchDataList,searchIndex,index);
                });
            }else{
                search.keyList.forEach((item,index) => {
                    if(searchDataList[searchIndex][index] == null){
                        //若为未获取过的数据则直接添加
                        searchDataList[searchIndex][index] = {updateTime:item.updateTime};
                        this.getSearchData(item,searchDataList,searchIndex,index);
                    }else{
                        //若已获取过则根据updateTime判断是否需要更新
                        if(item.updateTime !== searchDataList[searchIndex][index].updateTime){
                            this.getSearchData(item,searchDataList,searchIndex,index);
                        }
                    }
                });
            }
        });
    }

    //获取搜索条件数据
    getSearchData(item,searchDataList,searchIndex,index){
        searchDataList[searchIndex][index].data = [];
        if(item.dataType === 1){
            try {
                searchDataList[searchIndex][index].data = JSON.parse(item.data);
            }catch (e) {}
            this.setState({searchDataList});
        }else if(item.dataType === 2){
            axios.get(this.props.thisData.dataSources.dataUrl).then((response) => {
                // 在这儿实现 setState
                searchDataList[searchIndex][index].data = response.data.data;
                this.setState({searchDataList});
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    changeSearchData(key,valueType,event){
        let { searchResult } = this.state;
        searchResult[key] = valueType === 1 ? event.target.value : event;
        this.setState({searchResult});
    }

    getSearchList(){
        const { style } = this.props.thisData;
        const { searchList } = style;
        const { searchResult } = this.state;
        let children = [];
        const span = 24/style.columnNum;
        children.push(
            <Col span={span} style={{ display: searchList.length > 1 ? 'block' : 'none' }} key='name'>
                <Form.Item label='搜索类型'>
                    <Select value={this.state.searchResult.searchType}
                            onChange={this.changeSearchData.bind(this,'searchType',2)}>
                        {searchList.map((item,index) =>
                            <Select.Option value={index} key={index}>{item.name}</Select.Option>
                        )}
                    </Select>
                </Form.Item>
            </Col>
        );
        searchList.forEach((search,searchIndex) => {
            search.keyList.forEach((item,keyIndex) => {
                let searchData = [];
                if(this.state.searchDataList && this.state.searchDataList[searchIndex] && this.state.searchDataList[searchIndex][keyIndex] && this.state.searchDataList[searchIndex][keyIndex].data){
                    searchData = this.state.searchDataList[searchIndex][keyIndex].data;
                }
                children.push(
                    <Col key={searchIndex+' '+keyIndex} span={span} style={{ display: searchIndex === searchResult.searchType ? 'block' : 'none' }}>
                        <Form.Item label={item.name}>
                            <Select value={searchResult[item.key]}
                                    onChange={this.changeSearchData.bind(this,item.key,2)}>
                                {searchData.map((select,i) =>
                                    <Select.Option value={select.value} key={i}>{select.label}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                    </Col>
                );
            });
        });
        return children;
    }

    clickItem(clickItem){

    }

    render() {
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 16}
        };
        const { style } = this.props.thisData;
        const gutter = [this.props.getCompatibleSize(style.columnGap,'num'),this.props.getCompatibleSize(style.rowGap,'num')];
        const { searchType } = this.state.searchResult;
        const listData = {
            id: this.props.thisData.id + '_list_result',
            style: { ...style.listStyle, column:style.searchList[searchType].column},
            dataSources: this.props.thisData.dataSources.listDataSources
        };
        return (
            <ComponentBox
                className={cssStyle.searchAllBox}
                receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData}
                style={{backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage ? 'url('+fileUrl+'/download/'+style.backgroundImage+')' : 'none'}}
            >
                <Form {...formItemLayout} className={cssStyle.searchBox}>
                    <Row gutter={gutter}>
                        {this.getSearchList()}
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit" onClick={this.clickItem.bind(this)}>
                                搜索
                            </Button>
                            <Button style={{ marginLeft: 8 }} >
                                清空
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <div className={cssStyle.listBox} >
                    <TableList thisData={listData} getCompatibleSize={this.props.getCompatibleSize} firstLoad={this.props.firstLoad} />
                </div>
            </ComponentBox>
        );
    }
}
