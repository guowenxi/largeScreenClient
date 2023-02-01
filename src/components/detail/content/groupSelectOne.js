import React from "react";
import cssStyle from "./groupSelectOne.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {Button, Checkbox, Modal} from "antd";
import {emergencyUrl} from "../../../config";

export default class GroupSelectOne extends React.Component {
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

    selectGroup(group){
        group.check = !group.check;
        this.setState({});
    }

    openMeeting(){
        let ids = [];
        const {detail} = this.props;
        if(detail && detail.length > 0){
            detail.forEach((group)=>{
                if(group && group.check){
                    ids.push(group.id);
                }
            });
        }
        if(ids.length > 0){
            window.location.href = `dingtalkgov://dingtalkclient/page/link?url=${encodeURIComponent(emergencyUrl + '/zwddPC?type=2&commandId='+ids.join(','))}&pc_slide=true`;
        }else{
            Modal.error({
                content: '请选择指挥室！',
            });
        }
    }

    render() {
        const { style } = this.props.thisData;
        const {detail} = this.props;
        return (
            <div
                className={`${cssStyle.box}`}
                style={{ ...this.props.style, backgroundColor: style.bgColor }}
            >
                <div className={cssStyle.contentBox} >
                    <Scrollbars >
                        {detail && detail.map && detail.map((group,index)=>
                            <Checkbox
                                key={index}
                                checked={group.check}
                                onClick={this.selectGroup.bind(this,group)}
                            >
                                <span className={cssStyle.name}>{group.name+'-'+group.roadName}</span>
                            </Checkbox>
                        )}
                    </Scrollbars>
                </div>
                <div className={cssStyle.buttonBox}>
                    <Button type="primary" className={cssStyle.button} onClick={this.openMeeting.bind(this)}>确定</Button>
                </div>
            </div>
        );
    }
}