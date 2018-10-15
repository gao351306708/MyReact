/**
 * Created by gaoju on 2018/7/2.
 */
import React, { Cmponent } from 'react'
import './style.css'
import ShowMask from '../showMask'
import {Button} from 'antd'

class DialogMask extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            position:props.position || [],
            id:props.id || ''
        }
    }
    componentDidMount(){
        let dom = $('#Dialog-content'+this.state.id);
        let position = this.state.position;
        let nowpositionL = dom.css('margin-left');
        let nowpositionT = dom.css('margin-top');
        if(position.length>0){
            nowpositionL = Number(nowpositionL.replace(/px/,''));
            nowpositionT = Number(nowpositionT.replace(/px/,''));
            console.log("DialogMask-----new------<>>>>><<<<>>>>>>",position,nowpositionL,nowpositionT)
            dom.css('margin-left',(position[0]+nowpositionL) + 'px');
            dom.css('margin-top',(position[1]+nowpositionT) + 'px');
        }
    }
    render() {
        let {title,children,closeDialog} = this.props;
        return (
            <div>
                <ShowMask></ShowMask>
                <div className="Dialog-content" id={"Dialog-content"+this.state.id}>
                    <header>
                        <h3>{title}</h3>
                        <Button className="exit" onClick={closeDialog}>关闭</Button>
                    </header>
                    <section>
                        {children}
                    </section>
                </div>
            </div>
        );
    }
}

export default DialogMask