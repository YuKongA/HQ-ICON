import React from "react";

function FilterGroup({
  title,
  options,
  currentValue,
  onChange,
  disabledValues,
  onMouseDown,
}) {
  return (
    <div className="filter-group">
      <div className="filter-group-title">{title}</div>
      <div className="filter-options" onMouseDown={onMouseDown}>
        {options.map((option) => (
          <React.Fragment key={option.value}>
            <input
              type="checkbox"
              id={`${option.key}-${option.value}`}
              checked={currentValue === option.value}
              onChange={() => onChange(option)}
              disabled={disabledValues?.includes(option.value)}
            />
            <label htmlFor={`${option.key}-${option.value}`}>
              {option.text}
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default FilterGroup;
