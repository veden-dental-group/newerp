export const searchParamsParser = (url: URL, fields: string[]) => {
  const searchParams: { [key: string]: string | null } = {};

  fields.map((field) => {
    searchParams[field] = url.searchParams.get(field);
  });

  return searchParams;
};
