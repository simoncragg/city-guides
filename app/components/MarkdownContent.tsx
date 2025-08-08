import { marked } from "marked";

interface MarkdownContentProps {
  markdown: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ markdown }) => {
  return (
    <span
      className={`
        [&_ul]:mb-4 [&_ol]:mb-4
        [&_ul>li]:mt-4 [&_ol>li]:mt-4
        [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2.5
        [&_p]:inline
      [&_a]:text-sky-800
        [&_img]:rounded-xl [&_img]:my-4
      `}
      dangerouslySetInnerHTML={{
        __html: marked.parse(markdown) as string,
      }}
    />
  );
};

export default MarkdownContent;
