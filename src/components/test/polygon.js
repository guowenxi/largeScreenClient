import React from "react";
// import { getCompatibleSize } from "../../common/util";

export default class Rect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.boxRef = React.createRef();
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
                        <polygon points={`${width/2},0.5 ${width},0.5 ${width/2},${height} 0,${height}`} fill='white' />
                    </svg>
                ) : ''}
            </div>)
    }
}