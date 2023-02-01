import React from "react";
import cssStyle from "./specialLineOne.module.css";

import SvgEffectLine from "../../../common/svgEffectLine";

export default class SpecialLineOne extends React.Component {
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
                <div style={this.props.style} className={cssStyle.box} >
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineOne_' + this.props.thisData.id}
                            viewBox="0 0 210 186"
                            preserveAspectRatio="none"
                            d="m 131,182 L 13,114 L 210,0"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineTwo_' + this.props.thisData.id}
                            viewBox="0 0 278 90"
                            preserveAspectRatio="none"
                            d="m 3,82 L 141,4 L 270,83"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxThree}>
                        <SvgEffectLine
                            id={'lineThree_1_' + this.props.thisData.id}
                            viewBox="0 0 231 166"
                            preserveAspectRatio="none"
                            d="m 128,5 L92,31 L45,4 L1,30"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                        <SvgEffectLine
                            id={'lineThree_2_' + this.props.thisData.id}
                            viewBox="0 0 231 166"
                            preserveAspectRatio="none"
                            d="m 128,5 L92,31 L229,118 L164,166"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFour}>
                        <SvgEffectLine
                            id={'lineFour_1_' + this.props.thisData.id}
                            viewBox="0 0 358 184"
                            preserveAspectRatio="none"
                            d="m 153,4 L58,61 L24,41 L1,54"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                        <SvgEffectLine
                            id={'lineFour_2_' + this.props.thisData.id}
                            viewBox="0 0 358 184"
                            preserveAspectRatio="none"
                            d="m 356,115 L255,180 L58,61 L24,41 L1,54"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFive}>
                        <SvgEffectLine
                            id={'lineFive_' + this.props.thisData.id}
                            viewBox="0 0 109 38"
                            preserveAspectRatio="none"
                            d="M6,26 L17,30 L69,6 L108,29"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                </div>
                <div style={this.props.style} className={cssStyle.box} >
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineOne_' + this.props.thisData.id}
                            viewBox="0 0 210 186"
                            preserveAspectRatio="none"
                            d="m 131,182 L 13,114 L 210,0"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineTwo_' + this.props.thisData.id}
                            viewBox="0 0 278 90"
                            preserveAspectRatio="none"
                            d="m 3,82 L 141,4 L 270,83"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxThree}>
                        <SvgEffectLine
                            id={'lineThree_1_' + this.props.thisData.id}
                            viewBox="0 0 231 166"
                            preserveAspectRatio="none"
                            d="m 128,5 L92,31 L45,4 L1,30"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                        <SvgEffectLine
                            id={'lineThree_2_' + this.props.thisData.id}
                            viewBox="0 0 231 166"
                            preserveAspectRatio="none"
                            d="m 128,5 L92,31 L229,118 L164,166"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFour}>
                        <SvgEffectLine
                            id={'lineFour_1_' + this.props.thisData.id}
                            viewBox="0 0 358 184"
                            preserveAspectRatio="none"
                            d="m 153,4 L58,61 L24,41 L1,54"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                        <SvgEffectLine
                            id={'lineFour_2_' + this.props.thisData.id}
                            viewBox="0 0 358 184"
                            preserveAspectRatio="none"
                            d="m 356,115 L255,180 L58,61 L24,41 L1,54"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxFive}>
                        <SvgEffectLine
                            id={'lineFive_' + this.props.thisData.id}
                            viewBox="0 0 109 38"
                            preserveAspectRatio="none"
                            d="M6,26 L17,30 L69,6 L108,29"
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