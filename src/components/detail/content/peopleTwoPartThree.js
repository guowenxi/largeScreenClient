/* eslint-disable no-unused-vars */
import React from "react";
import cssStyle from "./peopleTwoPartThree.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import calc from "postcss-calc";

export default class PeopleTwoPartThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
    getVerticalLine(index, length) {
        return (
            <>
                {
                    index === 0 &&
                    <div
                        className={cssStyle.verticalLine}
                        style={{ height: calc(100 % - '1.65em'), marginTop: '1.65em' }}
                    ></div>
                }
                {
                    length >= 2 && index === length - 1 &&
                    <div className={cssStyle.verticalLine} style={{ height: '1.85em' }}></div>
                }
                {
                    length >= 3 && (index !== 0 && index !== length - 1) &&
                    <div className={cssStyle.verticalLine}></div>
                }
            </>
        )
    }
    render() {
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
                                    <div className={cssStyle.name}>{name}</div>
                                    {relatedPeople.length > 0 && <span className={cssStyle.horizontalLine}></span>}
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
                                                                <span className={cssStyle.connectingLine}></span>
                                                                <div className={cssStyle.relationContent}>{item.relation}</div>
                                                            </div>
                                                            <div className={cssStyle.relationName}>{item.name}</div>
                                                        </div>
                                                        <div
                                                            className={cssStyle.relationRight}
                                                            style={{ paddingBottom: arr.length - 1 !== index ? '2em' : 0 }}
                                                        >
                                                            <div className={cssStyle.listItem}>
                                                                <span className={cssStyle.title}>姓名：</span>
                                                                <span className={cssStyle.content}>{item.name}</span>
                                                            </div>
                                                            <div className={cssStyle.listItem}>
                                                                <span className={cssStyle.title}>身份证：</span>
                                                                <span className={cssStyle.content}>{item.idCode}</span>
                                                            </div>
                                                            <div className={cssStyle.listItem}>
                                                                <span className={cssStyle.title}>性别：</span>
                                                                <span className={cssStyle.content}>{item.gender}</span>
                                                            </div>
                                                            <div className={cssStyle.listItem}>
                                                                <span className={cssStyle.title}>联系电话：</span>
                                                                <span className={cssStyle.content}>{item.phone}</span>
                                                            </div>
                                                            <div className={cssStyle.listItem}>
                                                                <span className={cssStyle.title}>现居地址：</span>
                                                                <span className={cssStyle.content}>{item.address}</span>
                                                            </div>
                                                            <div className={`${cssStyle.listItem} ${cssStyle.itemGrid}`}>
                                                                <span className={cssStyle.title}>网格：</span>
                                                                <span className={cssStyle.content}>{item.grid}</span>
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