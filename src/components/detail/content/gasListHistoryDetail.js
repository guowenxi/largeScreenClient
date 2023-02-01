import React from "react";
import cssStyle from './gasListHistoryDetail.module.css';

import { interactData } from "../../../common/util";
import {Pagination} from "antd";

import './gasListDetail.css';
import {Scrollbars} from "react-custom-scrollbars";

export default class GasListHistoryDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedList:[]};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    componentDidUpdate(prveProps) {
        if (prveProps.changeKeyTime !== this.props.changeKeyTime && this.props.changeKeyTime) {
        }
    }

    //组件加载触发函数
    componentDidMount() {
    }

    interactAction(){
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, {id:this.state.selectedList.join(',')});
    }

    render() {
        const { list, total, title } = this.props.detail;
        const { pageSize, pageNo } = this.props.keyParams;
        return (
            <div style={this.props.style} className={`${cssStyle.box} gasListDetailBox`} >
                <div className={cssStyle.listBox}>
                    <div className={cssStyle.timeBox}>
                        <div className={`${cssStyle.itemPart} ${cssStyle.head}`} >时间</div>
                        {list && list.map((item, index) => {
                            return (
                                <div key={index} className={cssStyle.lineBox}>
                                    <div className={cssStyle.itemPart}>{item.time}</div>
                                </div>
                            )
                        })}
                    </div>
                    {title && (
                        <div className={`${cssStyle.rightBox} gasListHistoryDetailScrollbars`}>
                            <Scrollbars>
                                <div className={cssStyle.contentBox} style={{width:title.length*10+'em'}}>
                                    <div className={cssStyle.lineBox} style={{height:'3em'}}>
                                        {title && title.map((item, index) => {
                                            return <div key={index} className={`${cssStyle.itemPart} ${cssStyle.head}`}>{item}</div>
                                        })}
                                    </div>
                                    {list && list.map((row, rowIndex) =>
                                        <div key={rowIndex} className={cssStyle.lineBox}>
                                            {row.data && row.data.map((item,index)=>
                                                <div key={index} className={cssStyle.itemPart}>{item}</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Scrollbars>
                        </div>
                    )}
                </div>
                <Pagination
                    total={total}
                    pageSize={pageSize}
                    current={pageNo}
                    onChange={(pageNo) => this.props.changeKeyParams({ pageNo })}
                />
            </div>
        );
    }
}