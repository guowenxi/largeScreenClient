import React from 'react';
import {Form, Collapse, Select, Input, Radio, Button, Icon, InputNumber, Switch, Tag, Tooltip, Row, Col} from 'antd';
import {
    addListItem,
    changeDetailData,
    deleteListItem,
    getInteractEdit, iconClick, selectIcon,
    selectIconCancel,
    selectIconOk
} from "../../common/editUtil";
import { getColorList } from "../../common/nameNumEditUtil";
import { getDetailEdit } from "../../common/detailUtil";
import FileSelect from "../../common/fileSelect";
import {fileUrl} from "../../config";

const { Panel } = Collapse;

export default class DetailEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getColorList = getColorList.bind(this);
        this.getDetailEdit = getDetailEdit.bind(this);
        this.getInteractEdit = getInteractEdit.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const formItemLayout24 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const { style } = this.props.data;
        return (
            <Form {...formItemLayout24} >
                <Collapse >
                    <Panel header="内容设置" key="1">
                        <Form.Item label="上方载入" >
                            <Radio.Group value={style.formTop} onChange={changeDetailData.bind(this, 1, style, 'formTop')}>
                                <Radio.Button value={1}>是</Radio.Button>
                                <Radio.Button value={0}>否</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="字号">
                            <Input value={style.fontSize} onChange={changeDetailData.bind(this, 1, style, 'fontSize')} />
                        </Form.Item>
                        <Form.Item label="详情内容">
                            <Select value={style.contentName} onChange={changeDetailData.bind(this, 2, style, 'contentName')}>
                       
                                <Select.Option value={'followUpRecords'}>随访记录(瑞安</Select.Option>
                                <Select.Option value={'briefingOne'}>简报(宁海</Select.Option>
                                <Select.Option value={'ninghaiSearch'}>搜索(宁海</Select.Option>
                                <Select.Option value={'wordList'}>热词列表</Select.Option>
                                <Select.Option value={'formDetail'}>登记表详情（乐清防疫</Select.Option>
                                <Select.Option value={'buildingDetail'}>楼盘详情</Select.Option>
                                <Select.Option value={'buildingTwo'}>楼盘详情二</Select.Option>
                                <Select.Option value={'groupEdit'}>小组编辑</Select.Option>
                                <Select.Option value={'imageListOne'}>图片列表</Select.Option>
                                <Select.Option value={'imageListTwo'}>图片列表2(芦岙</Select.Option>
                                <Select.Option value={'imageListThree'}>图片列表3(芦岙</Select.Option>
                                <Select.Option value={'abnormalPersonnel'}>异常人员详情</Select.Option>
                                <Select.Option value={'emergencyDisposalDetail'}>应急处置详情（金海危化新模拟演练）</Select.Option>
                                <Select.Option value={'warehouseListDetail'}>仓库列表（金海危化新安全）</Select.Option>
                                <Select.Option value={'equipmentWarning'}>设备告警（金海危化新模拟演练）</Select.Option>
                                <Select.Option value={'gasListDetail'}>气体监测（金海危化新安全）</Select.Option>
                                <Select.Option value={'gasListHistoryDetail'}>气体监测历史（金海危化新安全）</Select.Option>
                                <Select.Option value={'inventoryTransactionDetailOne'}>仓库交易详情（金海危化新仓储管理）</Select.Option>
                                <Select.Option value={'visitorDetailOne'}>访客详情（金海危化新首页）</Select.Option>
                                <Select.Option value={'alarmRecordDetailOne'}>历史告警记录详情（金海危化新首页）</Select.Option>
                                <Select.Option value={'peopleDetailOne'}>人员详情（金海危化新首页）</Select.Option>
                                <Select.Option value={'equipmentDetailOne'}>设备详情（金海危化新首页）</Select.Option>
                                <Select.Option value={'carDetailOne'}>车辆详情（金海危化新首页）</Select.Option>
                                <Select.Option value={'collectionDataList'} >归集数据列表（民转刑首页）</Select.Option>
                                <Select.Option value={'boxTypeOne'} >背景框盒</Select.Option>
                                <Select.Option value={'specialTextOne'} >文字特效一（mzx首页</Select.Option>
                                <Select.Option value={'specialLineOne'} >尾迹线一（警网协同</Select.Option>
                                <Select.Option value={'specialLineTwo'} >尾迹线二（排查识别</Select.Option>
                                <Select.Option value={'specialLineThree'} >尾迹线三（跟踪关注</Select.Option>
                                <Select.Option value={'specialLineFour'} >尾迹线四（化解管控</Select.Option>
                                <Select.Option value={'specialLineFive'} >尾迹线五（责任落实</Select.Option>
                                <Select.Option value={'specialLineSix'} >尾迹线六（预警预测</Select.Option>
                                <Select.Option value={'specialLineSeven'} >尾迹线七（排查识别2</Select.Option>
                                <Select.Option value={'gradientText'}>渐变文字</Select.Option>
                                <Select.Option value={'creditDetail'} >龙湾信用详情</Select.Option>
                                <Select.Option value={'grid'} >网格详情</Select.Option>
                                <Select.Option value={'svgMapOne'} >流光地图一(柳市</Select.Option>
                                <Select.Option value={'svgMapTwo'} >流光地图二(柳市</Select.Option>
                                <Select.Option value={'svgMapThree'} >地图三(柳市</Select.Option>
                                <Select.Option value={'svgMapFour'} >地图四(乐清</Select.Option>
                                <Select.Option value={'controlOne'} >页面控制(柳市</Select.Option>
                                <Select.Option value={'moveWaves'} >平移波浪</Select.Option>
                                <Select.Option value={'purchase'} >采购项目</Select.Option>
                                <Select.Option value={'infrastructure'} >基建项目</Select.Option>
                                <Select.Option value={'inAndOut'} >货物进出</Select.Option>
                                <Select.Option value={'budgetImplementation'} >预算执行</Select.Option>
                                <Select.Option value={'fixedAssetsInventory'} >固资库存</Select.Option>
                                <Select.Option value={'importantPeople'} >重点人一</Select.Option>
                                <Select.Option value={'importantEvent'} >重点事一</Select.Option>
                                <Select.Option value={'importantPlace'} >重点场所一</Select.Option>
                                <Select.Option value={'importantPlaceTwo'} >重点场所二</Select.Option>
                                <Select.Option value={'importantPlaceThree'} >重点场所三</Select.Option>
                                <Select.Option value={'eventOne'} >事件一</Select.Option>
                                <Select.Option value={'eventTwo'} >事件二</Select.Option>
                                <Select.Option value={'eventThree'} >事件三</Select.Option>
                                <Select.Option value={'eventFive'} >事件五</Select.Option>
                                <Select.Option value={'eventSix'}>事件六（黄岩</Select.Option>
                                <Select.Option value={'eventSeven'}>事件七（富阳</Select.Option>
                                <Select.Option value={'eventEight'}>事件八（富阳</Select.Option>
                                <Select.Option value={'eventEightPartTwo'}>事件八部分二（富阳</Select.Option>
                                <Select.Option value={'eventEightPartThree'}>事件八部分三（富阳</Select.Option>
                                <Select.Option value={'eventNine'}>事件九（台州</Select.Option>
                                <Select.Option value={'eventTen'}>事件十（宁海</Select.Option>
                                <Select.Option value={'eventEleven'}>事件十一（瑞安</Select.Option>
                                <Select.Option value={'eventTwelve'}>事件十二（富阳</Select.Option>
                                <Select.Option value={'eventThirteen'}>事件十三（龙湾</Select.Option>
                                <Select.Option value={'eventFourteen'}>事件十四（龙湾</Select.Option>
                                <Select.Option value={'eventFifteen'}>事件十五（龙湾</Select.Option>
                                <Select.Option value={'eventSixteen'}>事件十六（瑞安</Select.Option>
                                <Select.Option value={'eventSeventeen'}>事件十七（乐清</Select.Option>
                                <Select.Option value={'eventEighteen'}>事件十八（乐清</Select.Option>
                                <Select.Option value={'eventNineteen'}>事件十九（乐清</Select.Option>
                                <Select.Option value={'eventPeople'}>人员详情（乐清</Select.Option>
                                <Select.Option value={'drugAdministration'} >龙湾药监</Select.Option>
                                <Select.Option value={'wzwt'} >温州违停</Select.Option>
                                <Select.Option value={'rental_housing'} >出租房管理</Select.Option>
                                <Select.Option value={'budget'} >首页-执行预算</Select.Option>
                                <Select.Option value={'reception'} >公务员接待费</Select.Option>
                                <Select.Option value={'news'} >图片新闻</Select.Option>
                                <Select.Option value={'travel'} >差旅经费</Select.Option>
                                <Select.Option value={'economics'} >经济事项</Select.Option>
                                <Select.Option value={'contract'} >机关合同</Select.Option>
                                <Select.Option value={'involved'} >涉案财物</Select.Option>
                                <Select.Option value={'currentAccount'} >往来款</Select.Option>
                                <Select.Option value={'coordination'} >瑞安协同处置</Select.Option>
                                <Select.Option value={'finance'} >中央省市级财政</Select.Option>
                                <Select.Option value={'economicMatters'} >经济事项(市级公用)</Select.Option>
                                <Select.Option value={'comprehensiveMatters'} >综合事项(市级公用)</Select.Option>
                                <Select.Option value={'placeLucheng'} >鹿城重点场所</Select.Option>
                                <Select.Option value={'platformList'} >平台列表</Select.Option>
                                <Select.Option value={'platformListTwo'} >平台列表二(龙湾</Select.Option>
                                <Select.Option value={'aboutPlatform'} >关联平台</Select.Option>
                                <Select.Option value={'eventLucheng'} >事件详情(鹿城</Select.Option>
                                <Select.Option value={'peopleLucheng'} >人员详情(鹿城</Select.Option>
                                <Select.Option value={'liushiDetail'} >柳市镇详情</Select.Option>
                                <Select.Option value={'sanitationWorker'} >环卫工</Select.Option>
                                <Select.Option value={'totalQuantityYuhai'} >玉海全量</Select.Option>
                                <Select.Option value={'messageEdit'} >消息编辑</Select.Option>
                                <Select.Option value={'messageEditTwo'} >事件转入(鹿城</Select.Option>
                                <Select.Option value={'weather'} >天气</Select.Option>
                                <Select.Option value={'peopleListOne'} >人员列表一</Select.Option>
                                <Select.Option value={'peopleListTwo'} >人员列表二</Select.Option>
                                <Select.Option value={'eventListOne'} >事件列表一</Select.Option>
                                <Select.Option value={'eventListTwo'} >事件列表二</Select.Option>
                                <Select.Option value={'eventListThree'} >事件列表三(乐清</Select.Option>
                                <Select.Option value={'eventListFour'} >事件列表四(乐清</Select.Option>
                                <Select.Option value={'eventListFive'} >事件列表五(乐清</Select.Option>
                                <Select.Option value={'peopleListThree'} >人员列表(乐清</Select.Option>
                                <Select.Option value={'groupList'} >网格小组列表</Select.Option>
                                <Select.Option value={'blankBackground'} >背景框盒</Select.Option>
                                <Select.Option value={'eventStepOne'} >事件流程节点一</Select.Option>
                                <Select.Option value={'eventStepTwo'} >事件流程节点二</Select.Option>
                                <Select.Option value={'eventStepThree'} >事件流程节点三</Select.Option>
                                <Select.Option value={'eventStepFour'} >事件流程节点四</Select.Option>
                                <Select.Option value={'eventStepFive'} >事件流程节点五</Select.Option>
                                <Select.Option value={'gridAppraisal'} >获奖网格</Select.Option>
                                <Select.Option value={'monitorJinhai'} >金海危化视频监控</Select.Option>
                                <Select.Option value={'emergencyEvent'} >紧急事件</Select.Option>
                                <Select.Option value={'peopleUnusualMove'} >人员异动</Select.Option>
                                <Select.Option value={'instruction'} >指令详情</Select.Option>
                                <Select.Option value={'eventFour'} >指挥调度事件详情</Select.Option>
                                <Select.Option value={'addInstruction'} >下达指令</Select.Option>
                                <Select.Option value={'jinHaiEquipmentNumber'} >金海危化视频监控</Select.Option>
                                <Select.Option value={'addEventOne'} >新增事件一</Select.Option>
                                <Select.Option value={'addEventTwo'} >新增事件二(转入四平台</Select.Option>
                                <Select.Option value={'peopleWarning'} >预警人</Select.Option>
                                <Select.Option value={'eventWarning'} >预警事</Select.Option>
                                <Select.Option value={'companyWarning'} >预警单位</Select.Option>
                                <Select.Option value={'eventProgress'} >乐清135应急联动事件进程</Select.Option>
                                <Select.Option value={'commandDispatch'} >乐清135应急联动指挥调度</Select.Option>
                                <Select.Option value={'addPower'} >乐清135应急联动增派力量</Select.Option>
                                <Select.Option value={'planStep'} >乐清135应急联动流程全貌</Select.Option>
                                <Select.Option value={'eventDiscription'} >乐清135应急联动事件描述</Select.Option>
                                <Select.Option value={'discuss'} >乐清135应急联动预案研判</Select.Option>
                                <Select.Option value={'addMember'} >乐清135应急联动添加人员</Select.Option>
                                <Select.Option value={'groupSelectOne'} >指挥室会议</Select.Option>
                                <Select.Option value={'peopleOne'} >人员详情一</Select.Option>
                                <Select.Option value={'peopleTwoPartOne'}>人员详情二(p1</Select.Option>
                                <Select.Option value={'peopleTwoPartTwo'}>人员详情二(p2</Select.Option>
                                <Select.Option value={'peopleTwoPartThree'}>人员详情二(p3</Select.Option>
                                <Select.Option value={'peopleTwoPartFour'}>人员详情二(p4</Select.Option>
                                <Select.Option value={'peopleThreePartOne'}>人员详情三(p1</Select.Option>
                                <Select.Option value={'peopleThreePartTwo'}>人员详情三(p2</Select.Option>
                                <Select.Option value={'peopleThreePartThree'}>人员详情三(p3</Select.Option>
                                <Select.Option value={'peopleThreePartFour'}>人员详情三(p4</Select.Option>
                                <Select.Option value={'peopleThreePartFive'}>人员详情三(p5</Select.Option>
                                <Select.Option value={'peopleFour'}>人员详情四(p1</Select.Option>
                                <Select.Option value={'peopleFourPartTwo'}>人员详情四(p2</Select.Option>
                                <Select.Option value={'peopleFourPartThree'}>人员详情四(p3</Select.Option>
                                <Select.Option value={'peopleFive'}>人员详情五</Select.Option>
                                <Select.Option value={'peopleSix'}>人员详情六</Select.Option>
                                <Select.Option value={'equipmentList'} >设备列表</Select.Option>
                                <Select.Option value={'equipmentDetail'} >设备详情</Select.Option>
                                <Select.Option value={'scheduleDetail'} >日程详情</Select.Option>
                                <Select.Option value={'enterpriseInformation'}>企业信息</Select.Option>
                                <Select.Option value={'importantInformationBriefing'}>要情简报</Select.Option>
                                {/* <Select.Option value={'earlyWarningEvent'}>平安天目信访新预警事件</Select.Option> */}
                                <Select.Option value={'wenchengProcessingProgress'}>文成办理进度</Select.Option>
                                <Select.Option value={'wenchengRiskLevel'}>文成风险级别</Select.Option>
                                <Select.Option value={'wenchengEventDiscription'}>文成事件描述</Select.Option>
                                <Select.Option value={'publicSecurityList'}>民转刑公安详情</Select.Option>
                                <Select.Option value={'checkGridList'}>民转刑排查业绩信息网格详情</Select.Option>
                                <Select.Option value={'defuseDetail'}>民转刑化解管控详情</Select.Option>
                                <Select.Option value={'checkDepartmentList'}>民转刑排查业绩信息部门详情</Select.Option>
                                <Select.Option value={'searchAll'}>民转刑全员条件查询</Select.Option>
                                <Select.Option value={'emergencyWarning'}>民转刑紧急预警列表</Select.Option>
                                <Select.Option value={'equipmentDesignate'}>单兵指派</Select.Option>
                                <Select.Option value={'equipmentVideoList'}>单兵视频流列表</Select.Option>
                                <Select.Option value={'breakPromiseStatistics'}>龙湾信用失信数量统计</Select.Option>
                                <Select.Option value={'digitalEconomyDetail'}>走进柳市数字经济详情</Select.Option>
                                <Select.Option value={'eventProgressNew'} >乐清应急联动事件进程新</Select.Option>
                                <Select.Option value={'planStepNew'} >乐清应急联动流程全貌新</Select.Option>
                                <Select.Option value={'eventDiscriptionNew'} >乐清应急联动事件描述新</Select.Option>
                                <Select.Option value={'commandDispatchNew'} >乐清应急联动指挥调度新</Select.Option>
                                <Select.Option value={'addMemberNew'} >乐清应急联动添加人员新</Select.Option>
                                <Select.Option value={'addPowerNew'} >乐清应急联动增派力量新</Select.Option>
                                <Select.Option value={'groupSelectOneNew'} >乐清应急联动开启会议新</Select.Option>
                                <Select.Option value={'equipmentDesignateNew'} >乐清应急联动单兵指派新</Select.Option>
                                <Select.Option value={'equipmentVideoListNew'} >乐清应急联动视频流新</Select.Option>
                                <Select.Option value={'peopleOneNew'}>乐清预警预测人员详情新</Select.Option>
                                <Select.Option value={'eventFiveNew'}>乐清预警预测事件详情新</Select.Option>
                                <Select.Option value={'tankList'}>罐区列表1（金海危化</Select.Option>
                                <Select.Option value={'tankListTwo'}>罐区列表2（金海危化</Select.Option>
                                <Select.Option value={'tankListThree'}>罐区列表3（金海危化</Select.Option>
                                <Select.Option value={'tankListFour'}>罐区列表4（金海危化</Select.Option>
                                <Select.Option value={'tankListFive'}>罐区列表5（金海危化</Select.Option>
                                <Select.Option value={'tankListSix'}>罐区列表6（金海危化</Select.Option>
                                <Select.Option value={'explain'}>应急/规格说明（金海危化</Select.Option>
                                <Select.Option value={'riskIdentification'}>风险分析（金海危化</Select.Option>
                                <Select.Option value={'problemRectification'}>隐患认定整改单（金海危化</Select.Option>
                                <Select.Option value={'orderSendOne'}>指令发送1（台州mzx</Select.Option>
                                <Select.Option value={'orderSendTwo'}>指令发送2（乐清任务指派</Select.Option>
                                <Select.Option value={'orderSendThree'}>指令发送3（台州常态任务</Select.Option>
                                <Select.Option value={'orderSendFour'}>指令发送4（台州临时任务</Select.Option>
                                <Select.Option value={'orderSendFive'}>指令发送5（台州预案指令</Select.Option>
                                <Select.Option value={'orderSendSix'}>指令发送6（台州预案指令</Select.Option>
                                <Select.Option value={'orderSendSeven'}>指令发送7（乐清交办</Select.Option>
                                <Select.Option value={'orderSendEight'}>指令发送8（乐清流转</Select.Option>
                                <Select.Option value={'orderSendNine'}>指令发送9（乐清流转</Select.Option>
                                <Select.Option value={'orderSendTen'}>指令发送10（乐清流转</Select.Option>
                                <Select.Option value={'orderSendEle'}>指令发送11（乐清分半协同</Select.Option>
                                <Select.Option value={'orderSendTwelve'}>指令发送12（乐清异动上报</Select.Option>
                                <Select.Option value={'orderSendThirteen'}>指令发送13（乐清漏管上报</Select.Option>
                                <Select.Option value={'orderSendFourteen'}>指令发送14（乐清管控上报</Select.Option>
                                <Select.Option value={'groupDetailOne'}>小队详情1（台州mzx</Select.Option>
                                <Select.Option value={'eventCountListOne'}>事件统计列表1（宁海</Select.Option>
                                <Select.Option value={'eventCountListTwo'}>事件统计列表2（宁海</Select.Option>
                                <Select.Option value={'eventCountListThree'}>事件统计列表3（宁海</Select.Option>
                                <Select.Option value={'eventCountListFour'}>事件统计列表4（宁海</Select.Option>
                                <Select.Option value={'eventCountListFive'}>事件统计列表5（乐清</Select.Option>
                                <Select.Option value={'dataCountListOne'}>数据统计列表1（宁海</Select.Option>
                                <Select.Option value={'dataCountListTwo'}>数据统计列表2（乐清</Select.Option>
                                <Select.Option value={'dataCountListThree'}>数据统计列表3（乐清</Select.Option>
                                <Select.Option value={'faithPlace'}>民间信仰场所(芦岙</Select.Option>
                                <Select.Option value={'organizationalStructure'}>民间信仰场所(芦岙</Select.Option>
                                <Select.Option value={'menuListOne'}>菜单列表(芦岙</Select.Option>
                                <Select.Option value={'operationCheck'}>操作检测</Select.Option>
                                <Select.Option value={'warningSoundOne'}>告警（龙湾</Select.Option>
                                <Select.Option value={'progressOne'}>流程进度一（乐清</Select.Option>
                                <Select.Option value={'progressTwo'}>流程进度二（乐清</Select.Option>
                                <Select.Option value={'progressThree'}>流程进度三（乐清</Select.Option>
                                <Select.Option value={'progressFour'}>流程进度四（乐清</Select.Option>
                                <Select.Option value={'planDetailOne'}>预案详情一（乐清</Select.Option>
                                <Select.Option value={'cameraListOne'}>监控列表一（乐清</Select.Option>
                                <Select.Option value={'cameraListTwo'}>监控列表二（乐清</Select.Option>
                                <Select.Option value={'nearResource'}>附近资源（乐清</Select.Option>
                                <Select.Option value={'nucleicAcidTesting'}>核酸检测（芦岙</Select.Option>
                                <Select.Option value={'operationButtonOne'}>操作菜单一（芦岙</Select.Option>
                                <Select.Option value={'operationButtonTwo'}>操作菜单二（宁海</Select.Option>
                              
                            </Select>
                        </Form.Item>
                        {'imageListOne'.indexOf(style.contentName) >= 0 && (
                            <Form.Item label="主题">
                                <Select value={style.themeType} onChange={changeDetailData.bind(this, 2, style, 'themeType')}>
                                    {style.themeList && style.themeList.map((item,index)=>
                                        <Select.Option key={index} value={item.id} >{item.themeName}</Select.Option>
                                    )}
                                </Select>
                            </Form.Item>
                        )}
                        {'peopleThreePartOne,peopleThreePartTwo,collectionDataList,eventListOne,peopleTwoPartOne,peopleTwoPartTwo,peopleTwoPartThree,peopleTwoPartFour'.indexOf(style.contentName) >= 0 && (
                            <Form.Item label="主题">
                                <Select value={style.themeType} onChange={changeDetailData.bind(this, 2, style, 'themeType')}>
                                    <Select.Option value={1} >主题1(默认</Select.Option>
                                    <Select.Option value={2} >主题2</Select.Option>
                                </Select>
                            </Form.Item>
                        )}
                        {'importantPlaceThree,eventThirteen'.indexOf(style.contentName) >= 0 && (
                            <Form.Item label="内容类型">
                                <Select value={style.contentType} onChange={changeDetailData.bind(this, 2, style, 'contentType')}>
                                    <Select.Option value={1} >内容1</Select.Option>
                                    <Select.Option value={2} >内容2</Select.Option>
                                    <Select.Option value={3} >内容3</Select.Option>
                                </Select>
                            </Form.Item>
                        )}
                        {style.contentName === 'eventListOne' && style.themeType === 2 && (
                            <React.Fragment>
                                <Form.Item label="类型接口">
                                    <Input value={style.eventTypeUrl} onChange={changeDetailData.bind(this, 1, style, 'eventTypeUrl')} />
                                </Form.Item>
                                <Form.Item label="推送单位">
                                    <Input value={style.sendDepUrl} onChange={changeDetailData.bind(this, 1, style, 'sendDepUrl')} />
                                </Form.Item>
                                <Form.Item label="接收单位">
                                    <Input value={style.receiveDepUrl} onChange={changeDetailData.bind(this, 1, style, 'receiveDepUrl')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        {style.contentName === 'orderSendFour' && (
                            <React.Fragment>
                                <Form.Item label="部门接口">
                                    <Input value={style.depListUrl} onChange={changeDetailData.bind(this, 1, style, 'depListUrl')} />
                                </Form.Item>
                                <Form.Item label="任务列表接口">
                                    <Input value={style.planListUrl} onChange={changeDetailData.bind(this, 1, style, 'planListUrl')} />
                                </Form.Item>
                                <Form.Item label="任务搜索键名">
                                    <Input value={style.planSearchKey} onChange={changeDetailData.bind(this, 1, style, 'planSearchKey')} />
                                </Form.Item>
                                <Form.Item label="任务详情接口">
                                    <Input value={style.planDetailUrl} onChange={changeDetailData.bind(this, 1, style, 'planDetailUrl')} />
                                </Form.Item>
                                <Form.Item label="镇街列表接口">
                                    <Input value={style.roadListUrl} onChange={changeDetailData.bind(this, 1, style, 'roadListUrl')} />
                                </Form.Item>
                                <Form.Item label="村社列表接口">
                                    <Input value={style.communityListUrl} onChange={changeDetailData.bind(this, 1, style, 'communityListUrl')} />
                                </Form.Item>
                                <Form.Item label="小队列表接口">
                                    <Input value={style.groupListUrl} onChange={changeDetailData.bind(this, 1, style, 'groupListUrl')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        {style.contentName === 'orderSendFive' && (
                            <React.Fragment>
                                <Form.Item label="镇街列表接口">
                                    <Input value={style.roadListUrl} onChange={changeDetailData.bind(this, 1, style, 'roadListUrl')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        {style.contentName === 'orderSendSix' && (
                            <React.Fragment>
                                <Form.Item label="编组列表接口">
                                    <Input value={style.groupListUrl} onChange={changeDetailData.bind(this, 1, style, 'groupListUrl')} />
                                </Form.Item>
                                <Form.Item label="部门列表接口">
                                    <Input value={style.depListUrl} onChange={changeDetailData.bind(this, 1, style, 'depListUrl')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        {'gradientText'.indexOf(style.contentName) >= 0 && (
                            <Form.Item label="内容补全">
                                <Input.TextArea value={style.restContent} rows={8} onChange={changeDetailData.bind(this, 1, style, 'restContent')}/>
                            </Form.Item>
                        )}
                        {'importantEvent,peopleLucheng,equipmentList,eventThree'.indexOf(style.contentName) >= 0 && (
                            <Form.Item label="内容类型">
                                <Select value={style.contentType} onChange={changeDetailData.bind(this, 2, style, 'contentType')}>
                                    <Select.Option value={1} >类型1</Select.Option>
                                    <Select.Option value={2} >类型2</Select.Option>
                                </Select>
                            </Form.Item>
                        )}
                        {'boxTypeOne' === style.contentName && (
                            <React.Fragment>
                                <Form.Item label="样式类型">
                                    <Select value={style.themeType} onChange={changeDetailData.bind(this, 2, style, 'themeType')}>
                                        <Select.Option value={1} >类型1(默认)</Select.Option>
                                        <Select.Option value={2} >类型2</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="宽">
                                    <Input value={style.width} onChange={changeDetailData.bind(this, 1, style, 'width')} />
                                </Form.Item>
                                <Form.Item label="高">
                                    <Input value={style.height} onChange={changeDetailData.bind(this, 1, style, 'height')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        {'addEventOne' === style.contentName && (
                            <Form.Item label="内容类型">
                                <Select value={style.contentType} onChange={changeDetailData.bind(this, 2, style, 'contentType')}>
                                    <Select.Option value={1} >新增</Select.Option>
                                    <Select.Option value={2} >编辑</Select.Option>
                                </Select>
                            </Form.Item>
                        )}
                        {'messageEdit' === style.contentName && (
                            <Form.Item label="内容类型">
                                <Select value={style.editType} onChange={changeDetailData.bind(this, 2, style, 'editType')}>
                                    <Select.Option value={0} >预警</Select.Option>
                                    <Select.Option value={1} >催办</Select.Option>
                                    <Select.Option value={2} >结束异动</Select.Option>
                                </Select>
                            </Form.Item>
                        )}
                        {'drugAdministration,eventThree'.indexOf(style.contentName) >= 0 && (
                            <Form.Item label="内容样式">
                                <Select value={style.contentStyle} onChange={changeDetailData.bind(this, 2, style, 'contentStyle')}>
                                    <Select.Option value={1} >样式一</Select.Option>
                                    <Select.Option value={2} >样式二</Select.Option>
                                </Select>
                            </Form.Item>
                        )}
                        <Form.Item label="服务地址">
                            <Input value={style.fileUrl} onChange={changeDetailData.bind(this, 1, style, 'fileUrl')} />
                        </Form.Item>
                        <Form.Item label="文件服务地址">
                            <Input value={style.fileServiceUrl} onChange={changeDetailData.bind(this, 1, style, 'fileServiceUrl')} />
                        </Form.Item>
                        {style.contentName === 'orderSendTwo' && (
                            <React.Fragment>
                                <Form.Item label="类型接口">
                                    <Input value={style.typeListUrl} onChange={changeDetailData.bind(this, 1, style, 'typeListUrl')} />
                                </Form.Item>
                                <Form.Item label="人员接口">
                                    <Input value={style.peopleListUrl} onChange={changeDetailData.bind(this, 1, style, 'peopleListUrl')} />
                                </Form.Item>
                                <Form.Item label="发送接口">
                                    <Input value={style.sendUrl} onChange={changeDetailData.bind(this, 1, style, 'sendUrl')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        {style.contentName === 'eventEight' && (
                            <React.Fragment>
                                <Form.Item label="部门接口">
                                    <Input value={style.depListUrl} onChange={changeDetailData.bind(this, 1, style, 'depListUrl')} />
                                </Form.Item>
                                <Form.Item label="修改接口">
                                    <Input value={style.editUrl} onChange={changeDetailData.bind(this, 1, style, 'editUrl')} />
                                </Form.Item>
                            </React.Fragment>
                        )}
                        {/*{style.contentName === 'totalQuantityYuhai' && (*/}
                        {/*    <Form.Item label="通知地址">*/}
                        {/*        <Input value={style.sendMessageUrl} onChange={changeDetailData.bind(this, 1, style, 'sendMessageUrl')} />*/}
                        {/*    </Form.Item>*/}
                        {/*)}*/}
                        {style.contentName === 'eventThree' && (
                            <Form.Item label="滚动间隔">
                                <InputNumber value={style.autoMoveTime} onChange={changeDetailData.bind(this, 2, style, 'autoMoveTime')} />
                            </Form.Item>
                        )}
                        {style.contentName === 'operationCheck' && (
                            <Form.Item label="时间间隔">
                                <InputNumber value={style.time} onChange={changeDetailData.bind(this, 2, style, 'time')} />
                            </Form.Item>
                        )}
                        {(style.contentName === 'peopleListOne') && (
                            <Form.Item label="显示分页">
                                <Switch
                                    checked={style.peopleListOneShowPaginition}
                                    onChange={changeDetailData.bind(this, 2, style, 'peopleListOneShowPaginition')}
                                />
                            </Form.Item>
                        )}
                    </Panel>
                    {style.contentName === 'imageListOne' && (
                        <Panel header="主题设置" key="9">
                            {style.themeList && style.themeList.map((item,index)=>
                                <div key={index}>
                                    <Tag closable={true} visible={true} onClose={deleteListItem.bind(this, style.themeList, index)}>{'主题' + (index + 1)}</Tag>
                                    <Form.Item label="主题名称">
                                        <Input value={item.themeName} onChange={changeDetailData.bind(this, 1, item, 'themeName')} />
                                    </Form.Item>
                                    <Form.Item label={
                                        <span>
                                            <Tooltip title="点击添加">
                                                <Icon type="plus" style={{cursor:'pointer',marginRight:'0.5vh'}} onClick={addListItem.bind(this, item, 'imgList', '')}/>
                                            </Tooltip>
                                            图片
                                        </span>
                                    }>
                                        <Row>
                                            {item.imgList && item.imgList.map((img,imgIndex) =>
                                                <Col key={imgIndex}>
                                                    {
                                                        img ? (
                                                            <img src={fileUrl + '/download/' + img} alt=""
                                                                 style={{ width: '160px', height: '90px', marginBottom:'10px' }}
                                                                 onClick={selectIcon.bind(this, item.imgList, imgIndex)} />
                                                        ) : (
                                                            <Button type="dashed" onClick={selectIcon.bind(this, item.imgList, imgIndex)}>
                                                                <Icon type="plus" /> 选择图片
                                                            </Button>
                                                        )
                                                    }
                                                    <Icon type="close" style={{position:'absolute',top:'12px',marginLeft:'0.5vh',cursor:'pointer'}} onClick={deleteListItem.bind(this, item.imgList, imgIndex)}/>
                                                </Col>
                                            )}
                                        </Row>
                                    </Form.Item>
                                </div>
                            )}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'themeList', {id:new Date().getTime()})}>
                                    <Icon type="plus" /> 添加主题
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {style.contentName === 'menuListOne' && (
                        <Panel header="子项点击交互" key="9">
                            {this.getInteractEdit(style.childInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'childInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {style.contentName === 'platformList' && (
                        <Panel header="转入按钮交互" key="9">
                            {this.getInteractEdit(style.handleInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'handleInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {style.contentName === 'platformList' && (
                        <Panel header="标题详情交互" key="10">
                            {this.getInteractEdit(style.detailInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'detailInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {'boxTypeOne,equipmentVideoList,equipmentDesignate,messageEditTwo,blankBackground,eventStepOne,eventStepTwo,eventStepThree,eventStepFour,eventStepFive'.indexOf(style.contentName) >= 0 && (
                        <Panel header="关闭时交互" key="4">
                            {this.getInteractEdit(style.closeInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'closeInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {style.contentName === 'blankBackground' && (
                        <Panel header="背景大小位置设置" key="5">
                            <Form.Item label="宽">
                                <Input value={style.width} onChange={changeDetailData.bind(this, 1, style, 'width')} />
                            </Form.Item>
                            <Form.Item label="高">
                                <Input value={style.height} onChange={changeDetailData.bind(this, 1, style, 'height')} />
                            </Form.Item>
                            <Form.Item label="左">
                                <Input value={style.left} onChange={changeDetailData.bind(this, 1, style, 'left')} />
                            </Form.Item>
                            <Form.Item label="上">
                                <Input value={style.top} onChange={changeDetailData.bind(this, 1, style, 'top')} />
                            </Form.Item>
                        </Panel>
                    )}
                    {style.contentName === 'eventThree' && (
                        <Panel header="原因点击交互" key="4">
                            {this.getInteractEdit(style.reasonInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'reasonInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'eventFour') && (
                        <Panel header="编辑交互" key="6">
                            {this.getInteractEdit(style.editInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'editInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'eventFour' || style.contentName === 'eventWarning') && (
                        <Panel header="转入交互" key="4">
                            {this.getInteractEdit(style.turnToInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'turnToInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {style.contentName === 'eventFour' && (
                        <Panel header="删除完成后交互" key="5">
                            {this.getInteractEdit(style.afterDeleteInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'afterDeleteInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'eventProgress') && (
                        <Panel header="流程全貌交互" key="6">
                            {this.getInteractEdit(style.progressOverviewInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'progressOverviewInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'eventProgress') && (
                        <Panel header="点击下一步交互" key="7">
                            {this.getInteractEdit(style.nextStepInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'nextStepInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'eventProgress') && (
                        <Panel header="点击完成交互" key="8">
                            {this.getInteractEdit(style.completeEventProgressInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'completeEventProgressInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'eventProgressNew') && (
                        <Panel header="流程全貌交互" key="10">
                            {this.getInteractEdit(style.processOverviewInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'processOverviewInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'eventProgressNew') && (
                        <Panel header="点击下一步交互" key="11">
                            {this.getInteractEdit(style.nextStepInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'nextStepInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'eventProgressNew') && (
                        <Panel header="点击完成交互" key="12">
                            {this.getInteractEdit(style.completedInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'completedInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'commandDispatch') && (
                        <Panel header="增派力量交互" key="6">
                            {this.getInteractEdit(style.addPowerInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'addPowerInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'commandDispatch') && (
                        <Panel header="添加人员交互" key="8">
                            {this.getInteractEdit(style.addMemberInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'addMemberInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'commandDispatch') && (
                        <Panel header="指挥室交互" key="10">
                            {this.getInteractEdit(style.commandGroupInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'commandGroupInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'commandDispatch') && (
                        <Panel header="其他设置" key="9">
                            <Form.Item label="刷新间隔">
                                <InputNumber value={style.commandDispatchInterval} onChange={changeDetailData.bind(this, 2, style, 'commandDispatchInterval')} />
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'commandDispatchNew') && (
                        <Panel header="增派力量交互" key="10">
                            {this.getInteractEdit(style.addPowerInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'addPowerInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'commandDispatchNew') && (
                        <Panel header="添加人员交互" key="12">
                            {this.getInteractEdit(style.addMemberInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'addMemberInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'commandDispatchNew') && (
                        <Panel header="指挥室交互" key="13">
                            {this.getInteractEdit(style.commandGroupInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'commandGroupInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'commandDispatchNew') && (
                        <Panel header="执行预案交互" key="15">
                            {this.getInteractEdit(style.commandDiscussInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'commandDiscussInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'commandDispatchNew') && (
                        <Panel header="其他设置" key="14">
                            <Form.Item label="小组刷新间隔">
                                <InputNumber value={style.teamInterval} onChange={changeDetailData.bind(this, 2, style, 'teamInterval')} />
                            </Form.Item>
                            <Form.Item label="消息刷新间隔">
                                <InputNumber value={style.dialogueInterval} onChange={changeDetailData.bind(this, 2, style, 'dialogueInterval')} />
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'addPower') && (
                        <Panel header="隐藏组件交互" key="6">
                            {this.getInteractEdit(style.hideAddPowerInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'hideAddPowerInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'addPower') && (
                        <Panel header="完成增派交互" key="7">
                            {this.getInteractEdit(style.completeAddPowerInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'completeAddPowerInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'addPowerNew') && (
                        <Panel header="隐藏组件交互" key="10">
                            {this.getInteractEdit(style.hideAddPowerInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'hideAddPowerInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'addPowerNew') && (
                        <Panel header="完成增派交互" key="11">
                            {this.getInteractEdit(style.completeAddPowerInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'completeAddPowerInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'discuss') && (
                        <Panel header="隐藏组件交互" key="6">
                            {this.getInteractEdit(style.hideDisscussInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'hideDisscussInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'discuss') && (
                        <Panel header="完成研判交互" key="7">
                            {this.getInteractEdit(style.completeDiscussInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'completeDiscussInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'eventDiscription') && (
                        <Panel header="传值交互" key="6">
                            {this.getInteractEdit(style.sendDiscriptionDataInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'sendDiscriptionDataInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'equipmentList') && (
                        <Panel header="查看交互" key="6">
                            {this.getInteractEdit(style.detailInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'detailInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'checkGridList') && (
                        <Panel header="关闭交互" key="10">
                            {this.getInteractEdit(style.closeInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'closeInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'checkDepartmentList') && (
                        <Panel header="关闭交互" key="10">
                            {this.getInteractEdit(style.closeInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'closeInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'defuseDetail') && (
                        <Panel header="关闭交互" key="10">
                            {this.getInteractEdit(style.closeInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'closeInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'searchAll') && (
                        <Panel header="关闭交互" key="10">
                            {this.getInteractEdit(style.closeInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'closeInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'searchAll') && (
                        <Panel header="查询交互" key="11">
                            {this.getInteractEdit(style.searchInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'searchInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'emergencyWarning') && (
                        <Panel header="处置状态交互" key="10">
                            {this.getInteractEdit(style.statusInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'statusInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'emergencyWarning') && (
                        <Panel header="详情交互" key="11">
                            {this.getInteractEdit(style.detailInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'detailInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'breakPromiseStatistics') && (
                        <Panel header="详情交互" key="10">
                            {this.getInteractEdit(style.detailInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'detailInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'addMemberNew') && (
                        <Panel header="关闭组件交互" key="10">
                            {this.getInteractEdit(style.closeInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'closeInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {(style.contentName === 'addMemberNew') && (
                        <Panel header="添加完成交互" key="11">
                            {this.getInteractEdit(style.completeInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'completeInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {style.contentName === 'inventoryTransactionDetailOne' && (
                        <Panel header="通过交互" key="10">
                            {this.getInteractEdit(style.adoptInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'adoptInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {style.contentName === 'inventoryTransactionDetailOne' && (
                        <Panel header="退回交互" key="11">
                            {this.getInteractEdit(style.backInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'backInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {style.contentName === 'equipmentWarning' && (
                        <Panel header="取消交互" key="10">
                            {this.getInteractEdit(style.cancelInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'cancelInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                    {style.contentName === 'equipmentWarning' && (
                        <Panel header="执行预案交互" key="11">
                            {this.getInteractEdit(style.startInteract)}
                            <Form.Item label="">
                                <Button type="dashed" onClick={addListItem.bind(this, style, 'startInteract', {})}>
                                    <Icon type="plus" /> 添加交互内容
                                </Button>
                            </Form.Item>
                        </Panel>
                    )}
                </Collapse>
                {'companyWarning,peopleWarning,eventWarning,addEventTwo,addEventOne,addInstruction,eventFour,instruction,messageEdit,purchase,infrastructure,inAndOut,fixedAssetsInventory,budgetImplementation,budget,reception,news,travel,economics,contract,involved,currentAccount,coordination,finance,economicMatters,comprehensiveMatters,placeLucheng,totalQuantityYuhai,emergencyEvent,peopleUnusualMove'.indexOf(style.contentName) >= 0 && this.getDetailEdit(style)}
                <FileSelect
                    title="图标选择"
                    visible={this.state.visible}
                    onOk={selectIconOk.bind(this)}
                    onCancel={selectIconCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    imgSelect={iconClick.bind(this)} token={this.props.token}
                    width={650}
                />
            </Form>
        );
    }
}
