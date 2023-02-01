import React from "react";
import cssStyle from "../map_window.module.css";
import cssStyleEventTwo from "./event_two.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import axios from "axios";
import {Scrollbars} from "react-custom-scrollbars";

export default class EventTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {detail:{},showDetail:false};
        this.colorList = ['','rgba(137,226,116,0.7)','rgba(255,204,0,0.7)','#ff0000'];
    }

    //组件加载触发函数
    componentDidMount() {
        this.loadData();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    loadData(){
        this.setState({bgTime:(new Date()).getTime()});
        const {attributes} = this.props;
        if(attributes.detailUrl){
            axios.get(attributes.detailUrl, { params: { rbacToken: this.props.token, id:attributes.id } }).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if (result) {
                    this.setState({ detail:result });
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    render() {
        const {detail} = this.state;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox} ${cssStyleEventTwo.box}`} style={{...this.props.style}}>
                <RectTypeThree className={cssStyle.boxBg} bgTime={this.state.bgTime} />
                <Scrollbars className={'eventListThreeBlueBar'}>
                    <div className={cssStyleEventTwo.contentBox}>
                        <div className={cssStyleEventTwo.title}>{detail.title}</div>
                        <div className={cssStyleEventTwo.content}>{detail.content}</div>
                        <div className={cssStyleEventTwo.row}>
                            <div>事件等级</div>
                            <div style={{color:this.colorList[detail.level]}} className={cssStyleEventTwo.rowContent}>{detail.levelName}</div>
                        </div>
                        <div className={cssStyleEventTwo.row}>
                            <div>事件类型</div>
                            <div className={cssStyleEventTwo.rowContent}>{detail.type}</div>
                        </div>
                        <div className={cssStyleEventTwo.row}>
                            <div>来源系统</div>
                            <div className={cssStyleEventTwo.rowContent}>{detail.source}</div>
                        </div>
                        <div className={cssStyleEventTwo.row}>
                            <div>发生地点</div>
                            <div className={cssStyleEventTwo.rowContent}>{detail.address}</div>
                        </div>
                        <div className={cssStyleEventTwo.row}>
                            <div>附件信息</div>
                            <div className={cssStyleEventTwo.rowContent}>
                                {detail.imgList && Array.isArray(detail.imgList) && detail.imgList.map((img,index)=>
                                    <img key={index} className={cssStyleEventTwo.img} src={img} alt={''} />
                                )}
                            </div>
                        </div>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}