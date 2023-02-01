import React from "react";
import cssStyle from "./importantPlaceTwo.module.css";

export default class ImportantPlaceThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }


    render() {
        const {detail,styleData} = this.props;
        if(detail == null){
            return '';
        }
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.contentBox}>
                    <table>
                        <tbody>
                        <tr >
                            <td className={`${cssStyle.title} ${cssStyle.threeTitle}`}>房屋类型</td>
                            <td className={cssStyle.threeContent}>{detail.residenceTypeName}</td>
                            <td className={`${cssStyle.title} ${cssStyle.threeTitle}`}>ID</td>
                            <td className={cssStyle.threeContent}>{detail.residenceCode}</td>
                        </tr>
                        <tr >
                            <td className={`${cssStyle.title} ${cssStyle.threeTitle}`}>户主姓名</td>
                            <td className={cssStyle.threeContent}>{detail.householderName}</td>
                            <td className={`${cssStyle.title} ${cssStyle.threeTitle}`}>联系方式</td>
                            <td className={cssStyle.threeContent}>{detail.householderPhone}</td>
                        </tr>
                        <tr >
                            <td className={`${cssStyle.title} ${cssStyle.threeTitle}`}>地址</td>
                            <td className={cssStyle.threeBigContent} colSpan={3}>{detail.address}</td>
                        </tr>
                        {styleData.contentType === 2 && (
                            <tr >
                                <td className={`${cssStyle.title} ${cssStyle.threeTitle}`}>排查状态</td>
                                <td className={cssStyle.threeContent}>{detail.lastCheckStateName}</td>
                                <td className={`${cssStyle.title} ${cssStyle.threeTitle}`}>最后排查时间</td>
                                <td className={cssStyle.threeContent}>{detail.lastCheckTime ? detail.lastCheckTime:'暂无'}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}