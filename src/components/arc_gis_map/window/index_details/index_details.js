import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import axios from "axios";

export default class SanitationWorker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:{}};
    }

    //组件加载触发函数
    componentDidMount() {
        // this.loadData();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.attributes.adCode !== this.props.attributes.adCode){
            //组件数据源变更时刷新数据
            // this.loadData();
        }
    }

    loadData(){
        const {attributes} = this.props;
        axios.get(attributes.dataUrl, { params: { rbacToken: this.props.token, communityId: attributes.adCode } }).then((response) => {
            // 在这儿实现 setState
            const result = response.data.data;
            if (result) {
                this.setState({ data:result });
            }
        }).catch(function (error) {
            // 处理请求出错的情况
        });
    }

    render() {
        const {attributes} = this.props;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={150}/>
                <div className={cssStyle.headOneBox} >
                    <div className={cssStyle.headName}>{attributes.name}</div>
                </div>
                <table>
                    <tbody className={`${cssStyle.itemContent} ${cssStyle.sameWidth}`}>
                      <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>乐治指数：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.indicatorJoy}</td>
                      </tr>
                      <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>平安指数：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.indicatorPeace}</td>
                      </tr>
                      <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>网格指数：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{attributes.indicatorGridActive}</td>
                      </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}