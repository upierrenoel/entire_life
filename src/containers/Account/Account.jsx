import React, {Component, PropTypes} from 'react';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import accountValidation from './accountValidation';
import * as userActions from 'redux/modules/users';
import {PageSection, Logo, Nav, CheckboxPrivatePublic} from 'components';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter();

@connect(
  state => ({
    currentUser: state.auth.user,
    saveError: state.users.saveError,
    formKey: String(state.auth.user.id),
  }),
  dispatch => bindActionCreators(userActions, dispatch)
)
@reduxForm({
  form: 'account',
  fields: ['id', 'slug', 'name', 'born', 'is_private'],
  validate: accountValidation,
},
state => ({
  initialValues: state.auth.user
}))
export default class Account extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    formKey: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
    saveError: PropTypes.object,
    currentUser: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
  }

  render() {
    const { fields: {slug, name, born, is_private}, formKey, handleSubmit, invalid,
      pristine, save, submitting, saveError: { [formKey]: saveError }, values } = this.props;
    const title = 'Edit Account ⟡ Entire.Life';
    return (
      <form role="form"
        onSubmit={handleSubmit(() => {
          save(values).then(result => {
            if (result && typeof result.error === 'object') {
              return Promise.reject(result.error);
            }});
        })}>
        <DocumentMeta {...metaData(title)} extend />
        <PageSection type="sunset-blocked" styleInner={{display: 'block'}} className={styles.g.container}>
          <Nav lower>
            <Logo type="black" style={{float: 'left'}}/>
            <h1 className={styles.g.brand}>Edit Account</h1>
          </Nav>
          <div style={{clear: 'both', marginBottom: '3em'}}>
            <p>
              <label htmlFor="slug">Username (entire.life/{slug.value || slug.initialValue})</label>
              <input type="text" {...slug} autoFocus/>
            </p>
            <p>
              <label htmlFor="name">Name</label>
              <input type="text" {...name}/>
            </p>
            <p>
              <label htmlFor="born">Birth Date</label>
              <input type="date" {...born}/>
            </p>
            <CheckboxPrivatePublic {...is_private}/>
            <button type="submit" className={styles.g.brand}
              disabled={pristine || invalid || submitting}>
              Save Changes
            </button>
            {saveError && <div className={styles.g.error}>{saveError}</div>}
          </div>
        </PageSection>
      </form>
    );
  }
}
