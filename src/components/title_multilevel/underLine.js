import React from "react";
import { SVG } from "@svgdotjs/svg.js";

export default class Rect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.saveRef = ref => { this.refDom = ref };
    }

    //组件加载触发函数
    componentDidMount() {
        this.timer = setTimeout(() => this.drawSvg());
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    drawSvg() {
        const {clientWidth} = this.refDom;
        var drawing = SVG().addTo('#' + this.props.id).viewbox(0,0,clientWidth,10).size('100%', '100%');
        drawing.circle(4).move(0,0).fill('rgb(77,162,255)')
        var path='M2 2 L'+clientWidth+' 2'
        drawing.path(path).stroke({color:'rgb(77,162,255)',width:1})
        drawing.circle(4).move((parseInt(clientWidth)-4),0).fill('rgb(77,162,255)')
    }

    render() {
        const style = this.props.graphicalStyle;
        return (
            <div id={this.props.id} style={{width:'100%',height:'100%',display:style.lineStyle===2&&style.showLine?'block':'none'}} ref={this.saveRef} />
        );
    }
}