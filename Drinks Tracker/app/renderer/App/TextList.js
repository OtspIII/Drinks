import React from "react";
// import DB from "./DB.js";
import God from "./God.js";
import Text from "./Text.js";
import Things from "./Things.js";
import Button from "./Button.js";
import Model from "./Model.js";
import Field from "./Field.js";
import ThingHolder from "./ThingHolder.js"; 

//thing: the thing, prop: the property, type: the subject (if not text), terse: terse, class: class override, if any
//seed: what an Add Button's seed should be, break: line breaks (default true if non-terse), button: sets button (default true if non-terse)
class TextList extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    let thing = this.props.thing;
    let props = thing[this.props.prop];
    let breaks = this.props.breaks != undefined ? this.props.breaks : !this.props.terse ;
    let addbutton = this.props.button != undefined ? this.props.button : !this.props.terse;

    let r = [];
    if (!props)
      props = [];
    let n = 0;
    let nMax = 1;
    let nMin = 1;
    for(let f of props){
      
      if (r.length > 0 && !this.props.bullets){
        // if (breaks && !thing.doomed)
        //   r.push(<br key={r.length + "br"}/>);
        // else
        // console.log("TL: " + this.props.title + " / " + breaks);
        if (!breaks) 
          r.push(<span  key={r.length + "comma"}>{', '}</span>);
      }
      
      let num = 0;
      if (this.props.wCount){
        let wei = parseInt(f.Weight);
        if (wei <=0) wei = 1;
        nMax = nMin + wei - 1;
        num = nMin + (nMin != nMax ? "-" + nMax:"") + ") ";
        nMin = nMax + 1;
      }
      // console.log("F: " + JSON.stringify(f))
      // if (typeof f == 'string'){
      //   r.push(<Text key={n+'str'} type={[this.props.prop,n]} thing={thing} class={this.props.class}/>);
      // }
      // else{
      //   if (!f.Subject)
      //     f.Subject = this.props.type;
      //   if (Things[f.Subject].Describe)
      //     r.push(Things[f.Subject].Describe(thing,n,this.props.terse));
      //   else
      //     console.log("NO Describe FOR " + f.Subject);
      // }
      // console.log("BREAKS TEXTLIST: " + breaks)
      let line = <ThingHolder breaks={breaks} key={n+'thold'+r.length} thing={thing} type={this.props.type} prop={this.props.prop} n={n} terse={this.props.terse} class={this.props.class} num={num}/>;
      if (this.props.bullets)
        line = <li key={r.length+"li"} className="BulletList">{line}</li>
      r.push(line); 
      n++;
    }
    // console.log("R: " + r.length + " / " + r)
    if (r.length == 0 && !this.props.terse)
      r.push(<span key={'noner'+r.length}>-none-</span>)
    let button = addbutton ? <Button key={r.length + "butt"} act='add' thing={thing} type={this.props.type} prop={this.props.prop} seed={this.props.seed} click={Model.MainScreen.UpdateFocus} class='FieldButton'/> : <span/>;
    // if (button){
    //   r.push(<span key={r.length + "spc"}>{' '}</span>);
    //   r.push(<Button key={r.length + "butt"} act='add' thing={thing} type={this.props.type} prop={this.props.prop} seed={this.props.seed} click={Model.MainScreen.UpdateFocus}/>);
    // }
    if (this.props.bullets)
      r = <ul>{r}</ul>
    if (this.props.title)
      r = <Field thing={thing} title={this.props.title} width={this.props.width} bod={r} click={this.props.click} button={button}/>
      // r = God.MakeField(this.props.title,r,this.props.width,this.props.click,button);
      // return <div key={"TI"} className="Field"><span className="FieldTitle">{this.props.title}</span><br/><span className="FieldText">{r}</span></div>;
    return <span key={'TextList ' + this.props.prop}>{r}</span>;
  }

}

export default TextList;