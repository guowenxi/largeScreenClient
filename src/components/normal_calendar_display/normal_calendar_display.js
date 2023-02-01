import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./normal_calendar_display.module.css";
import {Motion, spring} from "react-motion";
import {getCompatibleSize, interactData} from "../../common/util";
import Emitter from "../../common/eventBus";
import {getData} from "../../common/getDataUtil";

export default class NormalCalendarDdisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {opacity:0,resultData:{}};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.keyParams = {};
        this.year = null;
        this.month= null;
        this.day = null;
        // this.year_month = null; 
        this.allday = 0;
        this.dayArr = []
    }

    //组件加载触发函数
    componentDidMount() {
      // 获取当前年月日
      const today = new Date() //获取当前时间
      this.year = today.getFullYear() // //获取当前年份
      this.month = today.getMonth()+1 // //获取当前月份
      this.day = today.getDate() // //获取当前日
      this.showMonth()
      this.p = new Promise((resolve) => {
          if (this.props.thisData.firstLoad) {
              this.getData(this.callBack.bind(this, resolve));
          } else {
              this.callBack(resolve);
          }
      });
      if(this.props.firstLoad === false){
          this.animateOn();
      }
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "dataInterchange":
            case "changeKey" :
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                if(data.reGetData !== 2){
                    this.reGetData();
                }
                const { date } = this.keyParams
                if (date) {
                  const dateArr = date.split('-')
                  if(dateArr && Array.isArray(dateArr) && dateArr.length) {
                    this.dayCount(Number(dateArr[0]), Number(dateArr[1]))
                    this.year = Number(dateArr[0])
                    this.month = Number(dateArr[1])
                  }
                }
                break;
            case "showComponent":
                //显示当前组件
                Emitter.emit('app_box', {
                    type: 'changeComponentShowStatus',
                    data: { showStatus: true, id: this.props.thisData.id }
                });
                break;
            default:
                break;
        }
    }

    // 显示当前月份
    showMonth() {
      // if(this.month < 10){		//给小于10的数字前面加0
      //   this.year_month = this.year +" 年 " + "0" + this.month + " 月 ";
      // }else{
      //   this.year_month = this.year+" 年 " + this.month +" 月 ";
      // }
      this.dayCount(this.year, this.month)
    }

    // 判断当前月份是多少天
    dayCount(year, month) {
      this.dayArr = []
      if(month !== 2){
        if(month === 4 || month === 6 || month === 9 || month === 11)//判断月是30天还是31天,2月除外
          this.allday = 30;
        else
        this.allday = 31;
      }else{
        if((year % 4 === 0 &&  year % 100 !== 0) || (year % 400 ===0))//判断是否是闰年，进行相应的改变
        this.allday = 29;
        else
        this.allday = 28;
      }
      for (let index = 1; index <= this.allday; index++) {
        const obj = {
          day: index,
          isTask: false,
        }
        if (index === this.day + 1) {
          obj.isTask = true
        }
        // this.dayArr.push(obj)
      }
      for (let index = 1; index <= this.allday; index++) {
        const obj = {
          day: index,
          isTask: false,
        }
        // if (index === this.day + 1) {
        //   obj.isTask = true
        // }
        this.dayArr.push(obj)
      }
    }

    // 显示相应月份的天数
    showDay() {

    }

    // 点击日历中的每一天
    dayClick(day) {
      const date = this.year + '-' + this.month + '-' + day
      const { interact } = this.props.thisData.dataSources;
      this.interactData(interact, {date: date})
    }

    //运行加载动画
    animateOn(){
        this.setState({opacity:1});
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve();
        }
        if (result) {
            //数据结果处理
            this.setState({ resultData: result });
        }
    }

    render() {
        const {style} = this.props.thisData;
        const fontSize = getCompatibleSize(style.fontSize);
        const {resultData} = this.state;
        if(Array.isArray(resultData) && resultData.length > 0) {
          this.dayArr.forEach(item => {
            resultData.forEach(citem => {
              if (item.day === citem){
                item.isTask = true
              }
            })
          })
        }
        
        return (
            <ComponentBox style={{...this.props.style}} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} >
                <Motion style={{opacity:spring(this.state.opacity)}}>
                    {({opacity}) =>
                        <div className={`${cssStyle.box} blank_style`} style={{fontSize,opacity,color:style.fontColor}}>
                            {/*展示内容*/}
                            {/* {resultData && resultData.name}
                             */}
                             {/* <div>{this.year_month}</div> */}
                             <div className={cssStyle.calendar}>
                              {
                                Array.isArray(this.dayArr) && this.dayArr.length > 0 &&this.dayArr.map((item, index) => (
                                  <div key={index} className={`${cssStyle.calendar_item} ${item.day === this.day ? cssStyle.calendar_item_selected:''} ${item.isTask ? cssStyle.calendar_item_is_tasks:''}`} onClick={this.dayClick.bind(this, item.day)}>
                                    {
                                      item.isTask && <div className={cssStyle.spot}></div>
                                    }
                                    <div className={cssStyle.num}>{item.day}</div>
                                  </div>
                                ))
                              }
                             </div>
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}