import React from 'react';

function displayFormat(date) {
  return date ? date.toDateString() : '';
}

function editFormat(date) {
  return date ? date.toISOString().substr(0, 10) : '';
}

function unFormat(str) {
  const val = new Date(str);
  return Number.isNaN(val.getTime()) ? null : val;
}

export default class DateInput extends React.Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      value: editFormat(value),
      focused: false,
      valid: true,
    };

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  onChange(e) {
    if (e.target.value.match(/^[\d-]*$/)) {
      this.setState({ value: e.target.value });
    }
  }

  onBlur(e) {
    const { onChange, onValidityChange } = this.props;
    const { value, valid: oldValid } = this.state;

    const dateValue = unFormat(value);
    const valid = value === '' || dateValue != null;
    if (valid !== oldValid && onValidityChange) {
      onValidityChange(e, valid);
    }
    this.setState({ focused: false, valid });
    if (valid) onChange(e, dateValue);
  }

  onFocus() {
    this.setState({
      focused: true,
    });
  }

  render() {
    const { value: originValue, onValidityChange, ...props } = this.props;
    const { valid, focused, value } = this.state;
    // const className = !valid && !focused ? 'invalid' : null;
    const displayValue = focused || !valid ? value : displayFormat(originValue);
    return (
      <input
        // type="text"
        // size="20"
        // name={name}
        value={displayValue}
        // className={className}
        {...props}
        placeholder={!focused ? 'yyyy-mm-dd' : null}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
      />
    );
  }
}
