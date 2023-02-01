import React from 'react';
import style from './drag_box.module.css';

export default class DragBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    resize(isLeft, isTop, lockX, lockY, e){
        this.props.resize(isLeft, isTop, lockX, lockY, e, this.props.thisData.id);
    }

    drag(e){
        this.props.drag(e, this.props.thisData.id);
    }

    getDragPart(){
        if(this.props.isSelected){
            return <div>
                <div className={`${style.dragItem} ${style.dragLeftTop}`} onMouseDown={this.resize.bind(this, true, true, false, false)}/>
                <div className={`${style.dragItem} ${style.dragLeftBottom}`}  onMouseDown={this.resize.bind(this, true, false, false, false)}/>
                <div className={`${style.dragItem} ${style.dragRightTop}`}  onMouseDown={this.resize.bind(this, false, true, false, false)}/>
                <div className={`${style.dragItem} ${style.dragRightBottom}`}  onMouseDown={this.resize.bind(this, false, false, false, false)}/>
                <div className={`${style.dragItem} ${style.dragTop}`}  onMouseDown={this.resize.bind(this, false, true, true, false)}/>
                <div className={`${style.dragItem} ${style.dragLeft}`}  onMouseDown={this.resize.bind(this, true, false, false, true)}/>
                <div className={`${style.dragItem} ${style.dragRight}`}  onMouseDown={this.resize.bind(this, false, false, false, true)}/>
                <div className={`${style.dragItem} ${style.dragBottom}`}  onMouseDown={this.resize.bind(this, false, false, true, false)}/>
                <div className={`${style.dragItem} ${style.dragMove}`} onMouseDown={this.drag.bind(this)}/>
            </div>
        }else{
            return <div className={`${style.dragItem} ${style.dragSelect}`} />;
        }
    }

    render() {
        return (
            <div id={this.props.thisData.id+'_drag'} className={`${style.box} ${style.edit} ${!this.props.thisData.showStatus ? style.hideBox:''} ${this.props.isSelected ? style.selected:''}`}
                 style={{...this.props.thisData.position, zIndex: this.props.isSelected ? '100':''}} onClick={this.props.onPartClick}>
                <div id={this.props.thisData.id+'_content'}>{this.props.children}</div>
                {this.getDragPart()}
            </div>
        );
    }
}
