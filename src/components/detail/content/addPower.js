import React from "react";
import cssStyle from "./addPower.module.css";
import { Motion, spring } from "react-motion";
import { Checkbox, Icon, Input, Button, Modal } from "antd";
import axios from "axios";
import { emergencyUrl } from "../../../config";
import { Scrollbars } from "react-custom-scrollbars";



import { interactData } from "../../../common/util";

const { TextArea } = Input;

export default class PowerEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = { teamList: [], departList: [], selectedList: [], groupShowType: 1, content: '', loading: false, visible: true, emergencyId: '', };
        this.groupTypeList = [{ id: 1, name: '应急小组' }];
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.init();
    }

    componentDidUpdate(prveProps) {
        if (prveProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            this.init();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    init() {
        this.setState({ emergencyId: this.props.keyParams.emergencyId }, () => {
            this.initGroupData();
        });
    }
    //props变更时触发函数

    initList(list) {
        list.forEach(item => {
            item.checked = false;
        });
    }

    initGroupData() {
        this.setState({ selectedList: [], groupShowType: 1, content: '' });
        const groupListUrl = emergencyUrl + '/socialGovernance/YQemergencyProcess/getRunTeamAndStation';
        // const groupListUrl = './json/ruian/teamList.json';
        axios.get(groupListUrl, { params: { rbacToken: this.props.token, type: 2, emergencyId: this.state.emergencyId } }).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            console.log(result.allTeamList);
            if (result) {
                const teamList = result.allTeamList ? result.allTeamList : [];
                this.initList(teamList);
                const departList = result.basicStationList ? result.basicStationList : [];
                this.initList(teamList);
                this.setState({ teamList, departList });
            }
        }).catch(function (error) {
            // 处理请求出错的情况
        });
    }

    //详情显示内容切换
    changeDetailShow(item) {
        if (item.id !== this.state.groupShowType) {
            this.setState({ groupShowType: item.id });
        }
    }

    onChangeText(event) {
        this.setState({ content: event.target.value });
    }

    getSelectedList(list) {
        let ids = [];
        list.forEach((item) => {
            if (item.checked) {
                ids.push(item.id);
            }
        });
        return JSON.stringify(ids);
    }

    addPower() {
        this.setState({ loading: true });
        // eslint-disable-next-line no-unused-vars
        const { teamList, departList, content, emergencyId } = this.state;
        const sendData = {
            remark: content,
            emergencyId,
            operationType: 104,
            runProcessTaskTeam: this.getSelectedList(teamList),
            // runProcessTaskStation: this.getSelectedList(departList),
            rbacToken: this.props.token
        };
        if (!JSON.parse(sendData.runProcessTaskTeam).length) {
            Modal.error({
                content: '请选择小组',
            });
            this.setState({ loading: false });
            return;
        }
        axios.post(emergencyUrl + "/socialGovernance/YQemergencyProcess/emergencyOperate", sendData).then((response) => {
            if (response.data.success) {
                Modal.success({
                    content: '增派完成',
                });
                this.initGroupData();
            } else {
                Modal.error({
                    content: response.data.data,
                });
            }
            this.setState({ loading: false });
            this.handleClickClose();
        }).catch((error) => {
            Modal.error({
                content: '请求出错！',
            });
            this.setState({ loading: false });
            console.log(error);
        });
    }
    completeInteract() {
        const { detail } = this.props
        const { completeAddPowerInteract } = this.props.thisData.style;
        this.interactData(completeAddPowerInteract, { ...detail, emergencyId: this.props.keyParams.emergencyId});
    }
    changeSelected(group) {
        let { selectedList } = this.state;
        let thisIndex;
        for (let i = 0; i < selectedList.length; i++) {
            if (selectedList[i].id === group.id) {
                thisIndex = i;
                break;
            }
        }
        if (group.checked) {
            if (thisIndex == null) {
                selectedList.push({ id: group.id, name: group.teamName || group.stationName });
            }
        } else {
            if (thisIndex != null) {
                selectedList.splice(thisIndex, 1);
            }
        }
    }

    selectGroup(group) {
        group.checked = !group.checked;
        this.changeSelected(group);
        this.setState({});
    }

    removeSelected(group, index) {
        const { teamList, departList, selectedList } = this.state;
        selectedList.splice(index, 1);
        this.removeFromGroup(group, teamList);
        this.removeFromGroup(group, departList);
    }

    removeFromGroup(group, groupList) {
        if (groupList) {
            for (let j = 0; j < groupList.length; j++) {
                if (groupList[j].id === group.id) {
                    groupList[j].checked = false;
                    break;
                }
            }
        }
        this.setState({});
    }

    getGroupList(groupList, type) {
        return groupList && groupList.map((team, index) => {
            return (
                <div className={cssStyle.handleTeamBox} key={index} >
                    <div className={cssStyle.handleTeamName}>
                        <Checkbox
                            checked={team.checked}
                            className={cssStyle.checkBox}
                            onClick={this.selectGroup.bind(this, team)}
                        >
                            <span className={cssStyle.blueColor}>{type === 1 ? team.teamName : team.stationName}</span>
                        </Checkbox>
                    </div>
                    {team.allMemberList && team.allMemberList.map((people, peopleIndex) =>
                        <div className={cssStyle.handleContentRow} key={peopleIndex}>
                            <span className={cssStyle.handleContentRowPart}>{people.departmentName}</span>
                            <span className={cssStyle.handleContentRowPart}>{type === 1 ? people.teamDuty : people.duty}</span>
                            <span className={cssStyle.handleContentRowPart}>{people.userName}</span>
                            <span className={cssStyle.handleContentRowPart}>{type === 1 ? people.teamUserPhone : people.phone}</span>
                        </div>
                    )}
                </div>
            )
        })
    }
    handleClickClose() {
        this.setState({ selectedList: [], groupShowType: 1, content: '' });
        const { detail } = this.props;
        const { hideAddPowerInteract } = this.props.thisData.style;
        this.interactData(hideAddPowerInteract, detail);
    }
    render() {
        const { teamList, selectedList, groupShowType, content, loading, } = this.state;
        return (
            <Motion style={{ opacity: spring(1) }}>
                {({ opacity }) =>
                    <div style={{ opacity, }} className={cssStyle.addOrderBox}>
                        <div className={cssStyle.editHeadBox}>
                            <div>增派力量</div>
                            <Icon type="close" onClick={this.handleClickClose.bind(this)} className={cssStyle.closeIcon} />
                        </div>
                        <div className={cssStyle.selectedListBox}>
                            <div className={cssStyle.selectedListTitle}>已选小组：</div>
                            {selectedList.map((item, index) => {
                                return (
                                    <div key={index} className={cssStyle.selectedItemBox}>
                                        <div>{item.name}</div>
                                        <Icon type="close" className={cssStyle.deleteIcon} onClick={this.removeSelected.bind(this, item, index)} />
                                    </div>
                                );
                            })}
                        </div>
                        <div className={cssStyle.groupListBox}>
                            <Motion style={{ left: spring(groupShowType === 1 ? 0 : -100) }}>
                                {({ left }) =>
                                    <div style={{ left: left + '%' }} className={cssStyle.groupListContent}>
                                        <Scrollbars >
                                            {this.getGroupList(teamList, 1)}
                                        </Scrollbars>
                                    </div>
                                }
                            </Motion>
                        </div>
                        <TextArea value={content} onChange={this.onChangeText.bind(this)} placeholder="备注" className={cssStyle.editContent} />
                        <div className={cssStyle.editFootBox}>
                            <Button onClick={this.handleClickClose.bind(this)}>取消</Button>
                            <Button type="primary" onClick={this.addPower.bind(this)} loading={loading}>确定</Button>
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}