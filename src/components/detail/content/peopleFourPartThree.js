import React from "react";
import Scrollbars from "react-custom-scrollbars";
import cssStyle from "./peopleThreePartOne.module.css";

export default class PeopleFourPartThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.titleOne = [{
            name: '事件名称',
            key: 'title',
            width: '100%'
        }, {
            name: '事发地址',
            key: 'address',
            width: '100%'
        }, {
            name: '事发时间',
            key: 'time'
        }, {
            name: '事件类型',
            key: 'type'
        }, {
            name: '所属镇街',
            key: 'road'
        }, {
            name: '涉及人员',
            key: 'involveNum'
        }, {
            name: '事件内容',
            key: 'content',
            width: '100%'
        }];
        this.titleTwo = [{
            name: '姓名',
            key: 'suspectName'
        }, {
            name: '电话',
            key: 'suspectPhone'
        }, {
            name: '身份证',
            key: 'suspectIdCard',
            width: '100%'
        }];
        this.titleThree = [{
            name: '姓名',
            key: 'victimName'
        }, {
            name: '电话',
            key: 'victimPhone'
        }, {
            name: '身份证',
            key: 'victimIdCard',
            width: '100%'
        }];
        this.theme = {'2':cssStyle.themeTwo}
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
                    return (
                        <div className={cssStyle.rowPart} style={{ width: title.width }} key={index}>
                            <div className={cssStyle.title} >{title.name.split('').map((item,index)=>{return <span key={index}>{item}</span>})}</div>
                            <div className={cssStyle.dataContent} >{detail[title.key]}</div>
                        </div>
                    )
                })}
            </div>
        );
    }

    render() {
        const { detail, loading } = this.props;
        return (
            <div style={this.props.style} className={`${cssStyle.box} ${this.theme[this.props.styleData.themeType]}`} >
                {
                    JSON.stringify(detail) === '{}' ? (
                        <div className={cssStyle.noData}>{loading ? '数据加载中...' : '暂无数据'}</div>
                    ) : (
                        <Scrollbars>
                            {this.getHead('案件信息')}
                            {this.getContent(this.titleOne)}
                            {this.getHead('嫌疑人信息')}
                            {this.getContent(this.titleTwo)}
                            {this.getHead('被害人信息')}
                            {this.getContent(this.titleThree)}
                        </Scrollbars>
                    )
                }
            </div>
        );
    }
}