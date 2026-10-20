import { useState } from 'react';
import { Button } from '../../common/Button';
import type { AgentChatChannel, AgentUser } from '../../../types/customerCare';

interface AgentChatTabProps {
  channels: AgentChatChannel[];
  agents: AgentUser[];
  onSendInternalMessage: (channelId: string, text: string) => void;
}

export function AgentChatTab({
  channels,
  agents,
  onSendInternalMessage,
}: AgentChatTabProps) {
  const [selectedChannelId, setSelectedChannelId] = useState<string>(channels[0]?.id || '');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim() || !selectedChannel) return;
    onSendInternalMessage(selectedChannel.id, messageText.trim());
    setMessageText('');
  }

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 16,
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '280px 1fr 240px',
      height: 700,
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    }}>
      {/* Left: Channels and Agent List */}
      <div style={{
        borderRight: '1px solid #e2e8f0',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
            Internal Support Rooms
          </h4>
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              fontSize: 12,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {channels.map((chan) => {
            const isSelected = selectedChannel?.id === chan.id;
            return (
              <div
                key={chan.id}
                onClick={() => setSelectedChannelId(chan.id)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f1f5f9',
                  background: isSelected ? '#f0f9ff' : '#ffffff',
                  borderLeft: isSelected ? '3px solid #0284c7' : '3px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
                    {chan.type === 'group' ? '#' : '💬'} {chan.name}
                  </div>
                  {chan.unreadCount > 0 && (
                    <span style={{
                      background: '#0284c7',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 10,
                    }}>
                      {chan.unreadCount}
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: 11,
                  color: '#64748b',
                  marginTop: 3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {chan.lastMessage}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle: Chat Messages Thread */}
      {selectedChannel ? (
        <div style={{ display: 'flex', flexDirection: 'column', background: '#fafcff' }}>
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                {selectedChannel.name}
              </h4>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                {selectedChannel.members.length} team members participating
              </div>
            </div>
            <span style={{
              background: '#f1f5f9',
              color: '#475569',
              padding: '4px 10px',
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 600,
            }}>
              Internal Only
            </span>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {selectedChannel.messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: '#091e42',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 12,
                  flexShrink: 0,
                }}>
                  {msg.senderAvatar}
                </div>

                <div style={{
                  background: '#ffffff',
                  borderRadius: 12,
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  maxWidth: '85%',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: '#0f172a' }}>{msg.senderName}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>{msg.timestamp}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#334155' }}>{msg.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} style={{
            padding: '14px 20px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: 10,
          }}>
            <input
              type="text"
              placeholder={`Message in ${selectedChannel.name}...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
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
      ) : null}

      {/* Right: Team Agents Directory */}
      <div style={{
        borderLeft: '1px solid #e2e8f0',
        background: '#ffffff',
        padding: '16px',
        overflowY: 'auto',
      }}>
        <h4 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
          Active Agents ({agents.length})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {agents.map((agent) => (
            <div
              key={agent.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 8px',
                borderRadius: 8,
                background: '#f8fafc',
              }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: '#0284c7',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 10,
                }}>
                  {agent.avatar}
                </div>
                <span style={{
                  position: 'absolute',
                  bottom: -1,
                  right: -1,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: agent.isOnline ? '#22c55e' : '#94a3b8',
                }} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {agent.name}
                </div>
                <div style={{ fontSize: 10, color: '#64748b' }}>{agent.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
