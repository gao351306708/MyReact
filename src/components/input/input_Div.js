/**
 * Created by gaoju on 2018/2/28.
 */
import React, { Cmponent } from 'react'
import './style.css'

class InputDiv extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            content: props.content || ''
        }
    }
    render() {
        let content = this.state.content;
        return (
            <div contentEditable="true" dangerouslySetInnerHTML={{__html:content}} ></div>
        );
    }
}

export default InputDiv