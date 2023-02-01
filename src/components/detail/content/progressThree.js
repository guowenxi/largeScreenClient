import React from "react";
import cssStyle from "./progressThree.module.css";
import {Scrollbars} from "react-custom-scrollbars";
// import {Input} from "antd";
import "./eventListThree.css";

export default class ProgressThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {text:''};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    changeSend(e){
        this.setState({text:e.target.value});
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.contentBox}>
                    <Scrollbars className={'eventListThreeBlueBar'}>
                        {detail && Array.isArray(detail) && detail.map((item,index)=>
                            <div key={index} className={cssStyle.itemBox}>
                                <div className={cssStyle.content}>{item.content}</div>
                                <div className={cssStyle.textOne}>下达时间：{item.time}</div>
                                <div className={cssStyle.textOne}>下达街道：{item.street}</div>
                                <div className={cssStyle.textOne}>指令反馈：{item.feedback}</div>
                            </div>
                        )}
                    </Scrollbars>
                </div>
                {/* <div className={cssStyle.editBox}>
                    <Input value={this.state.text} onChange={this.changeSend.bind(this)} className={cssStyle.text} placeholder={'请输入交办内容'} />
                    <div className={cssStyle.sendButton}>发送</div>
                </div> */}
            </div>
        );
    }
}