import React from "react";
import cssStyle from "./scheduleDetail.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import { interactData } from "../../../common/util";
import { SpringSystem } from "rebound";
import BlankImg from "../images/blankOne.png";

export default class ScheduleDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.showIndex = 0;
    this.planName = {};
    this.themeCss = ['', '', cssStyle.themeTwo];
    this.scrollbars = React.createRef();
    this.interactData = interactData.bind(this);
    this.handleSpringUpdate = this.handleSpringUpdate.bind(this);
    this.levelColor = { '高': 'rgb(235,75,77)', '中': '#ef851a', '低': '#fbc800' };
  }

  //组件删除时触发函数
  componentWillUnmount() {
    this.springSystem.deregisterSpring(this.spring);
    this.springSystem.removeAllListeners();
    this.springSystem = undefined;
    this.spring.destroy();
    this.spring = undefined;
    if (this.autoMoveTimer) {
      clearTimeout(this.autoMoveTimer);
    }
  }

  //组件加载触发函数
  componentDidMount() {
    this.springSystem = new SpringSystem();
    this.spring = this.springSystem.createSpring(200, 30);
    this.spring.addListener({ onSpringUpdate: this.handleSpringUpdate });
    this.autoMove();
  }

  handleSpringUpdate(spring) {
    const val = spring.getCurrentValue();
    this.scrollbars.current.scrollTop(val);
  }

  getScrollTop() {
    return this.scrollbars.current.getScrollTop();
  }

  getScrollHeight() {
    return this.scrollbars.current.getScrollHeight();
  }

  getHeight() {
    return this.scrollbars.current.getClientHeight();
  }

  scrollTop(top) {
    const scrollTop = this.getScrollTop();
    this.spring.setCurrentValue(scrollTop).setAtRest();
    this.spring.setEndValue(top);
  }

  autoMove() {
    const { style } = this.props.thisData;
    this.autoMoveTimer = setTimeout(() => {
      const { detail } = this.props;
      const eventList = style.contentType === 2 ? detail : (detail ? detail.eventList : []);
      if (eventList && eventList.length > 0) {
        const length = eventList.length;
        this.showIndex++;
        if (length <= this.showIndex) {
          this.showIndex = 0;
        }
        const dom = document.getElementsByClassName(this.props.thisData.id + '_detailBox')[this.showIndex];
        const scrollTop = dom.offsetTop;
        const scrollHeight = this.getScrollHeight();
        const height = this.getHeight();
        const remain = scrollHeight - scrollTop - height;
        if (remain > 0) {
          this.scrollTop(scrollTop);
        } else {
          this.scrollTop(scrollHeight - height);
          this.showIndex = -1;
        }
      }
      this.autoMove();
    }, style.autoMoveTime ? style.autoMoveTime : 5000);
  }

  reasonClick(part) {
    const { reasonInteract } = this.props.thisData.style;
    this.interactData(reasonInteract, part);
  }

  eventClick(event) {
    const { interact } = this.props.thisData.dataSources;
    this.interactData(interact, event);
  }

  //手动拖动时结束定时自动滚动任务
  handleScrollStart() {
    clearTimeout(this.autoMoveTimer);
  }

  //手动拖动完毕时开始定时自动滚动任务
  handleScrollStop() {
    this.autoMove();
  }

  render() {
    const { detail } = this.props;
    const { style } = this.props.thisData;
    // const list  = detail.list
    const list = detail
    // const eventList = style.contentType === 2 ? detail : (detail ? detail.eventList:[]);
    return (
      <div style={this.props.style} className={`${cssStyle.box} ${this.themeCss[style.contentStyle]}`} >
        <div className={cssStyle.eventListBox} >
          <Scrollbars
            ref={this.scrollbars}
            onMouseEnter={this.handleScrollStart.bind(this)}
            onMouseLeave={this.handleScrollStop.bind(this)}
          >
            {Array.isArray(list) && list.length > 0 ? list.map((event, index) =>
              <div className={`${cssStyle.detailBox} ${this.props.thisData.id + '_detailBox'}`} key={index} onClick={this.eventClick.bind(this, event)}>
                <div className={cssStyle.headTwo}>
                  <div className={cssStyle.title}>
                    <div className={cssStyle.line} />
                    <div>{event.name}</div>
                  </div>
                  <div className={cssStyle.subTitle}>描述：</div>
                  <div className={cssStyle.detailContent}>{event.description}</div>
                  <div style={{display: 'flex',alignItems: 'center'}}>
                    <div style={{width: '50%'}}>
                      <div className={cssStyle.subTitle}>起止时间：</div>
                      <div className={cssStyle.detailContent}>{event.totalDate}</div>
                    </div>
                    <div style={{width: '50%'}}>
                      <div className={cssStyle.subTitle}>日程状态：</div>
                      <div className={`${cssStyle.detailContent} ${event.status === 0 && cssStyle.status}`}>{event.statusStr}</div>
                    </div>
                  </div>
                  <div className={cssStyle.subTitle}>部门：</div>
                  <div className={cssStyle.detailContent}>{event.deptName}</div>
                  <div className={cssStyle.subTitle}>台账信息：</div>
                  <div className={cssStyle.info}>
                    <div className={cssStyle.title}>任务描述</div>  
                    <div className={cssStyle.detailContent}>{event.task}</div>  
                    <div className={cssStyle.title}>照片信息</div>  
                    <div className={cssStyle.detailContent}>
                      {
                        Array.isArray(event.imgList) && event.imgList.length > 0 && event.imgList.map((item, index) => {
                          return <img className={cssStyle.img} key={index} alt='' src={item.src} />
                        })
                      }
                      
                    </div>  
                    <div className={cssStyle.title}>附件</div>  
                      {
                        Array.isArray(event.fileList) && event.fileList.length > 0 && event.fileList.map((item, index) => {
                          return <div key={index} className={cssStyle.file_list}>
                          <div className={cssStyle.file_name}>{item.name}</div>
                          <div className={cssStyle.file_down}>下载</div>
                        </div> 
                        })
                      }
                      
                  </div>
                </div>
              </div>

            ) : (
              <div className={cssStyle.blankBox}>
                <img alt={''} src={BlankImg} />
                <div className={cssStyle.blankText}>暂无数据</div>
              </div>
            )}

          </Scrollbars>
        </div>
      </div>
    );
  }
}