import React from "react";

export default class ItemPart extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {isHover:false};
    }

    //组件加载触发函数
    componentDidMount() {
    }

    //组件删除时触发函数
    componentWillUnmount() {
    }

    toggleHover(flag){
        this.setState({isHover:flag});
    }

    render() {
        const {style,className,onClick,name,hoverBgColor,hoverFontColor} = this.props;
        let partStyle;
        if(this.state.isHover){
            partStyle = {
                ...style,
                backgroundColor:hoverBgColor,
                color:hoverFontColor
            };
        }else{
            partStyle = style;
        }
        return (
            <div
                style={partStyle} className={className} onClick={onClick}
                onMouseEnter={this.toggleHover.bind(this,true)} onMouseLeave={this.toggleHover.bind(this,false)}
                title={name}
            >
                {name}
            </div>
        );
    }
}