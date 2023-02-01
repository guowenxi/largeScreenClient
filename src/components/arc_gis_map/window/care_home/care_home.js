import React from "react";
import cssStyle from "../map_window.module.css";
import cssStyleCareHome from "./care_home.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import axios from "axios";
import {interactData} from "../../../../common/util";

export default class CareHome extends React.Component {
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

    loadData(){
        const {attributes} = this.props;
        if(attributes.detailUrl){
            axios.get(attributes.detailUrl, { params: { rbacToken: this.props.token, id:attributes.id } }).then((response) => {
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

    showDetail(){
        const {attributes} = this.props;
        this.interactData(attributes.interactWindow,{ id:attributes.id });
    }

    render() {
        const {data} = this.state;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox} ${cssStyleCareHome.box}`} style={{...this.props.style}}>
                <RectTypeThree className={cssStyle.boxBg} bgTime={this.state.bgTime} />
                <div className={`${cssStyleCareHome.row} ${cssStyleCareHome.headRow}`}>
                    <span className={cssStyleCareHome.head}>{data.name}</span>
                    {/* eslint-disable-next-line eqeqeq */}
                    <span className={data.status == 1 ? cssStyleCareHome.green:cssStyleCareHome.red}>{data.statusName}</span>
                </div>
                <div className={cssStyleCareHome.row}>
                    地址：{data.address}
                </div>
                <div className={cssStyleCareHome.row}>
                    联系人：{data.contact+' '+data.phone}
                </div>
                <div className={cssStyleCareHome.line} />
                <div className={cssStyleCareHome.row}>
                    帮教人员：{data.relevantNum}名
                </div>
                <div className={cssStyleCareHome.row}>
                    专家能手：{data.expertNum}名
                </div>
                <div className={cssStyleCareHome.row}>
                    志愿者：{data.voluntterNum}名
                </div>
                <div className={cssStyleCareHome.detailButton} onClick={this.showDetail.bind(this)}>查看详情>></div>
            </div>
        );
    }
}