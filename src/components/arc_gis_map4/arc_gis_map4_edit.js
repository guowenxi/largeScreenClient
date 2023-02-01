// import React from 'react';
// import {Form, Input, Collapse, Radio, Button, Icon, Tooltip} from 'antd';
// import {changeDetailData, iconClick, selectIcon, selectIconCancel, selectIconOk, setColor} from "../../common/editUtil";
// import ColorSelect from "../../common/colorSelect";
// import {fileUrl} from "../../config";
// import FileSelect from "../../common/fileSelect";
//
// const { Panel } = Collapse;
// const { TextArea } = Input;
//
// export default class AntdCascaderEdit extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }
//
//     componentDidMount() {
//     }
//
//     componentWillUnmount() {
//     }
//
//     render() {
//         const formItemLayout24 = {
//             labelCol: {span: 8},
//             wrapperCol: {span: 16}
//         };
//         const { style } = this.props.data;
//         return (
//             <Form {...formItemLayout24} >
//                 <Collapse >
//                     <Panel header="基础配置" key="1">
//                         <Form.Item label="字体大小">
//                             <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
//                         </Form.Item>
//                     </Panel>
//                 </Collapse>
//                 <FileSelect
//                     title="图标选择"
//                     visible={this.state.visible}
//                     onOk={selectIconOk.bind(this)}
//                     onCancel={selectIconCancel.bind(this)}
//                     okText="确认"
//                     cancelText="取消"
//                     imgSelect={iconClick.bind(this)} token={this.props.token}
//                     width={650}
//                 />
//             </Form>
//         );
//     }
// }
