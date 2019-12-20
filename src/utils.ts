export const getBase64 = (file: File): Promise<string> => {
  const reader = new FileReader();

  return new Promise(resolve => {
    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.readAsDataURL(file);
  });
};
