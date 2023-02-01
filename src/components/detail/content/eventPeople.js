import React from "react";
import cssStyle from "./eventPeople.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import "./eventListThree.css";

export default class EventPeople extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.colorList = ['', 'rgba(137,226,116,0.7)', 'rgba(255,204,0,0.7)', '#ff0000'];
  }

  //组件删除时触发函数
  componentWillUnmount() {
  }

  //组件加载触发函数
  componentDidMount() {
  }

  render() {
    const { detail } = this.props;
    return (
      <div style={this.props.style} className={cssStyle.box} >
        <Scrollbars className={'eventListThreeBlueBar'}>
          <div className={cssStyle.contentBox}>
            <div className={cssStyle.row}>
              <img className={cssStyle.img} src="http://localhost:3001/images/ruian/img1.png" alt="" />
              <div className={cssStyle.rowContent2}>
                <div className={cssStyle.item}><span className={cssStyle.name}>王曼</span>女</div>
                <div className={cssStyle.item}>管控等级：<span className={cssStyle.level}>一级</span></div>
                <div className={cssStyle.item}>人员类型：重点信访人员</div>
                <div className={cssStyle.item}>所属街道：城东街道</div>
                <div className={cssStyle.item}>联系电话：194****1234
                <span className={cssStyle.verification}>验证后查看</span></div>
                <div className={cssStyle.item}>身份证号：194****1234</div>
              </div>
            </div>
            {/* <div className={cssStyle.row}>
              <div>事件等级</div>
              <div style={{ color: this.colorList[detail.level] }} className={cssStyle.rowContent}>{detail.levelName}</div>
            </div> */}
            <div className={cssStyle.row}>
              <div>现住地址：</div>
              <div className={cssStyle.rowContent}>{detail.type}</div>
            </div>
            <div className={cssStyle.row}>
              <div>户籍地址：</div>
              <div className={cssStyle.rowContent}>{detail.source}</div>
            </div>
            {/* <div className={cssStyle.row}>
              <div>附件信息</div>
              <div className={cssStyle.rowContent}>
                {detail.imgList && Array.isArray(detail.imgList) && detail.imgList.map((img, index) =>
                  <img key={index} className={cssStyle.img} src={img} alt={''} />
                )}
              </div>
            </div> */}
          </div>
        </Scrollbars>
      </div>
    );
  }
}