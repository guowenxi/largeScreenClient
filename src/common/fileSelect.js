import React from 'react';
import style from './css/fileSelect.module.css';
import {fileUrl} from "../config";
import {Icon, Modal, Upload} from "antd";
import axios from "axios";
import {Scrollbars} from "react-custom-scrollbars";

export default class FileSelect extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {fileList:[{id:'b042b359809243fcaf3af8e5b2a9da8c'},{id:'e4af7dac38e64570805462d520831b89'}],selectedId:''};
        this.state = {fileList:[],selectedId:''};
    }

    componentDidMount() {
        this.getFileList();
    }

    componentWillUnmount() {
    }

    getFileList(){
        axios.get(fileUrl + '/getList',{params:{rbacToken:this.props.token}}).then((response) =>{
            // 在这儿实现 setState
            const result = response.data;
            if(result.success){
                this.setState({fileList:result.data});
            }
        }).catch(function(error){
            // 处理请求出错的情况
        });
    }

    imgSelect(id){
        this.props.imgSelect(id);
        this.setState({selectedId:id});
    }

    handleChange(info){
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            const result = info.file.response;
            if(result.success){
                let { fileList } = this.state;
                fileList.push({id:result.data[0]});
                this.setState({fileList});
            }else{
                Modal.error({
                    content: '上传失败！',
                });
            }
        }
    }

    handleOk(){
        this.setState({selectedId:''});
        this.props.onOk();
    }

    handleCancel(){
        this.setState({selectedId:''});
        this.props.onCancel();
    }

    render() {
        return (
            <Modal
                title={this.props.title}
                visible={this.props.visible}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                okText={this.props.okText}
                cancelText={this.props.cancelText}
                centered={true}
                width={this.props.width}
            >
                <div className={style.selectBox}>
                    <Scrollbars>
                        <Upload
                            name="files"
                            listType="picture-card"
                            className={style.uploadBox}
                            showUploadList={false}
                            action={fileUrl + '/upload?rbacToken=' + this.props.token}
                            onChange={this.handleChange.bind(this)}
                            multiple={true}
                        >
                            <Icon type='plus' />
                            <div className="ant-upload-text">选择文件上传</div>
                        </Upload>
                        {this.state.fileList.map((file) =>
                            <div key={file.id} className={style.fileBox} onClick={this.imgSelect.bind(this,file.id)} style={{borderColor:file.id === this.state.selectedId ? '#09f':'gray'}}>
                                <img alt='' src={fileUrl + '/download/' + file.id} className={style.img}/>
                            </div>
                        )}
                    </Scrollbars>
                </div>
            </Modal>
        );
    }
}