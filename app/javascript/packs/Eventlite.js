import React from 'react';
import ReactDOM from 'react-dom';
import EventsList from './EventsList';
import EventForm from './EventForm';

class Eventlite extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      events: this.props.events
    };
  }

  render() {
    return ( 
      <div>
        <EventForm handleNewEvent={this.handleNewEvent} />
        <EventsList events={this.state.events} />
      </div>
    )
  }

  handleNewEvent = (event) => {
    const events = [event, ...this.state.events].sort((a, b) => (
      new Date(b.start_datetime) - new Date(a.start_datetime)
    ));

    this.setState({ events: events});
  } 
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('events_data');
  const data = JSON.parse(node.getAttribute('data'));

  ReactDOM.render(
    <Eventlite events={data} />,
    document.body.appendChild(document.createElement('div')),
  );
});
