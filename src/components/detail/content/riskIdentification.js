import React from "react";
import cssStyle from "./riskIdentification.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import {Pagination} from "antd";
import "./pagination.css";

export default class RiskIdentification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedIndex:0,fileId:''};
        this.levelColor = ['','#E26B0A','#FFC000','#FFFF00','#3366FF'];
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    changePage(page, pageSize) {
        this.props.changeKeyParams({ pageNo: page, pageSize });
    }

    render() {
        const { detail, keyParams } = this.props;
        if (detail == null) {
            return '';
        }
        const { total, list } = detail;
        const { pageNo, pageSize } = keyParams;
        return (
            <div style={this.props.style} className={`${cssStyle.box} black-blue-page`} >
                <table className={cssStyle.content}>
                    {list && Array.isArray(list) && list.map((item,index)=>
                        <tbody key={index}>
                        <tr style={{height:'2.5em'}} className={cssStyle.title}>
                            <td style={{width:'16%'}}>检查项目</td>
                            <td style={{width:'32%'}} colSpan={2}>标准</td>
                            <td style={{width:'32%',fontSize:'0.9em'}} colSpan={2}>不符合标准情况及后果</td>
                            <td style={{width:'20%'}}>管控措施</td>
                        </tr>
                        <tr style={{height:'calc(100% -7.5em)'}}>
                            <td style={{width:'16%'}}>{item.name}</td>
                            <td style={{width:'32%'}} colSpan={2}>
                                <Scrollbars>
                                    {item.standard}
                                </Scrollbars>
                            </td>
                            <td style={{width:'32%'}} colSpan={2}>
                                <Scrollbars>
                                    {item.consequence}
                                </Scrollbars>
                            </td>
                            <td style={{width:'20%'}}>
                                <Scrollbars>
                                    {item.measure}
                                </Scrollbars>
                            </td>
                        </tr>
                        <tr style={{height:'2.5em'}} className={cssStyle.title}>
                            <td style={{width:'16%'}}>L</td>
                            <td style={{width:'16%'}}>S</td>
                            <td style={{width:'16%'}}>R</td>
                            <td style={{width:'16%'}}>风险等级</td>
                            <td style={{width:'16%'}}>风险色标</td>
                            <td style={{width:'20%'}}>管控级别</td>
                        </tr>
                        <tr style={{height:'2.5em'}}>
                            <td style={{width:'16%'}}>{item.l}</td>
                            <td style={{width:'16%'}}>{item.s}</td>
                            <td style={{width:'16%'}}>{item.r}</td>
                            <td style={{width:'16%'}}>{item.level}</td>
                            <td style={{width:'16%'}}>
                                <div className={cssStyle.level} style={{background:this.levelColor[item.level]}}/>
                            </td>
                            <td style={{width:'20%'}}>{item.controlLevel}</td>
                        </tr>
                        </tbody>
                    )}
                </table>
                <Pagination current={pageNo} pageSize={pageSize} total={total} onChange={this.changePage.bind(this)} />
            </div>
        );
    }
}