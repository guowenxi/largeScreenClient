import React from "react";
// import {Button} from "antd";
import {interactData} from "../../common/util"
import RectTypeThree from "../../common/svg/rectTypeThree"
import CloseIcon from "./images/guanbi.png";
import cssStyle from "./svg_map_ex.module.css";

export default class DetailSix extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {data:{}};
        this.interactData = interactData.bind(this);
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    viewDetails(){
        const {attributes} = this.props;
        this.interactData(attributes.interactWindow,{ id:attributes.id });
      }
      // 隐藏组件
      closeThis() {
          // console.log(this.props);
          this.props.hideWindow(false, true);
      }

    render() {
        
        const {roadData, style}=this.props
        // console.log(roadData);
        return (
            // <div className={`  ${cssStyle.box}`} >
            <div className={`${cssStyle.detailOneBox} ${cssStyle.detailSixBox}`} style={style}>
                <img src={CloseIcon} alt={''} className={`${cssStyle.shutBox} `} onClick={this.closeThis.bind(this)}></img>
                <RectTypeThree bgTime={this.state.bgTime} />
                <div className={`${cssStyle.rowq} `}>
                    <span className={cssStyle.head}>{roadData.divisionName}</span>
                </div>
                {
                    Array.isArray(roadData.mapList) && roadData.mapList.length > 0 && roadData.mapList.map((item, index) => {
                        return <div key={index}>
                            <div className={cssStyle.row}>
                                {item.name}:{item.number}
                            </div>
                        </div>
                    })
                }
                {/* <div className={cssStyle.detailButton} >
                  <Button className={cssStyle.btn} size="small" type="primary" onClick={this.viewDetails.bind(this)}>查看详情</Button>

                </div> */}
            </div>
        );
    }
}