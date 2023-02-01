import React from 'react';
import { SketchPicker } from 'react-color';
import style from './css/colorSelect.module.css';
export default class ColorSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {displayColorPicker:"none"};
        this.handleClick = this.handleClick.bind(this);
    }
    //点击 显示/隐藏 颜色选择器
    handleClick() {
        let {displayColorPicker} =this.state;
        displayColorPicker = displayColorPicker==="none"?"block":"none";
        this.setState({displayColorPicker});
    }
    //颜色变更触发函数
    colorChange(value){
        this.props.setColor(value);
    }

    // handleClose(){
    //     this.setState({displayColorPicker:'none'});
    // }

    render() {
        let {displayColorPicker} = this.state;
        return (
            <div style={this.props.style} className={style.selectBox}>
                <div onClick={ this.handleClick.bind(this) } className={style.buttonBox}>
                    <div style={{background:this.props.color}} className={style.button}/>
                </div>
                {displayColorPicker==="block"?
                    <div className={style.popover}>
                        {/*<div className={ style.cover } onClick={ this.handleClose.bind(this) }/>*/}
                        <SketchPicker color={this.props.color}  onChangeComplete={this.colorChange.bind(this)} />
                    </div>
                    :null
                }
            </div>
        );
    }
}