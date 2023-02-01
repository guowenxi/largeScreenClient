import React from "react";
import cssStyle from './warehouseListDetail.module.css';

import { interactData } from "../../../common/util";

import Scrollbars from "react-custom-scrollbars";


export default class WarehouseListDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }
    componentDidUpdate(prveProps) {
        if (prveProps.getDataTime !== this.props.getDataTime && this.props.getDataTime) {
            // this.getDetail();
        }
    }
    //组件加载触发函数
    componentDidMount() {
    }
    render() {
        const { detail } = this.props;
        return (
            <div style={this.props.style} className={`${cssStyle.container} gasListDetailBox`} >
                <Scrollbars>
                    {
                        Array.isArray(detail) &&
                        detail.map(({ name, list }, index, arr) => {
                            return (
                                <div className={cssStyle.itemBox} key={index} style={{ marginBottom: arr.length - 1 === index ? 0 : '2em' }}>
                                    <span className={`${cssStyle.name} ${cssStyle.onlyLine}`} title={name}>{name}</span>
                                    <div className={cssStyle.listBox}>
                                        {
                                            Array.isArray(list) &&
                                            list.map((subItem, subIndex, subArr) => {
                                                return (
                                                    <div
                                                        key={subIndex}
                                                        className={cssStyle.listItem}
                                                        style={{ marginBottom: subArr.length - 1 === subIndex ? 0 : '1em' }}
                                                    >
                                                        <span className={`${cssStyle.content} ${cssStyle.onlyLine}`} title={subItem}>{subItem}</span>
                                                        <span className={cssStyle.listItemIcon}></span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </Scrollbars>
            </div>
        );
    }
}