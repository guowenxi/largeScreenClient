import React from "react";
import cssStyle from "../map_window.module.css";
import cssStyleGridFour from "../grid_four/grid_four.module.css";
import "../check_route/map_window.css";
import RectTypeThree from "../../../../common/svg/rectTypeThree";

export default class GridFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:{},showDetail:false};
    }

    //组件加载触发函数
    componentDidMount() {
        setTimeout(()=>{
            this.setState({bgTime:new Date().getTime()});
        })
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        const {attributes} = this.props;
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox} ${cssStyleGridFour.box}`} style={{...this.props.style,width:'20em'}}>
                <RectTypeThree className={cssStyle.boxBg} bgTime={this.state.bgTime} />
                <div className={cssStyleGridFour.row}>
                    <span className={cssStyleGridFour.head}>{attributes.name}</span>
                </div>
                <div className={cssStyleGridFour.line} />
                <div className={cssStyleGridFour.contentBox}>
                    <div className={cssStyleGridFour.partBox} >
                        <div className={cssStyleGridFour.title}>企业数量:</div>
                        <div className={cssStyleGridFour.partContent}>1</div>
                    </div>
                    <div className={cssStyleGridFour.partBox} >
                        <div className={cssStyleGridFour.title}>楼盘数量:</div>
                        <div className={cssStyleGridFour.partContent}>1</div>
                    </div>
                </div>
            </div>
        );
    }
}