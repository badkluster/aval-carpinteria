import { Button } from "antd";
import React from "react";

import "./ButtonComponent.css";

import { ENV } from "../utils";

export default function ButtonComponent({
  toAction,
  color,
  icon,
  name,
  loading,
  disabled,
  className,
  type = "default",
}) {
  const getIcon = () => {
    return null;
  };

  const buttonColor = disabled
    ? ENV.THEME_COLORS.DISABLED
    : color || ENV.THEME_COLORS.CELESTE;
  const textColor = disabled
    ? ENV.THEME_COLORS.DISABLED_TEXT
    : ENV.THEME_COLORS.TEXT;
  return (
    <Button
      className={`ButtonComponentStyle ${className}`}
      style={{ backgroundColor: buttonColor, color: textColor }}
      onClick={toAction}
      disabled={disabled}
      loading={loading}
      type={type}
    >
      {getIcon()}
      {name}
    </Button>
  );
}
