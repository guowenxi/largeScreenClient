/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./addMember.module.css";
import { Motion, spring } from "react-motion";
// eslint-disable-next-line no-unused-vars
import { Checkbox, Icon, Button, Modal, Tree, Input } from "antd";
import axios from "axios";
import { emergencyUrl } from "../../../config";
import { Scrollbars } from "react-custom-scrollbars";


import { interactData } from "../../../common/util";
const { TreeNode } = Tree;
export default class PowerEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = { departmentList: [], memberList: [], departmentValue: '', memberValue: '', emergencyId: '', };
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
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.getDataTime !== this.props.getDataTime) {
            this.setState({ emergencyId: prevProps.keyParams.emergencyId });
        }
    }
    // 获取部门列表
    getDepartmentList() {
        const url = emergencyUrl + '/rbac/fyDepartment/getDeptTreeNew';
        axios.get(url, { params: { rbacToken: this.props.token, treeType: 1, } }).then((res) => {
            const { data } = res.data;
            this.setState({ departmentList: data },)
        }).catch(function (e) {
            // 处理请求出错的情况
            console.log(e)
        });
    }
    // 获取成员列表
    getMemberList(id) {
        const url = emergencyUrl + '/socialGovernance/dingUser/getListByDepartId';
        axios.get(url, { params: { rbacToken: this.props.token, departId: id } }).then((res) => {
            const { data } = res.data;
            this.setState({ memberList: data })
        }).catch(function (e) {
            // 处理请求出错的情况
            console.log(e)
        });
    }
    // 选中部分获取成员
    handleClickSelect(key,) {
        this.getMemberList(key[0])
    }
    // 更改搜索内容
    handleChangeValue(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    handleEnterKey(e) {
        const code = e.keyCode || e.which;
        if (code === 13) {
            this.getValueList(e.target.name);
        }
    }
    // 添加成员
    handleClickAddMember(selectedIndex) {
        const url = emergencyUrl + '/socialGovernance/YQemergencyProcess/emergencyOperate';
        const { memberList, emergencyId } = this.state;
        const { departmentId, userId } = memberList[selectedIndex];
        const depUserList = [{ depId: departmentId, userIds: [userId] }];
        const sendData = { rbacToken: this.props.token, emergencyId, operationType: 104, depUserList };
        axios.post(url, sendData,).then((res) => {
            if (res.data.success) {
                Modal.success({
                    content: '添加成功',
                })
            } else {
                Modal.error({
                    content: res.data.message,
                })
            }
        }).catch(function (e) {
            // 处理请求出错的情况
            console.log(e)
        });
    }
    // 获取搜索结果
    getValueList(type) {
        const url = type === 'departmentValue' ? '/rbac/fyDepartment/getFyDepartmentList' : '/socialGovernance/dingUser/getListByName';
        const { departmentValue, memberValue } = this.state;
        const params = type === 'department' ? { name: departmentValue, pageNo: 1, pageSize: 20 } : { name: memberValue };
        axios.get(emergencyUrl + url, { params: { rbacToken: this.props.token, ...params } }).then((res) => {
            const { data } = res.data;
            if (type === 'departmentValue') {
                this.setState({ departmentList: data },)
            } else {
                this.setState({memberList: data})
            }
        }).catch(function (e) {
            // 处理请求出错的情况
            console.log(e)
        });
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
        const { departmentList, memberList, departmentValue, memberValue, } = this.state;
        return (
            <Motion style={{ opacity: spring(1) }}>
                {({ opacity }) =>
                    <div style={{ opacity, width: '100%', height: '100%' }} className={cssStyle.container}>
                        <div className={cssStyle.leftBox}>
                            <div className={cssStyle.headerBox}>部门</div>
                            {/* <input
                                name="departmentValue"
                                value={departmentValue}
                                onChange={this.handleChangeValue.bind(this)}
                                className={cssStyle.inputBox}
                                onKeyUp={this.handleEnterKey.bind(this)}
                            /> */}
                            <Scrollbars style={{ height: 'calc(100% - 4vh)' }}>
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
                            {/* <input
                                name="memberValue"
                                value={memberValue}
                                onChange={this.handleChangeValue.bind(this)}
                                className={cssStyle.inputBox}
                                onKeyUp={this.handleEnterKey.bind(this)}
                            /> */}
                            <Scrollbars style={{ height: 'calc(100% - 4vh)' }}>
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
                }
            </Motion>
        );
    }
}