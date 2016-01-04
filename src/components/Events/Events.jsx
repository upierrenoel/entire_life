import React, {PropTypes} from 'react';
import {Event} from 'components';
import {startOf, endOf} from 'helpers/dateHelpers';

const eventsOrPlans = ({weekno, born}) => {
  const now = new Date();
  const start = startOf({weekno, born});
  const end = endOf({weekno, born});

  if (end < now) return 'recorded events';
  else if (start > now) return 'plans';
  return 'events or plans';
};

const renderEvents = ({events, slug, weekno, authed, onEdit}) => {
  return (
    events.map(event => <Event
      key={event.date + event.id + event.title}
      slug={slug}
      weekno={weekno}
      event={event}
      authed={authed}
      onEdit={onEdit ? onEdit.bind(this, event) : null}
      />
    )
  );
};

const Events = ({events, slug, born, weekno, authed, onEdit}) => {
  return (
    <ol className="events">
      {!events ? `No ${eventsOrPlans({weekno, born})}` : renderEvents({events, slug, weekno, authed, onEdit})}
    </ol>
  );
};

Events.propTypes = {
  events: PropTypes.array,
  slug: PropTypes.string.isRequired,
  born: PropTypes.string.isRequired,
  weekno: PropTypes.number.isRequired,
  authed: PropTypes.bool.isRequired,
  onEdit: PropTypes.func,
};

export default Events;
