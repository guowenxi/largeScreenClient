/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./specialLineThree.module.css";

import SvgEffectLine from "../../../common/svgEffectLine";

export default class SpecialLineThree extends React.Component {
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
                            viewBox="0 0 100 59"
                            preserveAspectRatio="none"
                            d="M100,1 L0,58"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineTwo_' + this.props.thisData.id}
                            viewBox="0 0 158 73"
                            preserveAspectRatio="none"
                            d="M158,72 L42,2 L1,23"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxThree}>
                        <SvgEffectLine
                            id={'lineThree_' + this.props.thisData.id}
                            viewBox="0 0 50 34"
                            preserveAspectRatio="none"
                            d="M0,30 50,0"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFour}>
                        <SvgEffectLine
                            id={'lineFour_' + this.props.thisData.id}
                            viewBox="0 0 100 65"
                            preserveAspectRatio="none"
                            d="M0,65 100,0"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFive}>
                        <SvgEffectLine
                            id={'lineFive_' + this.props.thisData.id}
                            viewBox="0 0 269 122"
                            preserveAspectRatio="none"
                            d="M269,52 L167,120 L0,0"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxSix}>
                        <SvgEffectLine
                            id={'lineSix_' + this.props.thisData.id}
                            viewBox="0 0 87 67"
                            preserveAspectRatio="none"
                            d="M87,0 L2,66"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxSeven}>
                        <SvgEffectLine
                            id={'lineSeven_' + this.props.thisData.id}
                            viewBox="0 0 84 95"
                            preserveAspectRatio="none"
                            d="M16,0 L84,34 L0,94 "
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                </div>
                <div style={this.props.style} className={cssStyle.container} >
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineOne_' + this.props.thisData.id}
                            viewBox="0 0 100 59"
                            preserveAspectRatio="none"
                            d="M100,1 L0,58"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineTwo_' + this.props.thisData.id}
                            viewBox="0 0 158 73"
                            preserveAspectRatio="none"
                            d="M158,72 L42,2 L1,23"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxThree}>
                        <SvgEffectLine
                            id={'lineThree_' + this.props.thisData.id}
                            viewBox="0 0 50 34"
                            preserveAspectRatio="none"
                            d="M0,30 50,0"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFour}>
                        <SvgEffectLine
                            id={'lineFour_' + this.props.thisData.id}
                            viewBox="0 0 100 65"
                            preserveAspectRatio="none"
                            d="M0,65 100,0"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFive}>
                        <SvgEffectLine
                            id={'lineFive_' + this.props.thisData.id}
                            viewBox="0 0 269 122"
                            preserveAspectRatio="none"
                            d="M269,52 L167,120 L0,0"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxSix}>
                        <SvgEffectLine
                            id={'lineSix_' + this.props.thisData.id}
                            viewBox="0 0 87 67"
                            preserveAspectRatio="none"
                            d="M87,0 L2,66"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxSeven}>
                        <SvgEffectLine
                            id={'lineSeven_' + this.props.thisData.id}
                            viewBox="0 0 84 95"
                            preserveAspectRatio="none"
                            d="M16,0 L84,34 L0,94 "
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                </div>
            </>
        );
    }
}