import React from "react";
import cssStyle from "../map_window.module.css";
import cssStyleGridThree from "./grid_three.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import axios from "axios";
import {interactData} from "../../../../common/util";

export default class GridThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:{},showDetail:false};
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.loadData();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.attributes.adCode !== this.props.attributes.adCode){
            //组件数据源变更时刷新数据
            this.loadData();
        }
    }

    loadData(){
        const {attributes} = this.props;
        if(attributes.dataUrl){
            axios.get(attributes.dataUrl, { params: { rbacToken: this.props.token, orgCode:attributes.adCode } }).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if (result) {
                    this.setState({ data:result },()=>{
                        this.setState({bgTime:(new Date()).getTime()})
                    });
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    showMapDetail(){
        const {attributes} = this.props;
        this.interactData(attributes.interactShowMap,{ adCode:attributes.adCode });
    }

    showHomeDetail(id){
        const {attributes} = this.props;
        this.interactData(attributes.interactShowHome,{ id });
    }

    render() {
        const {data} = this.state;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox} ${cssStyleGridThree.box}`} style={{...this.props.style}}>
                <RectTypeThree className={cssStyle.boxBg} bgTime={this.state.bgTime} />
                <div className={cssStyleGridThree.row}>
                    <span className={cssStyleGridThree.head}>{data.name}</span>
                </div>
                {data.careHomeList && Array.isArray(data.careHomeList) && data.careHomeList.map((item,index)=>
                    <div className={`${cssStyleGridThree.row} ${cssStyleGridThree.homeRow}`} key={index}>
                        <div className={cssStyleGridThree.homeName}>{item.name}</div>
                        <div className={cssStyleGridThree.showButton} onClick={this.showHomeDetail.bind(this,item.id)}>查看详情>></div>
                    </div>
                )}
                <div className={cssStyleGridThree.line} />
                <div className={cssStyleGridThree.row}>
                    关爱对象：{data.particularNum}名
                </div>
                <div className={cssStyleGridThree.row}>
                    帮教人员：{data.relevantNum}名
                </div>
                <div className={cssStyleGridThree.row}>
                    专家能手：{data.expertNum}名
                </div>
                <div className={cssStyleGridThree.row}>
                    志愿者：{data.voluntterNum}名
                </div>
                <div className={cssStyleGridThree.detailButton} onClick={this.showMapDetail.bind(this)}>查看地图>></div>
            </div>
        );
    }
}