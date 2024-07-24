import { NIcon } from 'naive-ui';
import { h } from 'vue';
import { Component } from 'vue';

type NIconProps = InstanceType<typeof NIcon>["$props"]

export function renderIcon(icon: Component, props?: NIconProps) {
  return () => h(NIcon, props || null, { default: () => h(icon) })
}