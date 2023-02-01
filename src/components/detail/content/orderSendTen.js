import React from "react";
import cssStyle from "./orderSendTen.module.css";
import {Checkbox, Button} from "antd";
import {Scrollbars} from "react-custom-scrollbars";
import "./eventListThree.css";

export default class OrderSendTen extends React.Component {
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

    changeCheckAll(item){
        const checked = !item.checked;
        item.checked = checked;
        if(item.peopleList){
            item.peopleList.forEach((people)=>{
                people.checked = checked;
            });
        }
        this.setState({});
    }

    changeCheck(item,people){
        people.checked = !people.checked;
        let checkAll = true;
        let indeterminate = false;
        if(item.peopleList){
            item.peopleList.forEach((people)=>{
                if(!people.checked){
                    checkAll = false;
                }else{
                    indeterminate = true;
                }
            });
        }
        item.checked = checkAll;
        if(item.checked){
            item.indeterminate = false;
        }else{
            item.indeterminate = indeterminate;
        }
        this.setState({});
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.contentBox}>
                    <Scrollbars className={'eventListThreeBlueBar'}>
                        {detail && Array.isArray(detail) && detail.map((item,index)=>
                            <React.Fragment key={index}>
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.headRow}>
                                        <Checkbox checked={item.checked} indeterminate={item.indeterminate} onChange={this.changeCheckAll.bind(this,item)}/>
                                        <div>{item.name}</div>
                                    </div>
                                </div>
                                {item.peopleList && item.peopleList.map((people,peopleIndex)=>
                                    <div className={cssStyle.itemBox} key={peopleIndex}>
                                        <Checkbox checked={people.checked} onChange={this.changeCheck.bind(this,item,people)} />
                                        <div className={cssStyle.peopleBox}>
                                            <div className={cssStyle.row}>{people.department}</div>
                                            <div className={cssStyle.row}>
                                                <span style={{width:'5em'}}>{people.user}</span>
                                                <span>{people.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </Scrollbars>
                </div>
                <div className={cssStyle.editFootBox}>
                    <Button type="primary" icon={'camera'} >发起浙政钉会议</Button>
                </div>
            </div>
        );
    }
}