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

// DDOM Input View Component
export default {
    tagName: 'input-view',
    
    // Reactive properties
    $inputType: 'text',
    $dataType: 'string',
    $placeholder: '',
    $label: '',
    $description: '',
    $required: false,
    $disabled: false,
    $min: null,
    $max: null,
    $step: null,
    $size: null,
    $value: '',
    $field: null,
    $dataSource: null,
    $validFeedback: null,
    $invalidFeedback: null,
    $state: null, // null, true (valid), false (invalid)
    $class: null,
    $style: null,
    $draggable: false,

    // Computed properties
    $actualInputType: function() {
        const inputType = this.$inputType.get();
        return inputType === 'formatted-number' ? 'text' : inputType;
    },

    $isNumber: function() {
        return this.$dataType.get() === 'number';
    },

    $inputClass: function() {
        const classes = ['form-control'];
        const size = this.$size.get();
        const state = this.$state.get();
        
        if (size) classes.push(`form-control-${size}`);
        if (state === true) classes.push('is-valid');
        if (state === false) classes.push('is-invalid');
        
        return classes.join(' ');
    },

    $labelForId: function() {
        return `input_${this.cid || Math.random().toString(36).substr(2, 9)}`;
    },

    // Component structure
    children: [
        // Label (if provided)
        function() {
            const label = this.$label.get();
            if (!label) return null;
            
            return {
                tagName: 'label',
                attributes: {
                    'for': this.$labelForId(),
                    'class': function() {
                        const size = this.$size.get();
                        return size ? `form-label-${size}` : 'form-label';
                    }
                },
                textContent: label,
                style: { marginBottom: '0.5rem', display: 'block' }
            };
        },

        // Input element
        {
            tagName: 'input',
            attributes: {
                'id': '${this.$labelForId}',
                'type': '${this.$actualInputType}',
                'class': '${this.$inputClass}',
                'placeholder': '${this.$placeholder}',
                'value': '${this.$value}',
                'min': '${this.$min}',
                'max': '${this.$max}',
                'step': '${this.$step}',
                'required': function() { return this.$required.get() || null; },
                'disabled': function() { return this.$disabled.get() || null; },
                'data-field': '${this.$field}',
                'draggable': '${this.$draggable}'
            },
            
            // Event handlers
            oninput: function(event) {
                this.$value.set(event.target.value);
                this.handleInput?.(event.target.value);
            },
            
            onchange: function(event) {
                this.handleChange?.(event.target.value);
            },
            
            onblur: function(event) {
                this.handleBlur?.(event.target.value);
            },
            
            onfocus: function(event) {
                this.handleFocus?.(event.target.value);
            }
        },

        // Description (if provided)
        function() {
            const description = this.$description.get();
            if (!description) return null;
            
            return {
                tagName: 'div',
                textContent: description,
                attributes: {
                    'class': 'form-text'
                },
                style: { 
                    fontSize: '0.875rem',
                    color: '#6c757d',
                    marginTop: '0.25rem'
                }
            };
        },

        // Validation feedback
        function() {
            const state = this.$state.get();
            if (state === true) {
                const validFeedback = this.$validFeedback.get();
                if (validFeedback) {
                    return {
                        tagName: 'div',
                        textContent: validFeedback,
                        attributes: { 'class': 'valid-feedback' },
                        style: { color: '#198754', fontSize: '0.875rem', marginTop: '0.25rem' }
                    };
                }
            } else if (state === false) {
                const invalidFeedback = this.$invalidFeedback.get();
                if (invalidFeedback) {
                    return {
                        tagName: 'div',
                        textContent: invalidFeedback,
                        attributes: { 'class': 'invalid-feedback' },
                        style: { color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }
                    };
                }
            }
            return null;
        }
    ],

    // Container attributes
    attributes: {
        'class': '${this.$class}',
        'style': '${this.$style}',
        'data-timestamp': function() { return Date.now(); }
    },

    // Methods
    clear: function() {
        this.$value.set('');
    },

    focus: function() {
        const input = this.element?.querySelector('input');
        input?.focus();
    },

    // Property descriptors for the editor
    propertyDescriptors: {
        inputType: {
            type: 'select',
            label: 'Input Type',
            editable: true,
            options: [
                'text', 'password', 'email', 'url', 'tel', 'search',
                'number', 'formatted-number', 'range',
                'date', 'datetime-local', 'time', 'month', 'week',
                'color', 'file'
            ]
        },
        dataType: {
            type: 'select',
            label: 'Data Type',
            editable: true,
            options: ['string', 'number', 'integer', 'date', 'datetime', 'color'],
            category: 'data'
        },
        placeholder: {
            type: 'text',
            label: 'Placeholder Text',
            editable: true
        },
        label: {
            type: 'text',
            label: 'Label',
            editable: true
        },
        description: {
            type: 'text',
            label: 'Help Text',
            editable: true
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
        min: {
            type: 'number',
            label: 'Minimum Value',
            editable: true,
            hidden: function() {
                const type = this.$inputType.get();
                return !['number', 'range', 'date', 'datetime-local', 'time'].includes(type);
            }
        },
        max: {
            type: 'number',
            label: 'Maximum Value',
            editable: true,
            hidden: function() {
                const type = this.$inputType.get();
                return !['number', 'range', 'date', 'datetime-local', 'time'].includes(type);
            }
        },
        step: {
            type: 'number',
            label: 'Step',
            editable: true,
            hidden: function() {
                const type = this.$inputType.get();
                return !['number', 'range'].includes(type);
            }
        },
        size: {
            type: 'select',
            label: 'Size',
            editable: true,
            options: ['default', 'sm', 'lg'],
            category: 'style'
        }
    }
};