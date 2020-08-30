import React from 'react';

function format(text) {
  return text || '';
}

function unFormat(text) {
  return text.trim().length === 0 ? null : text;
}

export default class TextInput extends React.Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = { value: format(value) };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }


  onChange(e) {
    this.setState({ value: e.target.value });
  }

  onBlur(e) {
    const { onChange } = this.props;
    const { value } = this.state;
    onChange(e, unFormat(value));
  }

  render() {
    const { value } = this.state;
    const { tag = 'input', ...props } = this.props;
    return React.createElement(tag, {
      ...props,
      value,
      onChange: this.onChange,
      onBlur: this.onBlur,
    });
  }
}
