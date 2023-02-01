import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {emergencyFileUrl} from "../../config";

export default class ProgressContent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        let {progress} = this.props;
        return progress.map((item,index) =>{
            return (
                <div className={cssStyle.progressStepBox} key={index}>
                    <div className={cssStyle.progressStepPoint} />
                    <div className={cssStyle.progressStepLine} />
                    <div className={cssStyle.progressStepTime}>{item.createTime}</div>
                    <div className={cssStyle.progressStepContentBox}>
                        {item.handleMap && (
                            <React.Fragment>
                                <div className={cssStyle.progressStepTitle}>{item.handleMap.title}</div>
                                {item.handleMap.contentList && (
                                    item.handleMap.contentList.map((content,contentIndex)=>
                                        <div className={cssStyle.progressStepContent} key={contentIndex}>
                                            {content}
                                        </div>
                                    )
                                )}
                                {item.handleMap.fileList && (
                                    item.handleMap.fileList.map((file,fileIndex)=>
                                        <img src={emergencyFileUrl+file.fileId} alt={''} className={cssStyle.progressStepImg} key={fileIndex} />
                                    )
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </div>
            )
        });
    }
}