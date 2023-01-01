// import React from "react";
// import DB from "./DB.js";
// import Things from "./Things.js";
// import Button from "./Button.js";
// import God from "./God.js";
// import Model from "./Model.js";
// import { useHistory } from "react-router-dom";

// class ThingList extends React.Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       things: [],
//       call:true
//     };
//     this.mounted = false;
//     // console.log('TL: ' + this.props.)
//   }

//   componentDidMount(){
//     this.mounted = true;
//     this.load();
//   }

//   componentDidUpdate(prevProps, prevState, snapshot){
//     this.mounted = true;
//     if (this.state.call || prevProps.filters != this.props.filters || prevProps.subject != this.props.subject){
//       this.load();
//     }
//   }

//   load(){
//     this.setState({call:false});
//     // let filters = {'subject':this.props.subject};
//     // for(let f in this.props.filters)
//     //   {
//     //     filters[f] = this.props.filters[f];
//     //   }
//     // console.log("LIST UPD: " + this.props.subject + " / " + JSON.stringify(this.props.filters));
//     //DB.CallDB('getall',filters,r=>
    
//     DB.GetAll(this.props.subject,this.props.filters,r=>{ if (this.mounted) {
//       // console.log("FILTERS: " + JSON.stringify(this.props.filters) + " / " + r.length);
//       if (Things[this.props.subject].TableSort)
//         r = Things[this.props.subject].TableSort(r);
//       else
//         r = r.sort((a,b) => (a.Tag > b.Tag) ? 1 : -1)
//       this.setState({things: r});
//     }})
//   }

//   componentWillUnmount(){ 
//     this.setState({call:true})
//     this.mounted = false;
//   }
  
//   render(){
//     let r = [];
//     let n = 0;
//     for(let th of this.state.things)
//     {
//       let t = th;
//       if (!t.Subject)
//         t.Subject = this.props.subject;
      
//       if (Things[t.Subject].DrawList)
//         r.push(Things[t.Subject].DrawList(t,n))
//       else
//       {
//         // let comma = t.Description.indexOf(',');
//         // if (comma == -1) comma = t.Description.length;
//         // let desc = t.Description.substring(0,comma);
//         // r.push(<div key={'x'+n}>{t.Name ? t.Name : t.Tag}: {desc}</div>)
//         r.push(<div key={'x'+n+t.Tag}>{t.Name ? t.Name : t.Tag}: {t.Desc}</div>)
//       }
//       r.push(<br key={'r' + n} />);
//       n++;
//     }
//     let add = <span/>;
//     if (Things[this.props.subject].AddList && !this.props.optional)
//       add = <Button act='create' type={this.props.subject} thing={this.props.thing} click={Model.MainScreen.UpdateFocus} clickR={this.props.thing}/>;
//     if (this.props.optional && r.length == 0)
//       return <div></div>;
//     let title = this.props.title ? <div><u>{this.props.title}</u></div> :null;
//       r = (
//       <div key={"ThingList " + this.props.subject+n} >{title}
//         {r}{add}
//       </div>
//     );
//     // if (this.props.title)
//     //   r = God.MakeField(this.props.title,r,1,r=>{},add);
//     return r;
//   }
// }



// export default ThingList;