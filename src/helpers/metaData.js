export default (title, description) => {
  const metaData = {meta: {property: {}}};

  if (title) {
    metaData.title = title;
    metaData.meta.property['og:title'] = title;
    metaData.meta.property['twitter:title'] = title;
  }

  if (description) {
    metaData.description = description;
    metaData.meta.property['og:description'] = description;
    metaData.meta.property['twitter:description'] = description;
  }

  return metaData;
};
