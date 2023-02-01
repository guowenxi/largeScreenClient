import React from "react";
import cssStyle from "./problemRectification.module.css";
import { Scrollbars } from "react-custom-scrollbars";
import {PhotoSlider} from "react-photo-view";

export default class ProblemRectification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pathSrc:'',visible:false,photoIndex:0};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    showBigImg(pathSrc,index){
        this.setState({pathSrc:pathSrc,visible:true,photoIndex:index});
    }

    render() {
        const { detail,styleData } = this.props;
        if(!detail){
            return null;
        }
        const {pathSrc,visible,photoIndex} = this.state;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={cssStyle.head}>
                    <div className={cssStyle.headName}>隐患认定整改单</div>
                    <div className={cssStyle.formNo}>ZGD:{detail.hiddenNum}</div>
                </div>
                <div className={cssStyle.body}>
                    <Scrollbars>
                        <table>
                            <tbody>
                            <tr>
                                <td className={cssStyle.titleOne}>整改截止<br />时间</td>
                                <td className={cssStyle.contentOne} colSpan={5}>{detail.completionTime}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.titleOne}>隐患类型</td>
                                <td className={cssStyle.contentOne} colSpan={5}>{detail.hiddenType}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.titleOne}>上报人</td>
                                <td className={cssStyle.contentTwo}>{detail.reportUserName}</td>
                                <td className={cssStyle.titleTwo}>所在部门</td>
                                <td className={cssStyle.contentTwo}>{detail.reportDepartName}</td>
                                <td className={cssStyle.titleTwo}>发起时间</td>
                                <td className={cssStyle.contentThree}>{detail.reportTime}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.titleOne}>隐患描述</td>
                                <td className={cssStyle.contentOne} colSpan={5}>{detail.hiddenDescribe}</td>
                            </tr>
                            <tr>
                                <td className={cssStyle.titleOne}>现场照片</td>
                                <td className={cssStyle.contentOne} colSpan={5}>
                                    <div className={cssStyle.picBox}>
                                        {detail.upLoadPathStr && detail.upLoadPathStr.split(',').map((id,index)=>
                                            <img key={index} alt={''} className={cssStyle.pic} src={styleData.fileServiceUrl+id} onClick={this.showBigImg.bind(this,detail.upLoadPathStr,index)} />
                                        )}
                                    </div>
                                </td>
                            </tr>
                            {detail.departmentApproval ? (
                                <React.Fragment>
                                    <tr>
                                        <td className={cssStyle.titleOne}>部门审批人</td>
                                        <td className={cssStyle.contentTwo}>{detail.departmentApproval.approvalName}</td>
                                        <td className={cssStyle.titleTwo}>所在部门</td>
                                        <td className={cssStyle.contentTwo}>{detail.departmentApproval.approvalDepartment}</td>
                                        <td className={cssStyle.titleTwo}>审批时间</td>
                                        <td className={cssStyle.contentThree}>{detail.departmentApproval.approvalTime}</td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.titleOne}>审批意见</td>
                                        <td className={cssStyle.contentOne} colSpan={5}>{detail.departmentApproval.approvalComments}</td>
                                    </tr>
                                </React.Fragment>
                            ):(
                                <React.Fragment>
                                    <tr>
                                        <td className={cssStyle.titleOne}>部门审批人</td>
                                        <td className={cssStyle.contentTwo}> </td>
                                        <td className={cssStyle.titleTwo}>所在部门</td>
                                        <td className={cssStyle.contentTwo}> </td>
                                        <td className={cssStyle.titleTwo}>审批时间</td>
                                        <td className={cssStyle.contentThree}> </td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.titleOne}>审批意见</td>
                                        <td className={cssStyle.contentOne} colSpan={5}> </td>
                                    </tr>
                                </React.Fragment>
                            )}
                            {detail.departmentConfirmation ? (
                                <React.Fragment>
                                    <tr>
                                        <td className={cssStyle.titleOne}>部门确认人</td>
                                        <td className={cssStyle.contentTwo}>{detail.departmentConfirmation.approvalName}</td>
                                        <td className={cssStyle.titleTwo}>所在部门</td>
                                        <td className={cssStyle.contentTwo}>{detail.departmentConfirmation.approvalDepartment}</td>
                                        <td className={cssStyle.titleTwo}>确认时间</td>
                                        <td className={cssStyle.contentThree}>{detail.departmentConfirmation.approvalTime}</td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.titleOne}>整改意见</td>
                                        <td className={cssStyle.contentOne} colSpan={5}>{detail.departmentConfirmation.approvalComments}</td>
                                    </tr>
                                </React.Fragment>
                            ):(
                                <React.Fragment>
                                    <tr>
                                        <td className={cssStyle.titleOne}>部门确认人</td>
                                        <td className={cssStyle.contentTwo}> </td>
                                        <td className={cssStyle.titleTwo}>所在部门</td>
                                        <td className={cssStyle.contentTwo}> </td>
                                        <td className={cssStyle.titleTwo}>确认时间</td>
                                        <td className={cssStyle.contentThree}> </td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.titleOne}>整改意见</td>
                                        <td className={cssStyle.contentOne} colSpan={5}> </td>
                                    </tr>
                                </React.Fragment>
                            )}
                            {detail.rectificationPerson && detail.rectificationPerson.length > 0 ? (
                                detail.rectificationPerson.map((item,index)=>
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td className={cssStyle.titleOne}>整改人</td>
                                            <td className={cssStyle.contentTwo}>{item.rectificationName}</td>
                                            <td className={cssStyle.titleTwo}>所在部门</td>
                                            <td className={cssStyle.contentTwo}>{item.rectificationDepartment}</td>
                                            <td className={cssStyle.titleTwo}>整改时间</td>
                                            <td className={cssStyle.contentThree}>{item.rectificationTime}</td>
                                        </tr>
                                        <tr>
                                            <td className={cssStyle.titleOne}>整改描述</td>
                                            <td className={cssStyle.contentOne} colSpan={5}>{item.rectifyDescribe}</td>
                                        </tr>
                                        <tr>
                                            <td className={cssStyle.titleOne}>整改照片</td>
                                            <td className={cssStyle.contentOne} colSpan={5}>
                                                <div className={cssStyle.picBox}>
                                                    {item.rectifyPathStr && item.rectifyPathStr.split(',').map((id,index)=>
                                                        <img key={index} alt={''} className={cssStyle.pic} src={styleData.fileServiceUrl+id} onClick={this.showBigImg.bind(this,item.rectifyPathStr,index)} />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={cssStyle.titleOne}>整改确认人</td>
                                            <td className={cssStyle.contentTwo}>{item.rectificationConfirmationName}</td>
                                            <td className={cssStyle.titleTwo}>所在部门</td>
                                            <td className={cssStyle.contentTwo}>{item.rectificationConfirmationDepName}</td>
                                            <td className={cssStyle.titleTwo}>确认时间</td>
                                            <td className={cssStyle.contentThree}>{item.rectificationConfirmationTime}</td>
                                        </tr>
                                        <tr>
                                            <td className={cssStyle.titleOne}>整改确认<br />描述</td>
                                            <td className={cssStyle.contentOne} colSpan={5}>{item.rectificationConfirmationOpinions}</td>
                                        </tr>
                                        <tr>
                                            <td className={cssStyle.titleOne}>现场确认<br />照片</td>
                                            <td className={cssStyle.contentOne} colSpan={5}>
                                                <div className={cssStyle.picBox}>
                                                    {item.rectificationConfirmationPathStr && item.rectificationConfirmationPathStr.split(',').map((id,index)=>
                                                        <img key={index} alt={''} className={cssStyle.pic} src={styleData.fileServiceUrl+id} onClick={this.showBigImg.bind(this,detail.upLoadPathStr,index)} />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                )
                            ):(
                                <>
                                    <tr>
                                        <td className={cssStyle.titleOne}>整改人</td>
                                        <td className={cssStyle.contentTwo}> </td>
                                        <td className={cssStyle.titleTwo}>所在部门</td>
                                        <td className={cssStyle.contentTwo}> </td>
                                        <td className={cssStyle.titleTwo}>整改时间</td>
                                        <td className={cssStyle.contentThree}> </td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.titleOne}>整改描述</td>
                                        <td className={cssStyle.contentOne} colSpan={5}> </td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.titleOne}>整改照片</td>
                                        <td className={cssStyle.contentOne} colSpan={5}> </td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.titleOne}>整改确认人</td>
                                        <td className={cssStyle.contentTwo}> </td>
                                        <td className={cssStyle.titleTwo}>所在部门</td>
                                        <td className={cssStyle.contentTwo}> </td>
                                        <td className={cssStyle.titleTwo}>确认时间</td>
                                        <td className={cssStyle.contentThree}> </td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.titleOne}>整改确认<br />描述</td>
                                        <td className={cssStyle.contentOne} colSpan={5}> </td>
                                    </tr>
                                    <tr>
                                        <td className={cssStyle.titleOne}>现场确认<br />照片</td>
                                        <td className={cssStyle.contentOne} colSpan={5}> </td>
                                    </tr>
                                </>
                            )}
                            </tbody>
                        </table>
                    </Scrollbars>
                </div>
                {visible && pathSrc != null && pathSrc !== '' && (
                    <PhotoSlider
                        images={pathSrc.toString().split(',').map((id) => ({ src: styleData.fileServiceUrl+id }))}
                        visible={visible}
                        onClose={() => this.setState({ visible: false })}
                        onIndexChange={(index) => this.setState({ photoIndex: index })}
                        index={photoIndex}
                    />
                )}
            </div >
        );
    }
}