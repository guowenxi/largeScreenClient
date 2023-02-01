import React from "react";
import ReactDOM from "react-dom";
import {fileUrl} from "../../config";
import icon from "./images/num_bgimg.svg";

import {getCompatibleSize} from "../../common/util";

export default class PhoneOcx extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.bodyId = global.editType ? 'canvas-view' : 'root';
    }

    //组件加载触发函数
    componentDidMount() {
    }

     //props变更时触发函数
    componentDidUpdate(){
        
    }

    render() {
        const cssStyle=this.props.cssStyle
        const style=this.props.style
        const fontSize = getCompatibleSize(style.fontSize);
        const detail=this.props.detail
        return ReactDOM.createPortal(
            (
                <div style={{ position: 'absolute',display:this.props.showBox?'block':'none',zIndex:'999',pointerEvents:'none',width:style.boxWidth,height:style.boxHeight,left:style.boxLeft,top:style.boxTop ,fontSize:fontSize}}>
                    <div style={{ width: '0px', height: '0px', border: '20px solid transparent', borderBottomColor: style.triangleColor, position: "relative", top: style.triangleTop, left:this.props.number===1?style.triangleLeft:parseInt(style.triangleLeft)+5+'%' }} />
                    <div style={{ width: style.contentWidth, height: style.contentHeight, position: 'relative',pointerEvents:'auto', borderWidth:style.contentBorderWidth,borderColor:style.contentBorderColor,borderStyle:'solid',backgroundColor:style.contentColor }}>
                        <div className={cssStyle.managementBoxContent}>
                            <div style={{position:'relative',left:style.titleLeft,top:style.titleTop,fontSize:style.titleFontSize+'em',color:style.titleColor}}>{this.props.text}</div>
                            {detail && detail.fileId ?
                                <img alt='' src={detail.fileId.indexOf('http') >= 0 ? detail.fileId:fileUrl + '/download/' + detail.fileId} className={this.props.number !== 1 ? cssStyle.hidden : ''} /> : ''}
                            <ul className={`${cssStyle.textPlan} ${this.props.number !== 2 ? cssStyle.hidden : ''}`} >
                                {detail && detail.processList ?
                                    detail.processList.map((textItem, index) => {
                                        return (
                                            <li key={index}>
                                                <div className={cssStyle.indexTitle} style={{
                                                    backgroundImage: 'url(' + icon + ')'
                                                }}>{index + 1}</div>
                                                <div className={cssStyle.textContent}>{textItem.processContent}</div>
                                            </li>
                                        )
                                    }) : ''}
                            </ul>
                        </div>
                    </div>
                </div>
            ),
            document.getElementById(this.bodyId)
        );
    }
}