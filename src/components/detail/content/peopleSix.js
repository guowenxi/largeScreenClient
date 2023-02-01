import React from "react";
import cssStyle from './eventEighteen.module.css';
import {Scrollbars} from "react-custom-scrollbars";

export default class PeopleSix extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.dataContent = [
            {key: 'name',name: '姓名',width:'55%'},
            {key: 'type',name: '人员类型',width:'45%'},
            {key: 'cardId',name: '证件号码',width:'55%'},
            {key: 'no',name: '执行案号',width:'45%'},
            {key: 'court',name: '执行法院',width:'55%'},
            {key: 'reportUser',name: '发布人',width:'45%'},
            {key: 'recordTime',name: '立案时间',width:'55%'},
            {key: 'reportTime',name: '发布时间',width:'45%'},
            {key: 'status',name: '状态',width:'55%'},
            {key: 'shieldingTime',name: '屏蔽时间',width:'45%'},
            {key: 'undoTime',name: '撤销时间',width:'55%'},
            {key: 'expireTime',name: '失信到期日',width:'45%'},
            {key: 'action',name: '行为情形',width:'100%'},
        ];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const { detail } = this.props;
        if (detail == null) {
            return '';
        }
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <Scrollbars>
                    <div className={cssStyle.contentBox}>
                        {this.dataContent.map((item,index)=>
                            <div key={index} className={cssStyle.itemBox} style={{width:item.width}}>
                                <div className={cssStyle.titleTwo}>{item.name.split('').map((item,index)=><span key={index}>{item}</span>)}</div>
                                <span className={cssStyle.gray}>：</span>
                                <div className={cssStyle.content}>{detail[item.key]}</div>
                            </div>
                        )}
                    </div>
                </Scrollbars>
            </div>
        );
    }
}