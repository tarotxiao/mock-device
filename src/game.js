import React from 'react';
import ReactDOM from 'react-dom';
import './game.css';

/*class Square extends React.Component {

    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
}*/

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={props.style}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {

    color(i) {
        const finalBoard = this.props.finalBoard;
        let style = {};
        if (finalBoard === null) {
            style.color = 'black';
        } else {
            style.color = finalBoard.includes(i) ? 'red' : 'black';
        }
        return style;
    }

    renderSquare(i) {
        return (
            <Square
                key={'square-' + i}
                value={this.props.squares[i]}
                style={this.color(i)}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let rows = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 3 * i; j < 3 * i + 3; j++) {
                row.push(this.renderSquare(j));
            }
            rows.push(<div className="board-row" key={i}>{row}</div>)
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner: squares[a], finalBoard: [a, b, c]};
        }
    }
    return null;
}

class Game extends React.Component {

    constructor() {
        super();
        this.state = {
            history: [{
                squares: new Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            showSort: true,
        }
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                position: {x: Math.floor(i / 3), y: i % 3}
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    changeSort() {
        const sort = !this.state.showSort;
        this.setState({
            showSort: sort,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        })
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const sort = this.state.showSort;

        let moves = history.map((step, move) => {
            const desc = move ?
                'Move #(' + step.position.x + ',' + step.position.y + ')' :
                'Game start';
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}
                       style={move === this.state.stepNumber ? {fontWeight: 'bold'} : {fontWeight: 'normal'}}>{desc}</a>
                </li>
            );
        });
        if (sort) {
            moves = moves.reverse();
        }

        let status;
        let finalBoard;
        if (winner) {
            finalBoard = winner.finalBoard;
            status = 'Winner: ' + winner.winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            finalBoard = null;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        finalBoard={finalBoard}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button className="sort" onClick={() => this.changeSort()}>Sort</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
