import React from "react";
import cssStyle from "../window.module.css";
import { fileUrl } from "../../../../config";

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
        const { data } = this.props;
        const style = this.props.allStyle;
        return (
            <div ref={this.refDom} className={cssStyle.box} style={this.props.style}>
                <div className={cssStyle.imgBox} style={{
                    borderWidth: style.boxStyle === 1 ? style.borderWidth : '',
                    borderColor: style.boxStyle === 1 ? style.borderColor : '',
                    borderRadius: style.boxStyle === 1 ? style.borderWidth : '',
                    borderStyle: style.boxStyle === 1 ? style.borderStyle : '',
                    backgroundImage: style.boxStyle === 2 ? 'url(' + fileUrl + '/download/' + style.backgroundImg + ')' : '',
                }} >
                    <img alt="" src={data.imgSrc} className={cssStyle.imgStyle} style={{ padding: style.imgPadding }} />
                </div>
                <div className={cssStyle.textBox} style={{ padding: style.padding }}>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: "40%" }} className={cssStyle.textStyle}>
                            <span style={{ color: style.titleColor }}>车</span>
                            <span style={{ color: style.titleColor }}>牌</span>
                            <span style={{ color: style.titleColor }}>号：</span>
                        </div>
                        <div style={{ color: style.contentColor }}>{data.carNumber}</div>
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: "40%" }} className={cssStyle.textStyle}>
                            <span style={{ color: style.titleColor }}>颜</span>
                            <span style={{ color: style.titleColor }}>色：</span>
                        </div>
                        <div style={{ color: style.contentColor }}>{data.color}</div>
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: "40%" }} className={cssStyle.textStyle}>
                            <span style={{ color: style.titleColor }}>是</span>
                            <span style={{ color: style.titleColor }}>否</span>
                            <span style={{ color: style.titleColor }}>在</span>
                            <span style={{ color: style.titleColor }}>册：</span>
                        </div>
                        <div style={{ color: style.contentColor }}>{data.onLine}</div>
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: "40%" }} className={cssStyle.textStyle}>
                            <span style={{ color: style.titleColor }}>车</span>
                            <span style={{ color: style.titleColor }}>主：</span>
                        </div>
                        <div style={{ color: style.contentColor }}>{data.people}</div>
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: "40%" }} className={cssStyle.textStyle}>
                            <span style={{ color: style.titleColor }}>联</span>
                            <span style={{ color: style.titleColor }}>系</span>
                            <span style={{ color: style.titleColor }}>方</span>
                            <span style={{ color: style.titleColor }}>式：</span>
                        </div>
                        <div style={{ color: style.contentColor }}>{data.telphone}</div>
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: "40%" }} className={cssStyle.textStyle}>
                            <span style={{ color: style.titleColor }}>进</span>
                            <span style={{ color: style.titleColor }}>入</span>
                            <span style={{ color: style.titleColor }}>时</span>
                            <span style={{ color: style.titleColor }}>间：</span>
                        </div>
                        <div style={{ color: style.contentColor }}>{data.inTime}</div>
                    </div>
                </div>
            </div>
        );
    }
}