import React from "react";
import cssStyle from "./circleTypeOne.module.css";

export default class CircleTypeOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.id = new Date().getTime();
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    //组件加载触发函数
    componentDidMount() {
    }

    render() {
        return (
            <div style={this.props.style} className={this.props.className} ref={this.boxRef}>
                <svg x="0" y="0" viewBox='0 0 96 96' style={{width:'100%',height:'100%'}}>
                    <circle fill="#101C34" cx="48" cy="48" r="39.1"/>
                    <g opacity="0.8" className={cssStyle.circleOne}>
                        <g>
                            <linearGradient id={`linearGradient1_${this.id}`} gradientUnits="userSpaceOnUse" x1="48" y1="88.1147" x2="48" y2="7.8853">
                                <stop  offset="0" className={cssStyle.linearGradient1stop1}/>
                                <stop  offset="4.542294e-002"  className={cssStyle.linearGradient1stop2}/>
                                <stop  offset="0.2813"  className={cssStyle.linearGradient1stop3}/>
                                <stop  offset="0.4649"  className={cssStyle.linearGradient1stop4}/>
                                <stop  offset="0.5726"  className={cssStyle.linearGradient1stop5}/>
                                <stop  offset="1"  className={cssStyle.linearGradient1stop6}/>
                            </linearGradient>
                            <filter id={`filter_${this.id}`}  x="-10" y="-10" width="96" height="96">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                            </filter>
                            <path stroke={`url(#linearGradient1_${this.id})`} filter={`url(#filter_${this.id})`} d="M87.1,48c0,21.6-17.5,39.1-39.1,39.1
				S8.9,69.6,8.9,48S26.4,8.9,48,8.9S87.1,26.4,87.1,48z M85.8,53.5V41.1h-1.2v12.3H85.8z M10.5,53.5V41.1H9.4v12.3H10.5z M42,86.4
				h12.3v-1.2H42V86.4z M42,11.1h12.3V10H42V11.1z M70.7,78.9l8.8-8.7l-0.8-0.8l-8.8,8.7L70.7,78.9z M18,25.4l8.8-8.7l-0.8-0.8
				l-8.8,8.7L18,25.4z M16.8,70.9l8.7,8.8l0.8-0.8l-8.7-8.8L16.8,70.9z M70.3,17.7l8.7,8.8l0.8-0.8l-8.7-8.8L70.3,17.7z" className={cssStyle.path1}/>
                            <path stroke={`url(#linearGradient1_${this.id})`} d="M87.1,48c0,21.6-17.5,39.1-39.1,39.1
				S8.9,69.6,8.9,48S26.4,8.9,48,8.9S87.1,26.4,87.1,48z M85.8,53.5V41.1h-1.2v12.3H85.8z M10.5,53.5V41.1H9.4v12.3H10.5z M42,86.4
				h12.3v-1.2H42V86.4z M42,11.1h12.3V10H42V11.1z M70.7,78.9l8.8-8.7l-0.8-0.8l-8.8,8.7L70.7,78.9z M18,25.4l8.8-8.7l-0.8-0.8
				l-8.8,8.7L18,25.4z M16.8,70.9l8.7,8.8l0.8-0.8l-8.7-8.8L16.8,70.9z M70.3,17.7l8.7,8.8l0.8-0.8l-8.7-8.8L70.3,17.7z" className={cssStyle.path1}/>
                        </g>
                    </g>
                    <g className={cssStyle.circleTwo}>
                        <linearGradient id={`linearGradient2_${this.id}`} gradientUnits="userSpaceOnUse" x1="48" y1="92.33" x2="48" y2="3.6699">
                            <stop className={cssStyle.linearGradient2stop1} offset="0" />
                            <stop className={cssStyle.linearGradient2stop2} offset="0.1971" />
                            <stop className={cssStyle.linearGradient2stop3} offset="0.6286" />
                            <stop className={cssStyle.linearGradient2stop4} offset="1" />
                        </linearGradient>

                        <path stroke={`url(#linearGradient2_${this.id})`} d="M91.8,48c0,24.2-19.6,43.8-43.8,43.8S4.2,72.2,4.2,48S23.8,4.2,48,4.2S91.8,23.8,91.8,48z" className={cssStyle.path2}/>
                    </g>
                    <g className={cssStyle.circleThree}>
                        <g opacity="0.7">
                            <linearGradient id={`linearGradient3_${this.id}`} gradientUnits="userSpaceOnUse" x1="31.6302" y1="19.6602" x2="64.2525" y2="76.1638">
                                <stop className={cssStyle.linearGradient3stop1} offset="0" />
                                <stop className={cssStyle.linearGradient3stop2} offset="4.154670e-002" />
                                <stop className={cssStyle.linearGradient3stop3} offset="0.1474" />
                                <stop className={cssStyle.linearGradient3stop4} offset="0.2595" />
                                <stop className={cssStyle.linearGradient3stop5} offset="0.377" />
                                <stop className={cssStyle.linearGradient3stop6} offset="0.5016" />
                                <stop className={cssStyle.linearGradient3stop7} offset="0.6366" />
                                <stop className={cssStyle.linearGradient3stop8} offset="0.7898" />
                                <stop className={cssStyle.linearGradient3stop9} offset="1" />
                            </linearGradient>
                            <path stroke={`url(#linearGradient3_${this.id})`} d="M80.1,47.9C80.1,65.6,65.7,80,47.9,80
				S15.8,65.6,15.8,47.9s14.4-32.1,32.1-32.1S80.1,30.2,80.1,47.9z" className={cssStyle.path3}/>
                        </g>
                        <g opacity="0.25">
                            <g>
                                <g>

                                    <linearGradient id={`linearGradient4_${this.id}`} gradientUnits="userSpaceOnUse" x1="5.2593" y1="-548.8552" x2="5.2593" y2="-554.1478" gradientTransform="matrix(0.9208 0.39 -0.39 0.9208 -162.6425 584.2894)">
                                        <stop  offset="0" className={cssStyle.linearGradient4stop1}/>
                                        <stop  offset="0.1971" className={cssStyle.linearGradient4stop2}/>
                                        <stop  offset="0.6286" className={cssStyle.linearGradient4stop3}/>
                                        <stop  offset="1" className={cssStyle.linearGradient4stop4}/>
                                    </linearGradient>
                                    <path fill={`url(#linearGradient4_${this.id})`} d="M60.7,77.3c-0.4-0.6-1.6-0.8-2.6-0.4l-3.1,1c-1.1,0.3-1.6,1.1-1.1,1.8
						c0.5,0.7,1.7,1,2.7,0.7l3-1.1C60.7,78.8,61.2,78,60.7,77.3z"/>
                                </g>
                                <g>

                                    <linearGradient id={`linearGradient5_${this.id}`} gradientUnits="userSpaceOnUse" x1="15.6279" y1="-569.4038" x2="15.6279" y2="-578.0388" gradientTransform="matrix(0.9208 0.39 -0.39 0.9208 -162.6425 584.2894)">
                                        <stop  offset="0" className={cssStyle.linearGradient4stop1}/>
                                        <stop  offset="0.1971" className={cssStyle.linearGradient4stop2}/>
                                        <stop  offset="0.6286" className={cssStyle.linearGradient4stop3}/>
                                        <stop  offset="1" className={cssStyle.linearGradient4stop4}/>
                                    </linearGradient>
                                    <path fill={`url(#linearGradient5_${this.id})`} d="M74.6,60.8c-0.5,1.3-0.9,1.9-0.9,1.9c-0.5,1-0.6,2.3-0.1,3c0.5,0.7,1.3,0.5,1.9-0.4
						c0,0,1-1.6,1.7-3.4c0.3-0.7,0.3-0.7,0.3-0.7c0.3-0.8,0.1-2.1-0.5-2.9c-0.6-0.8-1.3-0.6-1.6,0.4C75.4,58.7,75.2,59.5,74.6,60.8z"
                                    />
                                </g>
                                <g>

                                    <linearGradient id={`linearGradient6_${this.id}`} gradientUnits="userSpaceOnUse" x1="60.1144" y1="-351.0315" x2="60.1144" y2="-359.6666" gradientTransform="matrix(0.9687 0.2483 -0.2483 0.9687 -67.2863 382.756)">
                                        <stop  offset="0" className={cssStyle.linearGradient4stop1}/>
                                        <stop  offset="0.1971" className={cssStyle.linearGradient4stop2}/>
                                        <stop  offset="0.6286" className={cssStyle.linearGradient4stop3}/>
                                        <stop  offset="1" className={cssStyle.linearGradient4stop4}/>
                                    </linearGradient>
                                    <path fill={`url(#linearGradient6_${this.id})`} d="M78.1,52.3c-0.3,1.4-0.6,2.1-0.6,2.1c-0.4,1-0.2,2.4,0.3,3s1.4,0.3,1.8-0.7
						c0,0,0.7-1.7,1.2-3.7c0.2-0.7,0.2-0.7,0.2-0.7c0.2-0.8-0.3-2.1-0.9-2.8c-0.7-0.7-1.3-0.5-1.5,0.6C78.6,50.1,78.4,50.9,78.1,52.3
						z"/>
                                </g>
                                <g>

                                    <linearGradient id={`linearGradient7_${this.id}`} gradientUnits="userSpaceOnUse" x1="-2.0244" y1="-544.4339" x2="-2.0244" y2="-548.7747" gradientTransform="matrix(0.9208 0.39 -0.39 0.9208 -162.6425 584.2894)">
                                        <stop  offset="0" className={cssStyle.linearGradient4stop1}/>
                                        <stop  offset="0.1971" className={cssStyle.linearGradient4stop2}/>
                                        <stop  offset="0.6286" className={cssStyle.linearGradient4stop3}/>
                                        <stop  offset="1" className={cssStyle.linearGradient4stop4}/>
                                    </linearGradient>
                                    <path fill={`url(#linearGradient7_${this.id})`} d="M52.8,79.9c-0.5-0.7-1.7-1.2-2.8-1.1L45.7,79c-1.1,0-1.6,0.6-1,1.4s1.9,1.5,3,1.4l4-0.3
						C52.8,81.3,53.3,80.6,52.8,79.9z"/>
                                </g>
                                <g>

                                    <linearGradient id={`linearGradient8_${this.id}`} gradientUnits="userSpaceOnUse" x1="14.0518" y1="-561.4041" x2="14.0518" y2="-568.6343" gradientTransform="matrix(0.9208 0.39 -0.39 0.9208 -162.6425 584.2894)">
                                        <stop  offset="0" className={cssStyle.linearGradient4stop1}/>
                                        <stop  offset="0.1971" className={cssStyle.linearGradient4stop2}/>
                                        <stop  offset="0.6286" className={cssStyle.linearGradient4stop3}/>
                                        <stop  offset="1" className={cssStyle.linearGradient4stop4}/>
                                    </linearGradient>
                                    <path fill={`url(#linearGradient8_${this.id})`} d="M73,66.7c-0.5-0.7-1.4-0.5-2,0.3l-2.1,2.5c-0.8,0.8-1,2-0.6,2.6c0.4,0.6,1.4,0.5,2.2-0.2
						l2.1-2.4C73.2,68.7,73.4,67.4,73,66.7z"/>
                                </g>
                                <g>

                                    <linearGradient id={`linearGradient9_${this.id}`} gradientUnits="userSpaceOnUse" x1="10.5376" y1="-554.5714" x2="10.5376" y2="-560.7802" gradientTransform="matrix(0.9208 0.39 -0.39 0.9208 -162.6425 584.2894)">
                                        <stop  offset="0" className={cssStyle.linearGradient4stop1}/>
                                        <stop  offset="0.1971" className={cssStyle.linearGradient4stop2}/>
                                        <stop  offset="0.6286" className={cssStyle.linearGradient4stop3}/>
                                        <stop  offset="1" className={cssStyle.linearGradient4stop4}/>
                                    </linearGradient>
                                    <path fill={`url(#linearGradient9_${this.id})`} d="M67.4,72.9c-0.4-0.6-1.5-0.6-2.4,0l-2.5,1.7c-0.9,0.6-1.4,1.6-0.9,2.2
						c0.4,0.6,1.6,0.7,2.5,0.1l2.5-1.7C67.5,74.6,67.9,73.6,67.4,72.9z"/>
                                </g>
                            </g>
                        </g>
                        <g>
                            <circle fill="#1C89B5" cx="27.4" cy="23.4" r="1.3"/>
                            <circle fill="#1C89B5" cx="24.7" cy="26.1" r="1.3"/>
                            <circle fill="#1C89B5" cx="15.8" cy="46.6" r="1.3"/>
                            <circle opacity="0.75" fill="#1C89B5" cx="75.4" cy="30.6" r="1.3"/>
                            <circle opacity="0.58" fill="#1C89B5" cx="28.4" cy="73.4" r="1.3"/>
                            <circle opacity="0.58" fill="#1C89B5" cx="33.3" cy="76.7" r="1.3"/>
                            <circle fill="1C89B5" cx="15.8" cy="49.8" r="1.3"/>
                        </g>
                    </g>
                </svg>
            </div>
        );
    }
}