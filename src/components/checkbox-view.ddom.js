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

// DDOM Checkbox View Component
export default {
    tagName: 'checkbox-view',
    
    // Reactive properties
    $label: '',
    $value: false,
    $switch: false,
    $required: false,
    $disabled: false,
    $size: null,
    $horizontalLayout: false,
    $description: '',
    $validFeedback: null,
    $invalidFeedback: null,
    $state: null, // null, true (valid), false (invalid)
    $field: null,
    $dataSource: null,
    $class: null,
    $style: null,
    $labelClass: null,
    $draggable: false,

    // Computed properties
    $checkboxClass: function() {
        const classes = [];
        const size = this.$size.get();
        
        if (this.$switch.get()) {
            classes.push('custom-switch');
        } else {
            classes.push('custom-checkbox');
        }
        
        if (size) classes.push(`custom-control-${size}`);
        
        return classes.join(' ');
    },

    $inputId: function() {
        return `checkbox_${this.cid || Math.random().toString(36).substr(2, 9)}`;
    },

    $labelForId: function() {
        return this.$horizontalLayout.get() ? null : this.$inputId();
    },

    // Component structure
    children: function() {
        const horizontalLayout = this.$horizontalLayout.get();
        const label = this.$label.get();
        const description = this.$description.get();
        const state = this.$state.get();
        const validFeedback = this.$validFeedback.get();
        const invalidFeedback = this.$invalidFeedback.get();

        const checkboxElement = {
            tagName: 'input',
            attributes: {
                'id': this.$inputId(),
                'type': 'checkbox',
                'class': 'form-check-input',
                'checked': function() { return this.$value.get(); },
                'required': function() { return this.$required.get() || null; },
                'disabled': function() { return this.$disabled.get() || null; },
                'data-field': '${this.$field}',
                'aria-describedby': function() {
                    return description ? `${this.$inputId()}_help` : null;
                }
            },
            onchange: function(event) {
                this.$value.set(event.target.checked);
                this.handleChange?.(event.target.checked);
            },
            oninput: function(event) {
                this.handleInput?.(event.target.checked);
            }
        };

        const labelElement = label ? {
            tagName: 'label',
            attributes: {
                'for': this.$inputId(),
                'class': function() {
                    const classes = ['form-check-label'];
                    const labelClass = this.$labelClass.get();
                    if (labelClass) classes.push(labelClass);
                    return classes.join(' ');
                }
            },
            textContent: label
        } : null;

        const descriptionElement = description ? {
            tagName: 'div',
            attributes: {
                'id': `${this.$inputId()}_help`,
                'class': 'form-text'
            },
            textContent: description,
            style: {
                fontSize: '0.875rem',
                color: '#6c757d',
                marginTop: '0.25rem'
            }
        } : null;

        const validFeedbackElement = state === true && validFeedback ? {
            tagName: 'div',
            textContent: validFeedback,
            attributes: { 'class': 'valid-feedback' },
            style: { color: '#198754', fontSize: '0.875rem', marginTop: '0.25rem' }
        } : null;

        const invalidFeedbackElement = state === false && invalidFeedback ? {
            tagName: 'div',
            textContent: invalidFeedback,
            attributes: { 'class': 'invalid-feedback' },
            style: { color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }
        } : null;

        // Main form group container
        const formGroup = {
            tagName: 'div',
            attributes: {
                'class': function() {
                    const classes = ['form-check'];
                    if (this.$switch.get()) classes.push('form-switch');
                    return classes.join(' ');
                }
            },
            children: [
                checkboxElement,
                labelElement,
                descriptionElement,
                validFeedbackElement,
                invalidFeedbackElement
            ].filter(Boolean)
        };

        return [formGroup];
    },

    // Container attributes
    attributes: {
        'class': '${this.$class}',
        'style': '${this.$style}',
        'draggable': '${this.$draggable}',
        'data-timestamp': function() { return Date.now(); }
    },

    // Event handlers
    onclick: function(event) {
        this.handleClick?.(event);
    },

    // Methods
    focus: function() {
        const checkbox = this.element?.querySelector('input[type="checkbox"]');
        checkbox?.focus();
    },

    toggle: function() {
        this.$value.set(!this.$value.get());
    },

    // Property descriptors for the editor
    propertyDescriptors: {
        label: {
            type: 'text',
            label: 'Label Text',
            editable: true
        },
        switch: {
            type: 'checkbox',
            label: 'Switch Style',
            editable: true,
            description: 'Render as a toggle switch instead of checkbox',
            category: 'style'
        },
        required: {
            type: 'checkbox',
            label: 'Required',
            editable: true
        },
        disabled: {
            type: 'checkbox',
            label: 'Disabled',
            editable: true
        },
        size: {
            type: 'select',
            label: 'Size',
            editable: true,
            options: ['default', 'sm', 'lg'],
            category: 'style'
        },
        horizontalLayout: {
            type: 'checkbox',
            label: 'Horizontal Layout',
            editable: true,
            description: 'Place label and checkbox side by side',
            category: 'layout'
        },
        description: {
            type: 'text',
            label: 'Help Text',
            editable: true
        },
        validFeedback: {
            type: 'text',
            label: 'Valid Feedback Message',
            editable: true
        },
        invalidFeedback: {
            type: 'text',
            label: 'Invalid Feedback Message',
            editable: true
        }
    }
};