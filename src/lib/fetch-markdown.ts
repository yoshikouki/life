const baseURL = "https://raw.githubusercontent.com/yoshikouki/yoshikouki/main/";
const replaceRegExp = new RegExp(
  "https://github.com/yoshikouki/yoshikouki/tree/main/",
  "g"
);

export const fetchMarkdown = async (fileName = "") => {
  const path = fileName ? fileName + "/README.md" : "README.md";
  const res = await fetch(`${baseURL}${path}`);
  const rowMarkdown = await res.text();
  const markdown = rowMarkdown.replace(replaceRegExp, "./");
  return markdown;
};
