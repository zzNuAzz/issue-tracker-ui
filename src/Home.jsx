import React, { useState } from 'react';

function Rainbow({ color }) {
  const style = {
    width: '100px',
    height: '100px',
    backgroundColor: color,
    display: 'inline-block',
    transitionDuration: '2s',
  };
  return (
    <>
      <div style={style} />
    </>
  );
}

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = { now: new Date() };
  }

  componentDidMount() {
    this.state.interval = setInterval(() => {
      this.setState({ now: new Date() });
    }, 30);
  }

  componentWillUnmount() {
    const { interval } = this.state;
    clearInterval(interval);
  }

  render() {
    const { now } = this.state;
    const second = now.getSeconds();
    const rainbow = [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'indigo',
      'purple',
    ];
    const style = {
      color: rainbow[second % rainbow.length],
    };
    const block = (i, row, id) => (
      <Rainbow key={row * 7 + id} color={rainbow[(i + row) % 7]} />
    );
    const row = [];
    for (let i = 0; i < rainbow.length; i += 1) {
      row.push((second + i) % rainbow.length);
    }
    return (
      <div className="text-center">
        <h1 className="text-center" style={style}>
          {now.toLocaleTimeString()}
        </h1>
        <div>{row.map((i, id) => block(i, 0, id))}</div>
        <div>{row.map((i, id) => block(i, 1, id))}</div>
        <div>{row.map((i, id) => block(i, 2, id))}</div>
        <div>{row.map((i, id) => block(i, 3, id))}</div>
        <div>{row.map((i, id) => block(i, 4, id))}</div>
        <div>{row.map((i, id) => block(i, 5, id))}</div>
        <div>{row.map((i, id) => block(i, 6, id))}</div>
      </div>
    );
  }
}

// import React, { Component } from 'react';
// import useChartConfig from 'hooks/useChartConfig';
// import { Chart } from 'react-charts';
// export default () => {
//   const { data, randomizeData } = useChartConfig({
//     dataType: 'linear',
//     series: 10,
//     useR: true,
//   });
//   const series = React.useMemo(
//     () => ({
//       type: 'bubble',
//       showPoints: false,
//     }),
//     []
//   );
//   const axes = React.useMemo(
//     () => [
//       { primary: true, type: 'linear', position: 'bottom' },
//       { type: 'linear', position: 'left' },
//     ],
//     []
//   );
//   return (
//     <>
//       <button onClick={randomizeData}>Randomize Data</button>
//       <br />
//       <br />
//         <Chart
//           data={data}
//           series={series}
//           axes={axes}
//           grouping="single"
//           tooltip
//         />
//       <br />
//     </>
//   );
// };
