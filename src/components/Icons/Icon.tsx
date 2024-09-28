import { FC } from "react";
import classnames from "classnames";

import styles from "./Icon.module.scss";

export type Props = React.SVGProps<SVGSVGElement>;

export const Icon: FC<Props> = ({
  children,
  className,
  width = "24px",
  height = "24px",
  ...props
}) => {
  const classNameVal = classnames(styles.main, className);

  return (
    <svg
      className={classNameVal}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      width={width}
      height={height}
      fill="currentColor"
    >
      {children}
    </svg>
  );
};
