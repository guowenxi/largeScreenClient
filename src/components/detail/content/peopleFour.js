import React from "react";
import Scrollbars from "react-custom-scrollbars";
import cssStyle from "./peopleFour.module.css";

export default class PeopleFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.titleOne = [{
            name: '姓名',
            key: 'name'
        }, {
            name: '身份证号',
            key: 'cardId'
        }, {
            name: '年龄',
            key: 'age'
        }, {
            name: '性别',
            key: 'sex'
        }, {
            name: '联系电话',
            key: 'phone'
        }, {
            name: '户籍地址',
            key: 'censusRegister'
        }, {
            name: '现居地址',
            key: 'address',
            width: '100%'
        }];
        this.titleTwo = [{
            name: '主要成员',
            key: 'memberList',
            dataType: 2
        }, {
            name: '家庭人数',
            key: 'memberNum'
        }, {
            name: '家和指数',
            key: 'homeIndex'
        }, {
            name: '家庭住址',
            key: 'homeAddress'
        }];
        this.titleThree = [{
            name: '管控信息',
            key: 'controlList',
            dataType: 3
        }];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }
    componentDidUpdate() {

    }
    getHead(title) {
        return (
            <div className={cssStyle.headBox}>
                <div className={cssStyle.lineTwo} />
                <div className={cssStyle.headName}>{title}</div>
            </div>
        );
    }

    getContent(titleList) {
        const { detail } = this.props;
        return (
            <div className={cssStyle.content}>
                {titleList.map((title, index) => {
                    let content;
                    if(title.dataType === 3){
                        return detail[title.key] && detail[title.key].map((item,itemIndex)=>
                            <div className={cssStyle.controlRow} style={{ width: '100%' }} key={index+'_'+itemIndex}>
                                <div>{item.time}</div>
                                <div>{item.type}：</div>
                                <div>{item.content}</div>
                            </div>
                        )
                    }else{
                        if (title.dataType === 2) {
                            content = detail[title.key] && detail[title.key].map((member, index) => {
                                return <span key={index}>{member.name}{member.type ? '(' + member.type + ')' : ''}{index < detail.memberList.length - 1 ? '、' : ''}</span>
                            })
                        } else {
                            content = detail[title.key];
                        }
                        return (
                            <div className={cssStyle.rowPart} style={{ width: title.width }} key={index}>
                                <div className={cssStyle.title} >{title.name.split('').map((item,index)=>{return <span key={index}>{item}</span>})}</div>
                                <div className={cssStyle.dataContent} >{content}</div>
                            </div>
                        )
                    }
                })}
            </div>
        );
    }

    render() {
        const { detail, loading } = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                {
                    JSON.stringify(detail) === '{}' ? (
                        <div className={cssStyle.noData}>{loading ? '数据加载中...' : '暂无数据'}</div>
                    ) : (
                        <Scrollbars>
                            {this.getHead('人员信息')}
                            {this.getContent(this.titleOne)}
                            {this.getHead('家庭信息')}
                            {this.getContent(this.titleTwo)}
                        </Scrollbars>
                    )
                }
            </div>
        );
    }
}