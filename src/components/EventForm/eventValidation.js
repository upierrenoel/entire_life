import {createValidator, required, inFormat} from 'utils/validation';
import emojiMap from 'react-emoji-picker/lib/emojiMap';

const emojiPattern = Object.keys(emojiMap).reduce((acc, el) => acc + '|' + el);

const eventValidation = createValidator({
  title: [required],
  emoji: [required, inFormat(new RegExp(`^:${emojiPattern}:$`), 'Please select a symbol from the dropdown')],
  date: [required],
});
export default eventValidation;
