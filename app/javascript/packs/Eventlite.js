import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import EventsList from './EventsList';
import EventForm from './EventForm';
import FormErrors from './FormErrors';

class Eventlite extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      events: this.props.events,
      title: '',
      start_datetime: '',
      location: '',
      formErrors: {}
    };
  }

  render() {
    return (
      <div>
        <FormErrors formErrors={this.state.formErrors} />
        <EventForm
          handleSubmit={this.handleSubmit}
          handleInput={this.handleInput}
          title={this.state.title}
          start_datetime={this.state.start_datetime}
          location={this.state.location} />

        <EventsList events={this.state.events} />
      </div>
    )
  }

  handleInput = (e) => {
    e.preventDefault();

    const name = e.target.name;
    const newState = {};
    newState[name] = e.target.value;
    this.setState(newState);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let newEvent = {
      title: this.state.title,
      start_datetime: this.state.start_datetime,
      location: this.state.location
    };

    axios({
      method: 'POST',
      url: '/events',
      data: { event: newEvent },
      headers: {
        'X-CSRF-Token': document.querySelector("meta[name=csrf-token]").content
      }
    })
    .then(response => {
      this.addNewEvent(response.data)
      this.resetInputFields()
      this.resetFormErrors()
    })
    .catch(error => {
      this.addErrorMessages(error.response.data)
    })
  }

  addNewEvent = (event) => {
    const events = [event, ...this.state.events].sort((a, b) => (
      new Date(b.start_datetime) - new Date(a.start_datetime)
    ));

    this.setState({ events: events });
  }
 
  addErrorMessages = (errorMessages) => {
    this.setState({ formErrors: errorMessages });
  }

  resetInputFields = () => this.setState({title: '', start_datetime: '', location: ''})

  resetFormErrors = () => this.setState({formErrors: {}})
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('events_data');
  const data = JSON.parse(node.getAttribute('data'));

  ReactDOM.render(
    <Eventlite events={data} />,
    document.body.appendChild(document.createElement('div')),
  );
});
