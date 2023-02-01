import React from "react";
import cssStyle from "./eventOne.module.css";
import {Scrollbars} from "react-custom-scrollbars";

export default class EventOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedIndex:0,fileId:''};
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
            //详情变更时切换选中图片
            this.setState({selectedIndex:0})
        }
    }

    changeImage(index){
        this.setState({selectedIndex:index});
    }

    render() {
        const {detail,styleData} = this.props;
        const {selectedIndex} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <table className={cssStyle.content}>
                    <tbody>
                    <tr>
                        <td className={cssStyle.trTitle}>事件名称：</td>
                        <td className={cssStyle.trContent} colSpan={3}>{detail.title}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>所属指标：</td>
                        <td className={cssStyle.trContent}>{detail.target}</td>
                        <td className={cssStyle.trTitle}>事件级别：</td>
                        <td className={cssStyle.trContent}>{detail.level}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>事发时间：</td>
                        <td className={cssStyle.trContent}>{detail.time}</td>
                        <td className={cssStyle.trTitle}>所属街道：</td>
                        <td className={cssStyle.trContent}>{detail.road}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>详细地址：</td>
                        <td className={cssStyle.trContent} colSpan={3}>{detail.address}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.trTitle}>附件信息：</td>
                        <td className={cssStyle.trContent} colSpan={3}>
                            {detail.fileList && detail.fileList.map((file,index) =>
                                <span key={index} className={cssStyle.fileName}>{file.name}</span>
                            )}
                        </td>
                    </tr>
                    <tr style={{height:'40%'}}>
                        <td className={cssStyle.trTitle} valign='top'>问题描述：</td>
                        <td className={cssStyle.trContent} colSpan={3}>
                            <Scrollbars>{detail.content}</Scrollbars>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className={cssStyle.imageBox}>
                    {detail.imgList && detail.imgList[selectedIndex] && <img className={cssStyle.image} alt='' src={styleData.fileUrl + detail.imgList[selectedIndex].id}/>}
                </div>
                <div className={cssStyle.buttonBox}>
                    {detail.imgList && detail.imgList.map((item,index)=>
                        <div key={index} onClick={this.changeImage.bind(this,index)} className={`${cssStyle.button} ${this.state.selectedIndex === index ? cssStyle.selected:''}`}>{index+1}</div>
                    )}
                </div>
            </div>
        );
    }
}