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

// DDOM Container View Component
export default {
    tagName: 'container-view',
    
    // Reactive properties
    $layout: 'block',
    $form: false,
    $nativeValidation: false,
    $showStateOnInput: false,
    $components: [],
    $defaultValue: {},
    $class: null,
    $style: null,
    $draggable: false,
    
    // Computed properties
    $containerTag: function() {
        return this.$form.get() ? 'form' : 'div';
    },

    $containerClass: function() {
        const classes = ['w-100', 'h-100'];
        const layout = this.$layout.get();
        const customClass = this.$class.get();
        
        // Layout-specific classes
        switch (layout) {
            case 'flex':
                classes.push('d-flex');
                break;
            case 'flex-column':
                classes.push('d-flex', 'flex-column');
                break;
            case 'grid':
                classes.push('d-grid');
                break;
            case 'block':
            default:
                classes.push('d-block');
                break;
        }
        
        if (customClass) classes.push(customClass);
        return classes.join(' ');
    },

    $containerStyle: function() {
        let style = this.$style.get() || '';
        
        // Add background for shared containers in edit mode
        if (this.edit && this.cid === 'shared') {
            style += '; background-color: #80808040;';
        }
        
        return style;
    },

    // Component structure - uses dynamic tagName
    tagName: '${this.$containerTag}',
    
    attributes: {
        'class': '${this.$containerClass}',
        'style': '${this.$containerStyle}',
        'draggable': '${this.$draggable}',
        'novalidate': function() {
            return this.$form.get() && !this.$nativeValidation.get() ? true : null;
        },
        'data-timestamp': function() { return Date.now(); }
    },

    // Child components
    children: function() {
        const components = this.$components.get() || [];
        
        return components.map((component, index) => {
            // Each component is rendered based on its type and properties
            return this.renderComponent(component, index);
        });
    },

    // Event handlers for form
    onsubmit: function(event) {
        if (this.$form.get()) {
            event.preventDefault();
            this.handleSubmit?.(event);
        }
    },

    onreset: function(event) {
        if (this.$form.get()) {
            this.handleReset?.(event);
        }
    },

    onclick: function(event) {
        this.handleClick?.(event);
    },

    // Methods
    renderComponent: function(component, index) {
        // This method would be overridden by the framework to render child components
        // For now, return a placeholder
        return {
            tagName: component.type?.toLowerCase().replace('view', '-view') || 'div',
            textContent: `Component: ${component.type || 'Unknown'}`,
            attributes: {
                'data-cid': component.cid,
                'data-index': index
            },
            style: {
                padding: '0.5rem',
                margin: '0.25rem',
                border: '1px dashed #ccc',
                borderRadius: '4px'
            }
        };
    },

    addComponent: function(componentType, properties = {}) {
        const components = this.$components.get();
        const newComponent = {
            cid: `${componentType}-${Math.random().toString(36).substr(2, 9)}`,
            type: componentType,
            ...properties
        };
        this.$components.set([...components, newComponent]);
        return newComponent;
    },

    removeComponent: function(cid) {
        const components = this.$components.get();
        this.$components.set(components.filter(c => c.cid !== cid));
    },

    getComponent: function(cid) {
        const components = this.$components.get();
        return components.find(c => c.cid === cid);
    },

    // Property descriptors for the editor
    propertyDescriptors: {
        layout: {
            type: 'select',
            label: 'Layout Type',
            editable: true,
            options: [
                { value: 'block', text: 'Block' },
                { value: 'flex', text: 'Flex Row' },
                { value: 'flex-column', text: 'Flex Column' },
                { value: 'grid', text: 'Grid' }
            ],
            category: 'layout'
        },
        form: {
            type: 'checkbox',
            label: 'Form Container',
            editable: true,
            description: 'Enable form functionality with submit/reset handling',
            category: 'behavior'
        },
        nativeValidation: {
            type: 'checkbox',
            label: 'Native HTML5 Validation',
            editable: true,
            hidden: function() { return !this.$form.get(); },
            category: 'behavior'
        },
        showStateOnInput: {
            type: 'checkbox',
            label: 'Show Validation State on Input',
            editable: true,
            description: 'Show validation feedback as user types',
            category: 'behavior'
        },
        defaultValue: {
            type: 'code/json',
            label: 'Default Data Value',
            editable: true,
            description: 'Default data object for this container',
            category: 'data'
        }
    }
};