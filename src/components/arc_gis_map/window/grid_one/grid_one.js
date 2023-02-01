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
        this.loadData();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.attributes.adCode !== this.props.attributes.adCode){
            //组件数据源变更时刷新数据
            this.loadData();
        }
    }

    loadData(){
        const {attributes} = this.props;
        // const gridUrl = './json/fkzh/gridDetail.json';
        const gridUrl = 'http://10.49.144.65:8000/fyDataManage/screenTown/communityGridAndWarning';
        axios.get(gridUrl, { params: { rbacToken: this.props.token, roadId: attributes.adCode } }).then((response) => {
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
        const {data} = this.state;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={150}/>
                <div className={cssStyle.headOneBox} >
                    <div className={cssStyle.headName}>{attributes.name}</div>
                </div>
                <table>
                    <tbody className={`${cssStyle.itemContent} ${cssStyle.sameWidth}`}>
                    {data.grinNum && (
                        <tr>
                            <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                                <span>网</span>
                                <span>格</span>
                                <span>数：</span>
                            </td>
                            <td style={{minWidth:'10em'}}>{data.grinNum}</td>
                        </tr>
                    )}
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            <span>告</span>
                            <span>警</span>
                            <span>数：</span>
                        </td>
                        <td style={{minWidth:'10em'}}>{data.warningNum}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}