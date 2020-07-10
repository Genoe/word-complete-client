import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { 
    subscribeToChat, 
    emitMessage, 
    emitUsername,
    emitTimerEnd, 
    subscribeToMatchingService, 
    subscribeToMatchFound, 
    subscribeToOppDiscnt, 
    disconnect,
    subscribeToBadWord,
    subscribeToGameOver,
} from '../services/socket';

import Message from '../components/Message';
import Timer from './Timer';

const DEFAULT_USER = 'Wyatt Weisensel (Word Complete Creator)';

class Chatroom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: [],
            showNewGameBtn: true,
            isTurn: false,
            lives: 0,
            word: '',
        };

        this.opponentUsername = DEFAULT_USER;
    };
    
    componentDidMount() {
        console.log('chatroom did mount');
        this.scrollToBot();
    };

    componentDidUpdate() {
        console.log('chatroom did update');
        this.scrollToBot();
    };

    componentWillUnmount() {
        console.log('chatroom will unmount');
        disconnect();
    };

    scrollToBot = () => {
        var scrollingElement = (document.scrollingElement || document.body); /* you could provide your scrolling element with react ref */
        scrollingElement.scrollTop = scrollingElement.scrollHeight;
    };

    handleWordInputChange = (e) => {
        this.setState({ word: e.target.value });
    };

    canBeSubmitted = () => {
        return this.state.word.length > 0;
    };

    submitMessage = (e) => {
        const { word } = this.state;

        e.preventDefault();

        if (this.canBeSubmitted()) {
            emitMessage(word, () => {
                this.setState({
                    isTurn: !this.state.isTurn,
                    word: '',
                    chats: this.state.chats.concat([{
                        username: this.props.currentUser.user.username,
                        content: word.toLowerCase(),
                    }]),
                }, () => {
                    ReactDOM.findDOMNode(this.refs.newWord).value = '';
                });
            });
        }    
    };

    startNewGame = (e) => {
        e.preventDefault();
        // connectChat();
        // emitUsername(this.props.currentUser.user.username);

        // After a username has been sent back to the server, wait for a match
        subscribeToMatchingService((err, msg) => {
            if (err) {
                this.setState({
                    chats: this.state.chats.concat(JSON.stringify(err)),
                });
            }

            this.setState({
                chats: this.state.chats.concat({username: this.opponentUsername, content: msg}),
                showNewGameBtn: false,
            });
        });

        subscribeToChat((err, msg) => this.setState({
            // timestamp
            chats: this.state.chats.concat({username: this.opponentUsername, content: msg}),
            isTurn: !this.state.isTurn
        }));

        subscribeToMatchFound((err, msgObj) => {
            this.setState({
                showNewGameBtn: false,
                isTurn: msgObj.isTurn,
                lives: msgObj.lives,
            });
            
            this.opponentUsername = msgObj.oppUsername;
        });

        subscribeToOppDiscnt((err, msg) => {
            this.setState({
                chats: this.state.chats.concat({
                    username: DEFAULT_USER,
                    content: `${this.opponentUsername} has disconnected!`
                }),
                showNewGameBtn: true,
                isTurn: false,
            });

            this.opponentUsername = DEFAULT_USER;

            disconnect();
        });

        subscribeToBadWord((err, msgObj) => {
            let newState = {
                chats: this.state.chats.concat({username: this.opponentUsername, content: msgObj.msg}),
                isTurn: msgObj.isTurn,
            };

            if (msgObj.lives !== undefined) {
                newState.lives = msgObj.lives;
            }

            this.setState(newState);
        });

        subscribeToGameOver((err, msgObj) => {
            this.setState({
                chats: this.state.chats.concat({
                    username: DEFAULT_USER,
                    content: msgObj.msg
                }),
                showNewGameBtn: true,
                isTurn: false,
                lives: 0,
            });

            this.opponentUsername = DEFAULT_USER;

            disconnect();
        });

        emitUsername(this.props.currentUser.user.username);
    };

    timerEnd = () => {
        emitTimerEnd();
    };

    render() {
        const username = this.props.currentUser.user.username;
        const { chats, showNewGameBtn, isTurn, lives } = this.state;
        const rules = {
            username: DEFAULT_USER,
            content: `Welcome to a new game!! After an opponent is found, one player will say a word.
            Then the other player responds with a word that begins with the ending letter of the previous word.
            For example: Dog -> Goat -> Taco -> Orange -> Ear. Words are not case sensitive.
            Words cannot be repeated. After three mistakes, the other player wins. Each turn lasts 30 seconds.
            If you run out of time, it becomes the other players turn.`
        };
        const jpnRules = {
            username: DEFAULT_USER,
            content: `新しいゲームへようこそ!! 対戦相手が見つかった後、1人のプレイヤーが単語を言うと、
            他のプレイヤーは前の単語の終了文字で始まる単語で応答します。 例：Dog -> Goat -> Taco -> Orange -> Ear.。 
            単語は大文字と小文字を区別しません。 言葉を繰り返すことはできません。 3つのミスの後、他のプレイヤーが勝ちます。
            各ターンは30秒続きます。時間を使い果たすと、他のプレイヤーがターンします。`
        };
        let form;

        if (showNewGameBtn) {
            form = 
            <form className="form-inline justify-content-center" onSubmit={(e) => this.startNewGame(e)}>
                <input type="submit" className="btn btn-primary mb-2 mr-sm-2" value="New Game!" />
            </form>
        } else {
            form = 
                <form className="form-inline justify-content-center" onSubmit={(e) => this.submitMessage(e)}>
                    <label className="sr-only" htmlFor="newWord">New Word</label>
                    <input type="text" className="form-control mb-2 mr-sm-2" id="newWord" placeholder="Enter a word!" ref="newWord" onChange={this.handleWordInputChange} />
                    <input type="submit" className="btn btn-primary mb-2 mr-sm-2" value={isTurn ? 'Submit' : 'Please Wait'} disabled={!isTurn}/>
                </form>
        }

        return (
            <div>
                <h3 className="text-center">Let's Play!</h3>         
                <ul className="list-group" ref="chats">
                    <Message chat={rules} user={username} key={0} appMsg={true}/>
                    <Message chat={jpnRules} user={username} key={1} appMsg={true}/>
                    {
                        chats.map((chat, i) => 
                            <Message chat={chat} user={username} key={i + 2} appMsg={false}/>
                        )
                    }
                </ul>
                <br />
                <div className="d-flex justify-content-between gameinfo">
                    <p>{isTurn ? <Timer timerEnd={this.timerEnd}></Timer> : 'Waiting...'}</p>
                    <p>Lives Remaining: {lives}</p>
                </div>
                {form}
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser
    };
}

export default connect(mapStateToProps)(Chatroom);
