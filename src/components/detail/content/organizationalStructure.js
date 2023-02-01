import React from "react";
import cssStyle from "./organizationalStructure.module.css";

export default class OrganizationalStructure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        if(!this.props.detail){
            return null;
        }
        const {leader,member} = this.props.detail;
        return (
            <div style={this.props.style} className={cssStyle.box} >
                <div className={`${cssStyle.headBox} ${cssStyle.flex}`}>
                    <div className={cssStyle.imgBox}>
                        {leader && (
                            <>
                                <img alt={''} src={leader.img} className={cssStyle.img} />
                                <div className={cssStyle.name}>{leader.name}</div>
                                <div className={cssStyle.leaderText}>工作领衔人</div>
                            </>
                        )}
                    </div>
                </div>
                <div className={`${cssStyle.headLineBox} ${cssStyle.flex}`}>
                    <div className={cssStyle.verticalLine} />
                </div>
                <div className={`${cssStyle.centerLineBox} ${cssStyle.flex}`}>
                    <div className={cssStyle.crosswiseLine} />
                </div>
                <div className={`${cssStyle.memberLineBox} ${cssStyle.flex}`}>
                    {['','','',''].map((item,index)=>
                        <div className={`${cssStyle.verticalLineBox} ${cssStyle.flex}`} key={index}>
                            <div className={cssStyle.verticalLine} />
                        </div>
                    )}
                </div>
                <div className={`${cssStyle.memberBox} ${cssStyle.flex}`}>
                    {member && member.map((item,index)=>
                        <div className={`${cssStyle.memberItemBox} ${cssStyle.flex}`} key={index}>
                            <div className={cssStyle.imgBox}>
                                <img alt={''} src={item.img} className={cssStyle.img} />
                                <div className={cssStyle.name}>{item.name}</div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={`${cssStyle.textBox} ${cssStyle.flex}`}>工作室团队</div>
            </div>
        );
    }
}