import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Icon, Input, Button, Modal} from "antd";
import axios from "axios";

const { TextArea } = Input;

export default class EndEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {detail:{plan:[]},roadList:[],subTypeList:[],planList:[],loading:false};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.emergencyId !== this.props.emergencyId){
            //组件数据源变更时刷新数据
            this.initDefault();
        }
    }

    initDefault(){
        let {detail} = this.state;
        detail.remark = '';
        this.setState({detail});
    }

    dataEdit(type,key,event){
        let {detail} = this.state;
        detail[key] = type === 1 ? event.target.value : event;
        this.setState({detail});
    }


    endEvent(){
        this.setState({loading:true});
        const {remark} = this.state.detail;
        const sendData = {
            rbacToken:this.props.token,
            eventId:this.props.emergencyId,
            remark,
        };
        axios.post(this.props.emergencyUrl+"/socialGovernance/commandDispatch/completeEvent", sendData,{params:{rbacToken:this.props.token}}).then((response) => {
            if(response.data.success){
                Modal.success({
                    content: '办结完成。',
                });
                this.props.changeEditShow();
                this.setState({detail:{remark:''}});
                this.props.changeListShow({id:4,name:'已结束'},true);
            }else{
                Modal.error({
                    content: response.data.message,
                });
            }
            this.setState({loading:false});
        }).catch( (error) => {
            Modal.error({
                content: '请求出错！',
            });
            console.log(error);
            this.setState({loading:false});
        });
    }

    render() {
        const {show,changeEditShow} = this.props;
        const {detail,loading} = this.state;
        return (
            <Motion style={{opacity:spring(show ? 1 : 0)}}>
                {({opacity}) =>
                    <div style={{opacity,zIndex:show?1:-1}} className={cssStyle.eventDiscussBox}>
                        <div className={cssStyle.editHeadBox}>
                            <div className={cssStyle.headName}>事件办结</div>
                            <Icon type="close" className={cssStyle.closeIcon} onClick={changeEditShow}/>
                        </div>
                        <div className={cssStyle.eventAddRow}>
                            <div className={cssStyle.addRowTitle}>备注</div>
                            <TextArea value={detail.remark} onChange={this.dataEdit.bind(this, 1, 'remark')} className={cssStyle.addRowTextArea}/>
                        </div>
                        <div className={cssStyle.editFootBox}>
                            <Button onClick={changeEditShow}>取消</Button>
                            <Button type="primary" onClick={this.endEvent.bind(this)} loading={loading} >确定</Button>
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}