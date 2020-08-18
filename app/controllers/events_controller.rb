class EventsController < ApplicationController
  def index
    @events = [
      {
        title: 'London Retail Expo',
        datetime: 'Monday 21 Oct, 2019',
        location: 'London Excel Centre'
      },
      {
        title: 'Enterprise Sales Training Workshop',
        datetime: 'Tuesday 22 Oct, 2019',
        location: 'Expert Sales Company Headquarters'
      },
      {
        title: 'Ruby Hack Night',
        datetime: 'Friday 25 Oct, 2019',
        location: 'Learnetto Headquarters'
      },
      {
        title: 'Beginners Salsa dance meetup',
        datetime: 'SAturday 26 Oct, 2019',
        location: 'Bar Salsa'
      }
    ]
  end
end
