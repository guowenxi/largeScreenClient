import React from "react";
import cssStyle from './buildingDetail.module.css';

import Scrollbars from "react-custom-scrollbars";

export default class BuildingDetail extends React.Component {
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

    getFileList(fileList){
        if(fileList && Array.isArray(fileList) && fileList.length > 0){
            let newList = [];
            fileList.forEach((file)=>{
                let hasSame = false;
                let i;
                for(i = 0;i < newList.length;i ++){
                    if(file.type === newList[i].type){
                        hasSame = true;
                        break;
                    }
                }
                if(hasSame){
                    newList[i].fileList.push(file);
                }else{
                    newList.push({type:file.type,fileList:[file]});
                }
            });
            return newList;
        }else{
            return [];
        }
    }

    render() {
        const { detail,styleData } = this.props;
        // const { fileServiceUrl } = this.props.styleData;
        const fileList = this.getFileList(detail.fileList);
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.head}>
                    <div className={cssStyle.lineOne} />
                    <div className={cssStyle.lineTwo} />
                    <div className={cssStyle.headText}>基本信息</div>
                </div>
                <div className={cssStyle.contentOne}>
                    <table className={cssStyle.table}>
                        <tbody>
                        <tr>
                            <td className={cssStyle.title}>楼盘名称</td>
                            <td className={cssStyle.tdContentOne}>{detail.name}</td>
                            <td className={cssStyle.title}>楼盘状态</td>
                            <td className={cssStyle.tdContentOne}>{detail.status}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.title}>所属镇街</td>
                            <td className={cssStyle.tdContentOne}>{detail.roadId}</td>
                            <td className={cssStyle.title}>楼盘地址</td>
                            <td className={cssStyle.tdContentOne}>{detail.addre}</td>
                        </tr>
                        <tr>
                            <td className={cssStyle.title}>楼盘介绍</td>
                            <td className={cssStyle.tdContentTwo} colSpan={3}>
                                <Scrollbars>
                                    {detail.info}
                                </Scrollbars>
                            </td>
                        </tr>
                        <tr>
                            <td className={cssStyle.title}>宣传图片</td>
                            <td className={cssStyle.tdContentThree} colSpan={3}>
                                <Scrollbars>
                                    {detail.packageList && detail.packageList.map((item,index)=>
                                        <img alt={''} src={styleData.fileServiceUrl+item} key={index} className={cssStyle.img} />
                                    )}
                                </Scrollbars>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={cssStyle.head}>
                    <div className={cssStyle.lineOne} />
                    <div className={cssStyle.lineTwo} />
                    <div className={cssStyle.headText}>公示信息</div>
                </div>
                <div className={cssStyle.contentOne}>
                    <table className={cssStyle.tableTwo}>
                        <tbody>
                        <tr>
                            <td valign='top' className={cssStyle.titleTwo}>预售资金监管银行：</td>
                            <td valign='top' className={cssStyle.tdContentFour}>{detail.superviseBanks}</td>
                            <td valign='top' className={cssStyle.titleTwo}>项目施工单位：</td>
                            <td valign='top' className={cssStyle.tdContentFour}>{detail.constructionUnits}</td>
                        </tr>
                        <tr>
                            <td valign='top' className={cssStyle.titleTwo}>监管账号：</td>
                            <td valign='top' className={cssStyle.tdContentFour}>{detail.regulatoryAccount}</td>
                            <td valign='top' className={cssStyle.titleTwo}>项目监理单位：</td>
                            <td valign='top' className={cssStyle.tdContentFour}>{detail.regulators}</td>
                        </tr>
                        <tr>
                            <td valign='top' className={cssStyle.titleTwo}>上传附件：</td>
                            <td valign='top' className={cssStyle.tdContentFive} colSpan={3}>
                                <Scrollbars>
                                    {fileList && fileList.map((item,index)=>
                                        <div key={index} className={cssStyle.fileTypeBox}>
                                            <div className={cssStyle.typeName}>{item.type}</div>
                                            <div className={cssStyle.fileBox}>
                                                {item.fileList.map((file,fileIndex)=>
                                                    <div key={index+'_'+fileIndex} className={cssStyle.fileName} onClick={()=>{window.open(styleData.fileServiceUrl+file.url)}}>
                                                        {file.fileName}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Scrollbars>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}