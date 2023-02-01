import React from "react";
import cssStyle from "./peopleListThree.module.css";
import './eventListOne.css';
import { Scrollbars } from "react-custom-scrollbars";
import "./pagination.css";
// import { Pagination } from "antd";
import {interactData} from "../../../common/util";
import "./eventListThree.css";

export default class PeopleListThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedId:''};
        this.scrollbars = React.createRef();
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    changePage(page, pageSize) {
        this.props.changeKeyParams({ pageNo: page, pageSize });
        this.scrollbars.current.scrollTop(0);
    }

    itemClick(item){
        this.setState({selectedId:item.id});
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }

    render() {
        const { detail, loading } = this.props;
        if (detail == null || detail.list == null) {
            return '';
        }
        const { list } = detail;
        // const { pageNo, pageSize } = keyParams;
        const {selectedId} = this.state;
        return (
            <div style={this.props.style} className={`${cssStyle.box} black-blue-page`} >
                <div className={cssStyle.contentBox}>
                    {list && list.length > 0 ? (
                        <Scrollbars ref={this.scrollbars} className={'eventListThreeBlueBar'}>
                            {list.map((item,index)=>{
                                return (
                                    <div key={index} className={`${cssStyle.itemBox} ${item.id === selectedId ? cssStyle.selectedBox:''}`}>
                                        <img className={cssStyle.img} alt={''} src={item.img} />
                                        <div className={cssStyle.nameBox}>
                                          <div><span className={cssStyle.name}>姓名</span>女</div>
                                          <div className={cssStyle.detail} onClick={this.itemClick.bind(this,item)}>查看详情</div>
                                        </div>
                                        <div className={cssStyle.nameBox}>
                                          <div>管控等级：<span className={cssStyle.level}>一级</span></div>
                                          <div>所属街道：城东街道</div>
                                        </div>
                                        <div>常住地址：城东街道XXXX大街XXX号阳光花苑4栋404</div>
                                    </div>
                                );
                            })}
                        </Scrollbars>
                    ):(
                        <div className={cssStyle.noData}>{loading ? '数据加载中...':'暂无数据'}</div>
                    )}
                </div>
                {/* <Pagination current={pageNo} pageSize={pageSize} total={total} onChange={this.changePage.bind(this)} style={{float:'right'}} /> */}
            </div>
        );
    }
}