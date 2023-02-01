import React from "react";
import cssStyle from "./people_ruian.module.css";
import "../check_route/map_window.css";
import axios from "axios";
import {Modal} from "antd";
import {interactData} from "../../../../common/util";
import defaultImg from "./images/head.jpg";

export default class PeopleRuian extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showEdit:false,pageIndex:0,detail:{},headList:[],selectedHeadImg:'',selectedHeadImgIndex:-1};
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
        this.getDetail();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    getDetail(){
        const {attributes} = this.props;
        if(attributes.detailUrl){
            let params = {rbacToken:this.props.token};
            const idKey = attributes.idKey ? attributes.idKey : 'peopleId';
            params[idKey] = attributes.id;
            axios.get(attributes.detailUrl, {params:params}).then((response) => {
                if(response.data.success){
                    if(response.data.data && response.data.data.detailInfo){
                        const detail = response.data.data.detailInfo;
                        const headList = detail.headUrl ? detail.headUrl.split(','):[];
                        if(headList.length>0){
                            this.changeHeadImg(0,headList);
                            this.setState({detail,headList});
                        }else{
                            this.setState({detail,headList,selectedHeadImg:'',selectedHeadImgIndex:-1});
                        }
                    }
                }else{
                    const errorMessage = response.data.message ? response.data.message : '获取详情请求出错！';
                    Modal.error({
                        content: errorMessage,
                    });
                }
            }).catch( (error) => {
                Modal.error({
                    content: '获取详情请求出错！',
                });
            });
        }
    }

    showMore(){
        const { attributes } = this.props;
        if(attributes.interactWindow){
            this.interactData(attributes.interactWindow, attributes);
        }
    }

    changeHeadImg(selectedHeadImgIndex,list){
        const imgList = list ? list : this.state.headList;
        let imgUrl = imgList[selectedHeadImgIndex];
        if(imgUrl){
            const selectedHeadImg = imgUrl + (imgUrl.indexOf('?') > 0 ? '&':'?') +'rbacToken='+ this.props.token;
            this.setState({selectedHeadImg,selectedHeadImgIndex});
        }
    }

    render() {
        const {detail} = this.state;
        const {selectedHeadImg,headList,selectedHeadImgIndex} = this.state;
        return (
            <div className={cssStyle.box} style={this.props.style}>
                {/*<img alt={''} src={} className={cssStyle.background}/>*/}
                <img alt={''} src={selectedHeadImg ? selectedHeadImg:defaultImg} className={cssStyle.headImg}/>
                <div className={cssStyle.headListBox}>
                    {headList.map((head,index)=>
                        <div
                            onClick={this.changeHeadImg.bind(this,index,'')}
                            key={index} className={`${cssStyle.headSelectItem} ${index === selectedHeadImgIndex ? cssStyle.headSelectedItem:''}`}
                        >
                            {index+1}
                        </div>
                    )}
                </div>
                {/*<div className={cssStyle.contentBoxOne} style={{width:headList.length>0?'calc(100% - 9.5em)':'calc(100% - 8em)',marginLeft:headList.length>0?'9.5em':'8em'}}>*/}
                <div className={cssStyle.contentBoxOne} >
                    <div className={cssStyle.line}>
                        <div className={cssStyle.titleOne}>姓名</div>
                        <div className={cssStyle.contentOne}>{detail.name}</div>
                        <div className={cssStyle.titleOne}>性别</div>
                        <div className={cssStyle.contentTwo}>{detail.sex}</div>
                    </div>
                    <div className={cssStyle.line}>
                        <div className={cssStyle.titleOne}>民族</div>
                        <div className={cssStyle.contentOne}>{detail.nation}</div>
                        <div className={cssStyle.titleOne}>籍贯</div>
                        <div className={cssStyle.contentTwo}>{detail.adminDivision}</div>
                    </div>
                    <div className={cssStyle.line}>
                        <div className={cssStyle.titleOne}>身份证号</div>
                        <div className={cssStyle.contentOne}>{detail.cardId}</div>
                        <div className={cssStyle.titleOne}>联系电话</div>
                        <div className={cssStyle.contentTwo}>{detail.phone}</div>
                    </div>
                    <div className={cssStyle.line}>
                        <div className={cssStyle.titleOne}>人员类型</div>
                        <div className={cssStyle.contentOne}>{detail.peopleTypeName}</div>
                        <div className={cssStyle.titleOne}>管控等级</div>
                        <div className={cssStyle.contentTwo}>{detail.level}</div>
                    </div>
                    <div className={cssStyle.line}>
                        <div className={cssStyle.titleOne}>所属街道</div>
                        <div className={cssStyle.contentOne}>{detail.roadName}</div>
                        <div className={cssStyle.titleOne}>所属社区</div>
                        <div className={cssStyle.contentTwo}>{detail.communityName}</div>
                    </div>
                </div>
                <div className={cssStyle.contentBoxTwo}>
                    <div className={cssStyle.line}>
                        <div className={cssStyle.contentThree}>户籍地（乡、镇、街道）：{detail.permanentAddress}</div>
                    </div>
                    <div className={cssStyle.line}>
                        <div className={cssStyle.contentThree}>详细地址：{detail.address}</div>
                    </div>
                    <div className={cssStyle.line}>
                        <div className={cssStyle.contentThree}>备注：{detail.remark}</div>
                    </div>
                    <div className={cssStyle.moreLine}>
                        <div className={cssStyle.moreButton} onClick={this.showMore.bind(this)}>查看更多</div>
                    </div>
                </div>
            </div>
        );
    }
}