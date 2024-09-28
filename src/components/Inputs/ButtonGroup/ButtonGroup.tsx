import {
  FC,
  DetailedHTMLProps,
  HTMLAttributes,
  Children,
  cloneElement,
  ReactElement,
} from "react";
import classnames from "classnames";

import styles from "./ButtonGroup.module.scss";
import { Box } from "../../Layout";

type Props = { orientation?: "horizontal" | "vertical" } & DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const ButtonGroup: FC<Props> = ({
  children,
  className,
  orientation = "horizontal",
  ...props
}) => {
  const classNameVal = classnames(styles.main, styles[orientation], className);

  return (
    <Box {...props} className={classNameVal}>
      {Children.map(children, (child) =>
        cloneElement(child as ReactElement, {}),
      )}
    </Box>
  );
};
