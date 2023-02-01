import React from "react";

export default class WarningSoundOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const { detail } = this.props;
        if (detail == null) {
            return null;
        }
        return (
            <div style={this.props.style} >
                {this.props.thisData.showStatus && detail && detail[0] && detail[0].indicator+''==='1' && <audio src="./audio/warning.wav" loop autoPlay style={{opacity:0}}/>}
            </div>
        );
    }
}