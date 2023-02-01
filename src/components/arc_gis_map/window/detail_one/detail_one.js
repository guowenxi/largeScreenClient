import React from "react";
import cssStyle from "../map_window.module.css";
import cssStyleCameraHls from "./detail_one.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import {Motion, spring} from "react-motion";
import {Icon} from "antd";
import {PhotoSlider} from "react-photo-view";

export default class DetailOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page:1,visible: false, photoIndex: 0, showList:[]};
    }

    //组件加载触发函数
    componentDidMount() {
        setTimeout(()=>{
            this.setState({bgTime:new Date().getTime()});
        })
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.attributes.id !== this.props.attributes.id){
            //组件数据源变更时刷新数据
            this.setState({page:1});
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    getImagePreview(){
        const { visible, showList, photoIndex } = this.state;
        const {attributes} = this.props;
        return (
            <PhotoSlider
                images={showList.map((item) => ({ src: (attributes.detailUrl || '')+item }))}
                visible={visible}
                onClose={() => this.setState({ visible: false })}
                onIndexChange={(index) => this.setState({ photoIndex: index })}
                index={photoIndex}
            />
        )
    }

    changePage(imgList,sub){
        let {page} = this.state;
        const newPage = page+sub;
        if(newPage > 0 && newPage <= imgList.length){
            this.setState({page:newPage});
        }
    }

    render() {
        const {attributes} = this.props;
        const imgList = attributes.img ? attributes.img.split(',') : [];
        const {page} = this.state;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox} ${cssStyleCameraHls.box}`} style={{...this.props.style}}>
                <RectTypeThree className={cssStyle.boxBg} bgTime={this.state.bgTime} />
                <div className={cssStyleCameraHls.row}>
                    <span className={cssStyleCameraHls.head}>{attributes.name}</span>
                </div>
                <div className={cssStyleCameraHls.line} />
                <div className={cssStyleCameraHls.contentBox}>
                    <Motion style={{page:spring(page)}}>
                        {({page}) =>
                            <div className={cssStyleCameraHls.imgAllBox} style={{width:imgList.length*100+'%',left:-100*(page-1)+'%'}}>
                                {imgList.map((img,index)=>
                                    <div className={cssStyleCameraHls.imgOneBox} style={{width:100/imgList.length+'%'}} key={index} >
                                        <img className={cssStyleCameraHls.img} alt={''} src={(attributes.detailUrl || '')+img} onClick={() => this.setState({ visible: true, photoIndex: index, showList: imgList })} />
                                    </div>
                                )}
                            </div>
                        }
                    </Motion>
                    <div className={cssStyleCameraHls.leftIconBox}>
                        <Icon type="left" className={`${cssStyleCameraHls.icon} ${page <= 1 ? cssStyleCameraHls.noPage:''}`} onClick={this.changePage.bind(this,imgList,-1)} />
                    </div>
                    <div className={cssStyleCameraHls.rightIconBox}>
                        <Icon type="right" className={`${cssStyleCameraHls.icon} ${page >= imgList.length ? cssStyleCameraHls.noPage:''}`} onClick={this.changePage.bind(this,imgList,1)}/>
                    </div>
                </div>
                {this.state.visible && this.getImagePreview()}
            </div>
        );
    }
}