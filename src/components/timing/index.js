/**
 * Created by gaoju on 2018/1/2.
 */
import React,{Component} from 'react'
import { connect } from 'react-redux'
import './style.css'

class Timing extends Component{
    constructor(props){
        super(props)
        this.state = {
            clearTime:props.clearTime || false,
            duration:props.duration || 30,//定时时长，默认为30s,最小单位s
            hours:0,
            minutes:0,
            seconds:0
        }
    }
    componentDidMount(){
        this.timer = setInterval(this.updateTime,1000);
    }
    //componentWillReceiveProps(nextProps) {
    //    this.setState({
    //        clearTime: nextProps.clearTime
    //    });
    //}
    updateTime=()=>{
        let newDuration = this.state.duration-1;
        let newHours = parseInt(newDuration/3600);
        let newMinutes = parseInt((newDuration-newHours*3600)/60);
        let newSeconds = newDuration-newHours*3600-newMinutes*60;
        if(newDuration === 0){
            clearInterval(this.timer)
            this.props.endHandle();
        }
        if(newMinutes<10){
            newMinutes = '0'+newMinutes;
        }
        if(newSeconds<10){
            newSeconds = '0'+newSeconds;
        }
        this.setState({
            duration:newDuration,
            hours:newHours,
            minutes:newMinutes,
            seconds:newSeconds
        })
    }
    render(){
        if(this.props.clearTime){
            clearInterval(this.timer)
        }
        console.log("this.state.clearTime::",this.state.clearTime,this.props.clearTime)
        let remainingTimes = (this.state.duration);
        const [hours,minutes,seconds]=[this.state.hours,this.state.minutes,this.state.seconds];
        return(
            <div className="time">时间还剩：{hours+':'+minutes+":"+seconds} s</div>
        )
    }
}
export default Timing