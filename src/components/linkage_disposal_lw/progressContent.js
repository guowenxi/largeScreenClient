import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {PhotoSlider} from "react-photo-view";

export default class ProgressContent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {visible:false};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    getFileList(files,emergencyFileUrl){
        let imgList = [];
        let videoList = [];
        let otherList = [];
        files.forEach((file)=>{
            if(file.fileType){
                if(file.fileType.indexOf('image') >= 0){
                    imgList.push(file);
                }else if(file.fileType.indexOf('video') >= 0){
                    videoList.push(file);
                }else{
                    otherList.push(file);
                }
            }else{
                otherList.push(file);
            }
        });
        return (
            <React.Fragment>
                {imgList.map((img,imgIndex)=>
                    <img src={emergencyFileUrl+img.fileId} alt={''} className={cssStyle.progressStepImg} key={imgIndex} onClick={()=>this.setState({visible:true,imgList,photoIndex:imgIndex})} />
                )}
                {videoList.map((video,videoIndex)=>
                    <video src={emergencyFileUrl+video.fileId} controls className={cssStyle.progressStepImg} key={videoIndex} />
                )}
                {otherList.map((word,wordIndex)=>
                    <div className={cssStyle.progressStepFileBox} key={wordIndex}>
                        <div className={cssStyle.fileName}>{word.fileName}</div>
                        <div className={cssStyle.download} onClick={()=>window.open(emergencyFileUrl+word.fileId)}>下载</div>
                    </div>
                )}
            </React.Fragment>
        )
    }

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
        let {progress,emergencyFileUrl} = this.props;
        return (
            <React.Fragment>
                {progress.map((item,index) =>{
                    return (
                        <div className={cssStyle.progressStepBox} key={index}>
                            <div className={cssStyle.progressStepPoint} />
                            <div className={cssStyle.progressStepLine} />
                            <div className={cssStyle.progressStepTime}>{item.handleTime}</div>
                            <div className={cssStyle.progressStepContentBox}>
                                <div className={cssStyle.progressStepTitle}>{item.handleStep}</div>
                                <div className={cssStyle.progressStepContent}>
                                    {item.handleContent}
                                </div>
                                {/*{item.handleFileIds && (*/}
                                {/*    item.handleFileIds.split(',').map((file,fileIndex)=>*/}
                                {/*        <img src={emergencyFileUrl+file} alt={''} className={cssStyle.progressStepImg} key={fileIndex} />*/}
                                {/*    )*/}
                                {/*)}*/}
                                {this.getFileList(item.handleFileList,emergencyFileUrl)}
                            </div>
                        </div>
                    )
                })}
                {this.state.visible && this.getImagePreview()}
            </React.Fragment>
        )
    }
}