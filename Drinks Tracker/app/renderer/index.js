import React from "react";
import Model from "./App/Model";
import MainScreen from "./App/MainScreen";
import God from "./App/God";

  class App extends React.Component {
      constructor(props) {
      super(props);
      this.state = {
        topBar: [],
        connected: false,
        
      };
      
    }
  
  componentDidMount() {
    this.Init();
  }

  async Init(){
    await Model.Init();
    this.setState({connected:true});
  }
  
  render() {
    // if (!this.state.connected)
    //   return null;
    
    return (
      <span >
        <MainScreen/>
      </span>
    );
  }
}

export default App;
