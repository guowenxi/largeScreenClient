import React from "react";
import Scrollbars from "react-custom-scrollbars";
import cssStyle from "./peopleThreePartOne.module.css";

export default class PeopleTwoPartFive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.title = [{
            name: '行为趋势',
            key: 'trend',
            width: '100%'
        }, {
            name: '研判时间',
            key: 'time',
            width: '100%'
        }, {
            name: '研判事由',
            key: 'reason',
            width: '100%'
        }, {
            name: '处置预案',
            key: 'plan',
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

    getContent(titleList,data) {
        return (
            <div className={cssStyle.content}>
                {titleList.map((title, index) => {
                    return (
                        <div className={cssStyle.rowPart} style={{ width: title.width }} key={index}>
                            <div className={cssStyle.title} >{title.name.split('').map((item,index)=>{return <span key={index}>{item}</span>})}</div>
                            <div className={cssStyle.dataContent} >{data[title.key]}</div>
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
                            {detail && Array.isArray(detail) && detail.map((item,index)=>
                                <React.Fragment key={index}>
                                    {this.getHead('研判信息'+(index+1))}
                                    {this.getContent(this.title,item)}
                                </React.Fragment>
                            )}
                        </Scrollbars>
                    )
                }
            </div>
        );
    }
}