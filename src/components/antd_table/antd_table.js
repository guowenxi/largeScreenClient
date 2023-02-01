import React from "react";
import {Table, ConfigProvider, Input, Button} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import ComponentBox from "../component_box";
import Emitter from "../../common/eventBus";

import cssStyle from "./antd_table.module.css";
import './antd_table.css';
import axios from "axios";
import {Scrollbars} from "react-custom-scrollbars";

import closeIcon from './image/close.svg';
import backIcon from './image/back.svg';
import {getCompatibleSizeList, interactData, getCompatibleSize} from "../../common/util";
import {Motion, spring} from "react-motion";
import {openMeeting} from "./operation";
import {fileUrl} from "../../config";
const { Search } = Input;
export default class AntdTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:[],hideData:[],loading:false,pagination:{current: 1, pageSize: 10, showQuickJumper:true, showSizeChanger:false, showTotal:total => `共 ${total} 项`},keyName:''};
        this.keyParams = {};
        this.columns = [];
        this.filteredValue = {};
        this.sortOrder = {};
        this.getCompatibleSizeList = getCompatibleSizeList.bind(this);
        this.interactData = interactData.bind(this);
        this.filterTextList = [];
        this.dateSearchType = ['','今日上报','本周上报','本月上报','本年上报'];
        this.dateType = ['','近7天','近1个月','近3个月','近12个月'];
    }

    //组件加载触发函数
    componentDidMount() {
        // axios.interceptors.request.use(function (config) {
        //     // 在发送请求之前做些什么
        //     if(config.method === 'get' && config.params){
        //         for(let key in config.params){
        //             config.params[key] = encodeURI(config.params[key]);
        //         }
        //     }
        //     return config;
        // }, function (error) {
        //     // 对请求错误做些什么
        //     return Promise.reject(error);
        // });
        // this.p = new Promise((resolve) => {this.getData(resolve)});
        const { firstLoad } = this.props.thisData;
        if(firstLoad){
            this.getData();
        }
        if(this.props.firstLoad === false){
            this.animateOn();
        }
        this.getColumns();
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.clearTimer){
            clearTimeout(this.clearTimer);
        }
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.updateTime !== this.props.thisData.updateTime){
            this.getColumns();
        }
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus && !this.props.thisData.showStatus){
            this.initialization();
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "showComponent":
                //显示当前组件
            // eslint-disable-next-line no-fallthrough
            case "changeKey" :
            case "dataInterchange" :
                if(!data.data.notInit){
                    //初始化请求条件
                    for(let key in this.filteredValue){
                        this.filteredValue[key] = [];
                    }
                }
                //修改请求条件
                for(let key in data.data){
                    if(typeof(data.data[key]) === 'object'){
                        this.filteredValue[key] = data.data[key];
                        // this.keyParams[key] = JSON.stringify(data.data[key]);
                    }else{
                        this.keyParams[key] = data.data[key];
                    }
                }
                //若为显示组件则显示
                if(data.type === 'showComponent'){
                    // const { style } = this.props.thisData;
                    // style.firstClick && this.rowClick({});
                    this.changeThisShow(true);
                }
                let {pagination} = this.state;
                pagination.current = 1;
                this.setState({pagination});
                this.getData();
                break;
            case "deleteKey":
                //删除请求条件
                delete this.keyParams[data.keyName];
                break;
            case "hideComponent":
                //隐藏组件
                this.changeThisShow(false);
                break;
            case "deselect":
                //取消当前选中
                break;
            case "reFresh":
                //刷新数据
                this.getData();
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
        this.setState({resultData:[]});
        this.getData();
    }

    //获取数据
    getData(resolve){
        if(this.clearTimer){
            clearTimeout(this.clearTimer);
        }
        this.setState({ loading: true });
        const { dataSources } = this.props.thisData;
        const {pagination} = this.state;
        const { style } = this.props.thisData;
        if(dataSources.dataType === 1){
            let defaultData = {};
            try {
                defaultData = JSON.parse(dataSources.defaultData);
            }catch (e) {
            }
            const listKey = style.listKey ? style.listKey : 'list';
            const countKey = style.countKey ? style.countKey : 'total';
            pagination.total = defaultData[countKey];
            const resultList = defaultData[listKey] ? defaultData[listKey] : [];
            resultList.forEach((resultItem,resultIndex)=>{
                resultItem.index_num = resultIndex+1;
                resultItem.all_index_num = (pagination.current-1)*pagination.pageSize+resultIndex+1;
            });
            this.setState({resultData:resultList,pagination,loading:false});
            if(resolve){
                resolve(defaultData);
            }
        }else if(dataSources.dataType === 2){
            let params = {};
            try {
                params = JSON.parse(dataSources.dataParams);
            }catch (e) {}
            if(this.sortOrder.order){
                if(style.orderByType === 1){
                    const key = this.sortOrder.column.orderKey ? this.sortOrder.column.orderKey : this.sortOrder.field;
                    params[key] = this.sortOrder.order === 'descend' ? 2 : 1;
                }else{
                    params.sortOrder = this.sortOrder.order === 'descend' ? -1 : 1;
                    params.sortField = this.sortOrder.column.orderKey ? this.sortOrder.column.orderKey : this.sortOrder.field;
                }
            }
            let url = dataSources.dataUrl;
            if(this.filteredValue){
                for(const key in this.filteredValue){
                    for(let i = 0;i < this.columns.length;i ++){
                        if(key === this.columns[i].key){
                            if(this.filteredValue[key].length > 0){
                                const sendKey = this.columns[i].selectKey ? this.columns[i].selectKey : key;
                                // params[sendKey] = encodeURI(JSON.stringify(this.filteredValue[key]));
                                // params[sendKey] = JSON.stringify(this.filteredValue[key]);
                                const partData = style.filterFormat !== 2 ? encodeURI(JSON.stringify(this.filteredValue[key])) : this.filteredValue[key].join(',');
                                if(url.indexOf('?') > 0){
                                    url += "&" + sendKey + '=' + partData;
                                }else{
                                    url += "?" + sendKey + '=' + partData;
                                }
                            }
                            break;
                        }
                    }
                }
            }
            if(style.searchKey){
                params[style.searchKey] = this.state.keyName;
            }else{
                params.keyWord = this.state.keyName;
            }
            axios.get(url,{params:{...params,...this.keyParams,pageNo:pagination.current,pageSize:pagination.pageSize,rbacToken:this.props.token}}).then((response) => {
                // 在这儿实现 setState
                const listKey = style.listKey ? style.listKey : 'list';
                const countKey = style.countKey ? style.countKey : 'total';
                const result = response.data.data;
                pagination.total = result[countKey];
                setTimeout(() => {
                    const resultList = result[listKey] ? result[listKey] : [];
                    resultList.forEach((resultItem,resultIndex)=>{
                        resultItem.index_num = resultIndex+1;
                        resultItem.all_index_num = (pagination.current-1)*pagination.pageSize+resultIndex+1;
                    });
                    this.setState({resultData:resultList,pagination,loading:false});
                    if(resultList.length > 0){
                        style.firstClick && this.rowClick(resultList[0]);
                    }
                },100);
                // if(resolve){
                //     resolve(result);
                // }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    //列样式初始化
    getColumns(){
        const { columns,pageSize,hideSizeChange,hideQuickJumper,simplePage } = this.props.thisData.style;
        columns.forEach((column,columnIndex) => {
            if(this.columns[columnIndex] == null){
                this.columns[columnIndex] = {...column,key:column.dataIndex,filters:[],width:column.width+'%',ellipsis:true,filteredValue:this.filteredValue[column.dataIndex], filterMultiple: !!column.filterMultiple};
                this.getColumnContent(column,this.columns[columnIndex]);
                this.getFilters(this.columns[columnIndex]);
            }else if(this.columns[columnIndex].updateTime !== column.updateTime){
                const oldColumn = {...this.columns[columnIndex]};
                this.columns[columnIndex] = {...column,key:column.dataIndex,filters:[],width:column.width+'%',ellipsis:true,filteredValue:this.filteredValue[column.dataIndex], filterMultiple: !!column.filterMultiple};
                this.getColumnContent(column,this.columns[columnIndex]);
                if(column.filterOpen){
                    if(oldColumn.filterType !== column.filterType || (column.filterType === 1 && oldColumn.filtersJson !== column.filtersJson)
                        || (column.filterType === 2 && oldColumn.filterUrl !== column.filterUrl)){
                        this.getFilters(this.columns[columnIndex]);
                    }else {
                        this.columns[columnIndex].filters = oldColumn.filters;
                    }
                }
            }
            if(!this.columns[columnIndex].dataIndex){
                this.columns[columnIndex].dataIndex = 'key'+columnIndex;
            }
        });
        let { pagination } = this.state;
        if(pageSize){
            pagination.pageSize = pageSize;
        }
        pagination.showSizeChanger = !hideSizeChange;
        pagination.showQuickJumper = !hideQuickJumper;
        pagination.simple = simplePage;
        this.columns.length = columns.length;
        this.columns.push({});
        this.setState({pagination});
    }

    //获取列筛选内容
    getFilters(column){
        if(column.filterOpen){
            if(column.filterType === 1){
                try{
                    column.filters = JSON.parse(column.filtersJson);
                }catch (e) {}
            }else{
                axios.get(column.filterUrl,{params:{rbacToken:this.props.token}}).then((response) => {
                    const result = response.data.data;
                    if(column.filterNameKey || column.filterValueKey){
                        const filters = [];
                        const nameKey = column.filterNameKey ? column.filterNameKey : 'text';
                        const numKey = column.filterValueKey ? column.filterValueKey : 'value';
                        result.forEach((item) => {
                           filters.push({
                               text : item[nameKey],
                               value : item[numKey],
                           })
                        });
                        column.filters = filters;
                    }else{
                        column.filters = result;
                    }
                    this.setState({});
                }).catch(function(error){
                    // 处理请求出错的情况
                });
            }
        }
    }

    //获取列内容
    getColumnContent(column,showColumn){
        if(column.contentType === 'operation'){
            this.getOperationContent(column,showColumn);
        }else{
            this.getFontContent(column,showColumn);
        }
    }

    //获取操作展示内容
    getOperationContent(column,showColumn){
        switch (column.operationType) {
            case 'ruian':
                showColumn.render = (data,record) => {
                    return (
                        <React.Fragment >
                            <div className={cssStyle.operationButton}>
                                <div className={cssStyle.operationName}>
                                    指派
                                </div>
                            </div>
                            <div className={cssStyle.operationButton} onClick={openMeeting.bind(this,record.id)}>
                                <div className={cssStyle.operationName}>
                                    <a href="dingtalkgov://dingtalkclient/page/link?url=https://shzl.ruian.gov.cn:8000/zwddPC&pc_slide=true" onClick={(e) => {
                                        e.stopPropagation()
                                    }}>
                                        开启会议
                                    </a>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                };
                break;
            case 'other':
                break;
            default:
        }
    }

    //获取文本展示内容
    getFontContent(column,showColumn){
        showColumn.render = (text,record) => {
            let fontColor;
            let imgUrl;
            if(column.dataType === 2){
                imgUrl = this.getImgUrl(column,record);
            }else{
                fontColor = this.getFontColor(column,text);
                if(column.dataType === 3){
                    imgUrl = this.getImgUrl(column,record);
                }
            }
            return (
                <React.Fragment>
                    {imgUrl && <img alt={''} src={fileUrl + '/download/' + imgUrl} className={cssStyle.img}/>}
                    {column.dataType !== 2 && <span style={{color:fontColor}}>{this.getText(column,text)}</span>}
                </React.Fragment>
            );
        }
    }

    //获取图片
    getImgUrl(column,record){
        const {imgKey,imgList} = column;
        if(imgKey && imgList){
            if(column.imgCalculateType === 1){
                for(let i = 0;i < imgList.length;i ++){
                    if(imgList[i].value+'' === record[imgKey]+''){
                        return imgList[i].img;
                    }
                }
            }else{
                for(let i = 0;i < imgList.length;i ++){
                    let moreType = true;
                    let lessType = true;
                    if(imgList[i].less != null && imgList[i].less !== "" && imgList[i].less <= record[imgKey]){
                        lessType = false;
                    }
                    if(imgList[i].more != null && imgList[i].more !== "" && imgList[i].more > record[imgKey]){
                        moreType = false;
                    }
                    if(moreType && lessType){
                        return imgList[i].color;
                    }
                }
            }
        }
        return null;
    }

    //获取颜色
    getFontColor(column,text){
        if(column.colorType === 2){
            if(column.calculateType === 1){
                for(let i = 0;i < column.calculateList.length;i ++){
                    if(column.calculateList[i].value == text){//eslint-disable-line
                        return column.calculateList[i].color;
                    }
                }
            }else if(column.calculateType === 2){
                for(let i = 0;i < column.calculateList.length;i ++){
                    let moreType = true;
                    let lessType = true;
                    if(column.calculateList[i].less != null && column.calculateList[i].less !== "" && column.calculateList[i].less <= text){
                        lessType = false;
                    }
                    if(column.calculateList[i].more != null && column.calculateList[i].more !== "" && column.calculateList[i].more > text){
                        moreType = false;
                    }
                    if(moreType && lessType){
                        return column.calculateList[i].color;
                    }
                }
            }
        }else{
            return null;
        }
    }

    getText(column,text){
        let returnText;
        if(column.formatter){
            try {
                // eslint-disable-next-line no-eval
                const formatter = eval(column.formatter);
                returnText = formatter(text);
            }catch (e) {
                returnText = text;
            }
        }else{
            returnText = text;
        }
        if(typeof(returnText) === 'object'){
            // console.log(returnText);
            return '';
        }else{
            return returnText;
        }
    }

    //获取筛选选中内容
    getFilteredValue(){
        const { style } = this.props.thisData;
        this.filterTextList = [];
        if(style.contentType === 2){
            if(this.keyParams.dateSearchType){
                this.filterTextList.push({
                    name:'日期',
                    value:this.dateSearchType[this.keyParams.dateSearchType]
                });
            }else if(this.keyParams.startTime && this.keyParams.endTime){
                this.filterTextList.push({
                    name:'日期',
                    value:this.keyParams.startTime.split(' ')[0] +'至'+ this.keyParams.endTime.split(' ')[0]
                });
            }else if(this.keyParams.dateType){
                this.filterTextList.push({
                    name:'日期',
                    value:this.dateType[this.keyParams.dateType]
                });
            }
        }
        this.columns.forEach((column) => {
            column.filteredValue = this.filteredValue[column.dataIndex];
            column.sortOrder = column.dataIndex === this.sortOrder.field && this.sortOrder.order;
            if(style.contentType === 2 && column.filteredValue && column.filteredValue.length > 0 && column.filters && column.filters.length > 0){
                let filterText = {name:column.title};
                let filterValue = [];
                column.filteredValue.forEach((value)=>{
                    for(let i = 0;i < column.filters.length;i ++){
                        if(column.filters[i].value+'' === value+''){
                            filterValue.push(column.filters[i].text);
                            break;
                        }
                    }
                });
                filterText.value = filterValue.join(',');
                this.filterTextList.push(filterText);
            }
        });
    }

    //排序筛选响应函数
    handleTableChange(pager, filters, sorter){
        this.filteredValue = filters;
        // if(filters){
        //     for(const key in filters){
        //         if(filters[key].length > 0){
        //             this.keyParams[key] = JSON.stringify(filters[key]);
        //         }else{
        //             delete this.keyParams[key];
        //         }
        //     }
        // }
        // this.keyParams = {...filters};
        if(sorter.order){
            this.sortOrder = {...sorter};
            // this.keyParams.sortField = sorter.field;
            // this.keyParams.sortOrder = sorter.order === 'descend' ? -1 : 1;
        }else{
            this.sortOrder = {};
            // delete this.keyParams.sortField;
            // delete this.keyParams.order;
        }
        const {pagination} = this.state;
        pagination.current = pager.current;
        pagination.pageSize = pager.pageSize;
        this.getData();
    }

    //修改搜索内容
    changeKeyName(event){
        this.setState({keyName:event.target.value});
    }

    //搜索数据
    searchData(){
        const {pagination} = this.state;
        pagination.current = 1;
        this.getData();
    }

    //行点击响应
    rowClick(record){
        const {dataSources} = this.props.thisData;
        if(dataSources.interact && dataSources.interact.length > 0){
            this.interactData(dataSources.interact,record);
        }
    }

    //当前组件显示隐藏
    changeThisShow(type,operateType){
        if(type === false){
            //若为关闭则清空筛选数据
            this.initialization();
            //通知关闭弹窗
            if(global.websocketId){
                global.bodyWebsocket.send(JSON.stringify([{"parameter":JSON.stringify({type:'hideWindow',data:global.moduleId}),"targetId":global.websocketSender+"_All_"}]));
            }
        }
        Emitter.emit('app_box', {
            type: 'changeComponentShowStatus',
            data: {showStatus: type, id: this.props.thisData.id}
        });
        if(operateType === 'close'){
            const {closeInteract} = this.props.thisData.style;
            this.interactData(closeInteract);
        }else if(operateType === 'back'){
            const {backInteract} = this.props.thisData.style;
            this.interactData(backInteract);
        }
    }

    //初始化内容
    initialization(){
        const { style } = this.props.thisData;
        if(!style.notInit){
            this.clearTimer = setTimeout(() => {
                const {pagination} = this.state;
                pagination.current = 1;
                // pagination.pageSize = 15;
                const { style } = this.props.thisData;
                if(!style.keepParams){
                    this.keyParams = {};
                }
                // this.filteredValue = {};
                this.sortOrder = {};
                this.setState({resultData:[],pagination,keyName:''});
            },500);
        }
    }

    clearFilter(){
        for(let key in this.filteredValue){
            this.filteredValue[key] = [];
        }
        this.keyParams = {};
        this.getData();
    }

    getHeadContent(){
        const { style } = this.props.thisData;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        if(style.contentType === 2){
            return (
                <React.Fragment>
                    <div className={cssStyle.contentOneHeadBox} style={{fontSize}}>
                        <div className={cssStyle.filterTextBox}>
                            <div>已筛选：</div>
                            {this.filterTextList.map((item,index)=>
                                <div key={index} className={cssStyle.filterItem}>
                                    <div className={cssStyle.filterTextName}>{item.name}为 </div>
                                    <div className={cssStyle.redColor}>{item.value}</div>
                                    {index < this.filterTextList.length - 1 && <div>、</div>}
                                </div>
                            )}
                        </div>
                        <div className={cssStyle.headRight}>
                            <div className={cssStyle.totalBox}>
                                共<span className={cssStyle.totalNum}>{this.state.pagination.total}</span>条事件
                            </div>
                            <div className={cssStyle.clearFilter} onClick={this.clearFilter.bind(this)}>清空</div>
                        </div>
                    </div>
                    <Search
                        style={{fontSize}}
                        className={cssStyle.searchInput}
                        placeholder="请输入事件名称或上报人"
                        onSearch={this.searchData.bind(this)}
                        onChange={this.changeKeyName.bind(this)}
                    />
                </React.Fragment>
            );
        }else{
            const searchWidth = this.props.getCompatibleSize(style.searchWidth);
            const searchHeight = this.props.getCompatibleSize(style.searchHeight);
            let searchStyle = {};
            style.searchLeft && (searchStyle.left = getCompatibleSize(style.searchLeft));
            style.searchRight && (searchStyle.right = getCompatibleSize(style.searchRight));
            return (
                <div className={cssStyle.keyNameBox} style={{fontSize,height: searchHeight}}>
                    <div style={searchStyle} className={cssStyle.searchBox}>
                        <Input value={this.state.keyName} onChange={this.changeKeyName.bind(this)} style={{width:searchWidth,height:searchHeight}}/>
                        <Button type="primary" icon="search" onClick={this.searchData.bind(this)}>搜索</Button>
                    </div>
                    {!style.hideClose && <img alt='' src={closeIcon} onClick={this.changeThisShow.bind(this,false,'close')}/>}
                    {style.hasBack && <img alt='' src={backIcon} onClick={this.changeThisShow.bind(this,false,'back')}/>}
                </div>
            );
        }
    }

    render() {
        const { style } = this.props.thisData;
        const searchHeight = this.props.getCompatibleSize(style.searchHeight);
        const headFontSize = this.props.getCompatibleSize(style.headFontSize);
        const contentFontSize = this.props.getCompatibleSize(style.contentFontSize);
        const padding = this.getCompatibleSizeList(style.padding);
        this.getFilteredValue();
        const expandedRowRender = style.descriptionKey ? record => <p style={{ margin: 0 }}>{record[style.descriptionKey]}</p> : null;
        const border = {borderStyle: style.borderStyle, borderWidth: style.borderWidth, borderColor: style.borderColor, borderRadius: style.borderRadius};
        return (
            <ComponentBox receiveMessage={this.receiveMessage.bind(this)} thisData={this.props.thisData}
                          reGetData={this.reGetData.bind(this)} style={this.props.style}
            >
                <Motion style={{top: spring(this.props.thisData.showStatus ? 0 : 100)}}>
                    {({top}) => {
                        return (
                            <div className={`${cssStyle.box} ${style.theme}`} style={{top: (style.formTop ? -top:0) + '%',backgroundColor:style.backgroundColor,padding:padding,...border}}>
                                {!style.hideSearch && this.getHeadContent()}
                                <ConfigProvider locale={zhCN}>
                                    <div className='antd-table-box' style={{height:`calc(100% - ${style.hideSearch ? 0 : searchHeight} - 6px)`}}>
                                        <Table
                                            style={{fontSize: headFontSize}}
                                            className='antd-table-component'
                                            columns={this.columns}
                                            rowKey={style.rowKey}
                                            dataSource={this.state.resultData}
                                            pagination={{...this.state.pagination}}
                                            expandedRowRender={expandedRowRender}
                                            onChange={this.handleTableChange.bind(this)}
                                        />
                                        <div className='antd-table-content-component' >
                                            <Scrollbars >
                                                <Table
                                                    style={{fontSize: contentFontSize}}
                                                    showHeader={false}
                                                    pagination={false}
                                                    columns={this.columns}
                                                    rowKey={style.rowKey}
                                                    rowClassName='row'
                                                    loading={this.state.loading}
                                                    dataSource={this.state.resultData}
                                                    expandedRowRender={expandedRowRender}
                                                    onRow={record => {
                                                        return {
                                                            onClick: this.rowClick.bind(this,record), // 点击行
                                                        };
                                                    }}
                                                />
                                            </Scrollbars>
                                        </div>
                                    </div>
                                </ConfigProvider>
                            </div>
                        );
                    }}
                </Motion>
            </ComponentBox>
        );
    }
}