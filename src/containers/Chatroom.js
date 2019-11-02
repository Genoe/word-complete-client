import React from 'react';
import ReactDOM from 'react-dom';
// import './App.css';

import Message from '../components/Message.js';

class Chatroom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: [{
                username: 'Wyatt Weisensel',
                content:' Hello World!',
            }, {
                username: 'Taylor Swift',
                content: 'Love it!',
            }, {
                username: 'Wyatt Weisensel',
                content: 'no way!',
            }, {
                username: "Elvis",
                content: 'Lorem ipsum dolor sit amet, nibh ipsum. Cum class sem inceptos incidunt sed sed. Tempus wisi enim id, arcu sed lectus aliquam, nulla vitae est bibendum molestie elit risus.',
            }, {
                username: 'Wyatt Weisensel',
                content: 'So',
            }, {
                username: 'Wyatt Weisensel',
                content: 'This is amazing!',
            }, {
                username: 'Wyatt Weisensel',
                content: 'You can sign-up now to try out our private beta!',
            }, {
                username: 'Taylor Swift',
                content: 'Sounds great!',
            }]
        };
    }

    componentDidMount() {
        this.scrollToBot();
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

export default Chatroom;