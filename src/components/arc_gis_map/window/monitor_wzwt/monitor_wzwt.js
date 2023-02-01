import React from "react";
import cssStyle from "./monitor_wzwt.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";

import { interactData } from "../../../../common/util";
import yujing from "./images/yujingjiankong.svg"

export default class CarUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showEdit: false, pageIndex: 0 };
        this.refDom = React.createRef();
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //搜索点击响应
    itemClick() {
        const { attributes } = this.props;
        this.interactData(attributes.interactWindow, attributes);
    }

    render() {
        const { attributes } = this.props;
        return (
            <div ref={this.refDom} className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={150} />
                <div className={cssStyle.headOneBox} onClick={this.itemClick.bind(this)}>
                    <div className={cssStyle.headName} style={{ color: 'white' }}>{attributes.road}</div>
                    <div className={cssStyle.No} />
                </div>
                <div style={{ display: 'flex' }}>
                    <img alt="" src={attributes.img} className={cssStyle.imgStyle} />
                    <div style={{width:'70%',height:'100%'}}>
                        <table className={cssStyle.table}>
                            <tbody className={`${cssStyle.itemContent}`}>
                                <tr>
                                    <td className={cssStyle.itemBox} >
                                        <div style={{ display: 'flex' }}>
                                            <div className={cssStyle.title}>抓拍数量：</div>
                                            <div style={{ color: 'white' }}>{attributes.num}</div>
                                        </div>
                                    </td>
                                    <td className={cssStyle.itemBox}>
                                        <div style={{ display: 'flex' }}>
                                            <div className={cssStyle.title}>类型：</div>
                                            <div style={{ color: 'white' }}>{attributes.monitorType}</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={cssStyle.itemBox}>
                                        <div style={{ display: 'flex' }}>
                                            <div className={cssStyle.title}>预警总数：</div>
                                            <div style={{ color: 'white' }}>{attributes.warningNum}</div>
                                        </div>
                                    </td>
                                    <td className={cssStyle.itemBox}>
                                        <div style={{ display: 'flex' }}>
                                            <div className={cssStyle.title}>整改数：</div>
                                            <div style={{ color: 'white' }}>{attributes.rectificationNum}</div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{ display: 'flex', alignItems: 'center' ,position:'relative' }}>
                            <img alt="" src={yujing} />
                            <div style={{ color: 'white' }}>{attributes.carNumber}</div>
                            <div style={{ color: 'white' }}>{attributes.time}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}