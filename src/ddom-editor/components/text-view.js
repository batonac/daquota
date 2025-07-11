/*
 * DDOM Text View Component
 * A simple text component using declarative DOM instead of Vue.js
 */

import DDOM from '../../declarative-dom/lib/dist/index.js';

export function createTextView(config = {}) {
    const {
        tag = 'p',
        text = '',
        className = '',
        style = {},
        markdown = false,
        ...otherProps
    } = config;

    // Create a DDOM object for the text view
    const textViewDdom = {
        tagName: tag,
        textContent: text,
        className: className,
        style: style,
        ...otherProps
    };

    // If markdown is enabled, we could add markdown processing here
    if (markdown) {
        // For now, just treat as HTML
        textViewDdom.innerHTML = text;
        delete textViewDdom.textContent;
    }

    return textViewDdom;
}

// Example usage:
const exampleTextView = {
    $text: 'Hello from DDOM!',
    $dynamicStyle: 'blue',
    
    // Define the text view component
    children: [
        createTextView({
            tag: 'h2',
            text: '${this.$text}',
            style: {
                color: '${this.$dynamicStyle}',
                padding: '10px',
                border: '1px solid #ccc'
            }
        }),
        createTextView({
            tag: 'p',
            text: 'This is a paragraph using DDOM text view component',
            className: 'demo-paragraph'
        })
    ]
};

export { exampleTextView };