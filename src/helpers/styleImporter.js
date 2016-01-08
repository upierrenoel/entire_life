import global from '../theme/global.scss';

export default (local) => {
  return {
    global: global,
    local: local,
    g: global,
    l: local,
  };
};
