
import React from "react";
import { Link } from "react-router-dom";
export default function ContentRenderer({ content }) {
    return (
        <div className="space-y-6">
            {content.map((block, index) => {
                if (block.type === 'paragraph') {
                    return <p key={index} className="text-gray-700 text-lg leading-relaxed">{block.text}</p>;
                }
                if (block.type === 'heading') {
                    return <h2 key={index} className="text-3xl font-bold text-fuchsia-700 mt-8 mb-4 border-b pb-2">{block.text}</h2>;
                }
                if (block.type === 'list') {
                    return (
                        <ul key={index} className="list-disc list-inside space-y-2 text-gray-700 text-lg ml-4">
                            {block.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    );
                }
                return null;
            })}
        </div>
    );
}