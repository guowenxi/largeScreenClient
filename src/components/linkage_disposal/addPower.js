// import React from "react";
// import cssStyle from "./orderEdit.module.css";
// import { Motion, spring } from "react-motion";
// import { Checkbox, Input, Button, Icon } from 'antd';
// import './orderEdit.css'
// import SpringScrollbars from "../../common/springScrollbars";
// import axios from "axios";
//
// const { TextArea } = Input;
// export default class OrderEdit extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { peopleList: [], indeterminate: true, checkAll: false, checkedList: [], power: 0, text: '', resultData: [] };
//         this.powerList = ['处置力量', '基层站所']
//         this.checkedList = []
//     }
//
//     //组件加载触发函数
//     componentDidMount() {
//         axios.get('./json/ruian/addPower.json', { params: { rbacToken: this.props.token } }).then((response) => {
//             // 在这儿实现 setState
//             const result = response.data.data;
//             if (result) {
//                 this.setState({ resultData: result })
//                 result.forEach(item => {
//                     item.checked = false
//                 })
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
//         console.log(this.state.checkedList)
//     }
//
//
//     render() {
//         const { show, changeEditShow } = this.props;
//         const { text, resultData } = this.state
//         let numStyle = {
//             display: 'flex',
//             justifyContent: 'space-between',
//             flexWrap: 'wrap'
//         }
//         return (
//             <Motion style={{ opacity: spring(show ? 1 : 0) }}>
//                 {({ opacity }) =>
//                     <div style={{ opacity }} className={`${cssStyle.orderEditBox} ant_checkbox`}>
//                         <div className={cssStyle.editHeadBox}>
//                             <div>人员力量</div>
//                             <Icon type="close" className={cssStyle.closeIcon} />
//                         </div>
//                         <div className={cssStyle.choose} style={{ height: '63%' }}>
//                             {this.getPowerList()}
//                             <SpringScrollbars>
//                                 <div className={cssStyle.checkBox} style={{ ...numStyle }}>
//                                     {resultData && resultData.map((item, index) => {
//                                         return (
//                                             <div style={{ width: '33%', marginBottom: '1em' }} key={index}>
//                                                 {item && <Checkbox checked={item.checked} onClick={(e) => {
//                                                     item.checked = e.target.checked
//                                                     if (item.checked === true) {
//                                                         this.checkedList.push(item.department)
//                                                         this.setState({ checkedList: this.checkedList })
//                                                     } else {
//                                                         this.state.checkedList.map((checkItem, checkIndex) => {
//                                                             if (checkItem === item.department) {
//                                                                 this.checkedList.splice(checkIndex, 1)
//                                                                 this.setState({checkedList:this.checkedList})
//                                                             }
//                                                         })
//                                                     }
//                                                 }} className={`${cssStyle.checkBoxStyle} .ant-checkbox-wrapper`} >
//                                                     <span>
//                                                         {item.department}
//                                                         <br />
//                                                         {item.people && item.people.map((peopleItem, peopleIndex) => {
//                                                             return (
//                                                                 <div key={peopleIndex}>
//                                                                     <span style={{ marginLeft: '25px' }}>{peopleItem.name + peopleItem.telphone}</span>
//                                                                     <br />
//                                                                 </div>
//                                                             )
//                                                         })}
//                                                     </span>
//                                                 </Checkbox>}
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