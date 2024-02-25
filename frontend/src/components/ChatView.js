import React, { useState } from 'react';
import api from '../common/api'
import { useChat } from './ChatContext';
export const ChatView = () => {
  const { messages, loading, error, addMessage, setLoading, setError } = useChat();

  // const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      // Add the user's message to the chat
      // setMessages((prevMessages) => [...prevMessages, { text: newMessage, sender: 'user' }]);

      addMessage({ text: newMessage, sender: 'user' });
      setNewMessage('');
      setLoading(true);

      // Make an API call to get a response
      try {
        const response = await api.post('http://localhost:8001/v1/chat', { prompt: newMessage });
        // setMessages((prevMessages) => [...prevMessages, { text: response.data.response, sender: 'bot' }]);
        addMessage({ text: response.data.response, sender: 'bot' });

      } catch (error) {
        // Check for a 401 Unauthorized error
        if (error.response && error.response.status === 401) {
          setError('Unauthorized: Please log in again.');
        } else {
          setError(`Error: ${error.message}`);
        }
        console.error('Error fetching response from the server:', error.message);
        // Remove the error after 5 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      } finally {
        setLoading(false);
      }

      // Clear the input field
    }
  };

  return (
    <main className="bg-slate-50 p-6 sm:p-10 flex-auto">
      <h1 className="text-xl font-bold text-left mb-4">Chat</h1>
      <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
        <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
          {messages.map((message, index) => (
            <div key={index} style={{ marginBottom: '10px', textAlign: message.sender === 'user' ? 'right' : 'left' }}>
              <strong>{message.sender === 'user' ? 'You' : 'Bot'}:</strong> {message.text}
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="border rounded-l py-2 px-4 w-3/4 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none"
            disabled={loading} // Disable button during loading
          >
            {loading ? 'Waiting...' : 'Send'}
          </button>
        </div>
      </div>
    </main>
  );
};
