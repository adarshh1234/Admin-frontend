import React from 'react';

export const CompanyLogo: React.FC<{ company: string; className?: string; size?: number }> = ({
  company,
  className = '',
  size = 40
}) => {
  const norm = company.toLowerCase().trim();

  switch (norm) {
    case 'openai':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#000000',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          <svg style={{ width: '60%', height: '60%', fill: '#ffffff' }} viewBox="0 0 24 24">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.8956zm16.5995 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4037-.6669zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.4074 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1636a.0804.0804 0 0 1-.038-.0567V6.0748a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4598a.7948.7948 0 0 0-.3927.6813v6.7219zm1.0932-2.8681l3.1-1.7891 3.1 1.7891v3.5783l-3.1 1.7891-3.1-1.7891z"/>
          </svg>
        </div>
      );

    case 'google':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#ffffff',
            border: '1px solid #e2edf8',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <svg style={{ width: '60%', height: '60%' }} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
        </div>
      );

    case 'stripe':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#635bff',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(99,91,255,0.2)'
          }}
        >
          <span style={{ fontWeight: 900, color: '#ffffff', fontSize: 18 }}>S</span>
        </div>
      );

    case 'apple':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#0f172a',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <svg style={{ width: '55%', height: '55%', fill: '#ffffff' }} viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.66-7.84-11.89-14.4-6.3-9.76-11.19-20.94-14.67-33.54-3.48-12.6-5.22-24.36-5.22-35.29 0-14.28 3.59-26.17 10.77-35.68 7.18-9.5 16.29-14.36 27.34-14.58 4.58 0 9.87 1.25 15.86 3.75 6 2.5 9.77 3.86 11.31 4.08 1.96-.44 5.8-1.85 11.53-4.24 5.72-2.39 10.77-3.47 15.15-3.23 12.83.65 23.06 5.43 30.7 14.35-11.31 6.85-16.85 16.3-16.63 28.37.22 9.35 3.81 17.18 10.77 23.48 6.96 6.3 15.22 9.89 24.78 10.76-2.17 6.74-4.78 13.58-7.83 20.54zM119.22 31.84c0-7.39 2.67-14.29 8.01-20.7 5.33-6.42 11.97-10.47 19.9-12.14.33 1.09.49 2.18.49 3.26 0 7.39-2.83 14.5-8.49 21.32-5.65 6.82-12.44 10.8-20.37 11.95-.22-1.08-.34-2.17-.34-3.26z"/>
          </svg>
        </div>
      );

    case 'tesla':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#ffffff',
            border: '1px solid #fecdd3',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontWeight: 900, color: '#e82127', fontSize: 18, fontFamily: 'serif' }}>T</span>
        </div>
      );

    case 'netflix':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#000000',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontWeight: 900, color: '#e50914', fontSize: 20 }}>N</span>
        </div>
      );

    case 'spotify':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#1ed760',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <svg style={{ width: '60%', height: '60%', fill: '#000000' }} viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.218.358-.684.472-1.042.254-2.855-1.745-6.449-2.14-10.682-1.173-.41.094-.82-.162-.913-.572-.094-.41.162-.82.572-.913 4.637-1.06 8.604-.614 11.81 1.362.358.218.473.684.255 1.042zm1.468-3.264c-.274.446-.86.588-1.306.314-3.268-2.008-8.25-2.59-12.114-1.416-.497.151-1.025-.133-1.176-.63-.151-.497.133-1.025.63-1.176 4.417-1.34 9.907-.693 13.652 1.602.446.274.588.86.314 1.306zm.126-3.41c-3.92-2.328-10.379-2.542-14.113-1.408-.601.183-1.24-.162-1.423-.763-.183-.601.162-1.24.763-1.423 4.29-1.302 11.41-1.055 15.918 1.62.54.321.717 1.022.396 1.562-.32.54-1.02.717-1.541.412z"/>
          </svg>
        </div>
      );

    case 'adobe':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#fa0f00',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontWeight: 900, color: '#ffffff', fontSize: 18 }}>A</span>
        </div>
      );

    case 'discord':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#5865F2',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <svg style={{ width: '60%', height: '60%', fill: '#ffffff' }} viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </div>
      );

    case 'uber':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#000000',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontWeight: 800, color: '#ffffff', fontSize: 11, letterSpacing: -0.5 }}>Uber</span>
        </div>
      );

    case 'anthropic':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#d0b49f',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontWeight: 900,
            color: '#191414',
            fontSize: 16
          }}
        >
          AI
        </div>
      );

    case 'aws':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#232f3e',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>aws</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#ff9900', lineHeight: 1 }}>⌣</span>
        </div>
      );

    case 'revolut':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#000000',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontWeight: 900, color: '#ffffff', fontSize: 18 }}>R</span>
        </div>
      );

    case 'figma':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#1e1e1e',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            padding: 4
          }}
        >
          <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 38 57" fill="none">
            <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
            <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
          </svg>
        </div>
      );

    case 'microsoft':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#ffffff',
            border: '1px solid #e2edf8',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            padding: 8
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: '100%', height: '100%' }}>
            <div style={{ background: '#f25022', borderRadius: 2 }} />
            <div style={{ background: '#7fba00', borderRadius: 2 }} />
            <div style={{ background: '#00a4ef', borderRadius: 2 }} />
            <div style={{ background: '#ffb900', borderRadius: 2 }} />
          </div>
        </div>
      );

    case 'pinterest':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#e60023',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontWeight: 900, color: '#ffffff', fontSize: 20, fontStyle: 'italic', fontFamily: 'serif' }}>P</span>
        </div>
      );

    case 'shopify':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#95bf47',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontWeight: 900, color: '#5e8e3e', background: '#ffffff', fontSize: 12, padding: '2px 4px', borderRadius: 3 }}>S</span>
        </div>
      );

    case 'coinbase':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#0052ff',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontWeight: 900, color: '#ffffff', fontSize: 20 }}>C</span>
        </div>
      );

    case 'notion':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#ffffff',
            border: '1px solid #e2edf8',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ fontWeight: 900, color: '#000000', fontSize: 18, fontFamily: 'serif' }}>N</span>
        </div>
      );

    case 'saroj':
    case 'saroj diagnostic':
    case 'saroj diagnostic laboratory':
      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: '#ffffff',
            border: '1px solid #e2edf8',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            padding: 4,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', fontWeight: 900, fontSize: 11, color: '#eab308' }}>
            <span>sar</span>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', display: 'inline-block', margin: '0 1px' }} />
            <span>j</span>
          </div>
        </div>
      );

    default: {
      // Deterministic vibrant background color based on company name
      const colors = [
        { bg: '#7c3aed', text: '#ffffff' }, // Purple
        { bg: '#15803d', text: '#ffffff' }, // Green
        { bg: '#4f46e5', text: '#ffffff' }, // Indigo
        { bg: '#0284c7', text: '#ffffff' }, // Sky
        { bg: '#d97706', text: '#ffffff' }, // Amber
        { bg: '#e11d48', text: '#ffffff' }, // Rose
        { bg: '#0d9488', text: '#ffffff' }, // Teal
        { bg: '#2563eb', text: '#ffffff' }, // Blue
      ];
      const charCode = norm.charCodeAt(0) || 0;
      const theme = colors[charCode % colors.length];

      return (
        <div
          className={className}
          style={{
            width: size,
            height: size,
            background: theme.bg,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: theme.text,
            fontSize: size > 36 ? 16 : 13,
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          {company.slice(0, 1).toUpperCase()}
        </div>
      );
    }
  }
};
