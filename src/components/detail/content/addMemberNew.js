/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./addMemberNew.module.css";
import './addMemberNew.css';
import { Modal, Tree, } from "antd";
import axios from "axios";
import { emergencyUrl } from "../../../config";
import { Scrollbars } from "react-custom-scrollbars";


import { interactData } from "../../../common/util";
const { TreeNode } = Tree;
export default class AddMemberNew extends React.Component {
    constructor(props) {
        super(props);
        this.state = { departmentList: [], memberList: [], departmentValue: '', memberValue: '', };
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.getDepartmentList();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps,) {
        if (prevProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            this.getDepartmentList();
        }
    }
    // 获取部门列表
    getDepartmentList() {
        const url = emergencyUrl + '/rbac/fyDepartment/getDeptTreeNew';
        axios.get(url, { params: { rbacToken: this.props.token, treeType: 1, } })
            .then((res) => {
                const { success, data } = res.data;
                if (success) {
                    this.setState({ departmentList: data });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
    // 获取成员列表
    getMemberList(id) {
        const url = emergencyUrl + '/socialGovernance/dingUser/getListByDepartId';
        axios.get(url, { params: { rbacToken: this.props.token, departId: id } })
            .then((res) => {
                const { success, data } = res.data;
                if (success) {
                    this.setState({ memberList: data });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
    // 选中部分获取成员
    handleClickSelect(key) {
        this.getMemberList(key[0])
    }
    // 添加成员
    handleClickAddMember(selectedIndex) {
        const url = emergencyUrl + '/socialGovernance/YQemergencyProcess/emergencyOperate';
        const { memberList, } = this.state;
        const { departmentId, userId } = memberList[selectedIndex];
        const depUserList = [{ depId: departmentId, userIds: [userId] }];
        const sendData = { rbacToken: this.props.token, emergencyId: this.props.keyParams.emergencyId, operationType: 104, depUserList };
        axios.post(url, sendData, { params: { rbacToken: this.props.token } })
            .then((res) => {
                const { success, message } = res.data;
                if (success) {
                    this.handleClickInteract('complete');
                    Modal.success({
                        content: '添加成功',
                    });
                } else {
                    Modal.error({
                        content: message,
                    })
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }
    handleClickInteract(type) {
        const { style } = this.props.thisData;
        const interact = style[`${type}Interact`];
        this.interactData(interact, { emergencyId: this.props.keyParams.emergencyId });
    }
    renderTreeNodes = data => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item} style={{ color: '#fff' }}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} {...item} />;
        });
    }
    render() {
        const { departmentList, memberList, } = this.state;
        return (
            <div style={{ ...this.props.style }} className={`${cssStyle.container} addMemberNewBox`} >
                <div className={cssStyle.top}>
                    <span className={cssStyle.title}>添加人员</span>
                    <span className={cssStyle.closeIcon} onClick={this.handleClickInteract.bind(this, 'close')}></span>
                </div>
                <div className={cssStyle.content}>
                    <div className={cssStyle.leftBox}>
                        <div className={cssStyle.headerBox}>部门</div>
                        <Scrollbars style={{ height: 'calc(100% - 5em)' }}>
                            {departmentList && <Tree
                                checkable
                                style={{ color: '#fff' }}
                                onSelect={this.handleClickSelect.bind(this)}
                            >
                                {this.renderTreeNodes(departmentList)}
                            </Tree>}
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.rightBox}>
                        <div className={cssStyle.headerBox}>人员</div>
                        <Scrollbars style={{ height: 'calc(100% - 5em)' }}>
                            {
                                memberList.length > 0 && memberList.map((item, index) => {
                                    return (
                                        <div className={cssStyle.memberBox} key={item.userId}>
                                            <div>{item.userName}</div>
                                            <div className={cssStyle.addButton} onClick={this.handleClickAddMember.bind(this, index)}>添加</div>
                                        </div>
                                    )
                                })
                            }
                        </Scrollbars>
                    </div>
                </div>
            </div>
        );
    }
}