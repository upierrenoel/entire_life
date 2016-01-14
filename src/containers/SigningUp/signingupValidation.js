import {createValidator, required, inFormat} from 'utils/validation';

const signingupValidation = createValidator({
  slug: [required],
  born: [required, inFormat(/^\d{4}-[01][0-9]-[0-3][0-9]$/, 'Expected date to have format YYYY-MM-DD')],
});
export default signingupValidation;
