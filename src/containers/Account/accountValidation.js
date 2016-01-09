import {createValidator, required, inFormat} from 'utils/validation';

const accountValidation = createValidator({
  slug: [required],
  name: [required],
  born: [required, inFormat(/^\d{4}-[01][0-9]-[0-3][0-9]$/, 'Expected date to have format YYYY-MM-DD')],
});
export default accountValidation;
