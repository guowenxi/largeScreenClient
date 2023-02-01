import React from "react";
import cssStyle from "./equipmentList.module.css";
import {Button} from "antd";
import {Scrollbars} from "react-custom-scrollbars";

import EquipmentOne from "../images/equipmentOne.png";
import EquipmentTwo from "../images/equipmentTwo.png";
import {interactData} from "../../../common/util";

export default class EquipmentList extends React.Component {
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
        const {style} = this.props.thisData;
        if(detail && detail.length){
            const width = detail.length*25 + '%';
            return (
                <div style={this.props.style} className={cssStyle.box} >
                    <Scrollbars>
                        <div className={cssStyle.listBox} style={{width}}>
                            {detail.map((item,index) =>
                                <div key={index} className={`${cssStyle.equipmentBox} ${item.status === 0 ? cssStyle.errorBox:''}`}>
                                    <div className={cssStyle.imgBox}>
                                        <img alt={''} src={style.contentType === 2 ? EquipmentTwo:EquipmentOne} />
                                    </div>
                                    <div className={cssStyle.statusBox}>
                                        {this.statusList[item.status]}
                                    </div>
                                    <div className={cssStyle.detailBox}>
                                        <div className={cssStyle.row}>
                                            设备名称：{item.name}
                                        </div>
                                        <div className={cssStyle.row}>
                                            操作员：{item.user}
                                        </div>
                                        <div className={cssStyle.row}>
                                            联系方式：{item.phone}
                                        </div>
                                        <div className={cssStyle.row}>
                                            设备简介：{item.introduction ? item.introduction :'暂无简介'}
                                        </div>
                                        {item.step && item.step.length && (
                                            <div className={cssStyle.stepBox}>
                                                {item.step.map((step,stepIndex) =>
                                                    <React.Fragment key={stepIndex}>
                                                        <div className={cssStyle.stepTime}>
                                                            {step.time}
                                                        </div>
                                                        <div className={cssStyle.stepContent}>
                                                            {step.content}
                                                        </div>
                                                    </React.Fragment>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className={cssStyle.buttonBox}>
                                        {item.status > 1 ? (
                                            <Button type="primary" className={cssStyle.button} onClick={this.showDetail.bind(this,item)}>查看</Button>
                                        ):(
                                            <Button type="primary" className={cssStyle.button} >指派</Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Scrollbars>
                </div>
            );
        }else{
            return null;
        }
    }
}