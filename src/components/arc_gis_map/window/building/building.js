import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";

export default class Building extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:{}};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        const {attributes} = this.props;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={150}/>
                <table>
                    <tbody className={`${cssStyle.itemContent} ${cssStyle.sameWidth}`}>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'4.2em'}}>
                            {'楼盘名称'.split('').map((item,index)=><span key={index}>{item}</span>)}
                        </td>
                        <td style={{minWidth:'15em',paddingLeft:'0.5em'}}>
                            {attributes.name}
                        </td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'4.2em'}}>
                            {'地址'.split('').map((item,index)=><span key={index}>{item}</span>)}
                        </td>
                        <td style={{minWidth:'15em',paddingLeft:'0.5em'}}>
                            {attributes.addre}
                        </td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'4.2em'}}>
                            {'开发商'.split('').map((item,index)=><span key={index}>{item}</span>)}
                        </td>
                        <td style={{minWidth:'15em',paddingLeft:'0.5em'}}>
                            {attributes.devName}
                        </td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'4.2em'}}>
                            {'销售状态'.split('').map((item,index)=><span key={index}>{item}</span>)}
                        </td>
                        <td style={{minWidth:'15em',paddingLeft:'0.5em'}}>
                            {attributes.status}
                        </td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'4.2em'}}>
                            {'预警风险'.split('').map((item,index)=><span key={index}>{item}</span>)}
                        </td>
                        <td style={{minWidth:'15em',paddingLeft:'0.5em'}}>
                            {attributes.warningNumber}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}