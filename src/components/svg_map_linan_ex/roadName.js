import React from "react";
import {roadPath} from './svg_data';

export default class RoadName extends React.PureComponent {
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
        if(roadName && thisRoadPath){
            return (
                <g>
                    {thisRoadPath.roadNamePath.map((item,index)=>{
                        if(item.indexOf('M') !== 0){
                            return <polyline style={style} className={className} points={item} key={index}/>
                        }else{
                            return <path style={style} className={className} d={item} transform="translate(-111.79 -134.36)" key={index}/>
                        }
                    })}
                </g>
            );
        }else{
            return '';
        }
    }
}