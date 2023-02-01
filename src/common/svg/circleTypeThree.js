import React from "react";

export default class circleTypeThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.boxRef = React.createRef();
        this.id = new Date().getTime();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        let width, height;
        if (this.boxRef && this.boxRef.current) {
            width = this.boxRef.current.clientWidth;
            height = this.boxRef.current.clientHeight;
        }
        const style = this.props.allStyle;
        let sum = parseInt(this.props.sum);
        let num = parseInt(this.props.num);
        let angel = num / sum;
        let allAngel=1-angel;
        let x = width / 2 - parseFloat((Math.cos(angel * 2 * Math.PI) * style.outRadius));
        let y = height / 2 - parseFloat((Math.sin(angel * 2 * Math.PI) * style.outRadius));
        let a = width / 2 - parseFloat((Math.cos(allAngel * 2 * Math.PI) * style.InRadius));
        let b = height / 2 - parseFloat((Math.sin(allAngel * 2 * Math.PI) * style.InRadius));
        return (
            <div style={this.props.style} className={this.props.className} ref={this.boxRef}>
                {width && height ? (
                    <svg x="0" y="0" viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
                        <path d={`M ${(width / 2) - style.outRadius} ${height / 2} A ${style.outRadius} ${style.outRadius}, 0, ${angel > 0.5 ? 1 : 0}, 1, ${x},${y}`} stroke={`${style.outColor}`} strokeWidth={`${style.MaxRadius}`} fill="RGBA(255,255,255,0)" />
                        <path d={`M ${(width / 2) - style.InRadius} ${height / 2} A ${style.InRadius} ${style.InRadius}, 0, ${allAngel > 0.5 ? 1 : 0}, 1, ${a},${b}`} stroke={`${style.inColor}`} strokeWidth={`${style.MinRadius}`} fill="RGBA(255,255,255,0)" />
                    </svg>
                ) : ''}
            </div>
        );
    }
}