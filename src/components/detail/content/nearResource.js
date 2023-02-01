import React from "react";
import {Slider} from "antd";
import cssStyle from "./nearResource.module.css";

export default class NearResource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.marks = {
            0:{
                style: {
                    color: '#fff',
                },
                label: <span>0</span>,
            },
            10:{
                style: {
                    color: '#fff',
                },
                label: <span>10km</span>,
            }
        };
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.sliderBox}>
                    <div className={cssStyle.title}>查询范围</div>
                    <Slider marks={this.marks} defaultValue={5} min={0} max={10} className={cssStyle.slider} tipFormatter={(text)=>text+'km'} />
                </div>
                <div className={cssStyle.contentBox}>
                    <div className={cssStyle.contentBg} >事发地点</div>
                    {detail && Array.isArray(detail) && detail.map((item,index)=>
                        <div className={cssStyle.itemBox} key={index}>
                            {!!item.num && <div className={cssStyle.num}>{item.num}</div>}
                            <div className={cssStyle.name}>{item.name}</div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}