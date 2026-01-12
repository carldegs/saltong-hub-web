import * as React from "react";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// Extract plain text from React children (for heading slug generation)
function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (React.isValidElement(node)) {
    const el = node as React.ReactElement<{ children?: React.ReactNode }>;
    return getNodeText(el.props.children);
  }
  return "";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function createHeading(tag: "h1" | "h2" | "h3" | "h4", baseClass: string) {
  const Heading: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
    children,
    id,
    className = "",
    ...props
  }) => {
    const text = getNodeText(children);
    const generatedId = id ?? (text ? slugify(text) : undefined);
    return React.createElement(
      tag,
      {
        id: generatedId,
        className: [baseClass, className].join(" "),
        ...props,
      },
      children
    );
  };
  Heading.displayName = `${tag.toUpperCase()}WithAnchor`;
  return Heading;
}

const A: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href = "",
  children,
  className = "",
}) => {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const classes = [
    "text-blue-500 underline-offset-4 hover:underline",
    className,
  ].join(" ");
  if (isInternal) {
    return (
      <Link href={href} className={classes} prefetch={false}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={classes}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      {children}
    </a>
  );
};

const Pre: React.FC<React.HTMLAttributes<HTMLPreElement>> = ({
  className = "",
  ...props
}) => (
  <pre
    className={[
      "bg-muted not-prose my-4 overflow-auto rounded-lg p-4 text-sm",
      className,
    ].join(" ")}
    {...props}
  />
);

const Code: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className = "",
  ...props
}) => (
  <code
    className={[
      "bg-muted rounded px-1.5 py-0.5 font-mono text-[0.9em]",
      className,
    ].join(" ")}
    {...props}
  />
);

const Blockquote: React.FC<React.BlockquoteHTMLAttributes<HTMLElement>> = ({
  className = "",
  ...props
}) => (
  <blockquote
    className={[
      "border-muted-foreground/30 text-muted-foreground mt-6 border-l-2 pl-6 italic",
      className,
    ].join(" ")}
    {...props}
  />
);

const MdxTable: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className="not-prose my-4">
    <Table className={className} {...props}>
      {children}
    </Table>
  </div>
);

const MdxTableHeader: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = (props) => <TableHeader {...props} />;

const MdxTableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = (
  props
) => <TableRow {...props} />;

const MdxTableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = (
  props
) => <TableHead {...props} />;

const MdxTableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = (
  props
) => <TableCell {...props} />;

const MdxTableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = (
  props
) => <TableBody {...props} />;

const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  className = "",
  loading = "lazy",
  alt = "",
  ...props
}) => (
  // Keep native img to avoid requiring width/height in MDX; lint is suppressed intentionally
  // eslint-disable-next-line @next/next/no-img-element
  <img
    loading={loading}
    alt={alt}
    className={["my-4 rounded-md", className].join(" ")}
    {...props}
  />
);

const Ul: React.FC<React.HTMLAttributes<HTMLUListElement>> = (props) => (
  <ul className="my-4 ml-6 list-disc space-y-1" {...props} />
);

const Ol: React.FC<React.HTMLAttributes<HTMLOListElement>> = (props) => (
  <ol className="my-4 ml-6 list-decimal space-y-1" {...props} />
);

const components = {
  h1: createHeading("h1", "mt-0 scroll-m-20 text-3xl font-bold tracking-tight"),
  h2: createHeading(
    "h2",
    "mt-10 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
  ),
  h3: createHeading(
    "h3",
    "mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
  ),
  h4: createHeading(
    "h4",
    "mt-8 scroll-m-20 text-lg font-semibold tracking-tight"
  ),
  a: A,
  pre: Pre,
  code: Code,
  blockquote: Blockquote,
  table: MdxTable,
  thead: MdxTableHeader,
  tbody: MdxTableBody,
  tr: MdxTableRow,
  th: MdxTableHead,
  td: MdxTableCell,
  img: Img,
  ul: Ul,
  ol: Ol,
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <Separator className="my-8" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
  ),
};

export function CustomMDX(props: {
  source: string;
  components?: MDXComponents;
}) {
  return (
    <MDXRemote {...props} components={{ ...components, ...props.components }} />
  );
}

export function useMDXComponents(userComponents: MDXComponents): MDXComponents {
  return {
    ...components,
    ...userComponents,
  };
}
