import React from "react";
import cssStyle from "./circleTypeTwo.module.css";

export default class CircleTypeTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {radiusOne:0,radiusTwo:0.5,radiusThree:1};
    }

    //组件加载触发函数
    componentDidMount() {
        this.startMove();
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    startMove(){
        this.timer = setTimeout(()=>{
            let {radiusOne,radiusTwo,radiusThree} = this.state;
            radiusOne += 0.01;
            if(radiusOne > 1){
                radiusOne = 0;
            }
            radiusTwo += 0.01;
            if(radiusTwo > 1){
                radiusTwo = 0;
            }
            radiusThree += 0.01;
            if(radiusThree > 1){
                radiusThree = 0;
            }
            this.setState({radiusOne,radiusTwo,radiusThree});
            this.startMove();
        },20);
    }

    render() {
        const {radiusOne,radiusTwo,radiusThree} = this.state;
        return (
            <div id={this.props.id} style={this.props.style} className={this.props.className}>
                <svg x="0" y="0" viewBox='0 0 160 160' style={{width:'100%',height:'100%'}}>
                    <circle cx="80" cy="80" fill="#f8b62d" r="30"/>
                    <circle cx="80" cy="80" r={30+radiusOne*50} opacity={1-radiusOne} className={cssStyle.circle}/>
                    <circle cx="80" cy="80" r={30+radiusTwo*50} opacity={1-radiusTwo} className={cssStyle.circle}/>
                    <circle cx="80" cy="80" r={30+radiusThree*50} opacity={1-radiusThree} className={cssStyle.circle}/>
                </svg>
            </div>
        );
    }
}