import React from "react";
import HeadMenu from "./head_menu/head_menu";
import App from "./App";

import 'antd/dist/antd.css';
import './index.css';
import 'react-photo-view/dist/index.css';

// import loadable from "../../common/loadable";
// const App = loadable(() => import('./App'));

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.showPage();
    }

    componentWillUnmount() {

    }

    //组件数据更新时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            window.location.reload();
        }
    }

    showPage() {
        if (navigator.userAgent.indexOf("Chrome") < 0) {
            if (window.external.hideCurrentBrowsers) {
                window.external.hideCurrentBrowsers();
            }
        } else {
            if (typeof (jsOBJ) != "undefined") {
                // eslint-disable-next-line no-undef
                jsOBJ.hideCurrentBrowsers();
            }
        }
    }

    render() {
        return (
            <div>
                <HeadMenu className='head-menu' pageId={this.props.match.params.id} token={this.props.match.params.token} />
                <App scale={this.state.scale} pageId={this.props.match.params.id} token={this.props.match.params.token} roadId={this.props.match.params.roadId} />
            </div>
        );
    }
}