import React from "react";
import cssStyle from "./importantInformationBriefing.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { interactData } from "../../../common/util";

export default class EventTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.planName = {};
        this.interactData = interactData.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    itemClick(item) {
        const { interact } = this.props.thisData.dataSources;
        this.interactData(interact, item);
    }

    getContent(eventList) {
        return (
            <>
                {
                    eventList.map((item, index, arr) => {
                        return (
                            <span key={index} onClick={this.itemClick.bind(this, item)} className={cssStyle.itemBox}>
                                {item.eventTitle}
                                {!!item.tagText && <span style={{ color: '#038fd2' }} >{item.tagText}</span>}
                                {item.tagTextType === 1 ? `${'起' + (!!item.content ? '，' : '')}` : ((item.tagTextType === 2 && item.content) ? '，' : '')}
                                {item.content}
                                {index === arr.length - 1 ? '。' : '；'}
                            </span>
                        )
                    })
                }
            </>
        )
    }
    getEventContent(eventList, eventType) {
        return eventList.map((eventItem, eventIndex, eventArr) => {
            if (eventType === 1) {
                return (
                    <React.Fragment key={eventIndex}>
                        {eventItem.eventTitle}
                        {eventItem.tagText && <span className={cssStyle.itemBox} onClick={this.itemClick.bind(this, eventItem)}>{eventItem.tagText}</span>}
                        {eventItem.tagTextType === 1 ? '项' : ''}
                        {!!eventItem.eventTitle ? '，' : ''}
                        {
                            typeof eventItem.content === 'string' ? eventItem.content : (
                                <span>
                                    {eventItem.content.eventTitle}
                                    <span className={cssStyle.itemBox} onClick={this.itemClick.bind(this, eventItem.content)}>{eventItem.content.tagText}</span>
                                    件
                                </span>
                            )
                        }
                        {eventItem.tagTextType === 1 ? '：' : (eventArr.length - 1 === eventIndex ? '。' : '；')}
                    </React.Fragment>
                )
            } else if (eventType === 2) {
                return (
                    <React.Fragment key={eventIndex}>
                        {eventItem.eventTitle}
                        {eventItem.tagText && <span className={cssStyle.itemBox} onClick={this.itemClick.bind(this, eventItem)}>{eventItem.tagText}</span>}
                        {eventItem.content}
                        {(eventArr.length - 1 === eventIndex ? '。' : '，')}
                    </React.Fragment>
                )
            } else {
                return (
                    <React.Fragment key={eventIndex}>
                        {eventItem.eventTitle}
                        {eventItem.tagText && <span className={cssStyle.itemBox} onClick={this.itemClick.bind(this, eventItem)}>{eventItem.tagText}</span>}
                        {eventItem.tagTextType === 1 ? '起' : ''}
                        {eventItem.content ? (eventItem.tagTextType === 1 ? '，' : '') + eventItem.content : ''}
                        {(eventArr.length - 1 === eventIndex ? '。' : '；')}
                    </React.Fragment>
                )
            }
        })
    }

    getContentByType(contentItem) {
        const { contentList, eventType, } = contentItem;
        return (
            Array.isArray(contentList) && contentList.map((item, index) => {
                return (
                    <div key={index} className={cssStyle.content}>
                        <span>
                            {contentList.length > 1 && index + 1 + '、'}
                            {item.subTitle ? item.subTitle + '：' : ''}
                            {
                                Array.isArray(item.eventList) && this.getEventContent(item.eventList, eventType)
                            }
                        </span>
                    </div>
                )
            })
        )
    }
    render() {
        const { detail } = this.props;
        const serialNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
        return (
            <div style={this.props.style} className={cssStyle.container} >
                {Array.isArray(detail) && <Scrollbars>
                    <div style={{ width: '100%', height: '100%', padding: '1.2em' }}>
                        {
                            detail.map((superItem, superIndex) => {
                                return (
                                    <div key={superIndex} className={cssStyle.superBox}>
                                        <div style={{ marginTop: superIndex === 0 ? 0 : '0.5em' }} className={cssStyle.superTitle}>{superItem.time}</div>
                                        {
                                            Array.isArray(superItem.content) && superItem.content.map((item, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div
                                                            className={`${cssStyle.resetP} ${cssStyle.title}`}
                                                        >{`${serialNumbers[index]}、${item.title}`}</div>
                                                        {/* {
                                                            Array.isArray(item.contentList) && item.contentList.map((contentItem, contentIndex) => {
                                                                return (
                                                                    <div key={contentIndex} className={cssStyle.content}>
                                                                        <span>
                                                                            {item.contentList.length > 1 && contentIndex + 1 + '、'}
                                                                            {contentItem.subTitle}
                                                                            {!!contentItem.subTitle && '：'}
                                                                            {Array.isArray(contentItem.eventList) && this.getContent(contentItem.eventList)}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            })
                                                        } */}
                                                        {this.getContentByType(item)}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </Scrollbars>}
            </div>
        );
    }
}