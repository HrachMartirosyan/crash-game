import {
  FC,
  DetailedHTMLProps,
  ReactNode,
  InputHTMLAttributes,
  useMemo,
  ChangeEvent,
} from "react";
import classnames from "classnames";

import styles from "./TextField.module.scss";
import { Box } from "../../Layout";
import { Typography } from "../../DataDisplay";

export type Props = {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  helperText?: string;
  error?: string;
  loading?: boolean;
  required?: boolean;
  fullWidth?: boolean;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "size" | "children"
>;

export const TextField: FC<Props> = ({
  type = "text",
  className,
  placeholder,
  disabled,
  startIcon,
  endIcon,
  helperText,
  error,
  required,
  fullWidth,
  value,
  onChange,
  ...props
}) => {
  const classNameVal = classnames(
    styles.main,
    error && styles.withError,
    disabled && styles.disabled,
    className,
  );

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  const requiredPlaceholder = useMemo(
    () => (placeholder ? `${placeholder}${required ? " *" : ""}` : ""),
    [placeholder, required],
  );

  return (
    <Box className={classnames(styles.wrapper, fullWidth && styles.fullWidth)}>
      <Box className={classNameVal}>
        {startIcon}
        <input
          type={type}
          disabled={disabled}
          placeholder={requiredPlaceholder}
          value={value}
          onChange={handleOnChange}
          {...props}
        />
        {endIcon}
      </Box>
      {helperText && !error && (
        <Typography variant="hint">{helperText}</Typography>
      )}
      {error && (
        <Typography
          variant="hint"
          className={classnames(error && styles.errorText)}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};
