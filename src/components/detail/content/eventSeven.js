import React from "react";
import cssStyle from './eventSeven.module.css';
import Scrollbars from "react-custom-scrollbars";
import {Pagination} from "antd";
import "./pagination.css";

export default class EventSeven extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selected:0};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    //组件加载触发函数
    componentDidMount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime){
            this.setState({selected:0});
        }
    }

    changePage(page, pageSize) {
        this.props.changeKeyParams({ pageNo: page, pageSize });
        this.scrollbars.current.scrollTop(0);
    }

    changeSelected(index){
        this.setState({selected:index});
    }

    render() {
        const { detail, keyParams, styleData } = this.props;
        if (detail == null) {
            return '';
        }
        const { total, records } = detail;
        const { pageNo, pageSize } = keyParams;
        const {selected} = this.state;
        return (
            <div style={this.props.style} className={`${cssStyle.box} black-blue-page`} >
                <div className={cssStyle.tabBox}>
                    {records && records.map((item,index)=>
                        <div key={index} className={`${cssStyle.tabOne} ${selected === index ? cssStyle.selectedTab:''}`} onClick={this.changeSelected.bind(this,index)}>事件{index+1}</div>
                    )}
                </div>
                {records && records[selected] ? (
                    <div className={cssStyle.contentBox}>
                        <table className={cssStyle.table}>
                            <tbody>
                            <tr>
                                <td className={cssStyle.title}>事件来源</td>
                                <td className={cssStyle.tdContentOne} colSpan={3}>{records[selected].eventSouceName}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.title}>事件描述</td>
                                <td className={cssStyle.tdContentTwo} colSpan={3}>
                                    <Scrollbars>
                                        {records[selected].eventDescribe}
                                    </Scrollbars>
                                </td>
                            </tr>
                            <tr>
                                <td className={cssStyle.title}>反映时间</td>
                                <td className={cssStyle.tdContentOne}>{records[selected].reflectTime}</td>
                                <td className={cssStyle.title}>处理部门</td>
                                <td className={cssStyle.tdContentOne}>{records[selected].eventDepartmentName}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.title}>处置进展</td>
                                <td className={cssStyle.tdContentTwo} colSpan={3}>
                                    <Scrollbars>
                                        {records[selected].eventProgress}
                                    </Scrollbars>
                                </td>
                            </tr>
                            <tr>
                                <td className={cssStyle.title}>附件</td>
                                <td className={cssStyle.tdContentTwo} colSpan={3}>
                                    <Scrollbars>
                                        {records[selected].fileList && records[selected].fileList.map((item,index)=>
                                            <div key={index} className={cssStyle.fileName} onClick={()=>{window.open(styleData.fileServiceUrl+item.url)}}>
                                                {item.fileName}
                                            </div>
                                        )}
                                    </Scrollbars>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                ):(
                    <div className={`${cssStyle.contentBox} ${cssStyle.noData}`}>
                        暂无数据
                    </div>
                )}
                <div className={cssStyle.pageBox}>
                    <Pagination current={pageNo} pageSize={pageSize} total={total} onChange={this.changePage.bind(this)} />
                </div>
            </div>
        );
    }
}