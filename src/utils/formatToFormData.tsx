export const formatToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] == null) return;

    formData.append(key, data[key]);
  });

  return formData;
};
