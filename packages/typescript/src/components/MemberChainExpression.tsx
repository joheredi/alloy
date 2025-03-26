import { childrenArray, computed, findKeyedChildren, For, isKeyedChild, List, Show } from "@alloy-js/core";
import { Children, isComponentCreator } from "@alloy-js/core/jsx-runtime";
import { FunctionCallExpression } from "./FunctionCallExpression.jsx";
import { CommonMemberExpressionProps, MemberExpressionProps, memberIdentifierTag } from "./Id.jsx";
import { C } from "vitest/dist/chunks/reporters.0x019-V2.js";

export interface MemberChainExpressionProps {
  children: Children;
}

/**
 * Create a member chain expression, which is a member expression comprised of
 * either children, {@link FunctionCallExpression} components, or nested member
 * chain expression components. Other component types are ignored.
 */
export function MemberChainExpression(props: MemberChainExpressionProps) {
  // chunks are constructed by consuming as many non-call expressions as
  // possible, then placing an indent and soft line break before and after the
  // any subsequent call expressions

  findKeyedChildren(Array.isArray(props.children) ? props.children : [props.children], memberIdentifierTag).forEach((child) => {
    console.log(child.props.nullish)
  })

  const chunks = computed(() => {
    const children = flattenCallChains(childrenArray(() => props.children));
    const chunks: Children[][] = [];

    let currentChunk: Children[] = [];

    for (const child of children) {
      if (
        isComponentCreator(child) &&
        child.component === FunctionCallExpression
      ) {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = [];
        }
        chunks.push([child]);
      } else {
        currentChunk.push(child);
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return [chunks[0], chunks.slice(1)];
  });
  const groupId = Symbol();

  return (
    <group>
      <group id={groupId}>
        <List joiner="." children={chunks.value[0]} />
      </group>
      <Show when={chunks.value[1].length === 1}>
        <For each={chunks.value[1]} softline>
          {(chunk) => (
            <>
              {isOptionalSegment(chunk) ? "?." : "."}
              <List joiner="." children={chunk} />
            </>
          )}
        </For>
      </Show>
      <Show when={chunks.value[1].length > 1}>
        <indent>
          <For each={chunks.value[1]} softline>
            {(chunk) => (
              <>
                {isOptionalSegment(chunk) ? "?." : "."}
                <List joiner="." children={chunk} />
              </>
            )}
          </For>
        </indent>
      </Show>
    </group>
  );
}

function flattenCallChains(children: Children[]): Children[] {
  const flatChildren = [];
  for (const child of children) {
    if (
      isComponentCreator(child) &&
      child.component === MemberChainExpression
    ) {
      flatChildren.push(...flattenCallChains(child.props.children));
    } else {
      flatChildren.push(child);
    }
  }

  return flatChildren;
}

function isOptionalSegment(child: Children): boolean {

  const isNullish = findKeyedChildren(
    Array.isArray(child) ? child : [child],
    memberIdentifierTag).some((child) => {
      return Boolean(child.props.nullish)
    });

    console.log(isNullish);

    return isNullish;
}