import * as ay from "@alloy-js/core";
import { ParameterDescriptor } from "./FunctionDeclaration.jsx";

/** Props for the JSDoc component. */
export interface JSDocProps {
  /** Main documentation text provided as a single string or an array of strings. */
  content?: string[] | string;
  /** Parameter documentation where only values of type ParameterDescriptor (with a "doc" property) are processed. */
  parameters?: Record<string, ay.Children | ParameterDescriptor>;
  /** Child content that will be rendered after the JSDoc comment. */
  children?: ay.Children;
}

/**
 * The JSDoc component generates a JSDoc comment block from the provided content and parameter documentation.
 *
 * If no valid documentation is provided, it renders the child content directly.
 *
 * @param props - The props for this component.
 * @returns The rendered JSDoc comment and any children.
 */
export function JSDoc(props: JSDocProps) {
  // If neither content nor valid parameter documentation is provided, simply render children.
  if (!props.content && !props.parameters) {
    return props.children;
  }

  // Convert the main content into an array of strings.
  let mainContent: string[] = [];
  if (props.content) {
    if (typeof props.content === "string") {
      mainContent = props.content.split("\n");
    } else {
      mainContent = props.content;
    }
  }

  // Build parameter documentation lines only for ParameterDescriptor values.
  let paramLines: string[] = [];
  if (props.parameters) {
    for (const [name, param] of Object.entries(props.parameters)) {
      // Only process the parameter if it has a "doc" property.
      if (typeof param === "object" && param !== null && "doc" in param) {
        let docs = param.doc;
        if (typeof docs === "string") {
          docs = docs.split("\n");
        }
        if (Array.isArray(docs) && docs.length > 0) {
          // Prefix the first line with '@param'.
          paramLines.push(`@param ${name} ${docs[0]}`);
          // Append any additional documentation lines.
          for (let i = 1; i < docs.length; i++) {
            paramLines.push(docs[i]);
          }
        }
      }
    }
  }

  // Combine the main content and parameter documentation, filtering out any empty lines.
  const allContent = mainContent.concat(paramLines).filter(line => line.trim() !== "");
  if (allContent.length === 0) {
    return props.children;
  }

  // Sanitize the content to prevent premature comment closure.
  const sanitizedContent = allContent.join("\n").replace(/\*\//g, "*\\/");
  const splitContent = sanitizedContent.split("\n");
  const multiline = splitContent.length > 1;

  let jsDoc: ay.Children;
  if (multiline) {
    // Render as a multi-line comment.
    jsDoc = <MultiLineComment content={splitContent} />;
  } else {
    // Render as a single-line comment.
    jsDoc = ay.code`
      /** ${sanitizedContent.trim()} */
    `;
  }

  return (
    <>
      {jsDoc}
      {props.children}
    </>
  );
}

/**
 * Renders a multi-line comment block.
 *
 * @param {Object} props - Component props.
 * @param {string[]} props.content - An array of strings representing each line of the comment.
 * @returns {string} The formatted multi-line comment.
 */
function MultiLineComment(props: { content: string[] }) {
  return `/**\n * ${props.content.join("\n * ")}\n */`;
}
