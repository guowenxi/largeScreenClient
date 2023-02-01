import React from "react";
import Scrollbars from "react-custom-scrollbars";
import cssStyle from "./peopleTwoPartOne.module.css";

export default class PeopleTwoPartOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.titleOne = [{
            name: '姓名：',
            key: 'name'
        }, {
            name: '身份证：',
            key: 'cardId'
        }, {
            name: '年龄：',
            key: 'age'
        }, {
            name: '性别：',
            key: 'sex'
        }, {
            name: '联系电话：',
            key: 'phone'
        }, {
            name: '户籍地址：',
            key: 'censusRegister'
        }, {
            name: '现居地址：',
            key: 'address',
            width: '100%'
        }];
        this.titleTwo = [{
            name: '家庭主要成员：',
            key: 'memberList',
            dataType: 2
        }, {
            name: '家庭人数：',
            key: 'memberNum'
        }, {
            name: '家和指数：',
            key: 'homeIndex'
        }, {
            name: '家庭住址：',
            key: 'homeAddress'
        }];
        this.titleThree = [{
            name: '管控环节：',
            key: 'controlLink'
        }, {
            name: '管控网格：',
            key: 'controlGrid'
        }];
        this.titleFour = [{ name: '排查渠道：', key: 'investigationChannels' }, { name: '排查时间：', key: 'investigationTime' }]
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
                <div className={cssStyle.lineOne} />
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
                    if (title.dataType === 2) {
                        content = detail[title.key] && detail[title.key].map((member, index) => {
                            return <span key={index}>{member.name}{member.type ? '(' + member.type + ')' : ''}{index < detail.memberList.length - 1 ? '、' : ''}</span>
                        })
                    } else {
                        content = detail[title.key];
                    }
                    return (
                        <div className={cssStyle.rowPart} style={{ width: title.width }} key={index}>
                            <div className={cssStyle.title} style={{ width: title.name.length + 'em' }}>{title.name}</div>
                            <div style={{ width: `calc(100% - ${title.name.length + 'em'})` }}>{content}</div>
                        </div>
                    )
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
                            {this.getContent(this.titleOne)}
                            {this.getHead('家庭信息')}
                            {this.getContent(this.titleTwo)}
                            {this.getHead('管控信息')}
                            {this.getContent(this.titleThree)}
                            {this.getHead('排查信息')}
                            {this.getContent(this.titleFour)}
                        </Scrollbars>
                    )
                }
            </div>
        );
    }
}