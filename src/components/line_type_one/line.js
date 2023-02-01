import React from "react";
import cssStyle from "./line_type_one.module.css";

export default class Line extends React.PureComponent {
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
        const {width,height,data,maxNum,itemWidth} = this.props;
        let points = [];
        const left = itemWidth/2;
        if(data && data.length > 0){
            const partWidth = (100-itemWidth)/(data.length-1);
            data.forEach((item,index)=>{
                points.push((left+index*partWidth)*width/100+','+((maxNum-item.num)*height*0.5/maxNum+height*0.15));
            });
        }
        return (
            <svg x="0px" y="0px" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                <polyline points={points.join(' ')} className={cssStyle.line}/>
            </svg>
        );
    }
}