import React, {PropTypes} from 'react';

const styles = require('./CheckboxPrivatePublic.scss');

const isPrivate = (value, defaultValue) => {
  if (typeof value === 'undefined') return defaultValue;
  return value;
};

const Checkbox = (props) => {
  return (
    <p>
      <span className={styles.checkbox}>
        <input type="checkbox" id={props.name} {...props}/>
        <label htmlFor="is_private"/>
      </span>
      &nbsp;Make my birthdate (and entire calendar)
      &nbsp;{isPrivate(props.value, props.defaultValue) ? 'private' : 'public'}<br/>
      <small>
        A private life calendar is an awesome way to remember and plan
        your life. A public life calendar can be that, plus a great way
        to show other people who you are and foster more empathy in the
        world. Maybe. It's up to you.
      </small>
    </p>
  );
};

Checkbox.propTypes = {
  name: PropTypes.string,
  value: PropTypes.bool,
  defaultValue: PropTypes.bool,
};

export default Checkbox;
