import React from "react";
import cssStyle from "../map_window.module.css";
import cssStyleAlertDetails from "./alert_details.module.css";
import cssStyleGridFour from "../grid_four/grid_four.module.css";
import "../check_route/map_window.css";
import Img1 from './cssl.png'
import Img2 from './wgys.png'
import ImgRed from './red.png'
import ImgOrange from './orange.png'
import ImgYellow from './yellow.png'
import ImgBlue from './blue.png'
import ImgGreen from './green.png'
// import axios from "axios";

export default class GridFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data:{},showDetail:false};
    }

    //组件加载触发函数
    componentDidMount() {
      // this.loadData();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
      if(prevProps.attributes.adCode !== this.props.attributes.adCode){
          //组件数据源变更时刷新数据
          // this.loadData();
      }
    }

    // loadData(){
    //   const {attributes} = this.props;
    //   if(attributes.dataUrl){
    //       axios.get(attributes.dataUrl, { params: { rbacToken: this.props.token, roadId:attributes.adCode, parentCode:attributes.adCode } }).then((response) => {
    //           // 在这儿实现 setState
    //           const result = response.data.data;
    //           if (Array.isArray(result.warningLevelCommunityCount) && result.warningLevelCommunityCount.length > 0) {
    //             result.warningLevelCommunityCount.forEach(item => {
    //               switch (item.name) {
    //                 case '红色预警':
    //                   item.img = ImgRed
    //                   break;
    //                 case '橙色预警':
    //                   item.img = ImgOrange
    //                   break;
    //                 case '黄色预警':
    //                   item.img = ImgYellow
    //                   break;
    //                 case '蓝色预警':
    //                   item.img = ImgBlue
    //                   break;
    //                 default:
    //                   item.img = ImgGreen
    //                   break;
    //               }
    //             })
    //           }

    //           if (result) {
    //               this.setState({ data:result });
    //           }
    //       }).catch(function (error) {
    //           // 处理请求出错的情况
    //       });
    //   }
    // }
    render() {
        const {attributes} = this.props;
        if (Array.isArray(attributes.warningLevelCommunityCount) && attributes.warningLevelCommunityCount.length > 0) {
          attributes.warningLevelCommunityCount.forEach(item => {
            switch (item.name) {
              case '红色预警':
                item.img = ImgRed
                break;
              case '橙色预警':
                item.img = ImgOrange
                break;
              case '黄色预警':
                item.img = ImgYellow
                break;
              case '蓝色预警':
                item.img = ImgBlue
                break;
              default:
                item.img = ImgGreen
                break;
            }
          })
        }
        return (
            <div className={`${cssStyle.box} ${cssStyle.themeOneBox} ${cssStyleGridFour.box}`} style={{...this.props.style,width:'20em'}}>
                <div className={`${cssStyle.boxBg} ${cssStyleAlertDetails.boxBg}`} style={{...this.props.style,width:'20em'}}/>
                <div className={`${cssStyleGridFour.row} ${cssStyleAlertDetails.headName}`}>
                    <span className={cssStyleGridFour.head}>{attributes.name}</span>
                </div>
                <div className={cssStyleAlertDetails.line} />
                <div className={cssStyleAlertDetails.box}>
                  <div className={cssStyleAlertDetails.box_item}>
                    <div className={cssStyleAlertDetails.box_item_left}>
                      <img className={cssStyleAlertDetails.box_item_left_img} src={Img1} alt="" />
                      <div className={cssStyleAlertDetails.box_item_left_title}>村社数量</div>
                    </div>
                    <div className={cssStyleAlertDetails.box_item_right}>
                      <div className={cssStyleAlertDetails.box_item_right_num}>{attributes.communityCount}</div>
                      <div className={cssStyleAlertDetails.box_item_right_title}>(个)</div>
                    </div>
                  </div>
                  <div className={cssStyleAlertDetails.box_item}>
                    <div className={cssStyleAlertDetails.box_item_left}>
                      <img className={cssStyleAlertDetails.box_item_left_img} src={Img2} alt="" />
                      <div className={cssStyleAlertDetails.box_item_left_title}>网格员人数</div>
                    </div>
                    <div className={cssStyleAlertDetails.box_item_right}>
                      <div className={cssStyleAlertDetails.box_item_right_num}>{attributes.userCount}</div>
                      <div className={cssStyleAlertDetails.box_item_right_title}>(人)</div>
                    </div>
                  </div>
                </div>
                <div className={` ${cssStyleAlertDetails.contentBox}`}>
                  {
                    Array.isArray(attributes.warningLevelCommunityCount) && attributes.warningLevelCommunityCount.length > 0 && attributes.warningLevelCommunityCount.map((item, index) => (
                      <div className={`${cssStyleAlertDetails.row} ${item.name === '红色预警'? cssStyleAlertDetails.row_red : item.name === '橙色预警'? cssStyleAlertDetails.row_orange : item.name === '黄色预警'? cssStyleAlertDetails.row_blue : item.name === '蓝色预警'? cssStyleAlertDetails.row_blue : cssStyleAlertDetails.row_green}`} key={index}>
                        <div className={cssStyleAlertDetails.row_left}>
                          <img className={cssStyleAlertDetails.row_left_img} src={item.img} alt="" />
                          <div className={cssStyleAlertDetails.row_left_text}>{item.name}</div>
                        </div>
                        <div className={cssStyleAlertDetails.row_right}>{item.num}</div>
                      </div>
                    ))
                  }
                  
                </div>
            </div>
        );
    }
}