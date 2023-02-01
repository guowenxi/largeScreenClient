import React from "react";
import cssStyle from "./rectTypeTwo.module.css";

export default class RectTypeTwo extends React.Component {
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
        let width,height;
        if(this.boxRef && this.boxRef.current){
            width = this.boxRef.current.clientWidth;
            height = this.boxRef.current.clientHeight;
        }
        return (
            <div style={this.props.style} className={this.props.className} ref={this.boxRef}>
                {width && height ? (
                    <svg x="0" y="0" viewBox={`0 0 ${width} ${height+4}`} style={{width:'100%',height:`calc(100% + 4px)`}}>
                        <polygon className={cssStyle.polygon} points={`${width-0.5},0.5 0.5,0.5 0.5,${height-0.5} ${width/2-3.6},${height-0.5} ${width/2},${height+3} ${width/2+3.6},${height-0.5} ${width-0.5},${height-0.5}`}/>
                    </svg>
                ):''}
            </div>
        );
    }
}