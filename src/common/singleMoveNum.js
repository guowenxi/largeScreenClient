import React from "react";
import {Motion, spring} from "react-motion";
import CssStyle from "./css/moveNum.module.css";

export default class SingleMoveNum extends React.Component {
    constructor(props) {
        super(props);
        this.state = {oldNum:props.num,newNum:0,isMove:false,top:0};
    }

    componentDidMount() {
        this.autoMove();
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.getDataTime !== this.props.getDataTime && !this.state.isMove){
            this.startMove();
        }
        // if(prevProps.getDataTime !== this.props.getDataTime && !this.state.isMove && prevProps.num !== this.props.num){
        //     this.startMove();
        // }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timerOne);
        clearTimeout(this.timerTwo);
        clearTimeout(this.timerAutoMove);
    }

    autoMove(){
        clearTimeout(this.timerAutoMove);
        if(this.props.autoMoveTime){
            this.timerAutoMove = setTimeout(()=>{
                this.startMove();
            },this.props.autoMoveTime);
        }
    }

    startMove(){
        clearTimeout(this.timerOne);
        clearTimeout(this.timerTwo);
        this.setState({isMove:true,newNum:this.props.num,top:0});
        this.timerOne = setTimeout(()=>{
            this.setState({top:1});
        },10);
        this.timerTwo = setTimeout(()=>{
            this.setState({isMove:false,top:0,oldNum:this.props.num});
        },1000);
        this.autoMove();
    }

    render() {
        let {oldNum,newNum,isMove} = this.state;
        oldNum = parseInt(oldNum);
        newNum = parseInt(newNum);
        let {lineHeight,padding,width} = this.props;
        if(!lineHeight && lineHeight !== 0){
            lineHeight = 1;
        }
        if(isMove){
            let numList = [];
            const sub = newNum > oldNum ? newNum - oldNum : newNum + 10 - oldNum;
            for(let i = 0;i <= sub;i ++){
                let thisNum = oldNum + i;
                if(thisNum > 9){
                    thisNum = thisNum - 10;
                }
                numList.push(thisNum);
            }
            return (
                <div className={CssStyle.numBox} style={{height:lineHeight+'em',width}}>
                    <Motion style={{top:spring(this.state.top)}}>
                        {({top}) =>
                            <div style={{top:-top*lineHeight*sub+'em'}} className={CssStyle.numListBox}  >
                                {numList.map((numItem,index) =>
                                    <div key={index} className={CssStyle.numItem}  style={{height:lineHeight+'em',padding}}>{numItem}</div>
                                )}
                            </div>
                        }
                    </Motion>
                </div>
            );
        }else{
            return (
                <div className={CssStyle.numBox} style={{height:lineHeight+'em',padding,width}}>
                    {oldNum!=null ? oldNum:''}
                </div>
            );
        }
    }
}