import React from "react";

export default class SvgText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.id = new Date().getTime();
        this.positioin = {
            'flex-start':'0%',
            'center':'50%',
            'flex-end':'100%',
        };
        this.dominantBaseline = {
            'flex-start':'hanging',
            'center':'central',
            'flex-end':'ideographic',
        };
        this.textAnchor = {
            'flex-start':'start',
            'center':'middle',
            'flex-end':'end',
        };
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        const {fontStyle,children,content,id} = this.props;
        //填充色渐变角度
        const angle = fontStyle.fontFillColorAngle == null ? 0 : fontStyle.fontFillColorAngle;
        return (
            <svg style={{width:'100%',height:'100%',...this.props.style}} className={this.props.className} >
                <linearGradient id={`linearGradient_${id}_${this.id}`} x1="0%" y1="0%" x2={angle <= 45 ? '100%' : (angle === 90 ? '0%':Math.tan((90-angle)*Math.PI/180)+'%')} y2={angle >= 45 ? '100%' : (angle === 0 ? '0%':Math.tan(angle*Math.PI/180)+'%')}>
                    {fontStyle.fontFillColor && fontStyle.fontFillColor.map((item,index) =>
                        <stop  offset={item.percent+'%'} style={{stopColor:item.color}} key={index}/>
                    )}
                </linearGradient>
                <text
                    x={this.positioin[content.justifyContent] || '50%'}
                    y={this.positioin[content.alignItems] || '50%'}
                    textAnchor={this.textAnchor[content.justifyContent] || 'middle'}
                    dominantBaseline={this.dominantBaseline[content.alignItems] || 'central'}
                    style={{fill:`url(#linearGradient_${id}_${this.id})`}} >
                    {children}
                </text>
            </svg>
        );
    }
}