import React from "react";
import SvgText from "./svgText";

export default class NameNumText extends React.Component {
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
        const {style,className,fontStyle,children,content,id} = this.props;
        if(fontStyle && fontStyle.fontColorType === 2){
            return <SvgText id={id} className={className} style={style} fontStyle={fontStyle} content={content}>{children}</SvgText>;
        }else{
            return <span className={className} style={style}>{children}</span>;
        }
    }
}