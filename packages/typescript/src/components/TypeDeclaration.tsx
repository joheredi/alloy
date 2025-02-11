import { Declaration, DeclarationProps } from "./Declaration.js";
import { JSDoc } from "./JSDoc.jsx";
import { Name } from "./Name.js";

export interface TypeDeclarationProps
  extends Omit<DeclarationProps, "nameKind"> {
  doc?: string | string[];
}

export function TypeDeclaration(props: TypeDeclarationProps) {
  return <Declaration {...props} nameKind="type">
    <JSDoc>type <Name /> = {props.children}</JSDoc>;
  </Declaration>;
}
