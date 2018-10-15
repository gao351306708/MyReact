/**
 * Created by gaoju on 2017/12/11.
 */
import React, { Component } from 'react'
import './style.css'

class Form extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            data:{
                title:["反比例函数","反比例函数的图象和性质","函数图象上点的坐标特征"]
            }
        }
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        console.log("submit")
        this.props.handleMask();
    }
    render() {
        let data = this.state.data.title;
        console.log(data)
        return (
            <div className="form1">
                <form onSubmit={this.handleSubmit}>
                    <div className="practice">
                        <div className="title">
                            <div><b>{data[0]}</b></div>
                            <div>一般的，形如y＝ （k为常数，k ≠0）的函数称为反比例函数。其中x是自变量，y是函数，自变量x的取值范围是___0的一切实数。</div>
                        </div>
                        <div className="example">
                            <ul>
                                <li><b>举例</b></li>
                                <li>
                                    <p>① 下列函数中，是反比例函数的是（   ）</p>
                                    <p style={{marginLeft: "10px"}}>
                                        <label><input type="radio" name="num1" />A、y=-x/2</label>
                                        <label><input type="radio" name="num1" />B、y=1/3x</label>
                                        <label><input type="radio" name="num1" />C、y=2x-1</label>
                                        <label><input type="radio" name="num1" />D、y=(x+2)/x</label>
                                    </p>
                                </li>
                                <li>
                                    <p>② 若函数y = x2m+1为反比例函数，则m的值是（   ）</p>
                                    <p style={{marginLeft: "10px"}}>
                                        <label><input type="radio" name="num1_1" />A、1</label>
                                        <label><input type="radio" name="num1_1" />B、0</label>
                                        <label><input type="radio" name="num1_1" />C、-1</label>
                                        <label><input type="radio" name="num1_1" />D、2</label>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="practice">
                        <div className="title">
                            <div><b>{data[1]}</b></div>
                            <div>
                                <p>反比例函数y＝ （k为常数，k ≠0）的图象是双曲线。</p>
                                <p>当k > 0时，反比例函数图象经过一、三象限，是减函数；当k___0时，反比例函数图象经过二、四象限，是增函数。结合对称性可知，反比例函数图象既是轴对称图形又是中心对称图形。有两条对称轴：直线y = x和 y =－x；对称中心是原点。</p>
                                <p>可列表如下：</p>
                                <p><img src="public/images/img/112.png"/></p>
                                <p>观察函数图象，可知 |k| 的几何意义：表示反比例函数图象上的点向两坐标轴所作的垂线段与两坐标轴围成的矩形的面积。</p>
                            </div>
                        </div>
                        <div className="example">
                            <ul>
                                <li><b>举例</b></li>
                                <li>
                                    <p>①如果反比例函数图象经过点M（-2，-1），那么此反比例函数解析式为（　　）</p>
                                    <p><img src="public/images/img/111.png"/></p>
                                    <p style={{marginLeft: "10px"}}>
                                        <label><input type="radio" name="num2" />A、y=-x/2</label>
                                        <label><input type="radio" name="num2" />B、y=(1/2)*x</label>
                                        <label><input type="radio" name="num2" />C、y=-2/x</label>
                                        <label><input type="radio" name="num2" />D、y=2/x</label>
                                    </p>
                                </li>
                                <li>
                                    <p>② 若函数y = x2m+1为反比例函数，则m的值是（   ）</p>
                                    <p style={{marginLeft: "10px"}}>
                                        <label><input type="radio" name="num2_2" />A、<img src="public/images/img/111.png"/></label>
                                        <label><input type="radio" name="num2_2" />B、<img src="public/images/img/111.png"/></label>
                                        <label><input type="radio" name="num2_2" />C、<img src="public/images/img/111.png"/></label>
                                        <label><input type="radio" name="num2_2" />D、<img src="public/images/img/111.png"/></label>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="practice">
                        <div className="title">
                            <div><b>{data[3]}</b></div>
                            <div>
                                <p>一般的，对于一个函数，如果把自变量与函数的每对对应值分别作为点的横、纵坐标，那么坐标平面内由这些点组成的图形，就是这个函数的图象。</p>
                                <p>在坐标平面内，满足函数关系式的有序实数对所对应的点，一定在这个函数的图象上；反之，函数图象上的点的坐标，一定满足这个函数的关系式。</p>
                            </div>
                        </div>
                        <div className="example">
                            <ul>
                                <li><b>举例</b></li>
                                <li>
                                    <p>① 下面哪个点不在函数y = -2x+3的图象上（   ）</p>
                                    <p><img src="public/images/img/111.png"/></p>
                                    <p style={{marginLeft: "10px"}}>
                                        <label><input type="radio" name="num3" />A、（-5，13）</label>
                                        <label><input type="radio" name="num3" />B、（-1，5）</label>
                                        <label><input type="radio" name="num3" />C、（3，0）</label>
                                        <label><input type="radio" name="num3" />D、（1，1）</label>
                                    </p>
                                </li>
                                <li>
                                    <p>② 若反比例函数y = 的图象经过点（-2，m），则m 的值是（    ）</p>
                                    <p style={{marginLeft: "10px"}}>
                                        <label><input type="radio" name="num3_3" />A、1/4</label>
                                        <label><input type="radio" name="num3_3" />B、-1/4</label>
                                        <label><input type="radio" name="num3_3" />C、-4</label>
                                        <label><input type="radio" name="num3_3" />D、4</label>
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <button type="submit" className="btn btn-primary submit_btn">提交</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Form