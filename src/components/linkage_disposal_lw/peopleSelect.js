import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Button, Checkbox, Icon, Tree} from "antd";
import axios from "axios";
import {Scrollbars} from "react-custom-scrollbars";
import "./linkage_disposal.css";

const { TreeNode } = Tree;

export default class PeopleSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {depList:[],peopleList:[],selectedPeople:[],selectedPeopleId:[],checkAll:false,indeterminate:false};
    }

    //组件加载触发函数
    componentDidMount() {
        const depListUrl = this.props.emergencyUrl + "/socialGovernance/common/getDepartmentTree";
        axios.get(depListUrl,{params:{rbacToken:this.props.token}}).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if(result){
                this.setState({depList:result});
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.showPeople !== this.props.showPeople && this.props.showPeople){
            //显示时初始化之前选中人员
            const selectedPeople = JSON.parse(JSON.stringify(this.props.selectedPeople));
            const selectedPeopleId = selectedPeople.map((item)=>{return item.id});
            this.setState({selectedPeople,selectedPeopleId},()=>{
                this.isCheckAll();
            });
        }
    }

    getTreeNode(list){
        if(list){
            return list.map((item)=>{
                if(item.children){
                    return (
                        <TreeNode key={item.departmentId} title={item.departmentName} >
                            {this.getTreeNode(item.children)}
                        </TreeNode>
                    );
                }else{
                    return <TreeNode key={item.departmentId} title={item.departmentName}/>
                }
            });
        }else{
            return null;
        }
    }

    treeSelect(departmentId){
        if(departmentId && departmentId.length > 0){
            const peopleUrl = this.props.emergencyUrl + "/socialGovernance/common/getDepartmentUserListMobile";
            axios.get(peopleUrl,{params:{rbacToken:this.props.token,departmentId:departmentId[0]}}).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if(result){
                    this.setState({peopleList:result},()=>{
                        this.isCheckAll();
                    });
                }
            }).catch(function(error){
                // 处理请求出错的情况
            });
        }
    }

    selectAll(){
        let {peopleList,checkAll,selectedPeople,selectedPeopleId} = this.state;
        if(checkAll){
            peopleList.forEach((item)=>{
                const index = selectedPeopleId.indexOf(item.id);
                if(index >= 0){
                    selectedPeopleId.splice(index,1);
                    selectedPeople.splice(index,1);
                }
            });
            checkAll = false;
        }else{
            peopleList.forEach((item)=>{
                const index = selectedPeopleId.indexOf(item.id);
                if(index < 0){
                    selectedPeopleId.push(item.id);
                    selectedPeople.push(item);
                }
            });
            checkAll = true;
        }
        this.setState({checkAll,indeterminate:false,selectedPeople,selectedPeopleId});
    }

    selectPeople(item){
        let {selectedPeople,selectedPeopleId} = this.state;
        const index = selectedPeopleId.indexOf(item.id);
        if(index >= 0){
            selectedPeopleId.splice(index,1);
            selectedPeople.splice(index,1);
        }else{
            selectedPeopleId.push(item.id);
            selectedPeople.push(item);
        }
        this.setState({selectedPeople,selectedPeopleId},()=>{
            this.isCheckAll();
        });
    }

    removeSelected(index){
        let {selectedPeople,selectedPeopleId} = this.state;
        selectedPeopleId.splice(index,1);
        selectedPeople.splice(index,1);
        this.setState({selectedPeople,selectedPeopleId},()=>{
            this.isCheckAll();
        });
    }

    isCheckAll(){
        let {peopleList,checkAll,indeterminate,selectedPeopleId} = this.state;
        let thisDepSelectedNum = 0;
        peopleList.forEach((person)=>{
            if(selectedPeopleId.indexOf(person.id) >= 0){
                thisDepSelectedNum ++;
            }
        });
        if(thisDepSelectedNum === 0){
            checkAll = false;
            indeterminate = false;
        }else if(thisDepSelectedNum < peopleList.length){
            checkAll = false;
            indeterminate = true;
        }else{
            checkAll = true;
            indeterminate = false;
        }
        this.setState({checkAll,indeterminate});
    }

    setPeopleSelect(){
        this.props.changePeopleSelect(this.state.selectedPeople);
        this.setState({selectedPeople:[],selectedPeopleId:[],checkAll:false,indeterminate:false});
    }

    render() {
        const {showPeople,changePeopleSelectShow,className} = this.props;
        const {depList,peopleList,checkAll,indeterminate,selectedPeople,selectedPeopleId} = this.state;
        return (
            <Motion style={{opacity:spring(showPeople ? 1 : 0)}}>
                {({opacity}) =>
                    <div style={{opacity,zIndex:showPeople?1:-1}} className={className ? className :cssStyle.peopleSelectBox}>
                        <div className={cssStyle.editHeadBox}>
                            <div className={cssStyle.headName}>人员选择</div>
                            <Icon type="close" className={cssStyle.closeIcon} onClick={changePeopleSelectShow}/>
                        </div>
                        <div className={cssStyle.peopleSelectContent}>
                            <div className={`${cssStyle.treeBox} linkage_disposal_lw_tree`}>
                                <Scrollbars className={'blueScrollbars'} >
                                    <Tree
                                        onSelect={this.treeSelect.bind(this)}
                                    >
                                        {this.getTreeNode(depList)}
                                    </Tree>
                                </Scrollbars>
                            </div>
                            <div className={`${cssStyle.peopleListBox} linkage_disposal_lw_checkbox`}>
                                <div>
                                    <Checkbox
                                        indeterminate={indeterminate}
                                        checked={checkAll}
                                        className={cssStyle.checkBox}
                                        onClick={this.selectAll.bind(this)}
                                    >
                                        <span className={cssStyle.blueColor}>全选</span>
                                    </Checkbox>
                                </div>
                                {peopleList && peopleList.map((item,index)=>
                                    <Checkbox
                                        checked={selectedPeopleId.indexOf(item.id) >= 0}
                                        className={cssStyle.checkBox} key={index}
                                        onClick={this.selectPeople.bind(this,item)}
                                    >
                                        <span className={cssStyle.blueColor}>{item.name}</span>
                                    </Checkbox>
                                )}
                            </div>
                            <div className={cssStyle.peopleSelectedListBox}>
                                <div className={cssStyle.selectedListTitle}>已选人员：</div>
                                <Scrollbars className={'blueScrollbars'} style={{height:'calc(100% - 2.3em)'}}>
                                    {selectedPeople.map((item,index)=>{
                                        return (
                                            <div key={index} className={cssStyle.selectedItemBox}>
                                                <div>{item.name}</div>
                                                <Icon type="close" className={cssStyle.deleteIcon} onClick={this.removeSelected.bind(this,index)}/>
                                            </div>
                                        );
                                    })}
                                </Scrollbars>
                            </div>
                        </div>
                        <div className={cssStyle.editFootBox}>
                            <Button onClick={changePeopleSelectShow}>取消</Button>
                            <Button type="primary" onClick={this.setPeopleSelect.bind(this)} >确定</Button>
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}