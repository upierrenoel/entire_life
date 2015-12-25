import global from '../theme/picnicss-with-overrides.scss';

export default (local) => {
  return {
    global: global,
    local: local,
  };
};
