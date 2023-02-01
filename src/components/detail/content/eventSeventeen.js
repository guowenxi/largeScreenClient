import React from "react";
import cssStyle from "./eventSeventeen.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import "./eventListThree.css";

export default class EventSeventeen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.colorList = ['','rgba(137,226,116,0.7)','rgba(255,204,0,0.7)','#ff0000'];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <Scrollbars className={'eventListThreeBlueBar'}>
                    <div className={cssStyle.contentBox}>
                        <div className={cssStyle.title}>{detail.title}</div>
                        <div className={cssStyle.content}>{detail.content}</div>
                        <div className={cssStyle.row}>
                            <div>事件等级</div>
                            <div style={{color:this.colorList[detail.level]}} className={cssStyle.rowContent}>{detail.levelName}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div>事件类型</div>
                            <div className={cssStyle.rowContent}>{detail.type}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div>来源系统</div>
                            <div className={cssStyle.rowContent}>{detail.source}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div>发生地点</div>
                            <div className={cssStyle.rowContent}>{detail.address}</div>
                        </div>
                        <div className={cssStyle.row}>
                            <div>附件信息</div>
                            <div className={cssStyle.rowContent}>
                                {detail.imgList && Array.isArray(detail.imgList) && detail.imgList.map((img,index)=>
                                    <img key={index} className={cssStyle.img} src={img} alt={''} />
                                )}
                            </div>
                        </div>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}