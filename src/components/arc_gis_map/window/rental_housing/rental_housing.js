import React from "react";
import cssStyle from "../map_window.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";
import {interactData} from "../../../../common/util";
export default class RentalHousing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,pageIndex:0};
        this.refDom = React.createRef();
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    itemClick(item){
        const {attributes} = this.props;
        this.interactData(attributes.interactWindow,item);
    }

    render() {
        const {attributes} = this.props;
        return (
            <div ref={this.refDom} className={`${cssStyle.box} ${cssStyle.themeOneBox}`} style={this.props.style}>
                <RectTypeThree className={cssStyle.boxBg} width={300} height={150}/>
                {/* <div className={cssStyle.headOneBox} onClick={this.itemClick.bind(this)}>
                    <div className={cssStyle.headName}>{attributes.address}</div>
                    <div className={cssStyle.No} />
                    <Icon type="right-circle" theme="filled" className={cssStyle.rightIcon}/>
                </div> */}
                <table>
                    <tbody className={cssStyle.itemContent}>
                    {attributes.people && attributes.people.map((item,index) =>
                        <tr key={index} onClick={this.itemClick.bind(this,item)} style={{cursor: "pointer"}}>
                            <td className={`${cssStyle.tdTitle} ${cssStyle.center}`}>{item.name}</td>
                            <td >
                                {item.address}
                                <br />
                                {item.cardId}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        );
    }
}