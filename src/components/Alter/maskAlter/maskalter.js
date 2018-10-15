/**
 * Created by gaoju on 2017/11/16.
 */
import React, { Cmponent } from 'react'
import Form from '../../form/form1'
import { Modal, Button } from 'antd';
import './style.css'

class MaskAlter extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            modalVisible: false,
            title:props.title
        }
    }
    setModalVisible(modalVisible) {
        this.setState({modalVisible:modalVisible});
    }
    render() {
        return (
            <div>
                <a type="primary" onClick={() => this.setModalVisible(true)}>{this.state.title}</a>
                <Modal
                    title=""
                    footer=""
                    width="800px"
                    maskClosable={false}
                    wrapClassName="vertical-center-modal"
                    visible={this.state.modalVisible}
                    onCancel={() => this.setModalVisible(false)}
                >
                    <Form handleMask={() => this.setModalVisible(false)}></Form>
                </Modal>
            </div>
        );
    }
}

export default MaskAlter