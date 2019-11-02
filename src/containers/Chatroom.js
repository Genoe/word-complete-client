import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { subscribeToChat, emitMessage, emitUsername, subscribeToMatchingService, subscribeToMatchFound } from '../services/socket';

import Message from '../components/Message.js';

class Chatroom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: [{
                username: 'Wyatt Weisensel (Word Complete Creator)',
                content:'Welcome to a new game!',
            }],

            opponentUsername: 'Wyatt Weisensel (Word Complete Creator)'
        };

    }

    componentDidMount() {
        this.scrollToBot();

        // After a username has been sent back to the server, wait for a match
        subscribeToMatchingService((err, msg) => {
            if (err) {
                this.setState({
                    chats: this.state.chats.concat(JSON.stringify(err)),
                });
            }

            this.setState({
                chats: this.state.chats.concat({username: this.state.opponentUsername, content: msg}),
            });
        });

        subscribeToChat((err, msg) => this.setState({
            // timestamp
            chats: this.state.chats.concat({username: this.state.opponentUsername, content: msg}),
        }));

        subscribeToMatchFound((err, msg) => this.setState({
            opponentUsername: msg
        }));
        // TODO: set opponentUsername back to default when other player disconnects
        emitUsername(this.props.currentUser.user.username);
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot = () => {
        var scrollingElement = (document.scrollingElement || document.body); /* you could provide your scrolling element with react ref */
        scrollingElement.scrollTop = scrollingElement.scrollHeight;
    }

    submitMessage = (e) => {
        e.preventDefault();

        this.setState({
            chats: this.state.chats.concat([{
                username: 'Wyatt Weisensel',
                content: ReactDOM.findDOMNode(this.refs.newWord).value,
            }])
        }, () => {
            ReactDOM.findDOMNode(this.refs.newWord).value = '';
        });
    }

    render() {
        const username = 'Wyatt Weisensel';
        const { chats } = this.state;

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
                <form className="form-inline justify-content-md-center" onSubmit={(e) => this.submitMessage(e)}>
                    <label className="sr-only" htmlFor="newWord">New Word</label>
                    <input type="text" className="form-control mb-2 mr-sm-2" id="newWord" placeholder="Enter a word!" ref="newWord" />
                    <input type="submit" className="btn btn-primary mb-2 mr-sm-2" value="Submit" />
                </form>
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