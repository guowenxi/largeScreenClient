import React from "react";
import cssStyle from "./svgTypeOne.module.css";
import lightIcon from "./light.png"

export default class circleTypeThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isBig: false };
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if (this.hideTimer) {
            clearTimeout(this.hideTimer);
        }
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const { content } = this.props;
        return (
            <div className={this.props.className} style={{ height: '100%' }}>
                <div className={cssStyle.headBox} style={{ height: '3em' }}>
                    {content.carNumber}
                </div>
                <img alt={''} src={lightIcon} className={cssStyle.lightIcon} />
                <img alt={''} src={lightIcon} className={cssStyle.lightIconTwo} style={{ top: '3em' }} />
                <div className={cssStyle.contentBox} style={{ height: `calc(100% - 3em)` }}>
                    <div className={cssStyle.contentStyle}>
                        <div style={{ width: "50%",display:'flex' }}>
                            <div className={cssStyle.contentTitle}>负责人</div>
                            <div className={cssStyle.contentData}>{content.name}</div>
                        </div>
                        <div style={{ width: "50%",display:'flex' }}>
                            <div className={cssStyle.contentTitle}>车辆类型</div>
                            <div className={cssStyle.contentData}>{content.carType}</div>
                        </div>
                    </div>
                    <div className={cssStyle.contentStyle}>
                        <div style={{ width: "50%",display:'flex' }}>
                            <div className={cssStyle.contentTitle}>联系电话</div>
                            <div className={cssStyle.contentData}>{content.telphone}</div>
                        </div>
                        <div style={{ width: "50%",display:'flex' }}>
                            <div className={cssStyle.contentTitle}>上牌费用</div>
                            <div className={cssStyle.contentData}>{content.registration}</div>
                        </div>
                    </div>
                    <div className={cssStyle.contentStyle}>
                        <div style={{ width: "50%",display:'flex' }}>
                            <div className={cssStyle.contentTitle}>车辆型号</div>
                            <div className={cssStyle.contentData}>{content.carModel}</div>
                        </div>
                        <div style={{ width: "50%",display:'flex' }}>
                            <div className={cssStyle.contentTitle}>改造费用</div>
                            <div className={cssStyle.contentData}>{content.reform}</div>
                        </div>
                    </div>
                    <div className={cssStyle.contentStyle}>
                        <div style={{ width: "50%",display:'flex' }}>
                            <div className={cssStyle.contentTitle}>车辆购置税</div>
                            <div className={cssStyle.contentData}>{content.purchase}</div>
                        </div>
                        <div style={{ width: "50%",display:'flex' }}>
                            <div className={cssStyle.contentTitle}>绑定的加油卡</div>
                            <div className={cssStyle.contentData}>{content.oil}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}