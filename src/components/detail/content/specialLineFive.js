/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./specialLineFive.module.css";

import SvgEffectLine from "../../../common/svgEffectLine";

export default class SpecialLineFive extends React.Component {
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
                            id={'lineTwo_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M80,494 L457,273 L573,338"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineOne_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M0,342 L171,442 L457,273 L573,338"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineThree_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M156,200 L366,325 L457,273 L573,338"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineFour_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M360,230 L445,281 L457,273 L573,338"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineFive_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M189,333 L271,383 L457,273 L573,338"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineSix_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M326,103 L534,228 L457,273 L573,338"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineSeven_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M540,127 L624,176 L457,273 L573,338"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineEight_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M502,0 L709,125 L457,273 L573,338"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineNine_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M714,7 L812,66 L457,273 L573,338"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineTen_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M839,50 L457,273 L573,338"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(38,255,244,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineEleven_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M555,361 L517,338 L436,386"
                            stroke="rgba(80,89,169,1)"
                            color="rgba(255,155,37,0.8)"
                            effect={false}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineThirteen_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M429,361 L491,324 L434,288 L270,383 L189,334"
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
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M0,342 L171,442 L457,273 L573,338"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineThree_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M156,200 L366,325 L457,273 L573,338"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineFour_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M360,230 L445,281 L457,273 L573,338"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineFive_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M189,333 L271,383 L457,273 L573,338"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineSix_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M326,103 L534,228 L457,273 L573,338"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineSeven_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M540,127 L624,176 L457,273 L573,338"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineEight_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M502,0 L709,125 L457,273 L573,338"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineNine_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M714,7 L812,66 L457,273 L573,338"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(38,255,244,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineEleven_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M555,361 L517,338 L436,386"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                            <SvgEffectLine
                                id={'lineTwelve_'+this.props.thisData.id}
                                viewBox="0 0 839 494"
                                preserveAspectRatio="none"
                                d="M429,361 L491,324 L434,288 L446,280 L360,230"
                                stroke="rgba(80,89,169,0)"
                                color="rgba(255,155,37,0.8)"
                                effect={true}
                                className={cssStyle.box}
                            />
                        </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineThirteen_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M429,361 L491,324 L434,288 L270,383 L189,334"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                            <SvgEffectLine
                                id={'lineFourteen_'+this.props.thisData.id}
                                viewBox="0 0 839 494"
                                preserveAspectRatio="none"
                                d="M429,361 L491,324 L434,288 L368,325 L157,199"
                                stroke="rgba(80,89,169,0)"
                                color="rgba(255,155,37,0.8)"
                                effect={true}
                                className={cssStyle.box}
                            />
                        </div>
                    <div className={cssStyle.lineBoxOne}>
                            <SvgEffectLine
                                id={'lineFifteen_'+this.props.thisData.id}
                                viewBox="0 0 839 494"
                                preserveAspectRatio="none"
                                d="M429,361 L491,324 L434,288 L535,229 L324,103"
                                stroke="rgba(80,89,169,0)"
                                color="rgba(255,155,37,0.8)"
                                effect={true}
                                className={cssStyle.box}
                            />
                        </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineSixteen_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M429,361 L491,324 L434,288 L625,173 L539,127"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineSeventeen_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M429,361 L491,324 L434,288 L710,127 L502,0"
                            stroke="rgba(80,89,169,0)"
                            color="rgba(255,155,37,0.8)"
                            effect={true}
                            className={cssStyle.box}
                        />
                    </div>
                    <div className={cssStyle.lineBoxOne}>
                        <SvgEffectLine
                            id={'lineEighteen_' + this.props.thisData.id}
                            viewBox="0 0 839 494"
                            preserveAspectRatio="none"
                            d="M429,361 L491,324 L434,288 L810,66 L713,9"
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