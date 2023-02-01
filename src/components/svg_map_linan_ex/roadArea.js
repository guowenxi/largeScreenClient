import React from "react";
import {roadPath} from './svg_data';

export default class RoadArea extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }


    render() {
        const {style,className,roadName} = this.props;
        const thisRoadPath = roadPath[roadName];
        if(roadName && thisRoadPath && thisRoadPath.path){
            return (
                <polyline points={thisRoadPath.path} style={style} className={className} />
            );
        }else{
            return null;
        }
    }
}