import { Blockquote } from "./blockquote";
import { H1 } from "./h1";
import { H2 } from "./h2";
import { H3 } from "./h3";
import { H4 } from "./h4";
import { Anchor } from "./a";
import { P } from "./p";
import { Ul, Ol, Li } from "./list";
import { InlineCode } from "./code";
import { Hr } from "./hr";
import { Img } from "./img";

const mdxComponents = {
  blockquote: Blockquote,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  a: Anchor,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  code: InlineCode,
  hr: Hr,
  img: Img,
};

export default mdxComponents;
