/**
 * 优化渲染，用immutable来做深度比较state有没有发生变化，从而判断是否render
 * Created by gaoju on 2017/12/6.
 */
import React from 'react'
import Immutable from 'immutable'

export default {
    deepCompare: (self, nextProps, nextState) => {
        return !Immutable.is(self.props, nextProps) || !Immutable.is(self.state, nextState)
    },
    loadDetection: (reducers=[])=> {
        for (let ren of reducers) {
            if (!ren.get('preload')) return (<div />)
        }
    },
    Compare:(reducers=[])=>{
        let result=true;
        for (let ren of reducers) {
            if (!ren.get('preload'))
                result=false;
        }
        //if(!result) return result
        return result
    }
}
