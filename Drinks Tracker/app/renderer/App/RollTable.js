import React from "react";
import Text from "./Text.js";
import Things from "./Things.js";
import Button from "./Button.js";
import DB from "./DB.js";
import Model from "./Model.js";
import Field from "./Field.js";
import ThingHolder from "./ThingHolder.js";
import TextList from "./TextList.js";
import God from "./God.js";


class RollTable extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      answer: null,
      terse: this.props.terse != undefined ? this.props.terse : true,
      flash: false,
      loaded: !this.props.link,
      thing: this.props.thing,
      hover:false,
    };
    this.Roll = this.Roll.bind(this);
    this.ToggleTerse = this.ToggleTerse.bind(this);
    this.MouseEnters = this.MouseEnters.bind(this);
    this.MouseLeaves = this.MouseLeaves.bind(this);
    this.Mounted = false;
    if (this.props.link){
      DB.GetOne('rpgtable',this.props.link,r=>{this.setState({thing: r,loaded:true});})
    }
      // DB.CallDB('get',{'db':'rpgtable','tag':this.props.link},r=>{this.setState({thing: r,loaded:true});})
  }

  componentDidMount(){
    this.Mounted = true;
    this.setState({flash: false})
  }

  componentWillUnmount(){
    this.Mounted = false;
  }

  MouseEnters(e){
    // console.log("HOVER ON!")
    this.setState({hover: true})
    if(this.props.hover)
      Model.MainScreen.SetHover(this.props.hover);
  }

  MouseLeaves(e){
    // console.log("HOVER OFF!")
    this.setState({hover: false})
    if(this.props.hover)
      Model.MainScreen.EndHover(this.props.hover);
  }

  setup(){
    if (this.props.link && !this.props.thing){
      this.setState({thing:null,loaded:false});
      DB.GetOne('rpgtable',this.props.link,r=>{this.setState({thing: r,loaded:true});})
      // DB.CallDB('get',{'db':'rpgtable','tag':this.props.link},r=>{this.setState({thing: r,loaded:true});})
    }
    else
      this.setState({thing:this.props.thing,loaded:true});
  }

  Roll(table, e){
    Things['rpgtable'].Roll(table,Things['tresult'].New(),r=>{
      // console.log("ANSWER: " + JSON.stringify(r))
      this.setState({answer: r, flash:true});
      if (this.props.extraEffect)
        this.props.extraEffect(r);
    },99);
    setTimeout(function() { 
      if (this.Mounted)
        this.setState({flash: false})
    }.bind(this), 250)
    // let opt = [];
    // for (let a of table.Entries)
    //   for (let n = 0;n < (a.Weight ? a.Weight : 1);n++)
    //     opt.push(a);
    // let roll = Math.floor(Math.random() * opt.length);
    // let answer = opt[roll];;s
    // if (answer.Table && safety > 0){
    //   substr += "[(" + (roll+1) + ") " + answer.Title + "]=>";
    //   safety--;
    //   DB.CallDB('get',{'db':'rpgtable','tag':answer.Table, 'tagtype':'Tag'},r=>{this.Roll(r,safety,substr)});
    // }
    // else
    //   this.setState({answer: substr + "(" + (roll+1) + ") " + answer.Title});
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if (prevProps.link != this.props.link || prevProps.thing != this.props.thing)
      this.setup();
    if (prevState.terse == this.state.terse && this.props.thing == prevProps.thing)
      {
        return;
      }
  }

  ToggleTerse(){
    console.log("TOGGLE TERSE: " + this.state.terse + " / " + !(this.state.terse));
    this.setState({terse: !(this.state.terse)});
  }

  render() {
    if (!this.state.thing)
      {
        return <Field title='...' bod='...'/>;
      }
    // let entries = [];
    // if (!this.state.terse){
    //   let n = 1;
    //   let nMax;
    //   // let nRaw = 0;
    //   for (let a of this.state.thing.Entries){
    //     if (!a.Subject)
    //       a.Subject = "tentry";
    //     let wei = parseInt(a.Weight);
    //     if (wei <=0) wei = 1;
    //     nMax = n + wei - 1;
    //     let num = n + (n != nMax ? "-" + nMax:"") + ") ";
    //     entries.push(<ThingHolder key={entries.length} thing={this.state.thing} type={a.Subject} prop={'Entries'} n={entries.length} terse={true} num={num}/>);
    //     // entries.push(Things[a.Subject].Describe(this.state.thing,nRaw,true,num));
    //     n = nMax + 1;
    //     // nRaw++;
    //   }
    //   entries.push(<Button key={'add'} act='add' thing={this.state.thing} type='tentry' prop='Entries' click={Model.MainScreen.UpdateFocus}/>);
    // }
    let flash = this.state.flash ? " Flasher" : "";
    if (!this.state.terse)
      flash = God.JoinClasses(flash,"RollTable")

    let rbbutton = null;
    if (!this.props.rightbar && (this.props.page || this.state.hover))
      rbbutton = <Button act='toRB' thing={this.state.thing}/>;
    let title = <div style={{display:"inline"}}><Text type='Tag' thing={this.state.thing} class={this.state.terse?"":"Title"} /> {rbbutton}</div>;
    let entries = this.state.terse ? null : <span>{God.FloatBreak()}<TextList key={this.state.thing.Tag} title='Results' thing={this.state.thing} type='tentry' prop='Entries' wCount={true}/></span>;
    let answer = this.state.answer ? Things[this.state.answer.Subject].Describe(this.state.answer) :["Click button to roll"];
    // if (this.state.answer) console.log("ANSW: " + this.state.answer.Subject + " / " + JSON.stringify(this.state.answer))
    // let ans = [];
    // if(answer.Title)
    //   for(let a of answer.Title){
    //     ans.push(God.ParseText(a));
    //   }
    // console.log("ANS NUM: " + ans.length + " / " + JSON.stringify(answer))
    let ansButt = this.state.answer && this.state.hover ? <Button act='toRB' thing={this.state.answer}/> : "";
    let bod = (<span>
        {!this.state.terse?<span><Text type='Text' thing={this.state.thing} /><br/><br/></span> : <span/>}
        <div className={flash}><span>{answer}</span>{ansButt}
        <span className="TableButton" onClick={e => {this.Roll(this.state.thing,e); e.stopPropagation();}}>Roll</span></div>
        {entries}
        
        {/* {entries} */}
    </span>);
    let button = <span className='FieldLink Icon' onClick={e=>{Model.MainScreen.UpdateFocus(Model.Get('rpgtable',this.props.link))}}>&#11111;</span>;

    // return null;
    if (this.props.page){
      return <div onMouseEnter={e=>{this.MouseEnters(e)}} onMouseLeave={e=>{this.MouseLeaves(e)}}>{title}<br/> {bod}</div>;
    }
    return <div onMouseEnter={e=>{this.MouseEnters(e)}} onMouseLeave={e=>{this.MouseLeaves(e)}}><Field onMouseEnter={e=>{this.MouseEnters(e)}} onMouseLeave={e=>{this.MouseLeaves(e)}} key={"RT " + title} title={title} hover={this.state.thing} bod={bod} button={button} onClick={e=>{this.ToggleTerse();e.stopPropagation();}}/></div>;

    // return (//onClick={this.ToggleTerse}
    //   <div className="RollTable" >
    //     <br/>
        
    //     {entries}
    //   </div>);
  }
}

export default RollTable;