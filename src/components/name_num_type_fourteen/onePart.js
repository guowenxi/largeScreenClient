import React from "react";
import {Motion, spring} from "react-motion";
import cssStyle from "./name_num_type_fourteen.module.css";
import {fileUrl} from "../../config";

export default class OnePart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {left:0,top:0};
    }

    //组件加载触发函数
    componentDidMount() {
        this.moveTimeout();
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.timer){
            clearTimeout(this.timer);
        }
    }

    moveTimeout(){
        if(this.props.move){
            const moveSize = this.props.moveSize ? this.props.moveSize : 1;
            this.setState({left:(Math.random()-0.5)*moveSize,top:(Math.random()-0.5)*moveSize});
            this.timer = setTimeout(()=>{
                this.moveTimeout();
            },3000);
        }
    }

    render() {
        const {name,partStyle} = this.props;
        let fontSize;
        let width;
        if(name.length <= 2){
            fontSize = '1em';
            width = '2em';
        }else if(name.length === 3){
            fontSize = '0.66em';
            width = '3em';
        }else if(name.length === 4){
            fontSize = '0.75em';
            width = '2em';
        }else {
            const lineNum = Math.ceil(name.length/2);
            fontSize = (2/lineNum)+'em';
            width = lineNum+'em';
        }
        return (
            <Motion style={{ leftMove: spring(this.state.left,{stiffness: 20, damping: 30}),topMove: spring(this.state.top,{stiffness: 20, damping: 30})}}>
                {({ leftMove,topMove }) =>
                    <div className={`${this.props.className} ${cssStyle.partBox}`} style={{...this.props.style,left:`calc(${partStyle.left} + ${leftMove}em)`,top:`calc(${partStyle.top} + ${topMove}em)`,fontSize,transform:`translate(-50%, -50%) scale(${partStyle.scale})`}} onClick={this.props.selItem}>
                        {partStyle.img && <img alt={''} src={fileUrl + '/download/' + partStyle.img} className={cssStyle.partBg} />}
                        <div className={cssStyle.itemBox} style={{width}}>
                            {name}
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}