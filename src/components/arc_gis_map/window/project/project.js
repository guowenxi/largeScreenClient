import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";

export default class Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,pageIndex:0};
        this.refDom = React.createRef();
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
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            项目名称：
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.projectName}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            项目过程：
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.projectType}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            谋划性质：
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.projectPlanType}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            所处阶段：
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.processTypeName}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}