import React from "react";
import cssStyle from "./drugAdministration.module.css";
import icon from "../images/drugIcon.svg"
import { Scrollbars } from "react-custom-scrollbars";

export default class CheckTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showEdit: false, pageIndex: 0 };
        this.refDom = React.createRef();
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        const { detail } = this.props;
        const {style} = this.props.thisData;
        return (
            <div className={`${cssStyle.box} ${style.contentStyle === 2 ? cssStyle.themeTwo:''}`} style={this.props.style}>
                <div className={cssStyle.title}>
                    <div className={cssStyle.titleLeft}>
                        <div className={cssStyle.titleName}>{detail.companyName}</div>
                        <div className={cssStyle.titleType}>{detail.type}</div>
                    </div>
                    <div className={cssStyle.titleRight}>
                        <img alt="" src={icon} className={cssStyle.icon} />
                        <div className={cssStyle.supervisory}>{detail.supervisory}</div>
                    </div>
                </div>
                <div className={cssStyle.textLeft}>
                    <div className={cssStyle.textBox}>
                        <div className={cssStyle.itemBox}>
                            <div className={cssStyle.question}>统一信用代码</div>
                            <div className={cssStyle.answer}>{detail.code}</div>
                        </div>
                    </div>
                    <div className={cssStyle.textBox}>
                        <div className={cssStyle.itemBox}>
                            <div className={cssStyle.question}>经营地址</div>
                            <div className={cssStyle.answer}>{detail.address}</div>
                        </div>
                    </div>
                    <div className={cssStyle.textBox}>
                        <div className={cssStyle.itemBox}>
                            <div className={cssStyle.question}>生命周期</div>
                            <div className={cssStyle.answer}>{detail.life}</div>
                        </div>
                    </div>
                    <div className={cssStyle.textBox}>
                        <div className={cssStyle.itemBox}>
                            <div className={cssStyle.question}>负责人</div>
                            <div className={cssStyle.answer}>{detail.person}</div>
                        </div>
                    </div>
                    <div className={cssStyle.textBox}>
                        <div className={cssStyle.itemBox}>
                            <div className={cssStyle.question}>成立时间</div>
                            <div className={cssStyle.answer}>{detail.time}</div>
                        </div>
                    </div>
                </div>
                <div className={cssStyle.line} />
                <div className={cssStyle.textRight}>
                    <div>
                        <table style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th className={cssStyle.tableHead}>类型</th>
                                    <th className={cssStyle.tableHead}>上年度信用分</th>
                                    <th className={cssStyle.tableHead}>上年度信用评级</th>
                                    <th className={cssStyle.tableHead}>年度监督分</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div style={{width:'100%',height:'80%'}}>
                        <Scrollbars>
                        <table style={{width:'100%'}}>
                            <tbody>
                                {detail.table && detail.table.map((item,index) => {
                                    return (
                                        <tr className={cssStyle.tableBody} key={index}>
                                            <td><div title={item.type} className={cssStyle.tdStyle}>{item.type}</div></td>
                                            <td><div title={item.credit} className={cssStyle.tdStyle}>{item.credit}</div></td>
                                            <td><div title={item.level} className={cssStyle.tdStyle}>{item.level}</div></td>
                                            <td><div title={item.supervise} className={cssStyle.tdStyle}>{item.supervise}</div></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        </Scrollbars>
                    </div>
                </div>
            </div>
        );
    }
}