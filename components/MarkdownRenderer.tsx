import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    // Fix: Improved markdown parsing to correctly handle code blocks, lists, and other elements.
    const renderMarkdown = (markdownContent: string) => {
        const lines = markdownContent.split('\n');
        const elements: React.ReactNode[] = [];
        let listItems: string[] = [];

        const flushList = (key: string | number) => {
            if (listItems.length > 0) {
                elements.push(
                    <ul key={`ul-${key}`} className="list-disc pl-5 space-y-1 my-3">
                        {listItems.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-slate-700 dark:text-slate-300">{renderInline(item.substring(2))}</li>
                        ))}
                    </ul>
                );
                listItems = [];
            }
        };

        const renderInline = (text: string) => {
            const html = text
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-800 dark:text-slate-200">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code class="bg-slate-200 dark:bg-slate-700 text-sm font-mono rounded px-1 py-0.5">$1</code>');
            return <span dangerouslySetInnerHTML={{ __html: html }} />;
        };

        lines.forEach((line, index) => {
            if (line.startsWith('# ')) {
                flushList(index);
                elements.push(<h1 key={index} className="text-3xl font-extrabold mt-4 mb-6 text-slate-900 dark:text-slate-100">{renderInline(line.substring(2))}</h1>);
            } else if (line.startsWith('## ')) {
                flushList(index);
                elements.push(<h2 key={index} className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-light-border dark:border-dark-border text-slate-900 dark:text-slate-100">{renderInline(line.substring(3))}</h2>);
            } else if (line.startsWith('### ')) {
                flushList(index);
                elements.push(<h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-slate-800 dark:text-slate-200">{renderInline(line.substring(4))}</h3>);
            } else if (line.startsWith('- ')) {
                listItems.push(line);
            } else if (line.trim() !== '') {
                flushList(index);
                elements.push(<p key={index} className="my-3 leading-relaxed text-slate-700 dark:text-slate-300">{renderInline(line)}</p>);
            } else {
                flushList(index);
            }
        });

        flushList(lines.length);
        return elements;
    };

    const parts = content.split(/(```[\s\S]*?```)/g);

    const elements = parts.map((part, index) => {
        if (!part) return null;
        if (part.startsWith('```')) {
            const code = part.replace(/```(.*\n)?/, '').replace(/```$/, '').trim();
            return (
                <pre key={`code-${index}`} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md my-4 overflow-x-auto">
                    <code className="text-sm font-mono text-slate-800 dark:text-slate-300">{code}</code>
                </pre>
            );
        } else {
            return renderMarkdown(part);
        }
    }).flat();

    return <div className="max-w-none">{elements}</div>;
};

export default MarkdownRenderer;