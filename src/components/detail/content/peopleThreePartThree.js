/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./peopleThreePartThree.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import calc from "postcss-calc";

import peopleIcon from "../images/peopleIconOne.png";
import upIcon from "../images/upOne.png";
import downIcon from "../images/downOne.png";

export default class PeopleTwoPartThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hideList:[]};
        this.relationRef = React.createRef();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {

    }
    componentDidUpdate() {
    }

    changeHide(index){
        let {hideList} = this.state;
        const hideIndex = hideList.indexOf(index);
        if(hideIndex >= 0){
            hideList.splice(hideIndex,1);
        }else{
            hideList.push(index);
        }
        this.setState({hideList});
    }

    getVerticalLine(index, length) {
        return (
            <>
                {
                    index === 0 &&
                    <div
                        className={cssStyle.verticalLine}
                        style={{ height: calc(100 % - '1em'), marginTop: '1em' }}
                    ></div>
                }
                {
                    length >= 2 && index === length - 1 &&
                    <div className={cssStyle.verticalLine} style={{ height: '1em' }}></div>
                }
                {
                    length >= 3 && (index !== 0 && index !== length - 1) &&
                    <div className={cssStyle.verticalLine}></div>
                }
            </>
        )
    }
    render() {
        let {hideList} = this.state;
        const { detail, loading } = this.props;
        const { name, relatedPeople } = detail;
        return (
            <div style={this.props.style} className={cssStyle.container} >
                {
                    JSON.stringify(detail) === '{}' ? (
                        <div className={cssStyle.noData}>{loading ? '数据加载中...' : '暂无数据'}</div>
                    ) : (
                        Array.isArray(relatedPeople) &&
                        <Scrollbars>
                            <div className={cssStyle.innerBox}>
                                <div className={cssStyle.nameBox}>
                                    <div className={cssStyle.name}>
                                        <img alt={''} src={peopleIcon} />
                                        <div>{name}</div>
                                    </div>
                                    {relatedPeople.length > 0 && (
                                        <div className={cssStyle.lineBox}>
                                            <div className={cssStyle.point} />
                                            <div className={cssStyle.horizontalLine} />
                                        </div>
                                    )}
                                </div>
                                <div className={cssStyle.relationBox}>
                                    <div className={cssStyle.relationList} ref={this.relationRef}>
                                        {
                                            relatedPeople.map((item, index, arr) => {
                                                return (
                                                    <div
                                                        className={cssStyle.relationItem}
                                                        key={index}
                                                    >
                                                        {this.getVerticalLine(index, arr.length)}
                                                        <div className={cssStyle.relationLeft}>
                                                            <div className={cssStyle.connectingBox}>
                                                                <div className={cssStyle.connectingLine} />
                                                                <div className={cssStyle.point} />
                                                            </div>
                                                            {/*<div className={cssStyle.relationName}>{item.name}</div>*/}
                                                            <div
                                                                className={cssStyle.relationRight}
                                                                style={{ paddingBottom: arr.length - 1 !== index ? '2em' : 0 }}
                                                            >
                                                                <div className={cssStyle.relationContent}>{item.relation}</div>
                                                                <div className={cssStyle.itemNameBox} onClick={this.changeHide.bind(this,index)}>
                                                                    <div className={cssStyle.nameLine} />
                                                                    <div>{item.name}</div>
                                                                    <img alt={''} src={hideList.indexOf(index) >= 0 ? downIcon : upIcon} />
                                                                </div>
                                                                {hideList.indexOf(index) < 0 && (
                                                                    <React.Fragment>
                                                                        <div className={cssStyle.listItem}>
                                                                            <span className={cssStyle.title}>姓　　名</span>
                                                                            <span className={cssStyle.content}>{item.name}</span>
                                                                        </div>
                                                                        <div className={cssStyle.listItem}>
                                                                            <span className={cssStyle.title}>身份证号</span>
                                                                            <span className={cssStyle.content}>{item.idCode}</span>
                                                                        </div>
                                                                        <div className={cssStyle.listItem}>
                                                                            <span className={cssStyle.title}>性　　别</span>
                                                                            <span className={cssStyle.content}>{item.gender}</span>
                                                                        </div>
                                                                        <div className={cssStyle.listItem}>
                                                                            <span className={cssStyle.title}>联系电话</span>
                                                                            <span className={cssStyle.content}>{item.phone}</span>
                                                                        </div>
                                                                        <div className={cssStyle.listItem}>
                                                                            <span className={cssStyle.title}>现居地址</span>
                                                                            <span className={cssStyle.content}>{item.address}</span>
                                                                        </div>
                                                                        <div className={`${cssStyle.listItem} ${cssStyle.itemGrid}`}>
                                                                            <span className={cssStyle.title}>所属网格</span>
                                                                            <span className={cssStyle.content}>{item.grid}</span>
                                                                        </div>
                                                                    </React.Fragment>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </Scrollbars>
                    )
                }
            </div>
        );
    }
}