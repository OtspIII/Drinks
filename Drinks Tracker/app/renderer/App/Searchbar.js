import React from "react";
import God from "./God.js";
import Model from "./Model.js";
import Autocomplete from "react-autocomplete";


class Searchbar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',
      things: [],
      thingDict: {},
      call:true,
      active:false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.Setup = this.Setup.bind(this);
    God.Searchbar = this;
  }

  active(){
    return true;//this.props.active != undefined ? this.props.active : this.state.active;
  }
  Setup(){
    this.setThings(Model.DrinkNames);
    // console.log("SETUP: " + Model.DrinkNames)
  }

  setThings(things){
    this.setState({things: things});
    let dict = {};
    for (let t of things)
    {
      dict[t] = t;
    }
    this.setState({thingDict: dict});
  }

  handleChange(v){//When you type
    this.setState({value:v});
  }

  handleSelect(v,i){//When you pick an option
    this.setState({value:'', active:false});
    if (this.state.thingDict[v]){
      let thing = this.state.thingDict[v];
      God.TableDisplay.SetTable(thing);
    
    }
  }

  filterRender(i,v){
    if (this.state.value.length < 1) return false;
    let name = i;
    let r = name ? name.toLowerCase().indexOf(v.toString().toLowerCase()) : -1;
    
    return r != -1;
  }

  handleClick(e){
    if (this.props.active == undefined)
      this.setState({active:true})
    console.log("HAND CLICK");
    e.preventDefault();
  }

  

  render(){
    let cl = this.props.class;
    let r = <span/>;
    let link = <span/>;
    let hover = null;
    if (this.active()){
      let style = {
        borderRadius: '2px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '5px',
        fontSize: '90%',
        border: 'solid black',
        position: 'fixed',
        overflow: 'auto',
        maxHeight: '50%',
        'zIndex': '5',
      }
      r = <div className="Searchbar"><Autocomplete getItemValue={(i)=>i} items={this.state.things}
        renderItem={(i, isHighlighted) => {
          return (<div key={i} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            <div onMouseEnter={e=>{}}
              onMouseLeave={e=>{}}>{i}</div>
          </div>)}
        }
        value={""+this.state.value} menuStyle={style}
        onChange={(e) => {this.handleChange(e.target.value);}}
        selectOnBlur={false}
        onMenuVisibilityChange={r=>{if (!r) this.setState({active:false})}}
        onSelect={(val,item,x) => {this.handleSelect(val,item);}}
        shouldItemRender={(i,v)=>this.filterRender(i,v)}
        renderInput={ function(props) {
            return <input  id = 'Active' className={cl + ' Picker'}  {...props} />
          }
        }
      /></div>
    }
    return r;
  }
}

export default Searchbar;