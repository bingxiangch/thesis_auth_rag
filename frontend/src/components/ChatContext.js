import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };
  const resetChat = () => {
    setMessages([]);
    setLoading(false);
    setError(null);
  };

  return (
    <ChatContext.Provider value={{ messages, loading, error, addMessage, setLoading, setError, resetChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
