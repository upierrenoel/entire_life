import React from 'react';
import {Link} from 'react-router';
import {PageSection} from 'components';
import styleImporter from 'helpers/styleImporter';

const styles = styleImporter();

export default () => {
  return (
    <PageSection type="light">
      <div className={`${styles.global.container} ${styles.global.row}`}>
        <div className={styles.global.col2}>
          <h5 className={styles.global.brand}>About</h5>
          <small>
            <Link to="/team">Team</Link><br/>
            {/* <a href="#">Press</a><br/> */}
            {/* <a href="#">Contact</a> */}
          </small>
        </div>
        <div className={styles.global.col2}>
          <h5 className={styles.global.brand}>Connect</h5>
          <small>
            <a href="https://www.instagram.com/yourentirelife/">Instagram</a><br/>
            <a href="https://twitter.com/yourentirelife">Twitter</a><br/>
            <a href="https://www.facebook.com/yourentirelife">Facebook</a><br/>
          </small>
        </div>
        <div className={styles.global.col8}>
          <h5 className={styles.global.brand}>Gratitude</h5>
          <small>
            Entire.Life thanks Tim Urban at&nbsp;
            <a href="http://waitbutwhy.com/2014/05/life-weeks.html">Wait But Why</a>,&nbsp;
            for inventing the idea of the life calendar, and&nbsp;
            <a href="http://brittanyforks.com/life/">Brittany Forks</a>, who
            first put emojis on one.
          </small>
        </div>
      </div>
    </PageSection>
  );
};
