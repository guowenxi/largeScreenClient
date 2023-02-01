import React from "react";
import cssStyle from "./faithPlace.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import {PhotoSlider} from "react-photo-view";

export default class FaithPlace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: false, photoIndex: 0, showList:[]};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    getImagePreview(){
        const { visible, showList, photoIndex } = this.state;
        return (
            <PhotoSlider
                images={showList.map((item) => ({ src: item }))}
                visible={visible}
                onClose={() => this.setState({ visible: false })}
                onIndexChange={(index) => this.setState({ photoIndex: index })}
                index={photoIndex}
            />
        )
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <Scrollbars>
                    {detail && Array.isArray(detail) && detail.map((item,index)=>
                        <div className={cssStyle.itemBox} key={index}>
                            <div className={cssStyle.imgBox}>
                                <img alt={''} src={item.img} className={cssStyle.img} onClick={() => this.setState({ visible: true, photoIndex: 0, showList: [item.img] })} />
                            </div>
                            <div className={cssStyle.head}>{item.title}</div>
                            <div className={cssStyle.content}>{item.content}</div>
                        </div>
                    )}
                </Scrollbars>
                {this.state.visible && this.getImagePreview()}
            </div>
        );
    }
}