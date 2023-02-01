import React from "react";
import cssStyle from "./importantPlaceTwo.module.css";
import {Scrollbars} from "react-custom-scrollbars";

export default class ImportantPlaceTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.contentOne = [{name:'场所名称',key:'areaName'},{name:'所属网格',key:'belongArea'}];
        this.contentTwo = [{name:'社会统一信用代码',key:'creditCode'},{name:'场所地址',key:'areaAddress'},{name:'场所类型',key:'areaType'},{name:'消防场所性质',key:'firePlaceQuality'},
            {name:'所在建筑名称',key:'bulidingName'},{name:'所在层数',key:'floor'},{name:'场所面积',key:'area'},{name:'工作人员数量',key:'workPeopleNum'},{name:'场所用途',key:'areaPurpose'}];
        this.contentThree = [{name:'负责人姓名',key:'leaderName'},{name:'负责人身份证号',key:'leaderCardid'},{name:'联系方式',key:'leaderPhone'}];
        this.contentFour = [{name:'河道负责人',key:'riverManager'},{name:'管理单位名称',key:'manageUnit'},{name:'重点属性',key:'keyAttributes'},{name:'成立时间',key:'establishTime'}];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    getContent(content,detail){
        return (
            <table>
                <tbody>
                {content.map((item,index)=>
                    <tr key={index}>
                        <td className={cssStyle.title}>{item.name}</td>
                        <td>{detail[item.key]}</td>
                    </tr>
                )}
                </tbody>
            </table>
        );
    }

    render() {
        const {detail} = this.props;
        if(detail == null){
            return '';
        }
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.headBox}>
                    <div>场所名称：</div>
                    <div className={cssStyle.headName}>{detail.areaName}</div>
                </div>
                <div className={cssStyle.contentBox}>
                    <Scrollbars>
                        {this.getContent(this.contentOne,detail)}
                        {this.getContent(this.contentTwo,detail)}
                        {this.getContent(this.contentThree,detail)}
                        {this.getContent(this.contentFour,detail)}
                    </Scrollbars>
                </div>
            </div>
        );
    }
}