import React from "react";
import Scrollbars from "react-custom-scrollbars";
import cssStyle from "./peopleFive.module.css";
import {PhotoSlider} from "react-photo-view";

export default class FollowUpRecords extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: false, photoIndex: 0};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    getImagePreview(){
        const { visible, photoIndex,imgList } = this.state;
        const {styleData} = this.props;
        return (
            <PhotoSlider
                images={imgList.map((item) => ({ src: styleData.fileServiceUrl+item.fileId }))}
                visible={visible}
                onClose={() => this.setState({ visible: false })}
                onIndexChange={(index) => this.setState({ photoIndex: index })}
                index={photoIndex}
            />
        )
    }

    render() {
        const { detail, styleData, loading } = this.props;
        return (
            <div style={this.props.style} className={`${cssStyle.box} ${cssStyle.followUp}`} >
                {
                    JSON.stringify(detail) === '{}' || !detail || !detail.data || detail.data.length === 0 ? (
                        <div className={cssStyle.noData}>{loading ? '数据加载中...' : '暂无数据'}</div>
                    ) : (
                        <Scrollbars>
                            {detail && Array.isArray(detail.data) && detail.data.map((item,index)=>
                                <div className={cssStyle.recordBox} key={index}>
                                    <div className={cssStyle.line}>
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.title}>所属周期：</div>
                                            <div className={cssStyle.content}>{item.cycleTime}</div>
                                        </div>
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.title}>是否　<br />按期随访：</div>
                                            <div className={cssStyle.content}>{item.isTimelyFollowUpName}</div>
                                        </div>
                                    </div>
                                    <div className={cssStyle.line}>
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.title}>随访时间：</div>
                                            <div className={cssStyle.content}>{item.followUpTime}</div>
                                        </div>
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.title}>随访类型：</div>
                                            <div className={cssStyle.content}>{item.followUpTypeName}</div>
                                        </div>
                                    </div>
                                    <div className={cssStyle.line}>
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.title}>随访地点：</div>
                                            <div className={cssStyle.content}>{item.followUpAddress}</div>
                                        </div>
                                        <div className={cssStyle.itemBox}>
                                            <div className={cssStyle.title}>现实状况：</div>
                                            <div className={cssStyle.content}>{item.actualStateName}</div>
                                        </div>
                                    </div>
                                    <div className={cssStyle.line}>
                                        <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                            <div className={cssStyle.title}>情绪状态：</div>
                                            <div className={cssStyle.content}>{item.emotionState}</div>
                                        </div>
                                    </div>
                                    <div className={cssStyle.line}>
                                        <div className={`${cssStyle.itemBox} ${cssStyle.itemBoxTwo}`}>
                                            <div className={cssStyle.title}>现场照片：</div>
                                            <div className={cssStyle.content}>
                                                {item.pictureId && Array.isArray(item.pictureId) && item.pictureId.map((img,imgIndex)=>
                                                    <img alt={''} src={styleData.fileServiceUrl+img.fileId} key={imgIndex} onClick={() => this.setState({ visible: true,imgList:item.pictureId, photoIndex: imgIndex })} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Scrollbars>
                    )
                }
                {this.state.visible && this.getImagePreview()}
            </div>
        );
    }
}