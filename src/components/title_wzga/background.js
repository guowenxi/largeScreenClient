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
        const {clientWidth,clientHeight} = this.refDom;
        var drawing = SVG().addTo('#' + this.props.id).viewbox(0,0,clientWidth,clientHeight).size('100%', '100%');
        const path=clientHeight/2+",0 "+(parseInt(clientWidth)-parseInt(clientHeight/2))+",0 "+clientWidth+","+clientHeight/2+" "+(parseInt(clientWidth)-parseInt(clientHeight/2))+","+clientHeight+" "+clientHeight/2+","+clientHeight+" 0,"+clientHeight/2;
        drawing.polygon(path).attr({fill:'rgb(22,56,108)',stroke:'rgb(39,138,198)','stroke-width':2})
    }

    render() {
        return (
            <div id={this.props.id} style={{width:'100%',height:'100%',float:'left'}}  ref={this.saveRef} />
        );
    }
}