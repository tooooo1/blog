import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Scribble {
  date: string;
  formattedDate: string;
  title: string;
  description?: string;
  content: string;
  image?: string;
}

export const getScribbles = () => {
  const scribbleDirectory = path.join(process.cwd(), "src", "scribbles");

  if (!fs.existsSync(scribbleDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(scribbleDirectory);
  const mdxFiles = fileNames.filter((fileName) => fileName.endsWith(".mdx"));

  const scribbles = mdxFiles.map((fileName) => {
    const filePath = path.join(scribbleDirectory, fileName);

    const fileContents = fs.readFileSync(filePath, "utf8");

    const { data, content } = matter(fileContents);

    const date = fileName.replace(/\.mdx$/, "");

    const formattedDate = formatDate(date);

    return {
      date,
      formattedDate,
      title: data.title || `${formattedDate}의 낙서`,
      description: data.description,
      content,
      image: data.image,
    };
  });

  return scribbles.sort((a, b) => (a.date > b.date ? -1 : 1));
};

const formatDate = (dateString: string) => {
  try {
    const [year, month, day] = dateString.split("-");
    return `${year}년 ${month}월 ${day}일`;
  } catch (e) {
    return dateString;
  }
};
