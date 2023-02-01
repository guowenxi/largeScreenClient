/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./specialLineFour.module.css";

import SvgEffectLine from "../../../common/svgEffectLine";

export default class SpecialLineFour extends React.Component {
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

    render() {
        return (
            <>
                <div style={this.props.style} className={cssStyle.container} >
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineOne_' + this.props.thisData.id}
                            viewBox="0 0 484 283"
                            preserveAspectRatio="none"
                            d="M289,109 L263,124 L50,2 L0,32"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineTwo_' + this.props.thisData.id}
                            viewBox="0 0 484 283"
                            preserveAspectRatio="none"
                            d="M289,109 L263,124 L484,253 L435,282"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxThree}>
                        <SvgEffectLine
                            id={'lineThree_' + this.props.thisData.id}
                            viewBox="0 0 484 283"
                            preserveAspectRatio="none"
                            d="M289,109 L263,124 L214,153"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFour}>
                        <SvgEffectLine
                            id={'lineFour_' + this.props.thisData.id}
                            viewBox="0 0 493 289"
                            preserveAspectRatio="none"
                            d="M275,137 L225,166 L147,211"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFive}>
                        <SvgEffectLine
                            id={'lineFive_' + this.props.thisData.id}
                            viewBox="0 0 493 289"
                            preserveAspectRatio="none"
                            d="M60,1 L1,37 L225,166 L147,211"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxSix}>
                        <SvgEffectLine
                            id={'lineSix_' + this.props.thisData.id}
                            viewBox="0 0 493 289"
                            preserveAspectRatio="none"
                            d="M492,257 L435,288 L225,166 L147,211"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                </div>
                <div style={this.props.style} className={cssStyle.container} >
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineOne_' + this.props.thisData.id}
                            viewBox="0 0 484 283"
                            preserveAspectRatio="none"
                            d="M289,109 L263,124 L50,2 L0,32"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineTwo_' + this.props.thisData.id}
                            viewBox="0 0 484 283"
                            preserveAspectRatio="none"
                            d="M289,109 L263,124 L484,253 L435,282"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxThree}>
                        <SvgEffectLine
                            id={'lineThree_' + this.props.thisData.id}
                            viewBox="0 0 484 283"
                            preserveAspectRatio="none"
                            d="M289,109 L263,124 L214,153"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFour}>
                        <SvgEffectLine
                            id={'lineFour_' + this.props.thisData.id}
                            viewBox="0 0 493 289"
                            preserveAspectRatio="none"
                            d="M275,137 L225,166 L147,211"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFive}>
                        <SvgEffectLine
                            id={'lineFive_' + this.props.thisData.id}
                            viewBox="0 0 493 289"
                            preserveAspectRatio="none"
                            d="M60,1 L1,37 L225,166 L147,211"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxSix}>
                        <SvgEffectLine
                            id={'lineSix_' + this.props.thisData.id}
                            viewBox="0 0 493 289"
                            preserveAspectRatio="none"
                            d="M492,257 L435,288 L225,166 L147,211"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                </div>
            </>
        );
    }
}