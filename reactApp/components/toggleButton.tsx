import React from "react";

interface ToggleButtonProps {
  onColor: string;
  offColor: string;
  size?: number;
  filled: boolean;
  circleColor: string;
  toggle: boolean;
  disabled?: boolean;
  classnames?: string;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  onTrue?: () => void;
  onFalse?: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  onColor,
  offColor,
  size,
  filled,
  circleColor,
  toggle,
  disabled,
  classnames,
  setToggle,
  onTrue = () => {},
  onFalse = () => {},
}) => {
  const _size = size ?? 25;
  const _classnames = classnames ?? "";
  const _disabled = disabled ?? false;

  function toggleContainerStyles() {
    const containerColor = _disabled
      ? "bg-gray-400"
      : toggle
      ? onColor
      : offColor;
    const baseClasses = `flex items-center justify-between px-${_size / 10} w-${
      2.3 * _size
    } rounded-full border-2.5 ${
      _disabled ? "border-gray-400" : `border-${containerColor}`
    }`;

    if (!filled) {
      return `${baseClasses} ${
        _disabled ? "border-gray-400" : `border-${containerColor}`
      } ${_classnames}`;
    } else {
      return `${baseClasses} bg-${containerColor} ${
        _disabled ? "bg-gray-400" : `bg-${containerColor}`
      } ${_classnames}`;
    }
  }

  function toggleCircleStyles() {
    const baseClasses = `w-${_size} h-${_size} rounded-full ${
      filled ? `bg-${circleColor}` : "bg-white"
    } ${toggle ? "self-end" : ""} ${
      _disabled ? "bg-gray-600" : `bg-${circleColor}`
    }`;
    return baseClasses;
  }

  return (
    <div className="flex justify-center items-center">
      <button
        disabled={_disabled}
        className={toggleContainerStyles()}
        onClick={() => {
          toggle ? onFalse() : onTrue();
          setToggle(!toggle);
        }}
      >
        <div className={toggleCircleStyles()}></div>
      </button>
    </div>
  );
};

export default ToggleButton;
