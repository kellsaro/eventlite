import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'

import EventsList from './EventsList'
import EventForm from './EventForm'
import FormErrors from './FormErrors'
import validations from './util/validations'

class Eventlite extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      events: this.props.events,
      title: { value: '', valid: false },
      start_datetime: { value: '', valid: false },
      location: { value: '', valid: false },
      formErrors: {},
      formValid: false
    } 
    this.logo = React.createRef()
  }

  static formValidations = {
    title: [
      (value) => ( validations.checkMinLength(value, 3))
    ],
    start_datetime: [
      (value) => ( validations.checkMinLength(value, 1)),
      (value) => ( validations.timeShouldBeInTheFuture(value))
    ],
    location: [
      (value) => ( validations.checkMinLength(value, 1))
    ]
  }

  render = () => 
    <div>
      <h1 className='logo' ref={this.logo}>Eventlite</h1>
      <FormErrors formErrors={this.state.formErrors} />
      <EventForm
        handleSubmit={this.handleSubmit}
        handleInput={this.handleInput}
        title={this.state.title.value}
        start_datetime={this.state.start_datetime.value}
        location={this.state.location.value}
        formValid={this.state.formValid} />

      <EventsList events={this.state.events} />
    </div>

  handleInput = (e) => {
    e.preventDefault();

    const name = e.target.name
    const value = e.target.value
    const newState = {}
    newState[name] = { ...this.state[name], value: value }
    this.setState(newState, () => this.validateField(name, value, Eventlite.formValidations[name]))
  }

  validateField = (fieldName, fieldValue, fieldValidations) => {
    let fieldValid = true
    let errors = fieldValidations.reduce((errors, validation) => {
      let [valid, fieldError] = validation(fieldValue)
      if (!valid) {
        errors = errors.concat([fieldError])
      }
      return errors
    }, [])
    
    fieldValid = errors.length === 0

    const newState = { formErrors: {...this.state.formErrors, [fieldName]: errors }}
    newState[fieldName] = {...this.state[fieldName], valid: fieldValid }
    this.setState(newState, this.validateForm)
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let newEvent = {
      title: this.state.title.value,
      start_datetime: this.state.start_datetime.value,
      location: this.state.location.value
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

    this.setState({ events: events }, this.changeLogoColour);
  }
 
  addErrorMessages = (errorMessages) => {
    this.setState({ formErrors: errorMessages })
  }

  resetInputFields = () => this.setState({title: '', start_datetime: '', location: ''})

  resetFormErrors = () => this.setState({formErrors: {}})

  validateForm = () => {
    this.setState({ formValid: this.state.title.valid &&
                               this.state.location.valid &&
                               this.state.start_datetime.valid })
  }

  changeLogoColour = () => {
    const colors = ['red', 'blue', 'green', 'violet']
    this.logo.current.style.color = colors[Math.floor(Math.random() * colors.length)]
  }
}

Eventlite.propTypes = {
  events: PropTypes.array.isRequired
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('events_data');
  const data = JSON.parse(node.getAttribute('data'));

  ReactDOM.render(
    <Eventlite events={data} />,
    document.body.appendChild(document.createElement('div')),
  );
});
