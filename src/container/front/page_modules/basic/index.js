/**
 * 此页面目前没有作用，以后可能会有
 * Created by gaoju on 2017/11/21.
 */
import React,{Component} from 'react'
import './style.css'

class Basic extends Component{
    constructor(props){
        super(props)
    }
    goPage(data,event){
        this.props.actions.push(`/home/basic/${data}`)
    }
    render(){
        return (
            <div className="math-door">
                <div className="questions">
                    <div className="enter-block question-block" onClick={this.goPage.bind(this,'basicInfo')}>用户信息</div>
                </div>
                <div className="exam">
                    <div className="enter-block exam-block" onClick={this.goPage.bind(this,'myCollection')}>收藏</div>
                </div>
            </div>
        )
    }
}
export default Basic