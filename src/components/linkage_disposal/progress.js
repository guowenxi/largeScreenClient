import React from "react";
import cssStyle from "./linkage_disposal.module.css";
import {Motion, spring} from "react-motion";
import {Scrollbars} from "react-custom-scrollbars";
import ProgressContent from "./progressContent";

export default class Progress extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        let {show,progress} = this.props;
        return (
            <Motion style={{left:spring(show ? 0 : 100)}}>
                {({left}) =>
                    <div style={{left:left+'%'}} className={cssStyle.detailContent}>
                        <Scrollbars >
                            <ProgressContent progress={progress}/>
                        </Scrollbars>
                    </div>
                }
            </Motion>
        );
    }
}