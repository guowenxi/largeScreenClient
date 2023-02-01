/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./gradientText.module.css";
import { interactData } from "../../../common/util";

export default class SpecialLineThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = { line: 0 };
        this.start = performance.now();
        this.frame = this.frame.bind(this);
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        cancelAnimationFrame(this.fameNum);
    }

    //组件加载触发函数
    componentDidMount() {
        setTimeout(() => {
            this.frame();
        });
    }
    handleClickInteract(item) {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }
    frame() {
        const now = performance.now();
        const phase = ((now - this.start) / 20 % 100) / 100;
        // const speed = this.props.speed ? this.props.speed : 0.1;
        const { thisData } = this.props;
        const stopDom1 = document.querySelector('#stop1_' + thisData.id);
        const stopDom2 = document.querySelector('#stop2_' + thisData.id);
        const stopDom3 = document.querySelector('#stop3_' + thisData.id);
        stopDom1.setAttribute("offset", phase);
        stopDom2.setAttribute("offset", phase + 0.05 > 1 ? 1 : phase + 0.05);
        stopDom3.setAttribute("offset", phase + 0.1 > 1 ? 1 : phase + 0.1);
        this.fameNum = requestAnimationFrame(this.frame);
    }
    getBoxSize() {
        const { boxRef } = this;
        if (boxRef) {
            const { offsetWidth, offsetHeight } = boxRef;
            return {
                width: offsetWidth || 0,
                height: offsetHeight || 0,
            }
        }
        return {
            width: 0,
            height: 0,
        }
    }
    render() {
        const { line } = this.state;
        const { detail, thisData, styleData } = this.props;
        const thisDetail = Array.isArray(detail) && detail.length <= 2 ? [...detail, ...JSON.parse(styleData.restContent)] : detail;
        const { width, height } = this.getBoxSize();
        const position = [
            { x: '15%', y: '30%', fill: '#fff' },
            { x: '43%', y: '70%', fill: '#fff' },
            { x: '6%', y: '11%', fill: 'rgba(255,255,255,0.66)' },
            { x: '9%', y: '55%', fill: 'rgba(255,255,255,0.66)' },
            { x: '24.5%', y: '90%', fill: 'rgba(255,255,255,0.66)' },
            { x: '66%', y: '15%', fill: 'rgba(255,255,255,0.66)' },
            { x: '60%', y: '40%', fill: 'rgba(255,255,255,0.66)' },
            { x: '66%', y: '90%', fill: 'rgba(255,255,255,0.66)' },
        ];
        return (
            <div style={this.props.style} className={cssStyle.container} ref={el => this.boxRef = el}>
                <svg x="0" y="0" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                    <filter xmlns="http://www.w3.org/2000/svg" id="filter" filterUnits="userSpaceOnUse">
                        <feGaussianBlur result="blur" stdDeviation="8" in="SourceAlpha" />
                        <feComposite result="composite" />
                        <feComposite result="composite-2" />
                        <feComposite result="composite-3" />
                        <feFlood result="flood" floodColor="rgba(255,255,255,0.2)" floodOpacity="0.6" />
                        <feComposite result="composite-4" operator="in" in2="composite-3" />
                        <feBlend result="blend" in2="SourceGraphic" />
                        <feBlend result="blend-2" in="SourceGraphic" />
                    </filter>
                    <radialGradient id={`linearGradient_1`} cx="212.5" cy="99.5" r="100%" gradientUnits="userSpaceOnUse" >
                        <stop id={'stop1_' + thisData.id} offset={line + 0.01 > 1 ? 1 : line + 0.01} stopColor="#39DAFF" stopOpacity="0" />
                        <stop id={'stop2_' + thisData.id} offset={line + 0.05 > 1 ? 1 : line + 0.05} stopColor="#39DAFF" stopOpacity="1" />
                        <stop id={'stop3_' + thisData.id} offset={line + 0.1 > 1 ? 1 : line + 0.1} stopColor="#39DAFF" stopOpacity="0" />
                    </radialGradient>
                    {
                        Array.isArray(thisDetail) &&
                        thisDetail.map((item, index) => {
                            const { x, y, } = position[index];
                            return (
                                <text
                                    x={x}
                                    y={y}
                                    key={index}
                                    style={{ filter: 'url("#filter")' }}
                                    className={cssStyle.text}
                                >
                                    {item.name}&nbsp;&nbsp;&nbsp;{index === 0 || index === 1 ? item.num : ''}
                                </text>
                            )
                        })
                    }
                    {
                        Array.isArray(thisDetail) &&
                        thisDetail.map((item, index) => {
                            const { x, y, fill } = position[index];
                            return (
                                <text
                                    x={x}
                                    y={y}
                                    key={index}
                                    style={{ fill }}
                                    className={cssStyle.text}
                                >
                                    {item.name}&nbsp;&nbsp;&nbsp;{index === 0 || index === 1 ? item.num : ''}
                                </text>
                            )
                        })
                    }
                    {
                        Array.isArray(thisDetail) &&
                        thisDetail.map((item, index) => {
                            const { x, y } = position[index];
                            return (
                                <text
                                    x={x}
                                    y={y}
                                    key={index}
                                    style={{ fill: 'url("#linearGradient_1")' }}
                                    className={cssStyle.text}
                                    onClick={this.handleClickInteract.bind(this, item)}
                                >
                                    {item.name}&nbsp;&nbsp;&nbsp;{index === 0 || index === 1 ? item.num : ''}
                                </text>
                            )
                        })
                    }
                </svg>
            </div>
        );
    }
}