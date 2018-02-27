import React from 'react';
import ReactDOM from 'react-dom';

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    renderClock2(date) {
        return (
            <Clock2 time={date}/>
        );
    }

    render() {
        const now = this.state.date.toLocaleTimeString();
        const clock2 = this.renderClock2(now);
        return (
            <div>
                <h2>Clock1 {now}.</h2>
                {clock2}
            </div>

        );
    }
}

function Clock2(props) {
    return (
            <h2>Clock2 {props.time}.</h2>
    )
}


ReactDOM.render(
    <Clock/>,
    document.getElementById('root')
);