import React from "react";
// import {SVG} from "@svgdotjs/svg.js";

export default class Rect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.saveRef = ref => {this.refDom = ref};
    }

    //组件加载触发函数
    componentDidMount() {
        this.timer = setTimeout(() => this.drawSvg());
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    drawSvg(){
        const {clientWidth, clientHeight} = this.refDom;
        const {tilt} = this.props;
        // eslint-disable-next-line no-undef
        const draw = SVG(this.props.id).viewbox(0,0,clientWidth,clientHeight).size('100%','100%');
        const gradient = draw.gradient('linear', function(stop) {
            stop.at(0, '#142e7d');
            stop.at(0.5, '#0066d4');
            stop.at(1, '#142e7d');
        }).from(0, 0).to(0, 1);
        const path = '1,'+(clientHeight-1)+' '+tilt+',1 '+(clientWidth-1)+',1 '+(clientWidth-tilt)+','+(clientHeight-1);
        draw.polygon(path).attr({fill:gradient,stroke:'#00a4ff','stroke-width':2});
    }

    render() {
        return (
            <div ref={this.saveRef} id={this.props.id} style={this.props.style} className={this.props.className}/>
        );
    }
}