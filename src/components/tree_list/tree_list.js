import React from "react";
import ComponentBox from "../component_box";

import { getData } from "../../common/getDataUtil";
import { getCompatibleSize, interactData, changeComponentShow } from "../../common/util";
import { Motion, spring } from "react-motion";
import { Scrollbars } from "react-custom-scrollbars";
import cssStyle from "./tree_list.module.css";
import { fileUrl } from "../../config";

export default class TreeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: [], selectedIndex: 0, show: false, showBox: false };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.clickCount = 0;
        this.changeComponentShow = changeComponentShow.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.p = new Promise((resolve) => {
            if (this.props.thisData.firstLoad) {
                this.getData(this.callBack.bind(this, resolve));
            } else {
                this.callBack(resolve);
            }
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.thisData.updateTime !== this.props.thisData.updateTime) {
            //组件数据源变更时刷新数据
            this.getData();
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "showComponent":
                //显示当前组件
                this.changeComponentShow(true);
                break;
            case "hideComponent":
                //隐藏当前组件
                this.changeComponentShow(false);
                break;
            case "deleteKey":
                //取消选中
                this.setState({selectedId:''});
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity: 1 });
        })
    }

    //重新获取数据
    reGetData() {
        this.setState({ resultData: [] });
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve(result);
        }
        if (result) {
            const { style } = this.props.thisData;
            if(style.selectedItem && style.defaultSelected){
                this.initSelectedItem(result,1)
            }else{
                this.initDataDefault(result);
            }
            this.setState({ resultData: result });
        }
    }

    //选中指定节点
    initSelectedItem(list,level){
        const { style } = this.props.thisData;
        const selectedItem = style.selectedItem.split('-');
        const thisLevelSelected = selectedItem[level-1]-1;
        if (list && list.length > 0) {
            const hasChildContent = list[thisLevelSelected].children && list[thisLevelSelected].children.length > 0;
            if (!hasChildContent || level === selectedItem.length) {
                this.setState({ selectedId: list[thisLevelSelected].id });
                setTimeout(() => {
                    const { interact } = this.props.thisData.dataSources;
                    this.interactData(interact, list[thisLevelSelected]);
                });
            } else {
                this.initSelectedItem(list[thisLevelSelected].children,level+1);
                list[thisLevelSelected].showChild = true;
            }
        }
    }

    //默认展开第一个节点到最下级
    initDataDefault(list) {
        const { style } = this.props.thisData;
        let hasChild = false;
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                const hasChildContent = list[i].children && list[i].children.length > 0;
                if (!hasChildContent) {
                    if(style.defaultSelected){
                        this.setState({ selectedId: list[i].id });
                        setTimeout(() => {
                            const { interact } = this.props.thisData.dataSources;
                            this.interactData(interact, list[i]);
                        });
                    }
                    hasChild = true;
                    break;
                } else {
                    hasChild = this.initDataDefault(list[i].children);
                    if (hasChild) {
                        list[i].showChild = true;
                        break;
                    }
                }
            }
        }
        return hasChild;
    }

    getTreeContent(list, level, style) {
        const fatherKey = style.fatherKey;
        const childKey = style.childKey;
        const subFatherKey = style.subFatherKey;
        const subChildKey = style.subChildKey;
        if (list && list.length > 0) {
            return list.map((item, index) => {
                let returnDom = [];
                const hasChild = item.children && item.children.length > 0;
                let background;
                let textColor;
                if (hasChild) {
                    if (this.state.selectedId === item.id) {
                        background = style.fatherSelectColor;
                        textColor = style.fatherSelectTextColor;
                    } else {
                        background = style.fatherColor;
                        textColor = style.fatherTextColor
                    }
                } else {
                    if (this.state.selectedId === item.id) {
                        background = style.childSelectColor;
                        textColor = style.childSelectTextColor;
                    } else {
                        background = style.childColor;
                        textColor = style.childTextColor;
                    }
                }
                if (style) {
                    returnDom.push(
                        <div key={index + 'name' + level} className={`${cssStyle.itemBox} ${cssStyle.nameBox} ${hasChild && cssStyle.nodeBox}`} onClick={this.itemClick.bind(this, item, hasChild)} style={{ backgroundColor: background, marginBottom: '5px' }}>
                            <img alt='' src={item.showChild ? fileUrl + '/download/' + style.closeImg : fileUrl + '/download/' + style.openImg} className={cssStyle.nodeIcon} style={{ opacity: hasChild ? 1 : 0, marginRight: style.marginRight, marginLeft: '10px' }} />
                            <div className={cssStyle.name} style={{ color: textColor, textDecoration: hasChild ? '' : (style.underlineShow===1?'underline':'') }} >
                                {hasChild ? item[fatherKey] : item[childKey]}
                            </div>
                            {style.show === 1 && <img alt='' src={fileUrl + '/download/' + style.rightImg} style={{ position: "relative", opacity: hasChild ? 0 : 1, width: style.imgRightWidth, height: style.imgRightHeight, top: style.top, left: style.left }} />}
                            {style.subShow === 1 &&
                                <div className={cssStyle.subTitle} style={{ padding: hasChild ? style.subFatherPadding : style.subChildPadding, color: textColor }}>
                                    {hasChild ? item[subFatherKey] : item[subChildKey]}
                                </div>}
                        </div>
                    );
                    if (hasChild) {
                        returnDom.push(
                            <div key={index + 'child' + level} style={{ display: item.showChild ? '' : 'none', padding: style.padding }} className={`${cssStyle.itemBox} ${cssStyle.childBox}`}>
                                {this.getTreeContent(item.children, level + 1, style)}
                            </div>
                        );
                    }
                }
                return returnDom;
            });
        }
    }

    //节点点击响应
    itemClick(item, hasChild) {
        const { style } = this.props.thisData;
        if (style.clickType === 1) {
            if (hasChild) {
                item.showChild = !item.showChild;
                this.setState({});
            }else{
                this.setState({ selectedId: item.id });
                const { interact } = this.props.thisData.dataSources;
                this.interactData(interact, item);
            }
        } else {
            this.clickCount++;
            if (!this.hasfunction) {
                this.hasfunction = true;
                this.timer = setTimeout(() => {
                    if (this.clickCount > 1) {
                        this.setState({ selectedId: item.id });
                        const { interact } = this.props.thisData.dataSources;
                        this.interactData(interact, item);
                    } else if (hasChild) {
                        item.showChild = !item.showChild;
                        this.setState({});
                    }
                    this.clickCount = 0;
                    this.hasfunction = false;
                }, 200);
            }
        }
    }



    render() {
        const { style } = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style, overflow: 'hidden' }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <Scrollbars style={{ opacity, fontSize }} className={cssStyle.box} >
                            {this.getTreeContent(this.state.resultData, 1, style)}
                        </Scrollbars>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}