import React from "react";
import cssStyle from "./groupSelectOneNew.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { Button, Checkbox, Modal } from "antd";
import { emergencyUrl } from "../../../config";
import { interactData } from "../../../common/util";
export default class GroupSelectOneNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    selectGroup(group) {
        group.check = !group.check;
        this.setState({});
    }

    openMeeting() {
        let ids = [];
        const { detail } = this.props;
        if (detail && detail.length > 0) {
            detail.forEach((group) => {
                if (group && group.check) {
                    ids.push(group.id);
                }
            });
        }
        if (ids.length > 0) {
            window.location.href = `dingtalkgov://dingtalkclient/page/link?url=${encodeURIComponent(emergencyUrl + '/zwddPC?type=2&commandId=' + ids.join(','))}&pc_slide=true`;
        } else {
            Modal.error({
                content: '请选择指挥室！',
            });
        }
    }
    handleClickClose() {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, { emergencyId: this.props.keyParams });
    }
    render() {
        const { detail } = this.props;
        return (
            <div style={{ ...this.props.style, }} className={cssStyle.container}>
                <div className={cssStyle.top}>
                    <span className={cssStyle.title}>镇街指挥室</span>
                    <span className={cssStyle.closeIcon} onClick={this.handleClickClose.bind(this)}></span>
                </div>
                <div className={cssStyle.content}>
                    <div className={cssStyle.contentBox} >
                        <Scrollbars >
                            {detail && detail.map && detail.map((group, index) =>
                                <Checkbox
                                    key={index}
                                    checked={group.check}
                                    onClick={this.selectGroup.bind(this, group)}
                                    style={{marginTop: '0.5em'}}
                                >
                                    <span className={cssStyle.name}>{group.name + '-' + group.roadName}</span>
                                </Checkbox>
                            )}
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.buttonBox}>
                        <Button type="primary" className={cssStyle.button} onClick={this.openMeeting.bind(this)}>确定</Button>
                    </div>
                </div>
            </div>
        );
    }
}