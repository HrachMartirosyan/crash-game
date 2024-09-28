import {
  FC,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
} from "react";
import classnames from "classnames";

import styles from "./Button.module.scss";
import LoadingIcon from "../../Icons/assets/Loading.tsx";
import { Link } from "react-router-dom";

export type Props = {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

export const Button: FC<Props> = ({
  children,
  className,
  disabled,
  href,
  startIcon,
  endIcon,
  loading,
  ...props
}) => {
  const classNameVal = classnames(
    styles.main,
    disabled && styles.disabled,
    className,
  );

  const modifiedChildren = (
    <>
      {loading ? <LoadingIcon /> : startIcon}
      {children}
      {endIcon}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={classNameVal} {...props}>
        {modifiedChildren}
      </Link>
    );
  }

  return (
    <button className={classNameVal} disabled={disabled} {...props}>
      {modifiedChildren}
    </button>
  );
};
