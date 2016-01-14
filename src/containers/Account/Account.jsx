import React, {Component, PropTypes} from 'react';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import accountValidation from './accountValidation';
import {save, destroy} from 'redux/modules/auth';
import {PageSection, Logo, Nav, CheckboxPrivatePublic} from 'components';
import styleImporter from 'helpers/styleImporter';
const styles = styleImporter();

@connect(
  state => ({
    currentUser: state.auth.user,
    saveError: state.auth.saveError,
    formKey: String(state.auth.user.id),
  }),
  dispatch => bindActionCreators({save}, dispatch)
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
      pristine, submitting, saveError: {[formKey]: saveError}, values, currentUser } = this.props;
    const title = 'Edit Account ⟡ Entire.Life';
    return (
      <div>
        <form role="form"
          onSubmit={handleSubmit(() => {
            this.props.save(values).then(result => {
              if (result && typeof result.error === 'object') {
                return Promise.reject(result.error);
              }});
          })}>
          <DocumentMeta {...metaData(title)} extend />
          <PageSection type="sunset-blocked" style={{paddingBottom: '3em'}} styleInner={{display: 'block'}} className={styles.g.container}>
            <Nav lower>
              <Logo type="black" style={{float: 'left'}}/>
              <h1 className={styles.g.brand}>Edit Account</h1>
            </Nav>
            <div style={{clear: 'both'}}>
              <p>
                <label htmlFor={slug.name}>Username (entire.life/{slug.value || slug.initialValue})</label>
                <input type="text" id={slug.name} {...slug} autoFocus/>
                {slug.error && slug.touched &&
                  <label htmlFor={slug.name} className={styles.g.errorText}>{slug.error}</label>}
              </p>
              <p>
                <label htmlFor="name">Name</label>
                <input type="text" {...name}/>
                {name.error && name.touched &&
                  <label htmlFor={name.name} className={styles.g.errorText}>{name.error}</label>}
              </p>
              <p>
                <label htmlFor="born">Birth Date</label>
                <input type="date" {...born}/>
                {born.error && born.touched &&
                  <label htmlFor={born.name} className={styles.g.errorText}>{born.error}</label>}
              </p>
              <CheckboxPrivatePublic {...is_private}/>
              <button type="submit" className={styles.g.brand}
                disabled={pristine || invalid || submitting}>
                {pristine ? 'Saved' : 'Save Changes'}
              </button>
              {saveError && <div className={styles.g.errorText}>{saveError}</div>}
            </div>
          </PageSection>
        </form>
        <PageSection type="dark" className={styles.g.container}>
          <h1 className={styles.g.brand}>Danger Zone</h1>
          <p>
            <button className={styles.g.error}
              onClick={() => this.props.dispatch(destroy(currentUser))}>
              Delete Account
            </button>
          </p>
          <p>
            Clicking this button will completely and immediately delete your
            Entire.Life account and all of its data.
          </p>
        </PageSection>
      </div>
    );
  }
}
