import React from 'react';
import Event from './Event';

const EventsList = props => (
  <div>
    {
      props.events.map((event, i) => (
        <Event key={i} event={event} />
      ))
    }
  </div>
);

export default EventsList;
