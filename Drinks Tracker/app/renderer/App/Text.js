import React from "react";
import DB from "./DB.js";
import God from "./God.js";
import Field from "./Field.js";

///props: type: [property name], thing: [thing represented], class: [what css class]
class Text extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      active: false,//this.getHTML() == "",
      // target: null,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.doomed = false;
  }

  active(){
    return this.props.active != undefined ? this.props.active : this.state.active;
  }

  handleClick(e){
    // console.log("CLICK: " + this.props.type + " / " + this.props.frozen);
    if (this.props.frozen)
      return;
    this.setState({active: true});
    //e.preventDefault();
  }

  handleKeyPress(e){
    // this.setState({target:e.target});
    // if (!this.state.active)
    //   return;
    // console.log("KEY: " + e + " / " + e.key + " / " + e.shiftKey);
    if (e.key == 'Enter' && !e.shiftKey)
      this.handleEdit(e);
  }

  handleEdit(e){
    let type = this.props.type;// etype.indexOf(',') != -1 ? JSON.parse("["+etype+"]") : etype;
    let txt = God.CleanHTML(e.target.innerHTML);//e.target.innerText;
    if (txt == this.props.default || (!this.props.default && txt == "..."))
      txt = "";
    this.setState({active: false});
    if (txt == "*DELETE*" && this.props.doomable != false)
      this.doomed = true;
    // else 
    //   this.doomed = false;

    // console.log("HANDLE EDIT: " + this.doomed + " / " + JSON.stringify(this.props.type) + " / " + this.getHTML());

    if (this.doomed && this.props.type.length > 1){
      DB.UpdateElement([type[0],type[1]],null,this.props.thing)
    }
    else{
      DB.UpdateElement(type,txt,this.props.thing)
    }
      
    // console.log("HTML: [" + this.getHTML() + "] " + this.doomed);
    if (this.props.update)
    {
      // console.log("A")
      this.props.update(this.props.thing);
      // console.log("B")
    }
      
    // this.props.panel.Refresh();
  }

  componentDidMount(){
    // if (this.getHTML() == "" && !document.hasFocus())//&& Array.isArray(this.props.type)
    //   {
    //     // console.log("A: " + this.getHTML() + " / " + JSON.stringify(this.props));
    //     let act = document.getElementById("Active");
    //     if (act)
    //       act.focus();
    //   }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // console.log("CDU: " + this.state.active + " / " + prevState.active)
    if (((this.props.active && !prevProps.active) || (this.state.active && !prevState.active)) && !document.hasFocus()){
      let act = document.getElementById("Active");
      if (act)
        act.focus();
    }
    else if (this.props.active == undefined && !this.state.active && this.getHTML() == "" ) //&& Array.isArray(this.props.type)
      {
        // console.log("B: " + this.getHTML());
        this.setState({active:true});
      }
    // else if (!this.props.active && prevProps.active){
    //   this.handleEdit();
    // }
  }

  getHTML(){
    let r = "";
    if (!Array.isArray(this.props.type))
      r = this.props.thing[this.props.type];
    else{
      // let deb = "DEB: ";
      r = this.props.thing;
      for(let t of this.props.type)
        {
          r = r[t];
          // deb += t + " ";
          if (!r)
            {
              // deb += "<" + r + ">";
              // console.log(deb);
              break;
            }
        }
    }
    if (!r)
      r = "";
    // if (r == "" || !r){
    //   if (this.props.default)
    //     r = this.props.default;
    //   else //if (!Array.isArray(this.props.type))
    //     r = "...";
    // }
      
    return r;
  }

  render(){
    let html = this.getHTML();
    let cl = this.props.class;
    if (this.props.active != undefined)
      cl = cl + " Locked";
    if (html == "" || !html){
      if (this.props.default)
        html = this.props.default;
      else //if (!Array.isArray(this.props.type))
        html = "...";
    }
    
    if (this.doomed)
      return <span/>;
    let r = <span/>;
    if (this.active()){
      
      r = (
      <span  type={this.props.type}
      onBlur={e => this.handleEdit(e)} onClick={e=>{}} onChange={e => this.handleEdit(e)} id = 'Active' className={cl + " Active"} 
      contentEditable="true" suppressContentEditableWarning="true" onKeyPress={e=>this.handleKeyPress(e)}>
        {html}
      </span>);
    }
    else{
    
    // if (this.props.terse)
    //   html = God.RemoveBrackets(html);
    if(this.props.display) html = God.ModDisplay(html,this.props.display,this.props.thing);
    let elems = God.ParseText(html,true,this.props.terse,this.props.boldbrackets,this.props.thing);
    // if (this.props.hover)
    //   {
    //     elems.push(<span key={elems.length+"HT"} className='Hovertext'>{this.props.hover}</span>);
    //     // html += "<span class='Hovertext'>" + this.props.hover + "</span>";
    //     cl += " HoverHolder"
    //   }
    if (!this.props.terse) cl = "Text " + cl;
    r = (
    <span type={this.props.type}
      onContextMenu={e => this.handleClick(e)} className={cl} 
        >{elems}
        
      </span>);
    }
    
    if (this.props.title)
      r =  <Field title={this.props.title} bod={r} width={this.props.width} click={e=>this.handleClick(e)}/>;
      // God.MakeField(this.props.title,r,this.props.width,e => this.handleClick(e));
    return r;
  }//dangerouslySetInnerHTML={{__html:html}}
}

export default Text;