import React from "react";
import cssStyle from "../map_window.module.css";
import cssStyleCareHome from "./detail_linan.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import axios from "axios";
import {interactData} from "../../../../common/util";
import {Button} from "antd";
export default class CareHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:{},trajectory:false};
        this.refDom = React.createRef();
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        // this.loadData();
        
        setTimeout(()=>{
          this.setState({bgTime:new Date().getTime()});
      })
        
        this.setState({bgTime:(new Date()).getTime()})
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
                    });
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    trajectory(){
      const {attributes} = this.props;
      this.interactData(attributes.interactWindow1,{ idCard:attributes.idCard, name: attributes.name, correctAddress: attributes.correctAddress });
    }

    // 签到历史
    signHistory() {
      const {attributes} = this.props;
      this.interactData(attributes.interactWindow2,attributes);
    }

    render() {
        const {attributes} = this.props;
        return (
            <div ref={this.refDom} className={`${cssStyle.box} ${cssStyle.themeOneBox} ${cssStyleCareHome.box}`} style={{...this.props.style}}>
                <RectTypeThree className={cssStyle.boxBg} bgTime={this.state.bgTime} />
                <div className={`${cssStyleCareHome.row} ${cssStyleCareHome.headRow}`}>
                    <span className={cssStyleCareHome.head}>{attributes.name}</span>
                    {/* eslint-disable-next-line eqeqeq */}
                    <span className={attributes.status == 1 ? cssStyleCareHome.green:cssStyleCareHome.red}>{attributes.statusName}</span>
                </div>
                <div className={cssStyleCareHome.row}>
                    司法所：{attributes.correctAddress}
                </div>
                <div className={cssStyleCareHome.row}>
                    地址：{attributes.address}
                </div>
                <div className={cssStyleCareHome.row}>
                    时间：{attributes.locationTime}
                </div>
                <div className={cssStyleCareHome.detailButton} >
                  <Button className={cssStyleCareHome.btn} size="small" type="primary" onClick={this.trajectory.bind(this)}>轨迹</Button>
                  <Button size="small" type="primary" onClick={this.signHistory.bind(this)}>签到历史</Button>
                </div>
            </div>
        );
    }
}