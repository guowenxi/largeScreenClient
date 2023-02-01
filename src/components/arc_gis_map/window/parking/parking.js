import React from "react";
import cssStyle from "./parking.module.css";
import "../check_route/map_window.css";
import blueBG from './images/kuang_blue.svg';
import cyanBG from './images/kuang_cyan.svg';
import orangeBG from './images/kuang_orange.svg';
import purpleBG from './images/kuang_purple.svg';
import roseBG from './images/kuang_rose.svg';
import yellowBG from './images/kuang_yellow.svg';

export default class Parking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,pageIndex:0};
        this.refDom = React.createRef();
        this.backgroundImg = {
            '2':blueBG,
            '6':orangeBG,
            '1':purpleBG,
            '5':cyanBG,
            '4':roseBG,
            '3':yellowBG,
        };
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        const {attributes} = this.props;
        console.log(attributes.windowTheme);
        return (
            <div ref={this.refDom} className={`${cssStyle.box} ${attributes.windowTheme===3 ? cssStyle.smallBox:''}`} style={this.props.style}>
                <img alt={''} src={this.backgroundImg[attributes.type]} className={cssStyle.background}/>
                <table>
                    <tbody className={cssStyle.itemContent}>
                    <tr>
                        <td className={`${cssStyle.tdHead}`} colSpan={2}>{attributes.name}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.num}>{`${attributes.freeBerth ? attributes.freeBerth : 0}/${attributes.count}`}</td>
                    </tr>
                    <tr>
                        <td valign={'bottom'} className={cssStyle.unit}>(空余泊位/总泊位数)</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}