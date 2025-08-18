'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ children, className, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <pre style={{
                background: '#f4f4f4',
                border: '1px solid #ddd',
                borderLeft: '3px solid #f36d33',
                color: '#666',
                pageBreakInside: 'avoid',
                fontFamily: 'monospace',
                fontSize: '15px',
                lineHeight: '1.6',
                marginBottom: '1.6em',
                maxWidth: '100%',
                overflow: 'auto',
                padding: '1em 1.5em',
                display: 'block',
                wordWrap: 'break-word'
              }}>
                <code style={{ background: 'transparent', color: '#333' }} {...props}>
                  {String(children).replace(/\n$/, '')}
                </code>
              </pre>
            ) : (
              <code style={{
                background: '#f4f4f4',
                color: '#666',
                padding: '2px 4px',
                borderRadius: '3px',
                fontSize: '90%',
                fontFamily: 'monospace'
              }} {...props}>
                {children}
              </code>
            )
          },
          h1: ({ children }) => <h1 style={{ fontSize: '2em', margin: '0.67em 0', fontWeight: 'bold' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ fontSize: '1.5em', margin: '0.75em 0', fontWeight: 'bold' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ fontSize: '1.17em', margin: '0.83em 0', fontWeight: 'bold' }}>{children}</h3>,
          h4: ({ children }) => <h4 style={{ fontSize: '1em', margin: '1.12em 0', fontWeight: 'bold' }}>{children}</h4>,
          h5: ({ children }) => <h5 style={{ fontSize: '0.83em', margin: '1.5em 0', fontWeight: 'bold' }}>{children}</h5>,
          h6: ({ children }) => <h6 style={{ fontSize: '0.67em', margin: '1.67em 0', fontWeight: 'bold' }}>{children}</h6>,
          p: ({ children }) => <p style={{ margin: '1em 0', lineHeight: '1.6' }}>{children}</p>,
          ul: ({ children }) => <ul style={{ margin: '1em 0', paddingLeft: '2em', listStyleType: 'disc' }}>{children}</ul>,
          ol: ({ children }) => <ol style={{ margin: '1em 0', paddingLeft: '2em' }}>{children}</ol>,
          li: ({ children }) => <li style={{ margin: '0.5em 0' }}>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote style={{
              margin: '1em 0',
              padding: '0.5em 1em',
              borderLeft: '4px solid #ddd',
              backgroundColor: '#f9f9f9',
              fontStyle: 'italic'
            }}>
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <table style={{
              borderCollapse: 'collapse',
              width: '100%',
              margin: '1em 0'
            }}>
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th style={{
              border: '1px solid #ddd',
              padding: '8px',
              backgroundColor: '#f2f2f2',
              fontWeight: 'bold'
            }}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td style={{
              border: '1px solid #ddd',
              padding: '8px'
            }}>
              {children}
            </td>
          ),
          a: ({ children, href }) => (
            <a href={href} style={{ color: '#1890ff', textDecoration: 'none' }}>
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt} style={{ maxWidth: '100%', height: 'auto' }} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
      <style jsx global>{`
        .markdown-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .markdown-content *:first-child {
          margin-top: 0;
        }
        .markdown-content *:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  )
}

export default MarkdownRenderer