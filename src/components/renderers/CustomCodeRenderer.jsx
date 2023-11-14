'use client'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
function CustomCodeRenderer({ data }) {
  (data)
// TODO: Add automatic language detection
  return (
    <pre className='bg-gray-800 rounded-md p-4'>
      <SyntaxHighlighter wrapLines={true} className=' text-sm' language="javascript" style={atomOneDark}>{data.code}</SyntaxHighlighter>
    </pre>
  )
}

export default CustomCodeRenderer
