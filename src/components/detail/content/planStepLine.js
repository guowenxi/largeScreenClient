import React from "react";
import cssStyle from "./planStep.module.css";

export default class StepLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.boxRef = React.createRef();
    }

    //组件加载触发函数
    componentDidMount() {
        setTimeout(()=>{
            this.setState({});
        })
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        const {step} = this.props;
        const children = step.children;
        if(children && children.length > 0){
            let width,height;
            if(this.boxRef && this.boxRef.current){
                width = this.boxRef.current.clientWidth;
                height = this.boxRef.current.clientHeight;
            }
            const length = children.length;
            const stepWidth = width/step.width;
            let childStart = 0;
            return (
                <div className={cssStyle.stepLineBox} ref={this.boxRef}>
                    {width && height && (
                        <svg x="0px" y="0px" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                            {length === 1 ? (
                                <line x1={width/2} y1="0" x2={width/2} y2={height} className={cssStyle.stepLine}/>
                            ):(
                                <g>
                                    <line x1={width/2} y1="0" x2={width/2} y2={height/2} className={cssStyle.stepLine}/>
                                    <line x1={children[0].width*stepWidth/2} y1={height/2} x2={width - children[length-1].width*stepWidth/2} y2={height/2} className={cssStyle.stepLine}/>
                                    {children.map((child,index)=>{
                                        const x = (childStart + child.width/2)*stepWidth;
                                        childStart += child.width;
                                        return <line key={index} x1={x} y1={height/2} x2={x} y2={height} className={cssStyle.stepLine}/>;
                                    })}
                                </g>
                            )}
                        </svg>
                    )}
                </div>
            );
        }else{
            return '';
        }
    }
}