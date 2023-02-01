import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";

export default class BuildingTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:{}};
        this.colorList = ['#48DD79','#5CC8FA','#FF9E47','#FF4E43'];
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
                            {'楼盘别名'.split('').map((item,index)=><span key={index}>{item}</span>)}
                        </td>
                        <td style={{minWidth:'15em',paddingLeft:'0.5em'}}>
                            {attributes.nickName}
                        </td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'4.2em'}}>
                            {'开发企业'.split('').map((item,index)=><span key={index}>{item}</span>)}
                        </td>
                        <td style={{minWidth:'15em',paddingLeft:'0.5em'}}>
                            {attributes.devName}
                        </td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'4.2em'}}>
                            {'风险等级'.split('').map((item,index)=><span key={index}>{item}</span>)}
                        </td>
                        <td style={{minWidth:'15em',paddingLeft:'0.5em',color:this.colorList[attributes.level]}}>
                            {attributes.warningLevel}
                        </td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'4.2em'}}>
                            {'风险情况'.split('').map((item,index)=><span key={index}>{item}</span>)}
                        </td>
                        <td style={{minWidth:'15em',paddingLeft:'0.5em'}}>
                            {attributes.warning}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}