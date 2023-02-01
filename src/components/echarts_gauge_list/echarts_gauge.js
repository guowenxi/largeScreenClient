import React from "react";
// import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/dataset';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/custom';

export default class EchartsGauge extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this._animationDuration = 1000;
        this._animationDurationUpdate = 1000;
        this._animationEasingUpdate = 'quarticInOut';
        this._valOnRadianMax = 134;
        this._outerRadius = 100;
        this._innerRadius = 0;
        this._pointerInnerRadius = 40;
        // this._insidePanelRadius = 140;
        // this._currentDataIndex = 0;
        // this.colorList = ['rgb(252,255,122)','rgb(117,255,225)','rgb(216,117,255)','rgb(255,141,117)','rgb(114,199,255)'];
        this.needShow = false;
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
        setTimeout(()=>{
            const chartDom = document.getElementById(this.props.id);
            this._outerRadius = Math.floor((chartDom.clientWidth < chartDom.clientHeight ? chartDom.clientWidth:chartDom.clientHeight)/2);
            // this._innerRadius = Math.floor(this._outerRadius*0.5);
            this.myChart = echarts.init(chartDom);
            this.getOption();
            if(this.props.opacity || this.needShow){
                this.showData();
            }
        })
    }

    //props变更时触发函数
    componentDidUpdate(prevProps){
        if((prevProps.opacity !== this.props.opacity && prevProps.opacity === 0) || (this.props.data.num !== prevProps.data.num)){
            this.showData();
        }
    }

    showData(){
        if(this.props.data){
            if(this.myChart){
                this.myChart.setOption({
                    dataset: {
                        source: [[0,this.props.data.num]]
                    }
                });
            }else{
                this.needShow = true;
            }
        }
    }

    getImageStyle(params,url){
        return {
            image: url,
            x: params.coordSys.cx - this._outerRadius,
            y: params.coordSys.cy - this._outerRadius,
            width: this._outerRadius * 2,
            height: this._outerRadius * 2
        }
    }

    renderItem(params, api) {
        const {index,fontSize,fontColor,fixNum} = this.props;
        let valOnRadian = api.value(1);
        let coords = api.coord([api.value(0), valOnRadian]);
        let polarEndRadian = coords[3];
        return {
            type: 'group',
            children: [{
                type: 'image',
                style: this.getImageStyle(params,'./images/gauge/img-bg.png'),
            }, {
                type: 'image',
                style: this.getImageStyle(params,'./images/gauge/img'+(index%5+1)+'-1.png'),
                clipPath: {
                    type: 'sector',
                    shape: {
                        cx: params.coordSys.cx,
                        cy: params.coordSys.cy,
                        r: this._outerRadius,
                        r0: this._innerRadius,
                        startAngle: Math.PI*3/4,
                        endAngle: -polarEndRadian,
                        transition: 'endAngle',
                        enterFrom: { endAngle: Math.PI*3/4 }
                    }
                }
            // }, {
            //     type: 'image',
            //     style: this.getImageStyle(params,'./images/gauge/img'+(index%5+1)+'-2.png'),
            //     clipPath: {
            //         type: 'polygon',
            //         shape: {
            //             points: this.makePionterPoints(params, polarEndRadian)
            //         },
            //         extra: {
            //             polarEndRadian: polarEndRadian,
            //             transition: 'polarEndRadian',
            //             enterFrom: { polarEndRadian: -Math.PI*3/4 }
            //         },
            //         during: (apiDuring) => {
            //             apiDuring.setShape(
            //                 'points',
            //                 this.makePionterPoints(params, apiDuring.getExtra('polarEndRadian'))
            //             );
            //         }
            //     }
            }, {
                type: 'image',
                style: this.getImageStyle(params,'./images/gauge/img'+(index%5+1)+'-3.png'),
            }, {
                type: 'image',
                style: this.getImageStyle(params,'./images/gauge/img-top.png'),
            }, {
                type: 'text',
                extra: {
                    valOnRadian: valOnRadian,
                    transition: 'valOnRadian',
                    enterFrom: { valOnRadian: 0 }
                },
                style: {
                    text: this.makeText(valOnRadian,fixNum),
                    fontSize: fontSize,
                    fontWeight: 700,
                    x: params.coordSys.cx,
                    y: params.coordSys.cy,
                    fill: fontColor,
                    align: 'center',
                    verticalAlign: 'middle',
                    enterFrom: { opacity: 0 }
                },
                during: (apiDuring) => {
                    apiDuring.setStyle('text', this.makeText(apiDuring.getExtra('valOnRadian'),fixNum));
                }
            }]
        };
    }

    convertToPolarPoint(renderItemParams, radius, radian) {
        return [
            Math.cos(radian) * radius + renderItemParams.coordSys.cx,
            -Math.sin(radian) * radius + renderItemParams.coordSys.cy
        ];
    }

    makePionterPoints(renderItemParams, polarEndRadian) {
        return [
            this.convertToPolarPoint(renderItemParams, this._outerRadius, polarEndRadian),
            this.convertToPolarPoint(renderItemParams, this._outerRadius, polarEndRadian + Math.PI * 0.03),
            this.convertToPolarPoint(renderItemParams, this._pointerInnerRadius, polarEndRadian)
        ];
    }

    makeText(valOnRadian,fixNum) {
        // Validate additive animation calc.
        if (valOnRadian < -10) {
            alert('illegal during val: ' + valOnRadian);
        }
        const valDecimal = (valOnRadian).toFixed(fixNum).split('.')[1];
        if(parseInt(valDecimal)){
            return (valOnRadian).toFixed(fixNum);
        }else{
            return (valOnRadian).toFixed(0);
        }
    }

    getOption(){
        const option = {
            animationEasing: this._animationEasingUpdate,
            animationDuration: this._animationDuration,
            animationDurationUpdate: this._animationDurationUpdate,
            animationEasingUpdate: this._animationEasingUpdate,
            dataset: {
                source: [[0, 0]]
            },
            // tooltip: {},
            angleAxis: {
                type: 'value',
                startAngle: -135,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false },
                min: 0,
                max: this._valOnRadianMax
            },
            radiusAxis: {
                type: 'value',
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            },
            polar: {},
            series: [{
                type: 'custom',
                coordinateSystem: 'polar',
                renderItem: this.renderItem.bind(this)
            }]
        };
        this.myChart.setOption(option);
    }

    render() {
        // if(this.props.opacity === 1){
        //     return (
        //         <ReactECharts
        //             style={{ width: '100%', height: '100%', position: 'absolute' }}
        //             echarts={echarts}
        //             option={this.getOption()} />
        //     );
        // }else{
        //     return null;
        // }
        return <div style={{ width: '100%', height: '100%', position: 'absolute' }} id={this.props.id}  />
    }
}