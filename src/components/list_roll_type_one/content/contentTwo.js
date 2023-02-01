import React from "react";
import cssStyle from "./contentTwo.module.css";

export default class ContentTwo extends React.Component {
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
        const {detail} = this.props;
        return (
            <div className={cssStyle.contentBox} style={this.props.style}>
                <img className={cssStyle.headImg} alt='' src={detail.headUrl ? detail.headUrl : ''}/>
                <div className={cssStyle.detailBox}>
                    <div className={cssStyle.detailItemBox}>
                        <div className={cssStyle.detailHead}>{'姓名'.split('').map((name,index)=>{return <span key={index}>{name}</span>})}</div>
                        <div className={cssStyle.detailContent}>{detail.name}</div>
                    </div>
                    <div className={cssStyle.detailItemBox}>
                        <div className={cssStyle.detailHead}>{'身份证'.split('').map((name,index)=>{return <span key={index}>{name}</span>})}</div>
                        <div className={cssStyle.detailContent}>{detail.idCard}</div>
                    </div>
                    <div className={cssStyle.detailItemBox}>
                        <div className={cssStyle.detailHead}>{'电话'.split('').map((name,index)=>{return <span key={index}>{name}</span>})}</div>
                        <div className={cssStyle.detailContent}>{detail.phone}</div>
                    </div>
                    <div className={cssStyle.detailItemBox}>
                        <div className={cssStyle.detailHead}>{'现住址'.split('').map((name,index)=>{return <span key={index}>{name}</span>})}</div>
                        <div className={cssStyle.detailContent}>{detail.address}</div>
                    </div>
                    <div className={cssStyle.detailItemBox}>
                        <div className={cssStyle.detailHead}>{'涉事类别'.split('').map((name,index)=>{return <span key={index}>{name}</span>})}</div>
                        <div className={cssStyle.detailContent}>{detail.eventType}</div>
                    </div>
                </div>
            </div>
        );
    }
}