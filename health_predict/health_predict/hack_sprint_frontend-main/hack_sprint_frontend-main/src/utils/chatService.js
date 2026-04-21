import apiClient from './api.js';

class ChatService {
  constructor() {
    this.sessionId = null;
    this.conversationHistory = [];
  }

  /**
   * Start a new chat session
   */
  async startChatSession() {
    try {
      console.log('ChatService: Starting new chat session...');
      
      const response = await apiClient.post('/chat/start');
      
      if (response.success && response.data) {
        this.sessionId = response.data.sessionId;
        this.conversationHistory = []; // Reset conversation history
        
        console.log('Chat session started successfully:', this.sessionId);
        
        return {
          success: true,
          data: {
            sessionId: this.sessionId,
            welcomeMessage: response.data.welcomeMessage,
            userId: response.data.userId
          },
          message: response.message
        };
      } else {
        throw new Error('Invalid response from chat service');
      }
    } catch (error) {
      console.error('Error starting chat session:', error);
      throw new Error(error.message || 'Failed to start chat session');
    }
  }

  /**
   * Send message to chatbot and get response
   */
  async sendMessage(message) {
    try {
      if (!this.sessionId) {
        throw new Error('No active chat session. Please start a session first.');
      }

      if (!message || message.trim() === '') {
        throw new Error('Message cannot be empty');
      }

      console.log('ChatService: Sending message...');
      console.log('Session ID:', this.sessionId);
      console.log('Message:', message);
      console.log('Conversation History Length:', this.conversationHistory.length);

      const requestData = {
        sessionId: this.sessionId,
        message: message.trim(),
        conversationHistory: this.conversationHistory
      };

      const response = await apiClient.post('/chat', requestData);

      if (response.success && response.data) {
        // Add user message to history
        this.conversationHistory.push({
          role: "user",
          parts: [{ text: message.trim() }]
        });

        // Add bot response to history
        this.conversationHistory.push({
          role: "model",
          parts: [{ text: response.data.botResponse }]
        });

        console.log('Chat response received successfully');
        
        return {
          success: true,
          data: {
            sessionId: response.data.sessionId,
            userMessage: response.data.userMessage,
            botResponse: response.data.botResponse,
            timestamp: response.data.timestamp
          },
          message: response.message
        };
      } else {
        throw new Error('Invalid response from chat service');
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw new Error(error.message || 'Failed to send message');
    }
  }

  /**
   * Get current session info
   */
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      conversationLength: this.conversationHistory.length,
      isActive: !!this.sessionId
    };
  }

  /**
   * End current chat session
   */
  endChatSession() {
    console.log('Ending chat session:', this.sessionId);
    this.sessionId = null;
    this.conversationHistory = [];
  }

  /**
   * Get conversation history for display
   */
  getConversationHistory() {
    return this.conversationHistory.map((item, index) => ({
      id: index,
      type: item.role === 'user' ? 'user' : 'bot',
      message: item.parts[0]?.text || '',
      timestamp: new Date().toISOString() // In real app, you'd store actual timestamps
    }));
  }

  /**
   * Clear conversation history (but keep session active)
   */
  clearHistory() {
    this.conversationHistory = [];
    console.log('Conversation history cleared');
  }

  /**
   * Validate message before sending
   */
  validateMessage(message) {
    const errors = {};

    if (!message || typeof message !== 'string') {
      errors.message = 'Message is required and must be text';
    } else {
      const trimmedMessage = message.trim();
      if (trimmedMessage === '') {
        errors.message = 'Message cannot be empty';
      } else if (trimmedMessage.length > 1000) {
        errors.message = 'Message is too long (max 1000 characters)';
      }
    }

    if (!this.sessionId) {
      errors.session = 'No active chat session';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Get suggested questions/prompts
   */
  getSuggestedPrompts() {
    return [
      "I have flu symptoms",
      "What are the signs of high blood pressure?",
      "I'm experiencing chest pain",
      "How can I improve my sleep quality?",
      "What should I do for a headache?",
      "I need information about diabetes",
      "Tell me about healthy diet tips",
      "I have digestive issues"
    ];
  }

  /**
   * Format conversation for export or sharing
   */
  exportConversation() {
    const conversation = this.getConversationHistory();
    return {
      sessionId: this.sessionId,
      exportDate: new Date().toISOString(),
      messageCount: conversation.length,
      messages: conversation
    };
  }
}

// Export singleton instance
const chatService = new ChatService();
export default chatService;