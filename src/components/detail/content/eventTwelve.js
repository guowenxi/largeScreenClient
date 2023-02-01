import React from "react";
import cssStyle from './eventEight.module.css';

export default class EventEight extends React.Component {
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

    render() {
        const { detail,styleData } = this.props;
        if (detail == null) {
            return '';
        }
        return (
            <div style={this.props.style} className={`${cssStyle.box}`} >
                <div className={cssStyle.row}>
                    <span className={cssStyle.title}>举报楼盘：</span>
                    <span>{detail.buildingName}</span>
                </div>
                <div className={cssStyle.row}>
                    <span className={cssStyle.title}>楼盘开发商：</span>
                    <span>{detail.devName}</span>
                </div>
                <div className={cssStyle.row}>
                    <span className={cssStyle.title}>举报原因：</span>
                    <span>{detail.complaintsAppeal}</span>
                </div>
                <div className={cssStyle.row}>
                    <span className={cssStyle.title}>举报内容：</span>
                    <span>{detail.complaintContent}</span>
                </div>
                <div className={cssStyle.row}>
                    <span className={cssStyle.title}>举报时间：</span>
                    <span>{detail.complaintsTime}</span>
                </div>
                <div className={cssStyle.row}>
                    <span className={cssStyle.title}>证据截图：</span>
                    <div className={cssStyle.imgBox}>
                        {detail.fileVoList && detail.fileVoList.map((item,index)=>
                            <img alt={''} src={styleData.fileServiceUrl+item.url} key={index} className={cssStyle.img} />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}