/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./specialLineSeven.module.css";

import SvgEffectLine from "../../../common/svgEffectLine";

export default class SpecialLineSeven extends React.Component {
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
                            viewBox="0 0 88 52"
                            preserveAspectRatio="none"
                            d="M0,0 88,51"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineTwo_' + this.props.thisData.id}
                            viewBox="0 0 134 81"
                            preserveAspectRatio="none"
                            d="M10,64 L100,9 L128,25"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxThree}>
                        <SvgEffectLine
                            id={'lineThree_' + this.props.thisData.id}
                            viewBox="0 0 122 104"
                            preserveAspectRatio="none"
                            d="M122,38 L55,0"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                        <SvgEffectLine
                            id={'lineThree_' + this.props.thisData.id}
                            viewBox="0 0 122 104"
                            preserveAspectRatio="none"
                            d="M10,85 L100,26 L55,0"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFour}>
                        <SvgEffectLine
                            id={'lineBoxFour_' + this.props.thisData.id}
                            viewBox="0 0 105 59"
                            preserveAspectRatio="none"
                            d="M0,59 L105,0"
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
                            viewBox="0 0 88 52"
                            preserveAspectRatio="none"
                            d="M0,0 88,51"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineTwo_' + this.props.thisData.id}
                            viewBox="0 0 134 81"
                            preserveAspectRatio="none"
                            d="M10,64 L100,9 L128,25"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxThree}>
                        <SvgEffectLine
                            id={'lineThree_1_' + this.props.thisData.id}
                            viewBox="0 0 122 104"
                            preserveAspectRatio="none"
                            d="M122,38 L55,0"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                        <SvgEffectLine
                            id={'lineThree_2_' + this.props.thisData.id}
                            viewBox="0 0 122 104"
                            preserveAspectRatio="none"
                            d="m 10,85 L 100,26 L 55,0"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFour}>
                        <SvgEffectLine
                            id={'lineBoxFour_' + this.props.thisData.id}
                            viewBox="0 0 105 59"
                            preserveAspectRatio="none"
                            d="M0,59 L105,0"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFive}>
                        <SvgEffectLine
                            id={'lineBoxFive_' + this.props.thisData.id}
                            viewBox="0 0 134 64"
                            preserveAspectRatio="none"
                            d="M0,0 L102,61 L130,43"
                            stroke="rgba(80,89,169,1)"
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