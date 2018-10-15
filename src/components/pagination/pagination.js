/**
 * Created by gaoju on 2017/12/21.
 */
import React,{Component} from 'react'
import './style.css'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

class Pagination extends Component{
    constructor(props){
        super(props)
        this.state={
            current: props.current,
            total: props.total || 0,
            arrayList: props.wordNum ||[],
            color:props.color,
            errorList:props.errorList||[]
        }
    }
    componentWillMount(){
        let arraylist=[];
        if(this.state.arrayList.length<1){
            for(let i=0;i<this.state.total;i++) {
                arraylist[i] = i+1;
            }
            this.setState({arrayList:arraylist})
        }
    }
    componentDidMount(){
        this.addClassHandle(this.state.current);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
           this.addClassHandle(nextProps.current)
            this.setBackgroudcolor(nextProps.errorList);
        }
    }
    setBackgroudcolor(list){
        if(list){
            for(let i=0;i<list.length;i++){
                let _this = this.refs[list[i]];
                $(_this).find('a').css("color","red")
            }
        }
    }
    addClassHandle(num){
        let _this = this.refs[num];
        $(_this).siblings().removeClass("active")
        $(_this).attr("class","active")
    }
    handleChange(e){
        this.addClassHandle(e.target.text);
        this.props.onChange(Number(e.target.text))
    }
    render(){
        if(this.state.arrayList.length<1){
            return <div/>
        }
        let color = this.state.color;
        return(
            <div className="myPagination">
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        {this.state.arrayList.map((index,i)=>(
                            <li key={index} ref={index} id={index}><a onClick={this.handleChange.bind(this)}>{index}</a></li>
                        ))}
                    </ul>
                </nav>
            </div>
        )
    }
}
Pagination.propTypes = {
    current: PropTypes.number,
    total:PropTypes.number,
    onChange:PropTypes.func,
    color:PropTypes.string,
    wordNum:PropTypes.array
}
export default Pagination