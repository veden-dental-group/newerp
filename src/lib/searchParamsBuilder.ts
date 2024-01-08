export const searchParamsBuilder = (params: { [key: string]: any }) => {
  const queryParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    const value = params[key as keyof typeof params];
    if (value) queryParams.append(key, value.toString());
  });

  return queryParams.toString();
};
