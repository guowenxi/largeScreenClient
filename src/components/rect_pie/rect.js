import React from "react";
import cssStyle from "./rect_pie.module.css";
import {getSumByKey} from "../../common/util";

export default class Rect extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.id = new Date().getTime();
        this.colorList = ['rgb(217,224,33)','rgb(255,216,97)','rgb(255,152,133)','rgb(140,225,254)',];
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    render() {
        const {width,height,data,lineWidth,radius,fontSize,numKey,id} = this.props;
        const lineLength = 2*Math.PI*radius + (width - fontSize*2 - 2*radius - lineWidth)*2 + (height - fontSize*2 - 2*radius - lineWidth)*2;
        const partCircle = Math.PI*radius/2;
        const rectWidth = width - fontSize*2 - 2*radius - lineWidth;
        const halfTop = rectWidth/2;
        const rectHeight = height - fontSize*2 - 2*radius - lineWidth;
        const sum = getSumByKey(data,numKey);
        let pathList = [];
        let addLength = 0;
        const clipRadius = radius+lineWidth/2+fontSize;
        const offsetAngle = 0.2;
        data.forEach((item,index)=>{
            const thisPer = item[numKey]/sum;
            if(parseFloat(item[numKey]) === 0){
                return;
            }
            const thisPartLength = thisPer*lineLength;
            const endLength = thisPartLength + addLength;
            let clipPath;
            let textPosition;
            if(endLength < halfTop){
                clipPath = `M${width/2},${height/2} 
                    L${width/2},0 l${-endLength},0 l0,${height/2} `;
                textPosition = {x:(width/2-endLength+fontSize/2),y:fontSize*1.05+lineWidth/2};
            }else if(endLength < (halfTop + partCircle)){
                const moveX = Math.tan(((endLength - halfTop)/partCircle)*(Math.PI/2))*clipRadius;
                clipPath = `M${width/2},${height/2} 
                    L${width/2},0 
                    l${-moveX-halfTop},0 
                    l${moveX},${clipRadius}`;
                textPosition = {
                    x:clipRadius-Math.sin(((endLength - halfTop)/partCircle)*(Math.PI/2)-offsetAngle)*(clipRadius-lineWidth/2-fontSize),
                    y:clipRadius-Math.cos(((endLength - halfTop)/partCircle)*(Math.PI/2)-offsetAngle)*(clipRadius-lineWidth/2-fontSize)
                };
            }else if(endLength < (halfTop + partCircle + rectHeight)){
                const remainLength = endLength - halfTop - partCircle;
                clipPath = `M${width/2},${height/2} 
                    L${width/2},0 L0,0 l0,${remainLength+clipRadius} l${width/2},0 `;
                textPosition = {x:fontSize*1+lineWidth/2,y:remainLength+clipRadius - fontSize/2};
            }else if(endLength < (halfTop + partCircle*2 + rectHeight)){
                const moveY = Math.tan(((endLength - halfTop - partCircle - rectHeight)/partCircle)*(Math.PI/2))*clipRadius;
                clipPath = `M${width/2},${height/2} 
                    L${width/2},0 
                    L0,0 l0,${clipRadius+rectHeight+moveY}
                    l${clipRadius},${-moveY} `;
                textPosition = {
                    y:clipRadius+rectHeight+Math.sin(((endLength - halfTop - partCircle - rectHeight)/partCircle)*(Math.PI/2)-offsetAngle)*(clipRadius-lineWidth/2-fontSize),
                    x:clipRadius-Math.cos(((endLength - halfTop - partCircle - rectHeight)/partCircle)*(Math.PI/2)-offsetAngle)*(clipRadius-lineWidth/2-fontSize)
                };
            }else if(endLength < (halfTop*3 + partCircle*2 + rectHeight)){
                const remainLength = endLength - halfTop - partCircle*2 - rectHeight;
                clipPath = `M${width/2},${height/2} 
                    L${width/2},0 L0,0 l0,${height} l${remainLength+clipRadius},0 l0,${-height/2} `;
                textPosition = {y:(height-fontSize*0.92-lineWidth/2),x:remainLength+clipRadius - fontSize/2};
            }else if(endLength < (halfTop*3 + partCircle*3 + rectHeight)){
                const moveX = Math.tan(((endLength - halfTop*3 - partCircle*2 - rectHeight)/partCircle)*(Math.PI/2))*clipRadius;
                clipPath = `M${width/2},${height/2} 
                    L${width/2},0 L0,0 l0,${height} l${rectWidth+clipRadius+moveX},0
                    l${-moveX},${-clipRadius} `;
                textPosition = {
                    x:clipRadius+rectWidth+Math.sin(((endLength - halfTop*3 - partCircle*2 - rectHeight)/partCircle)*(Math.PI/2)-offsetAngle)*(clipRadius-lineWidth/2-fontSize),
                    y:height - (clipRadius-Math.cos(((endLength - halfTop*3 - partCircle*2 - rectHeight)/partCircle)*(Math.PI/2)-offsetAngle)*(clipRadius-lineWidth/2-fontSize))
                };
            }else if(endLength < (halfTop*3 + partCircle*3 + rectHeight*2)){
                const remainLength = endLength - halfTop*3 - partCircle*3 - rectHeight;
                clipPath = `M${width/2},${height/2} 
                    L${width/2},0 L0,0 l0,${height} l${width},0 l0,${-remainLength-clipRadius} l${-width/2},0`;
                textPosition = {x:(width-fontSize-lineWidth/2),y:(height - remainLength - clipRadius) + fontSize*0.6};
            }else if(endLength < (halfTop*3 + partCircle*4 + rectHeight*2)){
                const moveY = Math.tan(((endLength - halfTop*3 - partCircle*3 - rectHeight*2)/partCircle)*(Math.PI/2))*clipRadius;
                clipPath = `M${width/2},${height/2} 
                    L${width/2},0 L0,0 l0,${height} l${width},0 l0,${-rectHeight-clipRadius-moveY}
                    l${-clipRadius},${moveY} `;
                textPosition = {
                    y:clipRadius - Math.sin(((endLength - halfTop*3 - partCircle*3 - rectHeight*2)/partCircle)*(Math.PI/2)-offsetAngle)*(clipRadius-lineWidth/2-fontSize),
                    x:width - (clipRadius-Math.cos(((endLength - halfTop*3 - partCircle*3 - rectHeight*2)/partCircle)*(Math.PI/2)-offsetAngle)*(clipRadius-lineWidth/2-fontSize))
                };
            }else{
                const remainLength = endLength - halfTop*3 - partCircle*4 - rectHeight*2;
                clipPath = `M${width/2},${height/2} 
                    L${width/2},0 L0,0 l0,${height} l${width},0 l0,${-height} l${-remainLength-clipRadius},0 l0,${height/2}`;
                textPosition = {x:(width - remainLength - clipRadius +fontSize/2),y:fontSize*1.05+lineWidth/2};
            }
            addLength = endLength;
            pathList.push({path:clipPath,color:this.colorList[index],textPosition,num:item[numKey]});
        });

        const allPath = `M${width/2},${fontSize+lineWidth/2} 
            L${fontSize+lineWidth/2+radius},${fontSize+lineWidth/2} 
            a${radius},${radius} 0 0,0 ${-radius},${radius} 
            l0,${height - fontSize*2 - 2*radius - lineWidth} 
            a${radius},${radius} 0 0,0 ${radius},${radius} 
            l${width - fontSize*2 - 2*radius - lineWidth},0 
            a${radius},${radius} 0 0,0 ${radius},${-radius} 
            l0,${-(height - fontSize*2 - 2*radius - lineWidth)} 
            a${radius},${radius} 0 0,0 ${-radius},${-radius} 
            L${width/2},${fontSize+lineWidth/2}`;
        let showList = [];
        for(let i = pathList.length - 1;i >= 0;i --){
            showList.push(pathList[i]);
        }
        return (
            <svg x="0px" y="0px" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={cssStyle.rect}>
                {/*<path d={pathList[0]} style={{file:'#fff'}}/>*/}
                <path d={allPath} className={cssStyle.blankLine} style={{strokeWidth:lineWidth}}/>
                {showList.map((item,index)=>{
                    return (
                        <g key={index}>
                            <clipPath id={'RectPieCutOff'+index+id}>
                                <path d={item.path} />
                            </clipPath>
                            <path d={allPath} className={cssStyle.blankLine} style={{strokeWidth:lineWidth,stroke:item.color}} clipPath={`url(#RectPieCutOff${index}${id})`}/>
                            {item.textPosition && <text x={item.textPosition.x} y={item.textPosition.y} fill='#fff' className={cssStyle.text} fontSize={fontSize}>{item.num}</text>}
                        </g>
                    );
                })}
            </svg>
        );
    }
}