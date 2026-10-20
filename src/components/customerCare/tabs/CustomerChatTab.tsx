import { useState } from 'react';
import { Button } from '../../common/Button';
import type { CustomerConversation, AgentUser } from '../../../types/customerCare';

interface CustomerChatTabProps {
  conversations: CustomerConversation[];
  agents: AgentUser[];
  onSendMessage: (conversationId: string, text: string) => void;
  onTakeOverAi: (conversationId: string, agentName: string) => void;
  onResolveChat: (conversationId: string) => void;
}

export function CustomerChatTab({
  conversations,
  agents,
  onSendMessage,
  onTakeOverAi,
  onResolveChat,
}: CustomerChatTabProps) {
  const [selectedChatId, setSelectedChatId] = useState<string>(conversations[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  const selectedConv = conversations.find((c) => c.id === selectedChatId) || conversations[0];

  const filteredConversations = conversations.filter((c) => {
    return (
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedConv) return;
    onSendMessage(selectedConv.id, inputMessage.trim());
    setInputMessage('');
  }

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 16,
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '320px 1fr 280px',
      height: 720,
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    }}>
      {/* Left Column: Conversations List */}
      <div style={{
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
      }}>
        {/* Search header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
              Customer Inquiries
            </h4>
            <span style={{
              background: '#e0f2fe',
              color: '#0369a1',
              padding: '2px 8px',
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 700,
            }}>
              {conversations.length} Live
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px 8px 30px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 12,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <i className="fas fa-search" style={{ position: 'absolute', left: 10, top: 10, color: '#94a3b8', fontSize: 12 }} />
          </div>
        </div>

        {/* Conversation Items */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConversations.map((conv) => {
            const isSelected = selectedConv?.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedChatId(conv.id)}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #f1f5f9',
                  background: isSelected ? '#f0f9ff' : '#ffffff',
                  borderLeft: isSelected ? '3px solid #0284c7' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: '#0284c7',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 11,
                      }}>
                        {conv.customerAvatar}
                      </div>
                      <span style={{
                        position: 'absolute',
                        bottom: -1,
                        right: -1,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: conv.isOnline ? '#22c55e' : '#94a3b8',
                        border: '1.5px solid #ffffff',
                      }} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
                      {conv.customerName}
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{conv.lastMessageTime}</span>
                </div>

                <div style={{
                  fontSize: 12,
                  color: '#64748b',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: 6,
                }}>
                  {conv.lastMessage}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: conv.handledBy === 'AI Bot' ? '#faf5ff' : '#f0fdf4',
                    color: conv.handledBy === 'AI Bot' ? '#9333ea' : '#16a34a',
                  }}>
                    {conv.handledBy === 'AI Bot' ? '🤖 AI Bot' : '👤 Agent'}
                  </span>

                  <span style={{
                    fontSize: 10,
                    color: '#64748b',
                    background: '#f1f5f9',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}>
                    {conv.channel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Column: Chat Conversation Thread */}
      {selectedConv ? (
        <div style={{ display: 'flex', flexDirection: 'column', background: '#fafcff' }}>
          {/* Top Bar */}
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
              }}>
                {selectedConv.customerAvatar}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                    {selectedConv.customerName}
                  </span>
                  <span style={{
                    fontSize: 11,
                    color: selectedConv.isOnline ? '#16a34a' : '#94a3b8',
                    fontWeight: 600,
                  }}>
                    • {selectedConv.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {selectedConv.customerCompany} • {selectedConv.customerEmail}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {selectedConv.handledBy === 'AI Bot' ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => onTakeOverAi(selectedConv.id, 'David Chen')}
                >
                  <i className="fas fa-hand-paper" style={{ marginRight: 6 }} />
                  Take Over Chat
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onResolveChat(selectedConv.id)}
                >
                  <i className="fas fa-check" style={{ marginRight: 6 }} />
                  Mark Resolved
                </Button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}>
            {selectedConv.messages.map((msg) => {
              const isAgent = msg.senderType === 'agent';
              const isAi = msg.senderType === 'ai';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignSelf: isAgent ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                  }}
                >
                  <div style={{
                    background: isAgent ? '#0066cc' : isAi ? '#f5f3ff' : '#ffffff',
                    color: isAgent ? '#ffffff' : '#1e293b',
                    borderRadius: 14,
                    padding: '10px 14px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: isAgent ? 'none' : isAi ? '1px solid #ddd6fe' : '1px solid #e2e8f0',
                  }}>
                    <div style={{
                      fontSize: 11,
                      fontWeight: 700,
                      marginBottom: 3,
                      color: isAgent ? 'rgba(255,255,255,0.9)' : isAi ? '#6d28d9' : '#0284c7',
                    }}>
                      {msg.senderName} {isAi && '(Automated Support)'}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.4 }}>{msg.text}</div>
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: '#94a3b8',
                    marginTop: 2,
                    alignSelf: isAgent ? 'flex-end' : 'flex-start',
                  }}>
                    {msg.timestamp}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} style={{
            padding: '14px 20px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: 10,
          }}>
            <input
              type="text"
              placeholder="Type message to customer..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
              }}
            />
            <Button type="submit" variant="primary">
              <i className="fas fa-paper-plane" />
            </Button>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8e9bb5' }}>
          Select a conversation from the left queue
        </div>
      )}

      {/* Right Column: Customer Info & Live Telemetry Panel */}
      {selectedConv && (
        <div style={{
          borderLeft: '1px solid #e2e8f0',
          background: '#ffffff',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          overflowY: 'auto',
        }}>
          <div>
            <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
              Customer Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b' }}>Entity:</span>{' '}
                <strong>{selectedConv.customerCompany}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b' }}>Channel:</span>{' '}
                <strong>{selectedConv.channel}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b' }}>Customer Sentiment:</span>{' '}
                <strong style={{ color: '#16a34a' }}>{selectedConv.sentiment}</strong>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
              Quick Macro Responses
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Hello, how can I assist you today?',
                'I am investigating this with our technical engineering team.',
                'Your ticket has been logged and prioritized.',
                'Thank you for contacting Curemaso Support!',
              ].map((macro) => (
                <button
                  key={macro}
                  type="button"
                  onClick={() => setInputMessage(macro)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: 11,
                    color: '#334155',
                    textAlign: 'left',
                    cursor: 'pointer',
                    lineHeight: 1.3,
                  }}
                >
                  "{macro}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
