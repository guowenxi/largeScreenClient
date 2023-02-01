import React from "react";
import cssStyle from "./eventSix.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import {PhotoConsumer, PhotoProvider} from "react-photo-view";

export default class EventSix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(this.props.detail != null && prevProps.detail.id !== this.props.detail.id){
        }
    }

    // 判断文件格式
    switchFileType(type) {
        const thisType = ['image', 'video','png','jpg','gif','svg','mp4'].filter(item => type.includes(item));
        return thisType[0];
    }
    // 渲染视频和图片
    getEnclosureRender(eventFileList) {
        return (
            <PhotoProvider>
                {
                    Array.isArray(eventFileList) && eventFileList.map((item) => {
                        const type = this.switchFileType(item.type);
                        return (
                            type &&
                            <div key={item.id} className={cssStyle.fileItemBox}>
                                {['image','png','jpg','gif','svg'].indexOf(type) >= 0 && (
                                    <PhotoConsumer
                                        src={item.fullUrl}
                                        intro={item.fileName}
                                    >
                                        <img
                                            src={item.fullUrl}
                                            alt=""
                                            className={cssStyle.file}
                                            title={item.fileName}
                                        />
                                    </PhotoConsumer>
                                )}
                                {['video','mp4'].indexOf(type) >= 0 && (
                                    <video
                                        src={item.fullUrl}
                                        controls
                                        autoPlay
                                        className={cssStyle.file}
                                        title={item.fileName}
                                    />
                                )}
                                <span
                                    className={cssStyle.fileName}
                                    title={item.fileName}
                                >{item.fileName}</span>
                            </div>
                        )
                    })
                }
            </PhotoProvider>
        )
    }
    // 渲染文件
    getFileRender(eventFileList) {
        return (
            Array.isArray(eventFileList) && eventFileList.map((item) => {
                const type = this.switchFileType(item.type);
                return (
                    !type &&
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', width: '100%', marginRight: '0.5em' }}>
                        <span
                            title={item.fileName}
                        >{item.fileName}</span>
                        <div style={{ lineHeight: '1.5em', width: '5em', marginLeft: '0.5em' }}>
                            <a href={item.fullUrl}>点击下载</a>
                        </div>
                    </div>
                )
            })
        )
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.line} />
                <Scrollbars>
                    <div className={cssStyle.itemBox}>
                        {detail && Array.isArray(detail) && detail.map((item,index)=>
                            <div key={index} className={cssStyle.itemBox}>
                                <div className={cssStyle.head}>
                                    <div className={cssStyle.point} />
                                    <div>{item.createTime}</div>
                                </div>
                                <div className={cssStyle.row}>
                                    {item.dealType+'['+item.createUser+']'}
                                </div>
                                {item.content && (
                                    <React.Fragment>
                                        <div className={cssStyle.row}>内容：</div>
                                        <div className={cssStyle.row}>{item.content}</div>
                                    </React.Fragment>
                                )}
                                {item.attachFileList && item.attachFileList.length && (
                                    <React.Fragment>
                                        <div className={cssStyle.row}>附件：</div>
                                        <div className={cssStyle.row}>
                                            <div className={cssStyle.fileBox}>
                                                {this.getEnclosureRender(item.attachFileList)}
                                            </div>
                                            {this.getFileRender(item.attachFileList)}
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                        )}
                    </div>
                </Scrollbars>
            </div>
        );
    }
}