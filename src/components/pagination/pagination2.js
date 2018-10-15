/**
 * Created by gaoju on 2018/3/6.
 */
import React,{Component} from 'react'
import './style.css'
import PropTypes from 'prop-types'

class Pagination2 extends Component{
    constructor(props){
        super(props)
        this.state={
            current: props.current,
            total: props.total || 5,
            color:props.color || 'red',
            scoreList: props.scoreArraylist ||[],
            arrayList: [],
            errorArray:props.errorArray || []
        }
    }
    componentWillMount(){
        let arraylist=[];
        for(let i=0;i<this.state.total;i++) {
            arraylist[i] = i+1;
        }
        this.setState({arrayList:arraylist})

    }
    componentDidMount(){
        let score = this.state.scoreList;
        $('.after').each(function(i){
            $(this).attr('data-attr',score[i])
        })
        this.addClassHandle(this.state.current);
        this.addColorHandle(this.state.errorArray);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.current != this.state.current) {
            this.addClassHandle(nextProps.current);
        }
        if(nextProps.errorArray != this.state.errorArray){
            this.addColorHandle(nextProps.errorArray);
        }
        this.setState({current:nextProps.current,
            errorArray:nextProps.errorArray,
        })
    }
    addClassHandle(num){
        let _this = this.refs[num];
        $(_this).siblings().removeClass("active")
        $(_this).attr("class","active")
    }
    //添加错题背景色
    addColorHandle(errorlist){
        $(".myPagination2").find('.after').each(function(){//改变之前先重置一下
            $(this)[0].style.color = '#020406';
        })
        for(let ii in errorlist){
            let id = errorlist[ii];
            $('#'+id)[0].style.color = this.state.color
        }
    }
    handleChange(e){
        this.addClassHandle(e.target.text);
        this.props.onChange(Number(e.target.text))
    }
    render(){
        if(this.state.arrayList.length<1){
            return <div/>
        }
        return(
            <div className="myPagination2">
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        {this.state.arrayList.map((index,i)=>(
                            <li key={i} ref={index}><a className="after" id={index} onClick={this.handleChange.bind(this)}>{index}</a></li>
                        ))}
                    </ul>
                </nav>
            </div>
        )
    }
}
Pagination2.propTypes = {
    current: PropTypes.number,//当前题号
    total:PropTypes.number,//总题数
    onChange:PropTypes.func,//切换题号的事件函数
    color:PropTypes.string,//背景颜色设置
    scoreList:PropTypes.array,//每题对应的分数数组
    errorArray:PropTypes.array,//错的的题号列表
}
export default Pagination2