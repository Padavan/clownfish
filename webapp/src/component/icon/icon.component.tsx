import React, { SVGProps } from "react";

import { IconKebab } from "./icon-kebab";

/** @type {Record<string, () => any>} */
const iconMapping = {
  kebab: IconKebab,
};

/**
 * @typedef {Object} IconProps
 * @prop {string} type
 * @prop {string} [className]
 */

interface IconProps extends SVGProps<SVGSVGElement> {
  type: string;
}
export function Icon({ type, ...rest }: IconProps) {
  const IconComponent = iconMapping[type];

  if (IconComponent) {
    return <IconComponent {...rest} />;
  }

  console.error("Unknown icon type: ", type);
  return null;
}
