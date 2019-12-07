import React from 'react';

const Message = ({chat, user, appMsg}) => {
    let textAlign;

    if (appMsg) {
        textAlign = 'text-center';
    } else if (user === chat.username) {
        textAlign = 'text-left';
    } else if (user !== chat.username) {
        textAlign = 'text-right'
    }

    return (
        <li className={`list-group-item ${textAlign}`}>
            <p className="text-muted">{chat.username}</p>
            <p>{chat.content}</p>
        </li>
    );
};

export default Message;
