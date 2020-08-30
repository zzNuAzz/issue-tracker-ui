import React from 'react';

// format num to string
function format(num) {
  return num ? num.toString() : '';
}
// format str to a number
function unFormat(str) {
  const num = parseInt(str, 10);
  return Number.isNaN(num) ? undefined : num;
}

export default class NumInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: format(props.value) };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }


  onChange(e) {
    if (e.target.value.match(/^\d*$/)) {
      this.setState({ value: e.target.value });
    }
  }

  onBlur(e) {
    const { onChange } = this.props;
    const { value } = this.state;
    onChange(e, unFormat(value));
  }

  render() {
    const { value } = this.state;
    return (
      <input
        type="text"
        {...this.props}
        onChange={this.onChange}
        onBlur={this.onBlur}
        value={value}
      />
    );
  }
}
