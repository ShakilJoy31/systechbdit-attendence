export const removeFalsyProperties = <T extends Record<string, unknown>>(
  selectedObject: T,
  propertiesName: Array<keyof T>
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(selectedObject).filter(([key, value]) => {
      return (
        !propertiesName.includes(key as keyof T) ||
        (value !== "" && value !== 0 && value !== null)
      );
    })
  ) as Partial<T>;
};