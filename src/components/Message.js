import React from 'react';

const Message = ({chat, user}) => (
    <li className={`list-group-item ${user === chat.username ? 'text-left' : 'text-right'}`}>
        <p className="text-muted">{chat.username}</p>
        <p>{chat.content}</p>
    </li>
);

export default Message;