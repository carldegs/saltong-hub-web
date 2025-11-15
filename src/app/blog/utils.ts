import fs from "fs";
import path from "path";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";

export type BlogMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  author?: string;
  tags?: string[];
  image?: string;
  heroImage?: string;
};

export type BlogPost = {
  metadata: BlogMetadata;
  slug: string;
  content: string;
};

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match![1];
  const content = fileContent.replace(frontmatterRegex, "").trim();
  const frontMatterLines = frontMatterBlock.trim().split("\n");
  const metadata: Partial<BlogMetadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    const typedKey = key.trim() as keyof BlogMetadata;

    // Handle arrays (tags)
    if (value.startsWith("[") && value.endsWith("]")) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (metadata as any)[typedKey] = JSON.parse(value);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (metadata as any)[typedKey] = value;
    }
  });

  return { metadata: metadata as BlogMetadata, content };
}

function getMDXFiles(dir: string) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir: string): BlogPost[] {
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file));
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts(): BlogPost[] {
  return getMDXData(path.join(process.cwd(), "src", "app", "blog", "posts"));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  const posts = getBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export function formatDate(date: string, includeRelative = false) {
  const targetDate = new Date(date);
  const fullDate = format(targetDate, "MMMM d, yyyy");
  const daysDifference = differenceInDays(new Date(), targetDate);

  if (includeRelative) {
    // For dates within the last week, show relative date with full date on hover
    if (daysDifference <= 7) {
      const relativeDate = formatDistanceToNow(targetDate, {
        addSuffix: true,
        includeSeconds: true,
      });
      return {
        display: relativeDate,
        full: fullDate,
      };
    }

    // For dates over a week old, just show the actual date
    return {
      display: fullDate,
      full: fullDate,
    };
  }

  return {
    display: fullDate,
    full: fullDate,
  };
}
