/**
 * Created by gaoju on 2018/1/10.
 */
import React, { Component } from 'react'
import echarts from 'echarts'
import './style.css'

export default class echart extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        this.loadChart()
    }
    loadChart() {
        console.log("loadChart")
        console.log(this.chart)
        this.chartObj = echarts.init(this.chart)
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: 值{c} ({d}%)',//tooltip显示格式。自定义
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['三角函数', '勾股定理', '垂直定理', '反比例函数', '正比例函数']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold',
                            },
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false,
                        },
                    },
                    data: [
                        { value: 335, name: '三角函数' },
                        { value: 310, name: '勾股定理' },
                        { value: 234, name: '垂直定理' },
                        { value: 135, name: '反比例函数' },
                        { value: 1548, name: '正比例函数' },
                    ],
                },
            ],
        };
        this.chartObj.setOption(option)
    }
    render() {
        return (
           <div className="echartMain">
               <div className="page padding20">知识点掌握情况：
                   <div className="page" ref={(c) => this.chart = c}></div>
               </div>
           </div>
        )
    }
}
