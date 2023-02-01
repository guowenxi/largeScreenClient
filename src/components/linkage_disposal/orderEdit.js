// import React from "react";
// import cssStyle from "./orderEdit.module.css";
// import { Motion, spring } from "react-motion";
// import { Checkbox, Input, Button, Icon } from 'antd';
// import './orderEdit.css'
// import SpringScrollbars from "../../common/springScrollbars";
// import axios from "axios";
// import close from "./images/close.svg"
// const { TextArea } = Input;
// export default class OrderEdit extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { peopleList: [], indeterminate: true, checkAll: false, checkedList: [], power: 0, text: '', departmentList: [], resultData: [] };
//         this.powerList = ['处置力量', '部门']
//         this.checkedList = []
//     }
//
//     //组件加载触发函数
//     componentDidMount() {
//         axios.get('./json/ruian/orderEdit.json', { params: { rbacToken: this.props.token } }).then((response) => {
//             // 在这儿实现 setState
//             const result = response.data.data;
//             if (result) {
//                 result.forEach(item => {
//                     item.checkedAll = false
//                     item.people.forEach(peopleItem => {
//                         peopleItem.checked = false
//                     })
//                 });
//                 this.setState({ resultData: result })
//             }
//         }).catch(function (error) {
//             // 处理请求出错的情况
//         });
//     }
//
//     //组件删除时触发函数
//     componentWillUnmount() {
//     }
//
//     getPeopleList() {
//         return (
//             <SpringScrollbars>
//                 <div className={cssStyle.peopleList}>
//                     {this.state.checkedList && this.state.checkedList.map((item, index) =>
//                         <div key={index} className={cssStyle.selectBox}>
//                             <div style={{ marginRight: '0.5em' }}>{item.name}</div>
//                             <img alt="" src={close} style={{ width: '0.8em' }} onClick={this.removeList.bind(this, this.state.checkedList, index, item)} />
//                         </div>
//                     )}
//                 </div>
//             </SpringScrollbars>
//         )
//     }
//
//     removeList(list, index, item) {
//         let updateList = list
//         updateList.splice(index, 1)
//         this.setState({ checkedList: updateList })
//         const { resultData } = this.state;
//         resultData[item.group].people[item.index].checked = false
//         resultData[item.group].checkedAll = false
//     }
//
//     getPowerList() {
//         return (
//             <div className={cssStyle.tabBox}>
//                 {this.powerList.map((item, index) =>
//                     <div key={index} className={`${cssStyle.tabItem} ${index === this.state.power ? cssStyle.selectedTab : ''}`} onClick={this.changePower.bind(this, index)}>
//                         <div className={cssStyle.tabName}>{item}</div>
//                     </div>
//                 )}
//             </div>
//         )
//     }
//
//     changePower(index) {
//         this.setState({ power: index })
//     }
//
//     onChangeText = ({ target: { value } }) => {
//         this.setState({ text: value });
//     };
//
//     addNewEvent() {
//         var list = []
//         this.state.checkedList.forEach(item => {
//             list.push(item.name)
//         })
//         console.log(list)
//     }
//
//     render() {
//         const { show, changeEditShow } = this.props;
//         const { text, resultData } = this.state
//         let numStyle = {
//             display: 'flex',
//             flexWrap: 'wrap'
//         }
//         return (
//             <Motion style={{ opacity: spring(show ? 1 : 0) }}>
//                 {({ opacity }) =>
//                     <div style={{ opacity, zIndex: show ? 1 : -1 }} className={`${cssStyle.orderEditBox} ant_checkbox`}>
//                         <div className={cssStyle.editHeadBox}>
//                             <div>下达指令</div>
//                             <Icon type="close" className={cssStyle.closeIcon} />
//                         </div>
//                         <div className={cssStyle.selectPeople}>
//                             <span className={cssStyle.choosePeople}>已选人员：</span>
//                             {this.getPeopleList()}
//                         </div>
//                         <div className={cssStyle.choose}>
//                             {this.getPowerList()}
//                             <SpringScrollbars>
//                                 <div className={cssStyle.checkBox} style={{ ...numStyle }}>
//                                     {resultData && resultData.map((item, index) => {
//                                         return (
//                                             <div key={index} style={{ width: '33%', marginBottom: '1em', display: 'flex', flexDirection: 'column' }}>
//                                                 {item && <Checkbox checked={item.checkedAll} onClick={(e) => {
//                                                     item.checkedAll = e.target.checked
//                                                     item.people.forEach((peopleItem, peopleIndex) => {
//                                                         if (item.checkedAll === false) {
//                                                             peopleItem.checked = false
//                                                             this.state.checkedList.map((checkItem, checkIndex) => {
//                                                                 if (checkItem.name === peopleItem.name) {
//                                                                     this.checkedList.splice(checkIndex, 1)
//                                                                     this.setState({ checkedList: this.checkedList })
//                                                                 }
//                                                             })
//                                                         } else {
//                                                             peopleItem.checked = true
//                                                             this.checkedList.map((checkItem, checkIndex) => {
//                                                                 console.log(checkItem.group)
//                                                             })
//                                                             this.checkedList.push({ "name": peopleItem.name, "group": index, "index": peopleIndex })
//                                                             this.setState({ checkedList: this.checkedList })
//
//                                                         }
//                                                     })
//                                                 }} className={cssStyle.checkBoxStyle}>{item.department}</Checkbox>}
//                                                 {item.people && item.people.map((peopleItem, peopleIndex) => (
//                                                     <Checkbox checked={peopleItem.checked} className={cssStyle.checkBoxStyle} onClick={(e) => {
//                                                         peopleItem.checked = e.target.checked
//                                                         if (peopleItem.checked === true) {
//                                                             this.checkedList.push({ "name": peopleItem.name, "group": index, "index": peopleIndex })
//                                                             this.setState({ checkedList: this.checkedList })
//                                                         } else {
//                                                             this.state.checkedList.map((checkItem, checkIndex) => {
//                                                                 if (checkItem.name === peopleItem.name) {
//                                                                     this.checkedList.splice(checkIndex, 1)
//                                                                     this.setState({ checkedList: this.checkedList })
//                                                                     item.checkedAll = false
//                                                                 }
//                                                             })
//                                                         }
//
//                                                     }} key={peopleIndex}>{peopleItem.name + peopleItem.telphone}</Checkbox>
//                                                 ))}
//                                             </div>
//                                         )
//                                     })}
//                                 </div>
//                             </SpringScrollbars>
//                         </div>
//                         <div className={cssStyle.content}>
//                             <TextArea value={text} onChange={this.onChangeText} placeholder="请输入需要发送的内容" className={`${cssStyle.textArea} ant-input`} />
//                         </div>
//                         <div className={cssStyle.button}>
//                             <Button onClick={changeEditShow}>取消</Button>
//                             <Button type="primary" onClick={this.addNewEvent.bind(this)} >确定</Button>
//                         </div>
//                     </div>
//                 }
//             </Motion>
//         );
//     }
// }