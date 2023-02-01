import React from "react";
import cssStyle from "../map_window.module.css";
import cssStyleGridTwo from "./grid_two.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import axios from "axios";

export default class GridTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:{},showDetail:false};
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
            axios.get(attributes.dataUrl, { params: { rbacToken: this.props.token, areaId:attributes.id } }).then((response) => {
                // 在这儿实现 setState
                const result = response.data.data;
                if (result) {
                    let headUrl;
                    for(let i = 0;i < result.length;i ++){
                        if(result[i].name === '微网格长照片'){
                            headUrl = result[i].value;
                            break;
                        }
                    }
                    this.setState({ data:result,headUrl },()=>{
                        this.setState({bgTime:(new Date()).getTime()})
                    });
                }
            }).catch(function (error) {
                // 处理请求出错的情况
            });
        }
    }

    changeDetailShow(){
        this.setState({showDetail:true},()=>{
            this.setState({bgTime:(new Date()).getTime()})
        });
    }

    render() {
        const {data,headUrl} = this.state;
        const {attributes} = this.props;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox} ${cssStyleGridTwo.box}`} style={{...this.props.style,width:headUrl?'29em':'22em'}}>
                <RectTypeThree className={cssStyle.boxBg} bgTime={this.state.bgTime} />
                {headUrl && <img alt={''} src={attributes.fileUrl+headUrl} className={cssStyleGridTwo.head} />}
                <table style={{width:'20em'}}>
                    <tbody className={`${cssStyle.itemContent} ${cssStyle.sameWidth}`}>
                    {data && Array.isArray(data) && data.map((item,index)=>{
                        let content;
                        if(item.name === '微网格长照片'){
                            return null;
                        }else if(item.name === '微网格员'){
                            content = item.value && item.value.split('，').map((text,textIndex)=>
                                <React.Fragment key={textIndex} >
                                    <div>{text}</div>
                                </React.Fragment>
                            );
                        }else if(item.name === '户主姓名'){
                            if(this.state.showDetail){
                                content = item.value;
                            }else{
                                content = <span onClick={this.changeDetailShow.bind(this)} style={{cursor:'pointer'}}>点击展开</span>;
                            }
                        }else{
                            content = item.value;
                        }
                        return (
                            <tr key={index}>
                                <td className={cssStyle.tdTitle} style={{width:'6em',paddingRight:'0.8em'}}>
                                    {item.name && (item.name).split('').map((text,textIndex)=><span key={textIndex}>{text}</span>)}
                                </td>
                                <td>
                                    {content}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}