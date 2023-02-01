import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import axios from "axios";
import cssStyleVillage from "./village.module.css";

export default class Village extends React.Component {
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
        if(attributes.dataUrl){
            axios.get(attributes.dataUrl, { params: { rbacToken: this.props.token, roadId:attributes.adCode, parentCode:attributes.adCode } }).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if (result) {
                    this.setState({ data:result });
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    render() {
        const {attributes} = this.props;
        const {data} = this.state;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={150}/>
                <table>
                    <tbody className={`${cssStyle.itemContent} ${cssStyle.sameWidth}`}>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            村社名称：
                        </td>
                        <td style={{minWidth:'10em'}}>
                            {attributes.name}
                        </td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            村社领导：
                        </td>
                        <td style={{minWidth:'10em'}}>
                            {data.people && data.people.map((item,index)=>{
                                return (
                                    <div key={index} className={cssStyleVillage.peopleItem}>
                                        <span>{item.name}</span>
                                        <span>{item.phone}</span>
                                    </div>
                                )
                            })}
                        </td>
                    </tr>
                    <tr>
                        <td className={cssStyle.tdTitle} style={{width:'auto'}}>
                            异常人员：
                        </td>
                        <td style={{minWidth:'10em'}}>
                            <div className={cssStyleVillage.levelBox}>
                                <div className={cssStyleVillage.red}>红色：{data.red}</div>
                                <div className={cssStyleVillage.orange}>橙色：{data.orange}</div>
                                <div className={cssStyleVillage.yellow}>黄色：{data.yellow}</div>
                                <div className={cssStyleVillage.green}>绿色：{data.green}</div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}