import React, { useState } from 'react';
import api from '../common/api';
import { useChat } from './ChatContext';
import { BASE_URL } from '../config';
export const ChatView = () => {
  const { messages, loading, error, addMessage, setLoading, setError } = useChat();
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      addMessage({ text: newMessage, sender: 'user' });
      setNewMessage('');
      setLoading(true);

      try {
        const response = await api.post(`${BASE_URL}chat`, { prompt: newMessage });
        addMessage({ text: response.data.response, sender: 'bot' });
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApiError = (error) => {
    if (error.response && error.response.status === 401) {
      setError('Unauthorized: Please log in again.');
    } else {
      setError(`Error: ${error.message}`);
    }

    console.error('Error fetching response from the server:', error.message);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleSendMessage();
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
              <strong>{message.sender === 'user' ? 'You' : 'Bot'}:</strong> 
              <div dangerouslySetInnerHTML={{ __html: message.text.replace(/(?:\r\n|\r)(?![\n*])/g, '<br />').replace(/<ol>/g, '<ol class="list-decimal" style="padding-left: 20px;">') }} />
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="border rounded-l py-2 px-4 w-3/4 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Waiting...' : 'Send'}
          </button>
        </div>
      </div>

    </main>
  );
};
