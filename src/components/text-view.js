/*
 * d.Lite - low-code platform for local-first Web/Mobile development
 * Copyright (C) 2021-2023 CINCHEO
 *                         https://www.cincheo.com
 *                         renaud.pawlak@cincheo.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// DDOM Text View Component
export default {
    tagName: 'text-view',
    
    // Reactive properties
    $text: '',
    $tag: 'div', 
    $variant: null,
    $pill: false,
    $markdown: false,
    $draggable: false,
    $field: null,
    $dataType: 'string',
    $dataSource: null,
    $class: null,
    $style: null,
    
    // Computed properties
    $displayText: function() {
        let text = this.$text.get() || this.$value?.get() || '';
        if (typeof text !== 'string') {
            return text === undefined ? '#undefined#' : '#invalid data#';
        }
        return this.$markdown.get() ? markdownToHtml(text) : text;
    },

    $tagName: function() {
        const tag = this.$tag.get();
        // Handle special tags
        if (tag === 'badge') return 'span';
        if (tag === 'alert') return 'div';
        return tag;
    },

    $classList: function() {
        const classes = [];
        const customClass = this.$class.get();
        const tag = this.$tag.get();
        const variant = this.$variant.get();
        
        if (tag === 'badge') {
            classes.push('badge');
            if (variant) classes.push(`badge-${variant}`);
            if (this.$pill.get()) classes.push('badge-pill');
        } else if (tag === 'alert') {
            classes.push('alert');
            if (variant) classes.push(`alert-${variant}`);
        }
        
        if (customClass) classes.push(customClass);
        return classes.join(' ');
    },

    // Component structure
    attributes: {
        'data-field': '${this.$field}',
        'data-timestamp': function() { return Date.now(); },
        'draggable': '${this.$draggable}',
        'class': '${this.$classList}',
        'style': '${this.$style}'
    },

    innerHTML: '${this.$displayText}',

    // Property descriptors for the editor
    propertyDescriptors: {
        tag: {
            type: 'select',
            label: 'Enclosing element type',
            editable: true,
            description: 'The wrapping element being used - default is "Block"',
            options: [
                { value: "div", text: "Block" },
                { value: "p", text: "Paragraph" },
                { value: "h1", text: "Heading 1" },
                { value: "h2", text: "Heading 2" },
                { value: "h3", text: "Heading 3" },
                { value: "h4", text: "Heading 4" },
                { value: "h5", text: "Heading 5" },
                { value: "h6", text: "Heading 6" },
                { value: "badge", text: "Badge" },
                { value: "alert", text: "Alert" },
                { value: "b", text: "Bold" },
                { value: "i", text: "Italic" },
                { value: "u", text: "Underline" },
                { value: "del", text: "Line-through" }
            ]
        },
        text: {
            label: 'Text or HTML (overrides the data model)',
            type: 'code/html',
            editable: true,
            rows: 6,
            maxRows: 30
        },
        variant: {
            type: 'select',
            hidden: function() { return !(this.$tag.get() === 'badge' || this.$tag.get() === 'alert'); },
            options: [
                "primary", "secondary", "success", "danger", "warning", "info", "light", "dark",
                "outline-primary", "outline-secondary", "outline-success", "outline-danger", 
                "outline-warning", "outline-info", "outline-light", "outline-dark", "link"
            ]
        },
        pill: {
            type: 'checkbox',
            hidden: function() { return this.$tag.get() !== 'badge'; },
            category: 'style'
        },
        dataType: {
            type: 'select',
            options: ['string', 'number', 'boolean', 'date'],
            category: 'data',
            description: 'The data type that can be selected from the options'
        },
        markdown: {
            label: 'Enable markdown syntax',
            type: 'checkbox',
            docLink: 'https://www.markdownguide.org/basic-syntax'
        }
    }
};


