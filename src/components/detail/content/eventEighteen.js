import React from "react";
import cssStyle from './eventEighteen.module.css';
import {Scrollbars} from "react-custom-scrollbars";

export default class EventEighteen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.dataContent = [
            {key: 'source',name: '事件来源',width:'55%'},
            {key: 'time',name: '事发时间',width:'45%'},
            {key: 'type',name: '事件类型',width:'55%'},
            {key: 'level',name: '事件等级',width:'45%'},
            {key: 'action',name: '现实行为',width:'55%'},
            {key: 'road',name: '所属街道',width:'45%'},
            {key: 'address',name: '事发地点',width:'55%'},
            {key: 'peopleNum',name: '参与人数',width:'45%'},
            {key: 'content',name: '事件描述',width:'100%'},
            {key: 'reportTime',name: '上报人员',width:'55%'},
            {key: 'reportUser',name: '上报时间',width:'45%'},
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
                                <div className={cssStyle.title}>{item.name}：</div>
                                <div className={cssStyle.content}>{detail[item.key]}</div>
                            </div>
                        )}
                        <div className={cssStyle.itemBox} >
                            <div className={cssStyle.title}>事件附件：</div>
                            <div className={cssStyle.content}>
                                {detail.imgList && detail.imgList.map((item,index)=>
                                    <img src={item} key={index} alt={''} className={cssStyle.img} />
                                )}
                            </div>
                        </div>
                    </div>
                </Scrollbars>
            </div>
        );
    }
}