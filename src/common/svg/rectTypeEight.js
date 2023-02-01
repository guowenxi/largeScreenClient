import React from "react";
import cssStyle from "./rectTypeEight.module.css";

export default class rectTypeEight extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.boxRef = React.createRef();
        this.id = new Date().getTime();
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    //组件加载触发函数
    componentDidMount() {
        this.timer = setTimeout(()=>{this.setState({})});
    }

    render() {
        let width, height;
        if (this.boxRef && this.boxRef.current) {
            width = this.boxRef.current.clientWidth;
            height = this.boxRef.current.clientHeight;
        }
        return (
            <div style={this.props.style} className={this.props.className} ref={this.boxRef}>
                {width && height ? (
                    <svg x="0" y="0" viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
                        <filter id={`RectEightFilter_${this.id}`} width="200" height="200" x="-10" y="-10">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                        </filter>
                        <polyline className={cssStyle.polyline} points="1,25 1,1 25,1 "/>
                        <polyline className={cssStyle.polyline} points={`1,${height-25} 1,${height-1} 25,${height-1}`}/>
                        <polyline className={cssStyle.polyline} points={`${width-25},${height-1} ${width-1},${height-1} ${width-1},${height-25}`}/>
                        <polyline className={cssStyle.polyline} points={`${width-25},1 ${width-1},1 ${width-1},25`}/>
                        <polyline className={cssStyle.polyline} points={`1,1 ${width-1},1 ${width-1},${height-1} 1,${height-1} 1,1`} filter={`url(#RectEightFilter_${this.id})`}/>
                    </svg>
                ) : ''}
            </div>
        );
    }
}