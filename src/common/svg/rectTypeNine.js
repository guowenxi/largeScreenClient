import React from "react";
import cssStyle from "./rectTypeNine.module.css";
import titleImg from "../images/rectTypeNineImgOne.svg"

export default class circleTypeThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isBig: false };
        this.id = new Date().getTime();
        this.boxRef = React.createRef();
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
                <img src={titleImg}  alt="" style={{position:'absolute',height:'90%'}} />
                {width && height ? (
                    <svg x="0" y="0" viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
                        <g>
                            <g>
                                <line x1='0' y1={`${height-1}`} x2='3.099' y2={`${height-1}`} className={cssStyle.line1} />
                                <line x1={`${width-6.822}`} y1={`${height-1}`} x2={`${width-3.723}`} y2={`${height-1}`} className={cssStyle.line1} />
                                <line x1={`${width-2.27}`} y1={`${height-1}`} x2={`${width-0.721}`} y2={`${height-1}`} className={cssStyle.line1} />
                                <line x1='5.036' y1={`${height-1}`} x2={`${width-8.34}`} y2={`${height-1}`} className={cssStyle.line2} />
                            </g>
                        </g>
                    </svg>
                ) : ''}
            </div>
        );
    }
}