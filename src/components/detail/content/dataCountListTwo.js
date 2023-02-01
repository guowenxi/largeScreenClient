import React from "react";
import cssStyle from "./dataCountListTwo.module.css";
import {interactData} from "../../../common/util";

import BgOne from "../images/bgOne.png";
import BgTwo from "../images/bgTwo.png";

export default class DataCountListTwo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {position:[0,1,2],selectedIndex:1};
        this.positionList = [cssStyle.left,cssStyle.center,cssStyle.right];
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if(prevProps.thisData.showStatus !== this.props.thisData.showStatus && this.props.thisData.showStatus && this.props.detail){
            const { interact } = this.props.thisData.dataSources;
            const {detail} = this.props;
            this.interactData(interact, detail[this.state.selectedIndex]);
        }
    }

    changeSelect(item,index){
        const {position} = this.state;
        const oldPosition = position[index];
        const oldCenterIndex = position.indexOf(1);
        position[index] = 1;
        position[oldCenterIndex] = oldPosition;
        this.setState({position,selectedIndex:index});
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }

    render() {
        const {detail} = this.props;
        const {position,selectedIndex} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                {detail && Array.isArray(detail) && detail.map((item,index)=>
                    <div className={`${cssStyle.itemBox} ${this.positionList[position[index]]} ${selectedIndex === index ? cssStyle.selected:''}`} key={index} onClick={this.changeSelect.bind(this,item,index)}>
                        {selectedIndex === index ? <img alt={''} src={BgTwo} className={cssStyle.bgTwo} /> : <img alt={''} src={BgOne} className={cssStyle.bgOne} />}
                        <div className={cssStyle.name}>{item.name}</div>
                        <div className={cssStyle.num}>{item.num}</div>
                    </div>
                )}
            </div>
        );
    }
}