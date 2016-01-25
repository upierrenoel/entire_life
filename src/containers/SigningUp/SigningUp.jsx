import React, {Component, PropTypes} from 'react';
import DocumentMeta from 'react-document-meta';
import metaData from 'helpers/metaData';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {bindActionCreators} from 'redux';
import signingupValidation from './signingupValidation';
import {save} from 'redux/modules/auth';
import {PageSection, Logo, Nav, CheckboxPrivatePublic} from 'components';

@connect(
  state => ({
    currentUser: state.auth.user,
    saveError: state.auth.saveError,
    formKey: String(state.auth.user.id),
  }),
  dispatch => bindActionCreators({save}, dispatch)
)
@reduxForm({
  form: 'signing-up',
  fields: ['id', 'born', 'slug', 'is_private'],
  validate: signingupValidation,
},
state => ({
  initialValues: state.auth.user
}))
export default class SigningUp extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    formKey: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,
    saveError: PropTypes.object,
    currentUser: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  state = {
    changingSlug: false
  }

  changeSlug = (e) => {
    e.preventDefault();
    this.setState({changingSlug: true});
  }

  renderSlug = () => {
    const {fields: {slug}} = this.props;
    return (
      <div>
        {this.state.changingSlug
          ? <div>
              <p>
                <label htmlFor={slug.name}>Pick a URL</label>
                <input id={slug.name} autoFocus autoComplete="off" {...slug}/>
              </p>
              <p>
                Right now your link is "entire.life/{slug.value || slug.initialValue}" &ndash; is that cool?
              </p>
            </div>
          : <p><small><a href="#" onClick={this.changeSlug}>
              If you want, you can also change your URL
            </a></small></p>
        }
      </div>
    );
  }

  render() {
    const { currentUser, fields: {born, is_private}, formKey, handleSubmit, invalid,
      submitting, saveError: { [formKey]: saveError }, values } = this.props;
    const title = 'Almost There ⟡ Entire.Life';
    return (
      <form role="form"
        onSubmit={handleSubmit(() => {
          this.props.save(values).then(result => {
            if (result && typeof result.error === 'object') {
              return Promise.reject(result.error);
            }
            this.props.history.pushState(null, `/quiz`);
          });
        })}>
        <DocumentMeta {...metaData(title)} extend />
        <PageSection type="sunset-blocked" styleInner={{display: 'block'}} className="container">
          <Nav lower>
            <Logo type="black" style={{float: 'left'}}/>
            <h1 className="brand">Almost Done, {currentUser.name} !</h1>
          </Nav>
          <div style={{clear: 'both'}}>
            <p>
              <label htmlFor="born">When were you born? This will be the first date on your calendar!</label>
              <input type="date" {...born}/>
              {born.error && born.touched &&
                <label htmlFor={born.name} className="errorText">{born.error}</label>}
            </p>
            <CheckboxPrivatePublic {...is_private}/>
            {this.renderSlug()}
            <button type="submit" className="brand"
              disabled={invalid || submitting}>
              Looks good !
            </button>
            {saveError && <div className="errorText">{JSON.stringify(saveError)}</div>}
          </div>
        </PageSection>
      </form>
    );
  }
}
