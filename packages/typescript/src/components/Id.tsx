import { Children, isRefkey, OutputSymbol, Refkey, taggedComponent, useBinder, useMemberScope, useScope } from "@alloy-js/core";

export interface CommonMemberExpressionProps {
  nullish?: boolean;
}
export interface IdPropsWithRefkey extends CommonMemberExpressionProps {
  refkey: Refkey;
}

export interface IdPropsWithSymbol extends CommonMemberExpressionProps {
  symbol: OutputSymbol;
}

export type MemberExpressionProps = IdPropsWithRefkey | IdPropsWithSymbol;

function _MemberIdentifier(props: IdPropsWithRefkey): Children;
function _MemberIdentifier(props: IdPropsWithSymbol): Children;
function _MemberIdentifier(props: MemberExpressionProps) {
  if (isMemberIdentifierWithRefkey(props)) {
      const scope = useScope() ?? useBinder().globalScope;
      const memberScope = useMemberScope();
      const binder = scope.binder;
    const symbol = binder.resolveDeclarationByKey(scope, memberScope?.staticMembers, props.refkey);

    if(symbol && symbol.value && symbol.value.memberPath && symbol.value.memberPath.length) {
      const memberIndex = symbol.value.memberPath.length - 1;
      return () => symbol!.value!.memberPath![memberIndex].name;
    }
    return props.refkey;
  } else {
    return () => props.symbol.name;
  }
}

export const memberIdentifierTag = Symbol();
export const MemberIdentifier = taggedComponent<MemberExpressionProps>(memberIdentifierTag, _MemberIdentifier as any)

function isMemberIdentifierWithRefkey(props: any): props is IdPropsWithRefkey {
  return isRefkey(props.refkey);
}
