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
                            <span style={{ color: style.titleColor }}>姓</span>
                            <span style={{ color: style.titleColor }}>名：</span>
                        </div>
                        <div style={{ color: style.contentColor }}>{data.name}</div>
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: "40%" }} className={cssStyle.textStyle}>
                            <span style={{ color: style.titleColor }}>岗</span>
                            <span style={{ color: style.titleColor }}>位：</span>
                        </div>
                        <div style={{ color: style.contentColor }}>{data.type}</div>
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
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: "40%" }} className={cssStyle.textStyle}>
                            <span style={{ color: style.titleColor }}>健</span>
                            <span style={{ color: style.titleColor }}>康</span>
                            <span style={{ color: style.titleColor }}>码：</span>
                        </div>
                        <div style={{ color: style.contentColor }}>{data.health}</div>
                    </div>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: "40%" }} className={cssStyle.textStyle}>
                            <span style={{ color: style.titleColor }}>体</span>
                            <span style={{ color: style.titleColor }}>温：</span>
                        </div>
                        <div style={{ color: style.contentColor }}>{data.temperature}</div>
                    </div>
                </div>
            </div>
        );
    }
}