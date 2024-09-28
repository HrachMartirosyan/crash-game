import { createElement, DetailedHTMLProps, FC, HTMLAttributes } from "react";
import classnames from "classnames";

import styles from "./Box.module.scss";

type Tags = "div" | "section";

type Props = { component?: Tags } & DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

export const Box: FC<Props> = ({
  component = "div",
  children,
  className,
  ...props
}) => {
  const classNameVal = classnames(styles.main, styles[component], className);
  return createElement(
    component,
    { ...props, className: classNameVal },
    children,
  );
};
