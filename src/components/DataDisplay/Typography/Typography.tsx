import { createElement, FC, ReactNode } from "react";
import classnames from "classnames";

import styles from "./Typography.module.scss";

type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

type Props = {
  variant?: Tag | "hint";
  component?: Tag;
  error?: boolean;
  className?: string;
  children: ReactNode;
};

const validTags: Array<Tag> = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"];

export const Typography: FC<Props> = ({
  variant = "p",
  component,
  error,
  className,
  children,
  ...props
}) => {
  const classNameVal = classnames(
    styles.main,
    styles[variant],
    error && styles.error,
    className,
  );

  return createElement(
    component || (validTags.includes(variant as Tag) ? variant : "p"),
    { ...props, className: classNameVal },
    children,
  );
};
