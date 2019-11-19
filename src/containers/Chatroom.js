import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { 
    subscribeToChat, 
    emitMessage, 
    emitUsername, 
    subscribeToMatchingService, 
    subscribeToMatchFound, 
    subscribeToOppDiscnt, 
    disconnect,
    connectChat,
    subscribeToBadWord,
    subscribeToGameOver,
} from '../services/socket';

import Message from '../components/Message.js';

const DEFAULT_USER = 'Wyatt Weisensel (Word Complete Creator)';

class Chatroom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: [{
                username: DEFAULT_USER,
                content:'Welcome to a new game!!',
            }],
            showNewGameBtn: false,
            isTurn: false,
        };

        this.opponentUsername = DEFAULT_USER;
    }

    setUpSocketIO() {

       
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
                isTurn: msgObj.isTurn
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

    render() {
        const username = this.props.currentUser.user.username;
        const { chats, showNewGameBtn, isTurn } = this.state;
        var form;

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
                    <input type="submit" className="btn btn-primary mb-2 mr-sm-2" value="Submit" disabled={!isTurn}/>
                </form>
        }

        return (
            <div>
                <h3 className="text-center">Let's Play!</h3>
                <ul className="list-group" ref="chats">
                    {
                        chats.map((chat, i) => 
                            <Message chat={chat} user={username} key={i}/>
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
