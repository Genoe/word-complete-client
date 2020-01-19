import React, { Component } from 'react'
// import './timer.css'

export default class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 30,
        }
    }

    componentDidMount() {
        if (this.props.isTurn) {
            this.myInterval = setInterval(() => {
                const { seconds } = this.state
    
                if (seconds > 0) {
                    this.setState(({ seconds }) => ({
                        seconds: seconds - 1
                    }));
                }
                if (seconds === 0) {
                    this.props.timerEnd();
                    clearInterval(this.myInterval)
                } 
            }, 1000)
        }
    }

    componentWillUnmount() {
        if (this.props.isTurn) {
          clearInterval(this.myInterval);  
        }
    }

    render() {
        const { seconds } = this.state
        return (
            <div id="timer">
                <p id="timertext" className="text-center">
                    {this.props.isTurn ? `Time left: ${String(seconds).padStart(2, 0)} seconds` : "Waiting..."}
                </p>       
            </div>
        );
    }
}
