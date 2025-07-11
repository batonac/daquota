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

// DDOM Button View Component
export default {
    tagName: 'button',
    
    // Reactive properties
    $label: '',
    $icon: null,
    $iconPosition: 'left',
    $href: null,
    $to: null,
    $buttonType: 'button',
    $variant: 'primary',
    $size: null,
    $pill: false,
    $squared: false,
    $block: false,
    $disabled: false,
    $openLinkInNewWindow: false,
    $draggable: false,
    $class: null,
    $style: null,
    $field: null,
    $dataSource: null,

    // Computed properties
    $displayText: function() {
        return this.$label.get() || '#error#';
    },

    $classList: function() {
        const classes = ['btn'];
        const variant = this.$variant.get();
        const size = this.$size.get();
        const customClass = this.$class.get();
        
        // Don't apply variant if custom bg- class is present
        if (!customClass || customClass.indexOf('bg-') === -1) {
            if (variant && variant !== 'none') {
                classes.push(`btn-${variant}`);
            }
        }
        
        if (size && size !== 'default') {
            classes.push(`btn-${size}`);
        }
        
        if (this.$pill.get()) classes.push('btn-pill');
        if (this.$squared.get()) classes.push('btn-squared'); 
        if (this.$block.get()) classes.push('btn-block');
        if (customClass) classes.push(customClass);
        
        return classes.join(' ');
    },

    $hasIcon: function() {
        return !!this.$icon.get();
    },

    $hasLabel: function() {
        return !!this.$label.get();
    },

    $iconFlexDirection: function() {
        const position = this.$iconPosition.get();
        const mapper = {
            'left': 'row',
            'right': 'row-reverse', 
            'top': 'column',
            'bottom': 'column-reverse'
        };
        return mapper[position] || 'row';
    },

    $renderIcon: function() {
        const icon = this.$icon.get();
        return icon ? `<i class="icon-${icon}"></i>` : '';
    },

    $contentHTML: function() {
        const hasIcon = this.$hasIcon();
        const hasLabel = this.$hasLabel();
        const iconHTML = this.$renderIcon();
        const labelHTML = this.$displayText();
        
        if (hasIcon && hasLabel) {
            return `<div style="display: flex; flex-direction: ${this.$iconFlexDirection()}; justify-content: center; align-items: center; gap: 0.4rem;">
                ${iconHTML}
                <div>${labelHTML}</div>
            </div>`;
        } else if (hasIcon) {
            return iconHTML;
        } else {
            return labelHTML;
        }
    },

    // Component structure
    attributes: {
        'type': '${this.$buttonType}',
        'class': '${this.$classList}',
        'style': '${this.$style}',
        'disabled': function() { return this.$disabled.get() || null; },
        'draggable': '${this.$draggable}',
        'href': '${this.$href}',
        'target': function() { return this.$openLinkInNewWindow.get() ? '_blank' : null; },
        'data-field': '${this.$field}'
    },

    innerHTML: '${this.$contentHTML}',

    // Event handlers
    onclick: function() {
        // Custom click handler - will be bound by the framework
        this.handleClick?.();
    },

    // Methods
    focus: function() {
        this.element?.focus();
    },

    // Property descriptors for the editor
    propertyDescriptors: {
        buttonType: {
            type: 'select',
            label: 'Type',
            literalOnly: true,
            editable: true,
            options: ['button', 'submit', 'reset']
        },
        variant: {
            type: 'select',
            editable: true,
            options: [
                "primary", "secondary", "success", "danger", "warning", "info", "light", "dark",
                "outline-primary", "outline-secondary", "outline-success", "outline-danger", 
                "outline-warning", "outline-info", "outline-light", "outline-dark", "link"
            ]
        },
        size: {
            type: 'select',
            editable: true,
            options: ['default', 'sm', 'lg']
        },
        icon: {
            type: 'icon',
            editable: true
        },
        iconPosition: {
            type: 'select',
            editable: true,
            options: ['left', 'right', 'top', 'bottom']
        },
        openLinkInNewWindow: {
            type: 'checkbox',
            editable: function() { return !!this.$href.get(); }
        },
        pill: {
            type: 'checkbox',
            editable: true,
            category: 'style'
        },
        squared: {
            type: 'checkbox',
            editable: true,
            category: 'style'
        },
        block: {
            type: 'checkbox',
            editable: true,
            category: 'style'
        },
        disabled: {
            type: 'checkbox',
            editable: true
        },
        label: {
            type: 'text',
            editable: true,
            label: 'Button Label'
        }
    }
};


