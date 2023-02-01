import React from "react";
import cssStyle from './buildingTwo.module.css';

export default class BuildingTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selected:0};
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
            <div style={this.props.style} className={`${cssStyle.box}`} >
                <table>
                    <tbody>
                    <tr>
                        <td className={cssStyle.title}>地址</td>
                        <td>{detail.address}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.title}>总网格长</td>
                        <td>{detail.gridLeader}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.title}>网格指导员</td>
                        <td>{detail.gridInstructor}</td>
                    </tr>
                    <tr>
                        <td className={cssStyle.title}>微网格长</td>
                        <td>{detail.microGridLeader}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}