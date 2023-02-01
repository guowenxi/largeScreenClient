import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { SpringSystem } from 'rebound';

export default class SpringScrollbars extends Component {

    constructor(props, ...rest) {
        super(props, ...rest);
        this.handleSpringUpdate = this.handleSpringUpdate.bind(this);
        this.scrollbars = React.createRef();
        this.mouseDown = false;
    }

    componentDidMount() {
        this.springSystem = new SpringSystem();
        this.spring = this.springSystem.createSpring(200,30);
        this.spring.addListener({ onSpringUpdate: this.handleSpringUpdate });
        this.startAutoScroll();
    }

    componentWillUnmount() {
        this.springSystem.deregisterSpring(this.spring);
        this.springSystem.removeAllListeners();
        this.springSystem = undefined;
        this.spring.destroy();
        this.spring = undefined;
        clearInterval(this.timer);
    }

    //props变更时触发函数
    componentDidUpdate(prevProps) {
        if(prevProps.selectedIndex !== this.props.selectedIndex && this.props.autoSelect){
            this.autoScrollIndex();
        }else if(prevProps.pageSelected !== this.props.pageSelected){
            this.autoScrollPage();
        }
        if(prevProps.autoMove !== this.props.autoMove){
            this.startAutoScroll();
        }
    }

    getScrollTop() {
        return this.scrollbars.current.getScrollTop();
    }

    getScrollHeight() {
        return this.scrollbars.current.getScrollHeight();
    }

    getHeight() {
        return this.scrollbars.current.getClientHeight();
    }

    scrollTop(top) {
        const scrollTop = this.getScrollTop();
        this.spring.setCurrentValue(scrollTop).setAtRest();
        this.spring.setEndValue(top);
    }

    getScrollLeft() {
        return this.scrollbars.current.getScrollLeft();
    }

    getScrollWidth() {
        return this.scrollbars.current.getScrollWidth();
    }

    getWidth() {
        return this.scrollbars.current.getClientWidth();
    }

    scrollLeft(left) {
        const scrollLeft = this.getScrollLeft();
        this.spring.setCurrentValue(scrollLeft).setAtRest();
        this.spring.setEndValue(left);
    }

    handleSpringUpdate(spring) {
        if(this.props.autoscrolltype === 'row'){
            const val = spring.getCurrentValue();
            this.scrollbars.current.scrollLeft(val);
        }else{
            const val = spring.getCurrentValue();
            this.scrollbars.current.scrollTop(val);
        }
    }

    startAutoScroll(){
        if(this.props.autoMove && this.props.interval){
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.autoScroll();
            },this.props.interval);
        }
    }

    autoScroll(){
        if(this.props.autoscrolltype === 'row'){
            const scrollWidth = this.getScrollWidth();
            const width = this.getWidth();
            const scrollLeft = this.getScrollLeft();
            const remain = scrollWidth - scrollLeft - width;
            const {lineHeight} = this.props;
            let moveLength;
            if(typeof(lineHeight) === 'string' && lineHeight.indexOf('%')){
                moveLength = parseFloat(lineHeight)*scrollWidth/100;
            }else{
                moveLength = lineHeight;
            }
            if(remain > (moveLength/2)){
                const left = (Math.round(scrollLeft/moveLength)+1)*moveLength;
                this.scrollLeft(Math.ceil(left));
            }else{
                this.scrollLeft(0);
            }
        }else{
            const scrollHeight = this.getScrollHeight();
            const height = this.getHeight();
            const scrollTop = this.getScrollTop();
            const remain = scrollHeight - scrollTop - height;
            const {lineHeight} = this.props;
            let moveLength;
            if(typeof(lineHeight) === 'string' && lineHeight.indexOf('%')){
                moveLength = parseFloat(lineHeight)*scrollHeight/100;
            }else{
                moveLength = lineHeight;
            }
            if(remain > (moveLength/2)){
                const top = (Math.round(scrollTop/moveLength)+1)*moveLength;
                this.scrollTop(Math.ceil(top));
            }else{
                this.scrollTop(0);
            }
        }
    }

    autoScrollIndex(){
        if(this.props.autoscrolltype === 'row'){
            const scrollWidth = this.getScrollWidth();
            const width = this.getWidth();
            const {lineHeight} = this.props;
            let moveLength;
            if(typeof(lineHeight) === 'string' && lineHeight.indexOf('%')){
                moveLength = parseFloat(lineHeight)*scrollWidth/100;
            }else{
                moveLength = lineHeight;
            }
            const remain = scrollWidth - width - moveLength*this.props.selectedIndex;
            if(remain > 0){
                this.scrollLeft(Math.ceil(moveLength*this.props.selectedIndex));
            }else{
                this.scrollLeft(Math.ceil(scrollWidth - width));
            }
        }else{
            const scrollHeight = this.getScrollHeight();
            const height = this.getHeight();
            const {lineHeight} = this.props;
            let moveLength;
            if(typeof(lineHeight) === 'string' && lineHeight.indexOf('%')){
                moveLength = parseFloat(lineHeight)*scrollHeight/100;
            }else{
                moveLength = lineHeight;
            }
            const remain = scrollHeight - height - moveLength*this.props.selectedIndex;
            if(remain > 0){
                this.scrollTop(Math.ceil(moveLength*this.props.selectedIndex));
            }else{
                this.scrollTop(Math.ceil(scrollHeight - height));
            }
        }
    }

    autoScrollPage(){
        if(this.props.autoscrolltype === 'row'){
            const scrollWidth = this.getScrollWidth();
            const lineHeight = this.props.pageHeight;
            let moveLength;
            if(typeof(lineHeight) === 'string' && lineHeight.indexOf('%')){
                moveLength = parseFloat(lineHeight)*scrollWidth/100;
            }else{
                moveLength = lineHeight;
            }
            const left = (this.props.pageSelected)*moveLength;
            this.scrollLeft(Math.ceil(left));
        }else{
            const scrollHeight = this.getScrollHeight();
            const lineHeight = this.props.pageHeight;
            let moveLength;
            if(typeof(lineHeight) === 'string' && lineHeight.indexOf('%')){
                moveLength = parseFloat(lineHeight)*scrollHeight/100;
            }else{
                moveLength = lineHeight;
            }
            const top = (this.props.pageSelected)*moveLength;
            this.scrollTop(Math.ceil(top));
        }
    }

    //手动拖动时结束定时自动滚动任务
    handleScrollStart(){
        // clearTimeout(this.timer);
        clearInterval(this.timer);
    }

    //手动拖动完毕时开始定时自动滚动任务
    handleScrollStop(){
        this.startAutoScroll();
    }

    render() {
        const thisProps = Object.assign({}, this.props);
        delete thisProps.autoMove;
        delete thisProps.lineHeight;
        delete thisProps.pageHeight;
        delete thisProps.interval;
        delete thisProps.selectedIndex;
        delete thisProps.autoSelect;
        delete thisProps.pageSelected;
        return (
            <Scrollbars
                {...thisProps}
                // onScrollStart={this.handleScrollStart.bind(this)}
                // onScrollStop={this.handleScrollStop.bind(this)}
                onMouseOver={this.handleScrollStart.bind(this)}
                onMouseOut={this.handleScrollStop.bind(this)}
                className={`${this.props.className} Scrollbars`}
                ref={this.scrollbars}/>
        );
    }
}