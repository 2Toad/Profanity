/**
 * Escapes all Regular Expression characters in a string
 * @param text the string to escape
 * @returns an escaped string
 */
export const escapeRegExp = (text: string) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
