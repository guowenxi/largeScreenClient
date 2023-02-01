/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./specialLineSix.module.css";

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
                            viewBox="0 0 484 281"
                            preserveAspectRatio="none"
                            d="M149,199 L205,165 L5,48 L81,2"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineTwo_' + this.props.thisData.id}
                            viewBox="0 0 484 281"
                            preserveAspectRatio="none"
                            d="M149,199 L205,165 L136,124 L214,79"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineThree_' + this.props.thisData.id}
                            viewBox="0 0 484 281"
                            preserveAspectRatio="none"
                            d="M149,199 L205,165 L271,203 L342,161"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineFour_' + this.props.thisData.id}
                            viewBox="0 0 484 281"
                            preserveAspectRatio="none"
                            d="M149,199 L205,165 L406,280 L483,233"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineFive_' + this.props.thisData.id}
                            viewBox="0 0 470 320"
                            preserveAspectRatio="none"
                            d="M5,85 L68,50 L269,161 L296,147 L73,19 L99,0"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineSix_' + this.props.thisData.id}
                            viewBox="0 0 470 320"
                            preserveAspectRatio="none"
                            d="M134,161 L202,124 L269,161 L296,147 L73,19 L99,0"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineSeven_' + this.props.thisData.id}
                            viewBox="0 0 470 320"
                            preserveAspectRatio="none"
                            d="M278,237 L337,202 L269,161 L296,147 L73,19 L99,0"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineEight_' + this.props.thisData.id}
                            viewBox="0 0 470 320"
                            preserveAspectRatio="none"
                            d="M402,316 L470,277 L269,161 L296,147 L73,19 L99,0"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxThree}>
                        <SvgEffectLine
                            id={'lineNine_' + this.props.thisData.id}
                            viewBox="0 0 92 58"
                            preserveAspectRatio="none"
                            d="M0,2 L92,54"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(29,173,255,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                </div>
                <div style={this.props.style} className={cssStyle.container} >
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineOne_' + this.props.thisData.id}
                            viewBox="0 0 484 281"
                            preserveAspectRatio="none"
                            d="M149,199 L205,165 L5,48 L81,2"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineTwo_' + this.props.thisData.id}
                            viewBox="0 0 484 281"
                            preserveAspectRatio="none"
                            d="M149,199 L205,165 L136,124 L214,79"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineThree_' + this.props.thisData.id}
                            viewBox="0 0 484 281"
                            preserveAspectRatio="none"
                            d="M149,199 L205,165 L271,203 L342,161"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineFour_' + this.props.thisData.id}
                            viewBox="0 0 484 281"
                            preserveAspectRatio="none"
                            d="M149,199 L205,165 L406,280 L483,233"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineFive_' + this.props.thisData.id}
                            viewBox="0 0 470 320"
                            preserveAspectRatio="none"
                            d="M5,85 L68,50 L269,161 L296,147 L73,19 L99,0"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineSix_' + this.props.thisData.id}
                            viewBox="0 0 470 320"
                            preserveAspectRatio="none"
                            d="M134,161 L202,124 L269,161 L296,147 L73,19 L99,0"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineSeven_' + this.props.thisData.id}
                            viewBox="0 0 470 320"
                            preserveAspectRatio="none"
                            d="M278,237 L337,202 L269,161 L296,147 L73,19 L99,0"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxTwo}>
                        <SvgEffectLine
                            id={'lineEight_' + this.props.thisData.id}
                            viewBox="0 0 470 320"
                            preserveAspectRatio="none"
                            d="M402,316 L470,277 L269,161 L296,147 L73,19 L99,0"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxThree}>
                        <SvgEffectLine
                            id={'lineNine_' + this.props.thisData.id}
                            viewBox="0 0 92 58"
                            preserveAspectRatio="none"
                            d="M0,2 L92,54"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(29,173,255,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                </div>
            </>
        );
    }
}