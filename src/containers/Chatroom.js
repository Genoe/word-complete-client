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
    connectChat,
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
            showNewGameBtn: false,
            isTurn: false,
        };

        this.opponentUsername = DEFAULT_USER;
    }
    
    componentDidMount() {
        console.log('chatroom did mount');
        this.scrollToBot();

         // After a username has been sent back to the server, wait for a match
         subscribeToMatchingService((err, msg) => {
            if (err) {
                this.setState({
                    chats: this.state.chats.concat(JSON.stringify(err)),
                });
            }

            this.setState({
                chats: this.state.chats.concat({username: this.opponentUsername, content: msg}),
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
            this.setState({
                chats: this.state.chats.concat({username: this.opponentUsername, content: msgObj.msg}),
                isTurn: msgObj.isTurn
            });
        });

        subscribeToGameOver((err, msgObj) => {
            this.setState({
                chats: this.state.chats.concat({
                    username: DEFAULT_USER,
                    content: msgObj.msg
                }),
                showNewGameBtn: true,
                isTurn: false,
            });

            this.opponentUsername = DEFAULT_USER;

            disconnect();
        });

        emitUsername(this.props.currentUser.user.username);
    }

    componentDidUpdate() {
        console.log('chatroom did update');
        this.scrollToBot();
    }

    componentWillUnmount() {
        console.log('chatroom will unmount');
        disconnect();
    }

    scrollToBot = () => {
        var scrollingElement = (document.scrollingElement || document.body); /* you could provide your scrolling element with react ref */
        scrollingElement.scrollTop = scrollingElement.scrollHeight;
    }

    submitMessage = (e) => {
        e.preventDefault();

        emitMessage(ReactDOM.findDOMNode(this.refs.newWord).value, () => {
            this.setState({
                isTurn: !this.state.isTurn,
                chats: this.state.chats.concat([{
                    username: this.props.currentUser.user.username,
                    content: ReactDOM.findDOMNode(this.refs.newWord).value.toLowerCase(),
                }]),
            }, () => {
                ReactDOM.findDOMNode(this.refs.newWord).value = '';
            });
        });
    }

    startNewGame = (e) => {
        e.preventDefault();
        connectChat();
        emitUsername(this.props.currentUser.user.username);

        this.setState({
            showNewGameBtn: false,
        });
    }

    timerEnd = () => {
        emitTimerEnd();
    }

    render() {
        const username = this.props.currentUser.user.username;
        const { chats, showNewGameBtn, isTurn } = this.state;
        const rules = {
            username: DEFAULT_USER,
            content: `Welcome to a new game!! After an opponent is found, one player will say a word.
            Then the other player responds with a word that begins with the ending letter of the previous word.
            For example: Dog -> Goat -> Taco -> Orange -> Ear. Words are not case sensitive.
            Words cannot be repeated. After three mistakes, the other player wins.`
        }
        const jpnRules = {
            username: DEFAULT_USER,
            content: `新しいゲームへようこそ!! 対戦相手が見つかった後、1人のプレイヤーが単語を言うと、
            他のプレイヤーは前の単語の終了文字で始まる単語で応答します。 例：Dog -> Goat -> Taco -> Orange -> Ear.。 
            単語は大文字と小文字を区別しません。 言葉を繰り返すことはできません。 3つのミスの後、他のプレイヤーが勝ちます。`
        }
        let form;

        if (showNewGameBtn) {
            form = 
            <form className="form-inline justify-content-md-center" onSubmit={(e) => this.startNewGame(e)}>
                <input type="submit" className="btn btn-primary mb-2 mr-sm-2" value="New Game!" />
            </form>
        } else {
            form = 
                <form className="form-inline justify-content-md-center" onSubmit={(e) => this.submitMessage(e)}>
                    <label className="sr-only" htmlFor="newWord">New Word</label>
                    <input type="text" className="form-control mb-2 mr-sm-2" id="newWord" placeholder="Enter a word!" ref="newWord" />
                    <input type="submit" className="btn btn-primary mb-2 mr-sm-2" value={isTurn ? 'Submit' : 'Please Wait'} disabled={!isTurn}/>
                </form>
        }

        return (
            <div>
                <h3 className="text-center">Let's Play!</h3>
                {isTurn && 
                    <Timer timerEnd={this.timerEnd}></Timer> 
                }
                               
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
                
                {form}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.currentUser
    };
}

export default connect(mapStateToProps)(Chatroom);
