import React from 'react';
import Event from './Event';

const EventsList = props => (
  <div>
    {
      props.events.map((event) => (
        <Event key={event.id} event={event} />
      ))
    }
  </div>
);

export default EventsList;
