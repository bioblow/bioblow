import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import Error                from 'material-ui/svg-icons/alert/error';

class BiteLog extends Component {
  constructor(props){
    super(props);
    this.props = props;
  }

  render() {
    return (
       <List>
        {this.props.bites.map(bite => (
         <ListItem
           primaryText="Bite detected"
           secondaryText={bite.time.toTimeString()}
           leftIcon={<Error/>}
         />
        ))} 
       </List>
    );
  }
}

export default BiteLog;
