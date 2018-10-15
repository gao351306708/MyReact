/*
* modal弹框！现在基本在专题复习，点击做题的时候用，也可用于其他地方 根据需求来使用
* 2018/08/15
* */
import React,{Component} from 'React'
import './style.css'
class ShowModal extends React.Component{
    constructor(props){
        super(props);
        this.state={
            modalVisible:false
        }
    }
    render(){
        return (
            <Modal
                title="试题详情"
                wrapClassName="vertical-center-modal resetCss"
                visible={this.state.modalVisible}
                maskClosable={false}
                closable={false}
                destroyOnClose={true}
                onOk={() => this.setModalVisible(false)}
                onCancel={() => this.setModalVisible(false)}
            >
            </Modal>
        )
    }
}
export default ShowModal