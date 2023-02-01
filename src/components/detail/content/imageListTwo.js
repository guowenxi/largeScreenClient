import React from "react";
import cssStyle from "./imageListTwo.module.css";
import {Scrollbars} from "react-custom-scrollbars";
import {PhotoSlider} from "react-photo-view";

export default class ImageListTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: false, photoIndex: 0, showList:[]};
        this.scrollbars = React.createRef();
    }

    //组件删除时触发函数
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    //组件加载触发函数
    componentDidMount() {
        if(this.props.showStatus) {
            this.autoMove();
        }
    }

    //组件数据更新时触发函数
    componentDidUpdate(prevProps){
        if(this.props.showStatus !== prevProps.showStatus){
            if(this.props.showStatus){
                this.autoMove();
            }else{
                clearTimeout(this.timer);
            }
        }
    }

    autoMove(){
        if(this.timer){
            clearTimeout(this.timer);
        }
        if(this.scrollbars.current){
            const current = this.scrollbars.current;
            const scrollWidth = current.getScrollWidth();
            const width = current.getClientWidth();
            const scrollLeft = current.getScrollLeft();
            const remain = scrollWidth - scrollLeft - width;
            if(remain < 1){
                current.scrollLeft(0);
            }else{
                current.scrollLeft(scrollLeft+1);
            }
        }
        this.timer = setTimeout(()=>{
            this.autoMove();
        },40);
    }

    changeAutoMove(flag){
        if(flag){
            this.autoMove();
        }else{
            clearTimeout(this.timer);
        }
    }

    getImagePreview(){
        const { visible, showList, photoIndex } = this.state;
        return (
            <PhotoSlider
                images={showList.map((item) => ({ src: item }))}
                visible={visible}
                onClose={() => {this.setState({ visible: false });this.autoMove();}}
                onIndexChange={(index) => this.setState({ photoIndex: index })}
                index={photoIndex}
            />
        )
    }

    render() {
        const {detail} = this.props;
        return (
            <div style={this.props.style} className={cssStyle.box} onMouseOver={this.changeAutoMove.bind(this,false)} onMouseLeave={this.changeAutoMove.bind(this,true)}>
                <Scrollbars className='blueScrollbars' ref={this.scrollbars}>
                    <div className={cssStyle.listBox}>
                        {detail && Array.isArray(detail) && detail.map((item,index)=>
                            <div className={cssStyle.itemBox} key={index}>
                                <div className={cssStyle.title}>{item.name}</div>
                                <div className={cssStyle.imgBox}>
                                    {item.img && item.img.map((img,imgIndex)=>
                                        <div
                                            className={cssStyle.imgOneBox} key={imgIndex}
                                            onClick={() => this.setState({ visible: true, photoIndex: imgIndex, showList: item.img })}
                                        >
                                            <img alt={''} src={img} className={cssStyle.img} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Scrollbars>
                {this.state.visible && this.getImagePreview()}
            </div>
        );
    }
}