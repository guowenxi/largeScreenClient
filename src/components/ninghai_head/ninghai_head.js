import React from "react";
import ComponentBox from "../component_box";
import cssStyle from "./ninghai_head.module.css";
import { getData } from "../../common/getDataUtil";
import { Motion, spring } from "react-motion";
import {interactData} from "../../common/util";
import BarTypeTwo from "../../common/svg/barTypeTwo";
import ThreePie from "../three_pie/three_pie";
import {threePieData} from "./threePieData";
import SingleMoveNum from "../../common/singleMoveNum";
import SvgEffectLine from "../../common/svgEffectLine";
import CustomLabel from "./customLabel";

import PartOneBg from "./images/partOne.svg";
import PartTwoBg from "./images/partTwo.svg";
import IconOne from "./images/iconOne.svg";
import IconFour from "./images/iconFour.svg";
import IconHandle from "./images/iconHandle.svg";
import IconPeople from "./images/iconPeople.svg";
import IconEventType from "./images/iconEventType.svg";
import IconTime from "./images/iconTime.svg";
import IconAddress from "./images/iconAddress.svg";
import IconAffect from "./images/iconAffect.svg";
import RectOne from "./images/rect.svg";
import PartThreeAfter from "./images/partThreeAfter.png";
import PartThreeBefore from "./images/partThreeBefore.png";
import LineOne from "./images/lineOne.svg";
import LineTwo from "./images/lineTwo.svg";
import TextBg from "./images/textBg.png";

export default class NinghaiHead extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opacity: 0, resultData: null, selectedIndex: 1, barSelected:0 };
        this.keyParams = {};
        this.getData = getData.bind(this);
        this.interactData = interactData.bind(this);
        this.barData = [
            {name:'1次未接收',num:'80',per:'80'},
            {name:'2次未接收',num:'100',per:'100'},
            {name:'3次未接收',num:'70',per:'70'},
            {name:'处理中',num:'60',per:'60'},
            {name:'已反馈',num:'80',per:'80'},
        ];
        this.lineStyleList = [
            {path:'M 80,0 L 460,194',color:'rgba(255,155,37,0.8)'},
            {path:'M 100,0 L 480,194',color:'rgba(255,155,37,0.8)'},
            {path:'M 120,0 L 500,194',color:'rgba(255,155,37,0.8)'},
            {path:'M 380,194 L 0,0',color:'rgba(255,255,255,0.8)'},
            {path:'M 360,194 L -20,0',color:'rgba(255,255,255,0.8)'},
            {path:'M 340,194 L -40,0',color:'rgba(255,255,255,0.8)'},
        ];
        this.lineStyleListTwo = [
            {path:'M 0,194 L 380,0',color:'rgba(255,155,37,0.8)'},
            {path:'M -20,194 L 360,0',color:'rgba(255,155,37,0.8)'},
            {path:'M -40,194 L 340,0',color:'rgba(255,155,37,0.8)'},
            {path:'M 460,0 L 80,194',color:'rgba(255,255,255,0.8)'},
            {path:'M 480,0 L 100,194',color:'rgba(255,255,255,0.8)'},
            {path:'M 500,0 L 120,194',color:'rgba(255,255,255,0.8)'},
        ];
        this.hasShow = false;
    }

    //组件加载触发函数
    componentDidMount() {
        this.hasShow = this.props.thisData.showStatus;
        this.p = new Promise((resolve) => {
            if (this.props.thisData.firstLoad) {
                this.getData(this.callBack.bind(this, resolve))
            } else {
                this.callBack(resolve);
            }
        });
        if (this.props.firstLoad === false) {
            this.animateOn();
        }
    }

    //组件删除时触发函数
    componentWillUnmount() {
        if(this.autoBarTimer){
            clearTimeout(this.autoBarTimer);
        }
        if(this.moveNumTimer){
            clearTimeout(this.moveNumTimer);
        }
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if (prevProps.thisData.showStatus !== this.props.thisData.showStatus && this.props.thisData.showStatus) {
            const {dataSources} = this.props.thisData;
            this.interactData(dataSources.interact,{id:this.state.selectedIndex});
            this.hasShow = true;
        }
    }

    //接收事件消息
    receiveMessage(data) {
        switch (data.type) {
            case "animateOn":
                //初始化加载动画
                this.animateOn();
                break;
            case "changeKey":
                for (let key in data.data) {
                    this.keyParams[key] = data.data[key];
                }
                this.reGetData();
                break;
            case "showComponent":
                break;
            case "changeSelected":
                if(this.state.selectedIndex !== data.data.id){
                    this.setState({selectedIndex:data.data.id});
                }
                const {dataSources} = this.props.thisData;
                if(dataSources.interact && dataSources.interact.length > 0 && data.isInteract !== 2){
                    this.interactData(dataSources.interact,{id:data.data.id});
                }
                break;
            default:
                break;
        }
    }

    //运行加载动画
    animateOn() {
        this.p.then(() => {
            this.setState({ opacity: 1 });
        })
    }

    //重新获取数据
    reGetData() {
        this.getData(this.callBack.bind(this, ''));
    }

    //获取数据后回调
    callBack(resolve, result) {
        if (resolve) {
            resolve(result);
        }
        if (result) {
            this.getDataTime = new Date().getTime();
            const barData = [result.onceNotReceive,result.twiceNotReceive,result.thriceNotReceive,result.processing,result.feedback];
            let maxNum = 0;
            barData.forEach((item)=>{
                if(item > maxNum){
                    maxNum = item;
                }
            });
            const showBarData = barData.map((item,index)=>{
                return {name:this.barData[index].name,num:item,per:maxNum === 0 ? 0 : (item*100/maxNum).toFixed(2)};
            });
            threePieData.dataSources.defaultData = JSON.stringify([{num:result.yearWarning},{num:result.mothWarning}]);
            this.setState({ resultData: result,showBarData },()=>{
                this.autoSelectBar();
            });
        }
    }

    changeSelect(index){
        const {dataSources} = this.props.thisData;
        if(this.state.selectedIndex !== index){
            if(dataSources.interact && dataSources.interact.length > 0){
                this.interactData(dataSources.interact,{id:index});
            }
            this.setState({selectedIndex:index});
        }
    }

    autoSelectBar(){
        if(this.autoBarTimer){
            clearTimeout(this.autoBarTimer);
        }
        this.autoBarTimer = setTimeout(()=>{
            let {barSelected} = this.state;
            barSelected ++;
            if(barSelected >= 5){
                barSelected = 0;
            }
            this.changeBarSelected(barSelected);
            this.autoSelectBar();
        },2000);
    }

    changeBarSelected(index){
        if(this.autoBarTimer){
            clearTimeout(this.autoBarTimer);
        }
        this.setState({barSelected:index});
    }

    getMoveNum(num){
        const numStr = num.toString();
        const numSingleList = numStr.split("");
        return numSingleList.map((str, numIndex)=>
            <div className={cssStyle.numSingle} key={numSingleList.length - numIndex} >
                <SingleMoveNum autoMoveTime={5000} num={str} getDataTime={this.getDataTime} width={'1em'} />
            </div>
        )
    }

    getEffectLine(lineList,name){
        return lineList.map((item,index)=>
            <SvgEffectLine
                key={index}
                id={name+index+'lineOne_' + this.props.thisData.id}
                viewBox="0 0 460 194"
                preserveAspectRatio="none"
                d={item.path}
                stroke="rgba(80,89,169,1)"
                color={item.color}
                effect={true}
                className={cssStyle.box}
            />
        );
    }

    interactClick(key,data,index){
        if(index == null || index === this.state.selectedIndex){
            const { style } = this.props.thisData;
            this.interactData(style[key],data || {});
        }
    }

    render() {
        const { style } = this.props.thisData;
        const {selectedIndex,barSelected,resultData,showBarData} = this.state;
        const fontSize = this.props.getCompatibleSize(style.fontSize);
        return (
            <ComponentBox style={{ ...this.props.style }} receiveMessage={this.receiveMessage.bind(this)} reGetData={this.reGetData.bind(this)} thisData={this.props.thisData} className={cssStyle.flex} >
                <Motion style={{ opacity: spring(this.state.opacity) }}>
                    {({ opacity }) =>
                        <div className={cssStyle.allBox} style={{ opacity, fontSize, color:style.fontColor }} >
                            {resultData != null && (
                                <React.Fragment>
                                    <div className={`${cssStyle.partOneBox} ${selectedIndex === 1 ? cssStyle.selectedBox:''}`}>
                                        <div className={cssStyle.lineBoxOne}>
                                            {this.getEffectLine(this.lineStyleList,'one')}
                                            <div className={cssStyle.dataCountOne} onClick={this.interactClick.bind(this,'countInteract')}>
                                                总数：{resultData.totalData}条
                                            </div>
                                            <div className={cssStyle.dataCountTwo} onClick={this.interactClick.bind(this,'countInteract')}>
                                                今日：{resultData.todayData}条
                                            </div>
                                        </div>
                                        <div className={cssStyle.partOneBg} >
                                            <div className={cssStyle.circleBottom} />
                                            <div className={cssStyle.rectBottom} onClick={this.interactClick.bind(this,'countInteract',null,1)} >数据归集</div>
                                        </div>
                                        <div className={`${cssStyle.partOneBg} ${cssStyle.sizeChange}`} onClick={this.changeSelect.bind(this,1)}>
                                            <img className={cssStyle.bgImg} alt={''} src={IconFour} />
                                            <div className={cssStyle.redPointTwo}>{resultData.dataUnitProblem}</div>
                                            <img className={cssStyle.bgImg} alt={''} src={IconOne} />
                                            <div className={cssStyle.redPointOne}>{resultData.commonDataPlatformProblem}</div>
                                            <img className={cssStyle.bgImg} alt={''} src={PartOneBg} />
                                            <div className={cssStyle.moveNumBox} onClick={this.interactClick.bind(this,'sourceInteract',null,1)}>
                                                {resultData.dataUnit != null && this.getMoveNum(resultData.dataUnit)}
                                            </div>
                                            <div className={cssStyle.moveNumBox} onClick={this.interactClick.bind(this,'platformInteract',null,1)}>
                                                {resultData.commonDataPlatform != null && this.getMoveNum(resultData.commonDataPlatform)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${cssStyle.partTwoBox} ${selectedIndex === 2 ? cssStyle.selectedBox:''}`}>
                                        <div className={cssStyle.lineBoxOne}>
                                            {this.getEffectLine(this.lineStyleListTwo,'two')}
                                        </div>
                                        <div className={cssStyle.partTwoBg} onClick={this.changeSelect.bind(this,2)}>
                                            <div className={cssStyle.circleBottom} />
                                            <div className={cssStyle.rectBottom} onClick={this.interactClick.bind(this,'labelInteract',null,2)}>标签化体系</div>
                                            <div className={cssStyle.showAll} onClick={this.interactClick.bind(this,'allInteract',null,2)}>标签分析</div>
                                            <div className={cssStyle.labelEdit} onClick={this.interactClick.bind(this,'editInteract',null,2)} />
                                        </div>
                                        <div className={`${cssStyle.partTwoBg} ${cssStyle.noEvents} ${cssStyle.sizeChange}`} >
                                            <img className={cssStyle.bgImg} alt={''} src={PartTwoBg} />
                                            <div className={cssStyle.rectOneBox}>
                                                <div className={`${cssStyle.rectMoveBox} ${cssStyle.rectMoveOne}`}>
                                                    <img alt={''} className={cssStyle.rect} src={RectOne} />
                                                    <div className={cssStyle.partTwoNumOneBox}>
                                                        <div>自定义</div>
                                                        <div className={cssStyle.moveNumBox}>
                                                            {resultData.custom != null && this.getMoveNum(resultData.custom)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cssStyle.rectTwoBox}>
                                                <div className={`${cssStyle.rectMoveBox} ${cssStyle.rectMoveTwo}`}>
                                                    <img alt={''} className={cssStyle.rect} src={RectOne} />
                                                    <div className={cssStyle.partTwoNumOneBox}>
                                                        <div>发现侧</div>
                                                        <div className={cssStyle.moveNumBox}>
                                                            {resultData.findSide != null && this.getMoveNum(resultData.findSide)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cssStyle.rectThreeBox}>
                                                <div className={`${cssStyle.rectMoveBox} ${cssStyle.rectMoveThree}`}>
                                                    <img alt={''} className={cssStyle.rect} src={RectOne} />
                                                    <div className={cssStyle.partTwoNumOneBox}>
                                                        <div>专业侧</div>
                                                        <div className={cssStyle.moveNumBox}>
                                                            {resultData.specialtySide != null && this.getMoveNum(resultData.specialtySide)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cssStyle.rectFourBox}>
                                                <div className={`${cssStyle.rectMoveBox} ${cssStyle.rectMoveFour}`}>
                                                    <img alt={''} className={cssStyle.rect} src={RectOne} />
                                                    <div className={cssStyle.partTwoNumOneBox}>
                                                        <div>统筹侧</div>
                                                        <div className={cssStyle.moveNumBox}>
                                                            {resultData.overallPlanningSide != null && this.getMoveNum(resultData.overallPlanningSide)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={cssStyle.partTwoNumTwoBox}>
                                                <div>处置侧</div>
                                                <div className={cssStyle.moveNumBox}>
                                                    {resultData.disposeSide != null && this.getMoveNum(resultData.disposeSide)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${cssStyle.partThreeBox} ${selectedIndex === 3 ? cssStyle.selectedBox:''}`}>
                                        <div className={cssStyle.lineBoxOne}>
                                            {this.getEffectLine(this.lineStyleList,'three')}
                                        </div>
                                        <div className={cssStyle.partThreeBg} >
                                            <div className={cssStyle.circleBottom} />
                                            <div className={cssStyle.rectBottom} >规律画像</div>
                                        </div>
                                        <div className={`${cssStyle.partThreeBg} ${cssStyle.sizeChange}`} onClick={this.changeSelect.bind(this,3)}>
                                            <img className={cssStyle.partThreeAfter} alt={''} src={PartThreeAfter} />
                                            {/*<div className={cssStyle.partThreePeople}>*/}
                                            {/*    <img className={cssStyle.peopleRotate} alt={''} src={PartThreePeople} />*/}
                                            {/*</div>*/}
                                            <img className={cssStyle.partThreeBefore} alt={''} src={PartThreeBefore} />
                                            <div className={cssStyle.partThreeIconBox}>
                                                <div className={`${cssStyle.rectMoveBox} ${cssStyle.rectMoveOne}`}>
                                                    <div className={cssStyle.bgBar} />
                                                    <img className={cssStyle.partThreeIcon} alt={''} src={IconHandle} />
                                                    <div className={cssStyle.partThreeIconText}>处置</div>
                                                </div>
                                            </div>
                                            <div className={cssStyle.partThreeIconBox}>
                                                <div className={`${cssStyle.rectMoveBox} ${cssStyle.rectMoveTwo}`}>
                                                    <div className={cssStyle.bgBar} />
                                                    <img className={cssStyle.partThreeIcon} alt={''} src={IconPeople} />
                                                    <div className={cssStyle.partThreeIconText}>人员</div>
                                                </div>
                                            </div>
                                            <div className={cssStyle.partThreeIconBox}>
                                                <div className={`${cssStyle.rectMoveBox} ${cssStyle.rectMoveThree}`}>
                                                    <div className={cssStyle.bgBar} />
                                                    <img className={cssStyle.partThreeIcon} alt={''} src={IconEventType} />
                                                    <div className={cssStyle.partThreeIconText}>事件类型</div>
                                                </div>
                                            </div>
                                            <div className={cssStyle.partThreeIconBox}>
                                                <div className={`${cssStyle.rectMoveBox}`}>
                                                    <img className={cssStyle.partThreeIcon} alt={''} src={IconTime} />
                                                    <div className={cssStyle.partThreeIconText}>时间</div>
                                                </div>
                                            </div>
                                            <div className={cssStyle.partThreeIconBox}>
                                                <div className={`${cssStyle.rectMoveBox} ${cssStyle.rectMoveFour}`}>
                                                    <div className={cssStyle.bgBar} />
                                                    <img className={cssStyle.partThreeIcon} alt={''} src={IconAddress} />
                                                    <div className={cssStyle.partThreeIconText}>地点</div>
                                                </div>
                                            </div>
                                            <div className={cssStyle.partThreeIconBox}>
                                                <div className={`${cssStyle.rectMoveBox} ${cssStyle.rectMoveFive}`}>
                                                    <div className={cssStyle.bgBar} />
                                                    <img className={cssStyle.partThreeIcon} alt={''} src={IconAffect} />
                                                    <div className={cssStyle.partThreeIconText}>影响</div>
                                                </div>
                                            </div>
                                            <CustomLabel selectedIndex={this.state.selectedIndex} token={this.props.token} serviceAddress={style.serviceAddress} interactClick={this.interactClick.bind(this)} />
                                        </div>
                                    </div>
                                    <div className={cssStyle.partTwoBox}>
                                        <div className={cssStyle.lineBoxOne}>
                                            <div className={cssStyle.partTwoTextBox}>
                                                {resultData.evTypeA && resultData.evTypeA.map((item,index)=>
                                                    <div className={cssStyle.partTwoText} key={index}>
                                                        <span title={item}>{item}</span>
                                                        <img alt={''} src={TextBg} />
                                                    </div>
                                                )}
                                                {resultData.evTypeB && resultData.evTypeB.map((item,index)=>
                                                    <div className={cssStyle.partTwoText} key={index}>
                                                        <span title={item}>{item}</span>
                                                        <img alt={''} src={TextBg} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${cssStyle.partFourBox} ${selectedIndex === 4 ? cssStyle.selectedBox:''}`}>
                                        <div className={cssStyle.partFourBg} >
                                            <div className={cssStyle.circleBottom} />
                                            <div className={cssStyle.rectBottom} >预警推送</div>
                                        </div>
                                        <div className={`${cssStyle.partFourBg} ${cssStyle.sizeChange}`} onClick={this.changeSelect.bind(this,4)}>
                                            <div onMouseLeave={this.autoSelectBar.bind(this)}>
                                                {showBarData.map((item,index)=>
                                                    <div
                                                        className={`${cssStyle.bar} ${barSelected === index ? cssStyle.barSelected:''}`}
                                                        key={index}
                                                        onMouseOver={this.changeBarSelected.bind(this,index)}
                                                    >
                                                        <BarTypeTwo contentStyle={{}} percentage={item.per} num={item.num} name={item.name} tooltip={false} />
                                                        {barSelected === index && (
                                                            <div className={cssStyle.barDataBox} style={{bottom:item.per+'%'}}>
                                                                <span>{item.name}</span>
                                                                <span>{item.num}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={cssStyle.threePie}>
                                                {this.hasShow && <ThreePie style={{...threePieData.position,pointerEvents:'none'}} token={this.props.token} thisData={threePieData} firstLoad={false} />}
                                                <img className={cssStyle.lineOne} alt={''} src={LineOne} />
                                                <img className={cssStyle.lineTwo} alt={''} src={LineTwo} />
                                                <div className={cssStyle.pieNumOneBox}>
                                                    <div className={cssStyle.moveNumBox}>
                                                        {resultData.mothWarning != null && this.getMoveNum(resultData.mothWarning)}
                                                    </div>
                                                    <div>本月预警</div>
                                                </div>
                                                <div className={cssStyle.pieNumTwoBox}>
                                                    <div className={cssStyle.moveNumBox}>
                                                        {resultData.yearWarning != null && this.getMoveNum(resultData.yearWarning)}
                                                    </div>
                                                    <div>今年预警</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    }
                </Motion>
            </ComponentBox>
        );
    }
}