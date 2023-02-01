import React from 'react';
import { Empty } from "antd";

import cssStyle from "./css/emptyDom.module.css";

export default class EmptyDom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }


    render() {
        return (
            <div className={cssStyle.emptyBox}>
                <div className={cssStyle.emptyDiv}>
                    <Empty description={this.props.description}/>
                </div>
            </div>
        );
    }
}