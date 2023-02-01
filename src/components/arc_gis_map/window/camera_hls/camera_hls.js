import React from "react";
import cssStyle from "../map_window.module.css";
import cssStyleCameraHls from "./camera_hls.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import axios from "axios";
import VideoPlayerHls from "../../../camera_hls_new/videoPlayerHls";

export default class CameraHls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:''};
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
        if(prevProps.attributes.id !== this.props.attributes.id){
            //组件数据源变更时刷新数据
            this.loadData();
        }
    }

    loadData(){
        const {attributes} = this.props;
        if(attributes.detailUrl){
            let params = {rbacToken:this.props.token};
            const idKey = attributes.idKey ? attributes.idKey : 'id';
            params[idKey] = attributes[attributes.dataKey || 'id'];
            axios.get(attributes.detailUrl, { params }).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if (result) {
                    this.setState({ data:result.url },()=>{
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
        const {attributes} = this.props;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox} ${cssStyleCameraHls.box}`} style={{...this.props.style}}>
                <RectTypeThree className={cssStyle.boxBg} bgTime={this.state.bgTime} />
                <div className={cssStyleCameraHls.row}>
                    <span className={cssStyleCameraHls.head}>{attributes.name}</span>
                </div>
                <div className={cssStyleCameraHls.line} />
                <div className={cssStyleCameraHls.contentBox}>
                    {data && (
                        <VideoPlayerHls
                            url={data}
                            className={cssStyleCameraHls.videoBox}
                            id={attributes.id}
                        />
                    )}
                </div>
            </div>
        );
    }
}