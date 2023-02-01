import React from "react";
import cssStyle from "./check_route.module.css";
import "./map_window.css";

export default class CheckRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,pageIndex:0};
        this.refDom = React.createRef();
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.firstLoad === false){
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件数据更新时触发函数
    componentDidUpdate(prevProps){
        if(this.props.show && (prevProps.attributes == null || prevProps.attributes.id !== this.props.attributes.id)){
            //组件数据变更时初始化当前页数
            this.setState({pageIndex:0});
        }
    }

    //切换页数
    changePage(type){
        const {pageIndex} = this.state;
        const {tasks} = this.props.attributes;
        if(type === 1 && pageIndex < tasks.length - 1){
            this.setState({pageIndex:pageIndex+1});
        }else if(type === 2 && pageIndex > 0){
            this.setState({pageIndex:pageIndex-1});
        }
    }

    render() {
        const {tasks} = this.props.attributes;
        let {pageIndex} = this.state;
        let task;
        if(tasks){
            if(pageIndex > tasks.length - 1){
                pageIndex = 0;
            }
            task = tasks[pageIndex];
        }
        return (
            <div ref={this.refDom} className={cssStyle.box} style={this.props.style}>
                <div className={`${cssStyle.pageIcon} ${cssStyle.pageLeft} ${pageIndex === 0 && cssStyle.noPage}`} onClick={this.changePage.bind(this,2)}>{'<'}</div>
                {task && (
                    <div >
                        <div className={`${cssStyle.line} ${cssStyle.topTitle}`}>
                            {task.taskName}
                        </div>
                        <div className={cssStyle.line}>
                            <div className={cssStyle.title}>路线长度：</div>
                            <div className={cssStyle.content}>{task.taskDistance && task.taskDistance+'米'}</div>
                        </div>
                        <div className={cssStyle.line}>
                            <div className={cssStyle.title}>巡防时间：</div>
                            <div className={cssStyle.content}>{task.checkStart + ' - ' + task.checkEnd}</div>
                        </div>
                        <div className={cssStyle.line}>
                            <div className={cssStyle.title}>所属街道：</div>
                            <div className={cssStyle.content}>{task.publishDepartName}</div>
                        </div>
                        <div className={cssStyle.line}>
                            <div className={cssStyle.title}>参与人数：</div>
                            <div className={cssStyle.content}>{task.instanceCount && task.instanceCount+'人'}</div>
                        </div>
                    </div>
                )}
                <div className={`${cssStyle.pageIcon} ${cssStyle.pageRight} ${pageIndex === tasks.length - 1 && cssStyle.noPage}`} onClick={this.changePage.bind(this,1)}>{'>'}</div>
            </div>
        );
    }
}