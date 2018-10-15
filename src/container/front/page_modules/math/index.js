/**
 * Created by gaoju on 2017/11/21.
 */
import React,{Component} from 'react'
import { Link } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import './style.css'

class Math extends Component{
    constructor(props) {
        super(props)
    }
    goPage(data,event){
        this.props.actions.push(`/home/math/${data}`)
    }
    render(){
        return (
            <div className="math-door">
                <div className="exam">
                    <div className="enter-block exam-block" onClick={this.goPage.bind(this,'thematiceParts')}>考纲复习</div>
                </div>
                <div className="questions">
                    <div className="enter-block question-block" onClick={this.goPage.bind(this,'exams')}>模考训练</div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({push}, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Math)