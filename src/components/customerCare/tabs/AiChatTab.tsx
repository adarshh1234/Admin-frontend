import { useState } from 'react';
import { Button } from '../../common/Button';
import type { CustomerConversation, AgentUser } from '../../../types/customerCare';

interface AiChatTabProps {
  conversations: CustomerConversation[];
  agents: AgentUser[];
  onTakeOverAi: (conversationId: string, agentName: string) => void;
  onSendMessage: (conversationId: string, text: string) => void;
}

export function AiChatTab({
  conversations,
  agents,
  onTakeOverAi,
  onSendMessage,
}: AiChatTabProps) {
  const [selectedChatId, setSelectedChatId] = useState<string>(
    conversations.find((c) => c.handledBy === 'AI Bot')?.id || conversations[0]?.id || '',
  );
  const [takeoverNotice, setTakeoverNotice] = useState<string | null>(null);

  const selectedConv = conversations.find((c) => c.id === selectedChatId) || conversations[0];

  function handleTakeover() {
    if (!selectedConv) return;
    onTakeOverAi(selectedConv.id, 'David Chen');
    setTakeoverNotice(`You have taken over the session for ${selectedConv.customerName}.`);
    setTimeout(() => setTakeoverNotice(null), 3000);
  }

  const aiConversations = conversations.filter((c) => c.handledBy === 'AI Bot');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner: AI Overview */}
      <div style={{
        background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
        borderRadius: 16,
        padding: '20px 24px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255,255,255,0.2)',
            padding: '3px 10px',
            borderRadius: 12,
            fontSize: 11,
            fontWeight: 700,
            marginBottom: 8,
          }}>
            <i className="fas fa-sparkles" /> AI Copilot Engine Active
          </div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
            Autonomous AI Customer Support Sessions
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.9 }}>
            Review real-time AI responses, intent recognition confidence scores, and take over any active chat.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 16px', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{aiConversations.length}</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>AI Handling</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 16px', borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>96.8%</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Confidence Avg</div>
          </div>
        </div>
      </div>

      {takeoverNotice && (
        <div style={{
          padding: '12px 16px',
          background: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: 10,
          color: '#15803d',
          fontSize: 13,
          fontWeight: 600,
        }}>
          <i className="fas fa-check-circle" style={{ marginRight: 6 }} />
          {takeoverNotice}
        </div>
      )}

      {/* Main Grid: AI Chats List & Live Monitor */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        gap: 20,
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        height: 640,
        overflow: 'hidden',
      }}>
        {/* Left: AI Sessions List */}
        <div style={{ borderRight: '1px solid #e2e8f0', overflowY: 'auto' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
              All Live Customer Chats ({conversations.length})
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {conversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id;
              const isAi = conv.handledBy === 'AI Bot';

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChatId(conv.id)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    background: isSelected ? '#faf5ff' : '#ffffff',
                    borderLeft: isSelected ? '3px solid #7c3aed' : '3px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
                      {conv.customerName}
                    </span>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: isAi ? '#f3e8ff' : '#eff6ff',
                      color: isAi ? '#7c3aed' : '#2563eb',
                    }}>
                      {isAi ? '🤖 AI Bot' : '👤 Human Agent'}
                    </span>
                  </div>

                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                    {conv.customerCompany} • {conv.channel}
                  </div>

                  <div style={{ fontSize: 12, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.lastMessage}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Inspection Window */}
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
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                    {selectedConv.customerName}
                  </span>
                  <span style={{
                    background: selectedConv.handledBy === 'AI Bot' ? '#f3e8ff' : '#eff6ff',
                    color: selectedConv.handledBy === 'AI Bot' ? '#7c3aed' : '#2563eb',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 12,
                  }}>
                    {selectedConv.handledBy === 'AI Bot' ? '🤖 Handled by AI Bot' : '👤 Handled by Human Agent'}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {selectedConv.customerCompany} • Channel: {selectedConv.channel}
                </div>
              </div>

              {selectedConv.handledBy === 'AI Bot' && (
                <Button type="button" variant="primary" onClick={handleTakeover}>
                  <i className="fas fa-hand-paper" style={{ marginRight: 6 }} />
                  Take Over Conversation
                </Button>
              )}
            </div>

            {/* Messages Thread */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}>
              {selectedConv.messages.map((msg) => {
                const isAi = msg.senderType === 'ai';
                return (
                  <div
                    key={msg.id}
                    style={{
                      background: isAi ? '#f5f3ff' : '#ffffff',
                      border: isAi ? '1px solid #ddd6fe' : '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '12px 16px',
                      maxWidth: '85%',
                      alignSelf: msg.senderType === 'customer' ? 'flex-start' : 'flex-end',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: isAi ? '#7c3aed' : '#0f172a',
                      }}>
                        {msg.senderName} {isAi && '(Confidence: 98%)'}
                      </span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{msg.timestamp}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#1e293b' }}>{msg.text}</div>
                  </div>
                );
              })}
            </div>

            {/* AI Suggestion Bar */}
            <div style={{
              padding: '12px 20px',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              fontSize: 12,
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span>
                <i className="fas fa-microchip" style={{ color: '#7c3aed', marginRight: 6 }} />
                AI Model: <strong>Curemaso Clinical LLM v2.4 (Enterprise RAG)</strong>
              </span>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>API Status: Ready</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
