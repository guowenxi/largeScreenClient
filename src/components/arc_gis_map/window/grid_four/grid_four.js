import React from "react";
import cssStyle from "../map_window.module.css";
import cssStyleGridFour from "./grid_four.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import axios from "axios";
import {interactData} from "../../../../common/util";

export default class GridFour extends React.Component {
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
            axios.get(attributes.dataUrl, { params: { rbacToken: this.props.token, roadId:attributes.adCode, operationType:'getGridDetail' } }).then((response) => {
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

    render() {
        const {data} = this.state;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox} ${cssStyleGridFour.box}`} style={{...this.props.style}}>
                <RectTypeThree className={cssStyle.boxBg} bgTime={this.state.bgTime} />
                <div className={cssStyleGridFour.row}>
                    <span className={cssStyleGridFour.head}>{data.name}</span>
                </div>
                <div className={cssStyleGridFour.line} />
                <div className={cssStyleGridFour.contentBox}>
                    {data.content && data.content.map((item,index)=>
                        <div className={cssStyleGridFour.partBox} key={index}>
                            <div className={cssStyleGridFour.title}>{item.name}:</div>
                            <div className={cssStyleGridFour.partContent}>{item.value}{item.unit}{item.subValue}{item.subUnit}</div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}