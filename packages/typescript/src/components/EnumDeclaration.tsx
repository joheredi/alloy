import {
  refkey,
  Declaration as CoreDeclaration,
  useBinder,
  Scope,
  mapJoin,
} from "@alloy-js/core";
import { useTSNamePolicy } from "../name-policy.js";
import { DeclarationProps } from "./Declaration.js";
import { Name } from "./Name.js";
import {
  createTSMemberScope,
  createTSSymbol,
  useTSScope,
} from "../symbols/index.js";
import { EnumMember } from "./EnumMember.jsx";
import { JSDoc } from "./JSDoc.jsx";

export interface EnumDeclarationProps
  extends Omit<DeclarationProps, "nameKind"> {
  /**
   * The members of the enum.
   */
  members?: Record<string, string | number | EnumMemberDescriptor>;
  /**
   * Documentation for the enum.
   */
  doc?: string | string[];
}

export interface EnumMemberDescriptor {
  jsValue: string | number;
  doc?: string | string[];
}

/**
 * A TypeScript enum declaration.
 */
export function EnumDeclaration(props: EnumDeclarationProps) {
  const name = useTSNamePolicy().getName(props.name, "enum");
  const binder = useBinder();
  const scope = useTSScope();
  const sym = createTSSymbol({
    binder,
    scope,
    name: name,
    refkey: props.refkey ?? refkey(name),
    default: props.default,
    export: props.export,
  });

  sym.memberScope = createTSMemberScope(binder, scope, sym);

  const jsValueMembers = mapJoin(
    Object.entries(props.members ?? {}),
    ([name, value]) => {
      const jsValue = typeof value === "object" ? value.jsValue : value;
      const doc = typeof value === "object" ? value.doc : undefined;
      return <JSDoc content={doc}><EnumMember name={name} jsValue={jsValue} /></JSDoc>;
    },
    { joiner: ",\n" },
  );

  return <CoreDeclaration symbol={sym}>
    <JSDoc content={props.doc}>
    {props.export ? "export " : ""}{props.default ? "default " : ""}enum <Name /> {"{"}
      <Scope value={sym.memberScope}>
        {jsValueMembers}{jsValueMembers.length > 0 && props.children && ",\n"}{props.children}
      </Scope>
    {"}"}
    </JSDoc>
  </CoreDeclaration>;
}
