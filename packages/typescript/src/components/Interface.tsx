import { Children, code } from "@alloy-js/core";
import { useTSNamePolicy } from "../name-policy.js";
import { Declaration, DeclarationProps } from "./Declaration.js";
import { Name } from "./Name.js";
import { JSDoc } from "./JSDoc.js";

export interface InterfaceDeclarationProps
  extends Omit<DeclarationProps, "nameKind"> {
  extends?: Children;
  doc?: string | string[];
}

export function InterfaceDeclaration(props: InterfaceDeclarationProps) {
  const extendsPart = props.extends ? <> extends {props.extends}</> : "";

  return <Declaration {...props} nameKind="interface">
    <JSDoc content={props.doc}>
    interface <Name />{extendsPart} <InterfaceExpression>
      {props.children}
    </InterfaceExpression>
    </JSDoc>
  </Declaration>;
}

export interface InterfaceExpressionProps {
  children?: Children;
}

export function InterfaceExpression(props: InterfaceExpressionProps) {
  return code`
    {
      ${props.children}
    }
  `;
}
export interface InterfaceMemberProps {
  name?: string;
  doc?: string | string[];
  indexer?: Children;
  type?: Children;
  children?: Children;
}

export function InterfaceMember(props: InterfaceMemberProps) {
  const namer = useTSNamePolicy();
  const type = props.type ?? props.children;
  if (props.indexer) {
    return <>
      <JSDoc content={props.doc}>
        [{props.indexer}]: {type}
      </JSDoc>
    </>;
  } else {
    return <>
      <JSDoc content={props.doc}>
        {namer.getName(props.name!, "interface-member")}: {type}
      </JSDoc>
    </>;
  }
}
