import React from "react";
import cssStyle from "./parking_wzwt.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";

import { interactData } from "../../../../common/util";
import location from "./images/location.svg"

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
                    <div className={cssStyle.headName} style={{ color: 'white' }}>{attributes.address}</div>
                    <div className={cssStyle.No} />
                </div>
                <div style={{ display: 'flex' }}>
                    <img alt="" src={attributes.img} className={cssStyle.imgStyle} />
                    <table className={cssStyle.table}>
                        <tbody className={`${cssStyle.itemContent} `}>
                            <tr>
                                <td className={cssStyle.tdTitle} >
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ color: 'white' }}>总车位数：</div>
                                        <div style={{ color: 'white' }}>{attributes.allNum}</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle}>
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ color: 'white' }}>空余车位数量：</div>
                                        <div style={{ color: 'white' }}>{attributes.restNum}</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className={cssStyle.tdTitle} style={{display:'flex'}} >
                                    <img alt="" src={location} style={{width:'10%'}} />
                                    <div style={{ color: 'white' }}>{attributes.address}</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}