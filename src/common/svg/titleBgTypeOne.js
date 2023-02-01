import React from "react";
import cssStyle from "./titleBgTypeOne.module.css";
import titleBgImg from "../images/titleBgTypeOne.svg";
import lightIcon from "../images/light.png";

export default class TitleBgTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        return (
            <div id={this.props.id} style={this.props.style} className={this.props.className}>
                <img alt='' src={titleBgImg} className={cssStyle.bg}/>
                {/*<div className={cssStyle.line}>*/}
                {/*    <img alt={''} src={lightIcon} className={cssStyle.lineImg}/>*/}
                {/*</div>*/}
                <svg viewBox="0 0 1920 110" preserveAspectRatio="none" className={cssStyle.bg}>
                    <clipPath id="cut-off-bottom">
                        {/*<polygon points="0,30.5 710.6,30.5 740.3,66.5 1160,66.5 1190.9,30.5 1920,30.5 1920,27.5 1189.9,27.5 1159,63.5 741.3,63.5 711.6,27.5 0,27.5" />*/}
                        {/*<polygon points="0,31.5 710.6,31.5 740.3,67.5 1160,67.5 1190.9,31.5 1920,31.5 1920,26.5 1189.9,26.5 1159,62.5 741.3,62.5 711.6,26.5 0,26.5" />*/}
                        {/*<polygon points="0,31 710.6,31 740.3,67 1160,67 1190.9,31 1920,31 1920,27 1189.9,27 1159,63 741.3,63 711.6,27 0,27" />*/}
                        <polygon points="0,32 710.6,32 740.3,68 1160,68 1190.9,32 1920,32 1920,26 1189.9,26 1159,62 741.3,62 711.6,26 0,26" />
                        {/*<polygon points="0,30 710.6,30 740.3,66 1159,66 1189.9,30 1920,30 1920,28 1189.9,28 1159,64 741.3,64 711.6,28 0,28" />*/}
                    </clipPath>
                    {/*<polyline  points="0,29 711.6,29 741.3,65 1159,65 1189.9,29 1920,29 " className={cssStyle.polyline} clipPath="url(#cut-off-bottom)"/>*/}
                    <image x="1100" y="-1" width="108" height="60" xlinkHref={lightIcon} clipPath="url(#cut-off-bottom)" className={cssStyle.svgImg} />
                </svg>
            </div>
        );
    }
}