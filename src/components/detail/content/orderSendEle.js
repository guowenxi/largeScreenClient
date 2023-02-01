import React from "react";
import cssStyle from "./orderSendEle.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import "./eventListThree.css";

export default class OrderSendEle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
            <div style={this.props.style} className={cssStyle.box}>
                <div className={cssStyle.contentBox}>
                    <Scrollbars className={'eventListThreeBlueBar'}>
                        {detail && Array.isArray(detail) && detail.map((item,index)=>
                            <React.Fragment key={index}>
                                {item.peopleList && item.peopleList.map((people,peopleIndex)=>
                                    <div className={cssStyle.itemBox} key={peopleIndex}>
                                        <div className={cssStyle.peopleBox}>
                                            <div className={cssStyle.row}>{people.department}</div>
                                            <div className={cssStyle.row}>
                                                <span style={{width:'5em'}}>{people.user}</span>
                                                <span>{people.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className={cssStyle.itemBox}>
                                    <div className={cssStyle.headRow}>
                                        <div>{item.name}</div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </Scrollbars>
                </div>
            </div>
        );
    }
}