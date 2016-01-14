import React, {PropTypes} from 'react';
import {Event} from 'components';
import {startOf, endOf} from 'helpers/dateHelpers';

const styles = require('./Events.scss');

const eventsOrPlans = ({weekno, born}) => {
  const now = new Date();
  const start = startOf({weekno, born});
  const end = endOf({weekno, born});

  if (end < now) return 'recorded events';
  else if (start > now) return 'plans';
  return 'events or plans';
};

const renderEvents = ({events, slug, weekno, canEdit, editEventId}) => {
  return (
    events.map(event => <Event
      key={event.date + event.id + event.title}
      slug={slug}
      weekno={weekno}
      event={event}
      canEdit={canEdit}
      editEventId={editEventId}
      />
    )
  );
};

const Events = ({events, slug, born, weekno, canEdit, editEventId}) => {
  return (
    <ol className={styles.events}>
      {!events ? `No ${eventsOrPlans({weekno, born})}` : renderEvents({events, slug, weekno, canEdit, editEventId})}
    </ol>
  );
};

Events.propTypes = {
  events: PropTypes.array,
  slug: PropTypes.string.isRequired,
  born: PropTypes.string.isRequired,
  weekno: PropTypes.number.isRequired,
  canEdit: PropTypes.bool.isRequired,
  editEventId: PropTypes.string,
};

export default Events;
