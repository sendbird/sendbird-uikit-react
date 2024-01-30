import React, { ReactNode } from "react";

import Label, { LabelColors, LabelTypography } from "../Label";
import { changeColorToClassName } from "../Label/utils";
import "./index.scss";
import { ObjectValues } from "../../utils/typeHelpers/objectValues";

const http = /https?:\/\//;

type LinkLabelProps = {
  src: string;
  className?: string | string[];
  type?: ObjectValues<typeof LabelTypography>;
  color?: ObjectValues<typeof LabelColors>;
  children: ReactNode;
};

export default function LinkLabel({
  className = "",
  src,
  type,
  color,
  children,
}: LinkLabelProps) {
  const url = http.test(src) ? src : `http://${src}`;
  const handleMobileTouchEnd = (e: React.TouchEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      className={[
        ...(Array.isArray(className) ? className : [className]),
        "sendbird-link-label",
        changeColorToClassName(color),
      ].join(" ")}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      // for mobile
      onTouchEnd={handleMobileTouchEnd}
    >
      <Label className="sendbird-link-label__label" type={type} color={color}>
        {children}
      </Label>
    </a>
  );
}

export const LinkLabelTypography = LabelTypography;
export const LinkLabelColors = LabelColors;
