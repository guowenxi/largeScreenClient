import React from 'react';

export default class SvgCylinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: 0,
            dataList: [],
        };
    }

    render() {
        const { type, heightRadio, } = this.props;
        const fillColors = [{ type: 'red', fill1: '#e5020c', fill2: '#fd2b33' }, { type: 'yellow', fill1: '#f6c604', fill2: '#fdd42d' }, { type: 'blue', fill1: '#5cceef', fill2: '#65dafc' }, { type: 'green', fill1: '#04d88b', fill2: '#28fbae' },];
        const [{ fill1, fill2 }] = fillColors.filter(item => item.type === type);
        const height = 143 * heightRadio;
        return (
            this.props.type && <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"
                viewBox="0 0 74.438 156.719" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={'linear' + type} x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" style={{
                            stopColor: fill1,
                            stopOpacity: 1
                        }} />
                        <stop offset="100%" style={{
                            stopColor: fill1,
                            stopOpacity: 0.7
                        }} />
                    </linearGradient>
                </defs>
                <path
                    style={{ fill: fill1, fillRule: 'evenodd', opacity: 0.4 }}
                    d="M143.781,363.938h74.438V507.781H143.781V363.938ZM181,358.281c20.555,0,37.219,2.715,37.219,6.063s-16.664,6.062-37.219,6.062-37.219-2.714-37.219-6.062S160.445,358.281,181,358.281Z"
                    transform="translate(-143.781 -358)" />
                <path
                    style={{ fill: fill1, fillRule: 'evenodd', opacity: 0.4 }}
                    d="M143.781,363.94h74.438M181,358.281c20.555,0,37.219,2.715,37.219,6.063s-16.664,6.062-37.219,6.062-37.219-2.714-37.219-6.062S160.445,358.281,181,358.281Z"
                    transform="translate(-143.781 -358)" />
                <path
                    style={{ fill: fill1, fillRule: 'evenodd', opacity: 0.6 }}
                    d="M181.344,361.719c14.273,0,25.844,1.077,25.844,2.406s-11.571,2.406-25.844,2.406-25.844-1.077-25.844-2.406S167.071,361.719,181.344,361.719Z"
                    transform="translate(-143.781 -358)" />
                <rect style={{ fill: `url(#linear${type})`, }} y={7 + (143 * (1 - heightRadio))} width="74.438" height={height} />
                <ellipse style={{ fill: fill1, }} cx="37.219" cy="150.86" rx="37.219" ry="5.86" />
                <ellipse style={{ fill: fill2, }} cx="37.219" cy={7 + (143 * (1 - heightRadio))} rx="37.219" ry="5.859" />
            </svg>
        )
    }
}