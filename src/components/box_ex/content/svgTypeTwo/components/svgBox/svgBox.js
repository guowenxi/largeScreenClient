import React from 'react';

export default class SvgBox extends React.Component {
    render() {
        const { width, height, leftBoxWidth, rightBoxWidth, id, opacity, backgroundColor } = this.props;
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                preserveAspectRatio="none"
                viewBox={`0 0 ${width} ${height}`}
            >
                <defs>
                    {
                        // backgroundColor && this.props.backgroundGradientType === 'linear' ?
                        //     (<linearGradient id={"linear" + id} x1="0%" y1="0%" x2="100%" y2="100%">
                        //         {backgroundColor.map((item, index) => {
                        //             return (
                        //                 <stop offset={item.percent + '%'} stopColor={item.color} key={index} />
                        //             )
                        //         })}
                        //     </linearGradient>) : (this.props.backgroundGradientType === 'radial' && (
                        //         <radialGradient id={"linear" + id} x1="0%" y1="0%" x2="100%" y2="100%">
                        //             {backgroundColor && backgroundColor.map((item, index) => {
                        //                 return (
                        //                     <stop offset={item.percent + '%'} stopColor={item.color} key={index} />
                        //                 )
                        //             })}
                        //         </radialGradient>
                        //     ))
                    }
                </defs>
                <rect style={{ fill: backgroundColor  && backgroundColor.length > 0 ? `url(#linear${id})` : '#172d57', fillOpacity: 1, opacity: opacity === 0 ? 0 : (opacity || 0.3) }} y="0" width={width} height={height} />
                <rect style={{ fill: '#0055b9' }} x={leftBoxWidth} y="0" width={width - leftBoxWidth - rightBoxWidth} height="1" />
                <rect style={{ fill: '#0055b9' }} x={leftBoxWidth} y={height - 1} width={width - leftBoxWidth - rightBoxWidth} height="1" />
                <rect style={{ fill: '#0055b9' }} y="0" width={leftBoxWidth || 20} height="6" />
                <rect style={{ fill: '#0055b9' }} x={width - (rightBoxWidth ? rightBoxWidth : 20)} y="0" width={rightBoxWidth || 20} height="6" />
                <rect style={{ fill: '#0055b9' }} y={height - 6} width={leftBoxWidth || 20} height="6" />
                <rect style={{ fill: '#0055b9' }} x={width - (rightBoxWidth ? rightBoxWidth : 20)} y={height - 6} width={rightBoxWidth || 20} height="6" />
            </svg>
        )
    }
}