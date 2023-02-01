import React from "react";
import cssStyle from "./imageListOne.module.css";
import {fileUrl} from "../../../config";
import {Scrollbars} from "react-custom-scrollbars";

import CloseIcon from "../images/closeTwo.png";
import SmallIcon from "../images/changeSmall.png";
import BigIcon from "../images/changeBig.png";

export default class ImageListOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showType:1,showIndex:0};
        this.imgList = [];
        this.chaneKeyBoard = this.chaneKeyBoard.bind(this);
    }

    //组件删除时触发函数
    componentWillUnmount() {
        window.removeEventListener('keydown',this.chaneKeyBoard);
    }

    //组件加载触发函数
    componentDidMount() {
        window.addEventListener('keydown',this.chaneKeyBoard);
    }

    changeShowIndex(index){
        this.setState({showIndex:index});
    }

    changeShowType(type){
        this.setState({showType:type});
    }

    chaneKeyBoard(e){
        if(this.props.thisData.showStatus){
            let {showIndex} = this.state;
            if(e.key === 'ArrowRight'){
                if(showIndex < this.imgList.length - 1){
                    this.setState({showIndex:showIndex+1})
                }
            }else if(e.key === 'ArrowLeft'){
                if(showIndex > 0){
                    this.setState({showIndex:showIndex-1})
                }
            }
        }
    }

    render() {
        const {showType,showIndex} = this.state;
        const {themeType,themeList} = this.props.styleData;
        this.imgList = [];
        if(themeList){
            for(let i = 0;i < themeList.length;i ++){
                if(themeList[i] && themeList[i].id === themeType){
                    if(themeList[i].imgList){
                        this.imgList = themeList[i].imgList;
                    }
                    break;
                }
            }
        }
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={`${cssStyle.bodyBox} ${showType === 2 ? cssStyle.bigBox:''}`}>
                    {this.imgList[showIndex] ? <img alt={''} src={fileUrl + '/download/' + this.imgList[showIndex]} className={cssStyle.imgContent} />:<div className={cssStyle.imgContent}>暂无</div>}
                    <div className={cssStyle.imgListBox}>
                        <Scrollbars >
                            <div className={cssStyle.listBox} style={{width:this.imgList.length*17+'em'}}>
                                {this.imgList.map((item,index)=>
                                    <img alt={''} src={fileUrl + '/download/' + item} key={index} onClick={this.changeShowIndex.bind(this,index)} className={showIndex === index ? cssStyle.selected:''} />
                                )}
                            </div>
                        </Scrollbars>
                    </div>
                    <div className={cssStyle.buttonBox}>
                        <img alt={''} src={CloseIcon} title={'关闭'} onClick={this.props.changeThisShow.bind(this,false)} />
                        <img alt={''} src={showType === 1 ? BigIcon:SmallIcon} title={showType === 1 ? '全屏':'缩小'} onClick={this.changeShowType.bind(this,showType === 1 ? 2:1)} />
                    </div>
                </div>
            </div>
        );
    }
}