import React from "react";

export default class Circle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.saveRef = ref => {this.refDom = ref};
    }

    //组件加载触发函数
    componentDidMount() {
        this.timer = setTimeout(() => this.drawSvg(),1000);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    drawSvg(){
        // eslint-disable-next-line no-undef
        const draw = SVG('circleDrawing'+this.props.id).viewbox(0,0,160,160);
        draw.attr({opacity:0}).animate({duration:500,delay:0}).attr({opacity:1});
        const animate = 3000;
        draw.circle(60).fill('#f8b62d').center(80,80);
        draw.circle(60).fill('none').center(80,80).stroke({width:7,color: '#f8b62d'}).animate({duration:animate,delay:0}).attr({ r: 80 ,opacity:0}).loop();
        draw.circle(60).fill('none').center(80,80).stroke({width:7,color: '#f8b62d'}).animate({duration:animate,delay:1000}).attr({ r: 80 ,opacity:0}).loop();
        draw.circle(60).fill('none').center(80,80).stroke({width:7,color: '#f8b62d'}).animate({duration:animate,delay:2000}).attr({ r: 80 ,opacity:0}).loop();
    }

    render() {
        return (
            <div ref={this.saveRef} id={'circleDrawing'+this.props.id} style={this.props.style} className={this.props.className}/>
        );
    }
}