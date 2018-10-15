/**
 * 404
 * Created by gaoju on 2018/6/11.
 */
import React,{Component} from 'react'
import './style.css'

class NoFound extends Component {
    constructor(props) {
        super(props)
        this.state = {
        };
    };
    componentDidMount(){
    };
    render() {
        return (
            <div className="nofound">
                <h1>No Found 404!!!</h1>
            </div>
        );
    }
}

export default NoFound
