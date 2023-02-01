import React from "react";
// eslint-disable-next-line no-unused-vars
import cssStyle from "./svgTypeTwo.module.css";
import SvgBox from './components/svgBox/svgBox';
import {getLinearBackground, getRadialBackground} from "../../../../common/util";
export default class SvgTypeTwo extends React.Component {
    constructor(props) {
        super(props);
        this.boxRef = React.createRef();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {

    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {

    }

    getBoxStyle() {
        const { boxRef } = this;
        const { style, } = this.props.thisData;
        if (boxRef && boxRef.current) {
            const width = boxRef.current.offsetWidth;
            const height = boxRef.current.offsetHeight;
            return {
                width,
                height,
                leftBoxWidth: style.leftBoxWidth ? width * (style.leftBoxWidth / 100) : 0,
                rightBoxWidth: style.rightBoxWidth ? width * (style.rightBoxWidth / 100) : 0,
            }
        }
        return {
            width: 0, height: 0, leftBoxWidth: 0, rightBoxWidth: 0,
        }
    }
    render() {
        const { width, height, leftBoxWidth, rightBoxWidth } = this.getBoxStyle();
        const {style} = this.props.thisData;
        const { id } = this.props.thisData;
        const background = style.backgroundGradientType !== 'linear' ? getRadialBackground(style.backgroundColor) : getLinearBackground(style.backgroundColor,style.backgroundAngle);
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{ width: '100%', height: '100%',background }} className={cssStyle.container} ref={this.boxRef}>
                    {width && height && <SvgBox
                        width={width}
                        height={height}
                        leftBoxWidth={leftBoxWidth}
                        rightBoxWidth={rightBoxWidth}
                        id={id}
                        opacity={style.backgroundOpacity}
                        backgroundColor={style.backgroundColor}
                        backgroundGradientType={style.backgroundGradientType}
                    />}
                </div>
            </div>
        );
    }
}