import {createValidator, required, inFormat} from 'utils/validation';
import emojiMap from 'react-emoji-picker/lib/emojiMap';

const emojiPattern = emojiMap.
  map(el => el.name[0].match(/([a-z]|[0-9])/) ? el.name : '\\' + el.name).
  join('|');

const eventValidation = createValidator({
  title: [required],
  emoji: [required, inFormat(new RegExp(`^:(${emojiPattern}):$`), 'Please select a symbol from the dropdown')],
  date: [required],
});
export default eventValidation;
