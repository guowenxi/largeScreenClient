import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Icon} from "antd";
// import ReactDOM from "react-dom";
import {PhotoSlider} from "react-photo-view";

export default class Detail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {page:1,fileList:[],imgList:[],videoList:[],full:false};
        this.refDom = React.createRef();
        this.bodyId = global.editType ? 'canvas-view' : 'root';
    }

    //组件加载触发函数
    componentDidMount() {
        this.initFileList();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props detailId变更时更新事件及监控点
    componentDidUpdate(prevProps){
        if(prevProps.id !== this.props.id){
            this.initFileList();
        }
    }

    initFileList(){
        const {pageList} = this.props;
        let fileList = [];
        let imgList = [];
        let videoList = [];
        pageList.forEach((file)=>{
            if(file.fileType){
                if(file.fileType.indexOf('image') >= 0){
                    fileList.push(file);
                    imgList.push(file);
                }else if(file.fileType.indexOf('video') >= 0){
                    fileList.push(file);
                    videoList.push(file);
                }
            }
        });
        this.setState({fileList,imgList,videoList});
    }

    changePage(sub){
        let {page,fileList} = this.state;
        const newPage = page+sub;
        if(newPage > 0 && newPage <= fileList.length){
            this.setState({page:newPage});
        }
    }

    // changeFull(e){
    //     e.stopPropagation();
    //     const flag = !this.state.full;
    //     this.setState({full:flag});
    //     const {id} = this.props;
    //     if(flag){
    //         document.getElementById('bodyBox_'+id).appendChild(this.refDom.current);
    //     }else{
    //         document.getElementById('smallBox_'+id).appendChild(this.refDom.current);
    //     }
    // }

    getImagePreview(){
        const { visible, photoIndex, imgList } = this.state;
        const {emergencyFileUrl} = this.props;
        if(imgList){
            return (
                <PhotoSlider
                    images={imgList.map((item) => ({ src: emergencyFileUrl+item.fileId }))}
                    visible={visible}
                    onClose={() => this.setState({ visible: false })}
                    onIndexChange={(index) => this.setState({ photoIndex: index })}
                    index={photoIndex}
                />
            )
        }else{
            return null;
        }
    }

    render() {
        const {emergencyFileUrl,id} = this.props;
        const {page,fileList,imgList,videoList} = this.state;
        if(imgList.length+videoList.length === 0){
            return (
                <div className={cssStyle.feedbackNoPic}>
                    <Icon type="picture" className={cssStyle.noPicIcon}/>
                    <div>暂无图片</div>
                </div>
            )
        }
        return (
            <div className={cssStyle.feedbackFileAllBox} id={'smallBox_'+id}>
                {/*<div className={cssStyle.feedbackFileAllBox} ref={this.refDom} onDoubleClick={this.changeFull.bind(this)}>*/}
                <div className={cssStyle.feedbackFileAllBox} ref={this.refDom} >
                    <Motion style={{page:spring(page)}}>
                        {({page}) =>
                            <div style={{left:-(page-1)*100+'%',width:fileList.length*100+'%'}} className={cssStyle.feedbackFileAll} >
                                {/*{fileList.map((file,index)=>{*/}
                                {/*    if(file.fileType && file.fileType.indexOf('image') >= 0){*/}
                                {/*        return <img alt={''} src={emergencyFileUrl+file.fileId} key={index} className={cssStyle.feedbackFile} style={{width:100/fileList.length+'%'}} />;*/}
                                {/*    }else{*/}
                                {/*        return (*/}
                                {/*            <video controls className={cssStyle.feedbackFile} key={index} style={{width:100/fileList.length+'%'}} >*/}
                                {/*                <source src={emergencyFileUrl+file.fileId} type={file.fileType} />*/}
                                {/*            </video>*/}
                                {/*        )*/}
                                {/*    }*/}
                                {/*})}*/}
                                {imgList.map((file,index)=>
                                    <img
                                        alt={''}
                                        src={emergencyFileUrl+file.fileId} key={index}
                                        className={cssStyle.feedbackFile}
                                        style={{width:100/fileList.length+'%'}}
                                        onClick={()=>this.setState({visible:true,photoIndex:index})}
                                    />
                                )}
                                {videoList.map((file,index)=>
                                    <video src={emergencyFileUrl+file.fileId} controls className={cssStyle.feedbackFile} key={index} style={{width:100/fileList.length+'%'}}/>
                                )}
                            </div>
                        }
                    </Motion>
                    <div className={cssStyle.feedbackLeftIconBox}>
                        <Icon type="left" className={`${cssStyle.feedbackIconOne} ${page <= 1 ? cssStyle.noPage:''}`} onClick={this.changePage.bind(this,-1)} />
                    </div>
                    <div className={cssStyle.feedbackRightIconBox}>
                        <Icon type="right" className={`${cssStyle.feedbackIconOne} ${page >= fileList.length ? cssStyle.noPage:''}`} onClick={this.changePage.bind(this,1)}/>
                    </div>
                </div>
                {/*{ReactDOM.createPortal(*/}
                {/*    (*/}
                {/*        <div id={'bodyBox_'+id} className={`${cssStyle.bodyBox} ${this.state.full ? cssStyle.show:cssStyle.hide}`} />*/}
                {/*    ),*/}
                {/*    document.getElementById(this.bodyId)*/}
                {/*)}*/}
                {this.state.visible && this.getImagePreview()}
            </div>
        );
    }
}