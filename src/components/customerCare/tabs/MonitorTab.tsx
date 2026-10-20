import type { SupportTicket, CustomerConversation, AgentUser } from '../../../types/customerCare';

interface MonitorTabProps {
  tickets: SupportTicket[];
  conversations: CustomerConversation[];
  agents: AgentUser[];
}

export function MonitorTab({ tickets, conversations, agents }: MonitorTabProps) {
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const pendingCount = tickets.filter((t) => t.status === 'Pending').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

  const activeChats = conversations.filter((c) => c.status === 'Active').length;
  const aiChats = conversations.filter((c) => c.handledBy === 'AI Bot').length;
  const onlineAgents = agents.filter((a) => a.isOnline).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Real-time Status Header */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: '20px 24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
            }} />
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              Live Support Operations Telemetry
            </h3>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Real-time queue monitoring, workload distribution, and SLA threshold adherence
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: '#475569' }}>
          <div>
            Queue Status: <strong style={{ color: '#16a34a' }}>HEALTHY (0 Bottlenecks)</strong>
          </div>
          <div>
            System Time: <strong>{new Date().toLocaleTimeString()}</strong>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
      }}>
        <div style={{ background: '#ffffff', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#0284c7' }}>OPEN TICKETS</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{openCount}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>In triage queue</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#b45309' }}>IN PROGRESS</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{inProgressCount}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Assigned to agents</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#7e22ce' }}>PENDING CUSTOMER</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{pendingCount}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Awaiting customer response</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>RESOLVED TODAY</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{resolvedCount}</div>
          <div style={{ fontSize: 11, color: '#16a34a', marginTop: 2 }}>★ 99.2% satisfaction</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#2563eb' }}>ACTIVE CHATS</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{activeChats}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{aiChats} handled by AI</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#0891b2' }}>AGENTS ONLINE</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{onlineAgents}/{agents.length}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Tier 1 & Tier 2 active</div>
        </div>
      </div>

      {/* Support Telemetry Benchmarks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        <div style={{ background: '#ffffff', borderRadius: 16, padding: 22, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Average First Response
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '8px 0 4px' }}>
            1m 24s
          </div>
          <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
            ↓ 18% faster than 3-minute SLA benchmark
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 16, padding: 22, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Average Resolution Time
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '8px 0 4px' }}>
            18m 40s
          </div>
          <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
            ↓ 42% faster than industry standard
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: 16, padding: 22, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Enterprise SLA Adherence
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '8px 0 4px' }}>
            98.4%
          </div>
          <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
            Target: 95.0% • 0 Breaches this month
          </div>
        </div>
      </div>

      {/* Agent Workload Distribution Table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: 24,
        border: '1px solid #e2e8f0',
      }}>
        <h4 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
          Agent Capacity & Workload Balance
        </h4>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Agent</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Active Chats</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Open Tickets</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>Capacity Load</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>CSAT Rating</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => {
              const totalItems = agent.activeChatsCount + agent.openTicketsCount;
              const loadPercentage = Math.min(100, Math.round((totalItems / 10) * 100));

              return (
                <tr key={agent.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{agent.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{agent.role}</div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      background: agent.isOnline ? '#dcfce7' : '#f1f5f9',
                      color: agent.isOnline ? '#15803d' : '#64748b',
                    }}>
                      {agent.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{agent.activeChatsCount}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{agent.openTicketsCount}</td>

                  <td style={{ padding: '12px 16px', width: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          width: `${loadPercentage}%`,
                          height: '100%',
                          background: loadPercentage > 75 ? '#f59e0b' : '#0284c7',
                        }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{loadPercentage}%</span>
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>
                    ★ {agent.rating}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
