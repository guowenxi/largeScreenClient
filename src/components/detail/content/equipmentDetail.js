import React from "react";
import cssStyle from "./equipmentDetail.module.css";
import {Button} from "antd";

import EquipmentVideo from "../images/equipmentVideo.png";
import {interactData} from "../../../common/util";

export default class EquipmentDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.statusList = ['离线','正常待机','已指派','进行中'];
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    showDetail(item){
        const { detailInteract } = this.props.thisData.style;
        this.interactData(detailInteract, item);
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <img alt={''} src={EquipmentVideo} className={cssStyle.img}/>
                <div className={cssStyle.detailBox}>
                    <div className={cssStyle.row}>
                        操作员：{detail.user}
                    </div>
                    <div className={cssStyle.row}>
                        联系方式：{detail.phone}
                    </div>
                </div>
                <Button type="primary" className={cssStyle.button} >连线</Button>
            </div>
        );
    }
}