/*
 * Daquota to DDOM Converter
 * Converts existing Daquota JSON format to DDOM objects
 */

import jsesc from '../../node_modules/jsesc/jsesc.js';

export class DaquotaToDdomConverter {
    constructor() {
        this.componentMapping = {
            'TextView': this.convertTextView,
            'ButtonView': this.convertButtonView,
            'InputView': this.convertInputView,
            'ContainerView': this.convertContainerView,
            'IteratorView': this.convertIteratorView,
            'CheckboxView': this.convertCheckboxView,
            'SelectView': this.convertSelectView
        };
    }

    convert(daquotaJson) {
        try {
            const parsed = typeof daquotaJson === 'string' ? JSON.parse(daquotaJson) : daquotaJson;
            
            if (parsed.roots) {
                // Convert full Daquota application
                return this.convertApplication(parsed);
            } else {
                // Convert single component
                return this.convertComponent(parsed);
            }
        } catch (error) {
            throw new Error(`Conversion failed: ${error.message}`);
        }
    }

    convertApplication(app) {
        const ddomApp = {
            // Add global state from applicationModel if needed
            $appName: app.applicationModel?.name || 'Daquota App',
            $version: app.applicationModel?.version || '1.0.0',
            
            document: {
                body: {
                    children: []
                }
            }
        };

        // Convert each root component
        if (app.roots) {
            for (const root of app.roots) {
                const converted = this.convertComponent(root);
                if (converted) {
                    ddomApp.document.body.children.push(converted);
                }
            }
        }

        return ddomApp;
    }

    convertComponent(component) {
        if (!component || !component.type) {
            return null;
        }

        const converter = this.componentMapping[component.type];
        if (converter) {
            return converter.call(this, component);
        } else {
            console.warn(`No converter found for component type: ${component.type}`);
            return this.convertGenericComponent(component);
        }
    }

    convertTextView(component) {
        return {
            tagName: component.tag || 'p',
            textContent: component.text || '',
            className: component.class || '',
            style: component.style || {},
            id: component.cid
        };
    }

    convertButtonView(component) {
        const button = {
            tagName: 'button',
            textContent: component.label || '',
            className: this.buildButtonClasses(component),
            disabled: component.disabled || false,
            id: component.cid
        };

        // Convert event handlers
        if (component.eventHandlers) {
            button.onclick = this.convertEventHandlers(component.eventHandlers);
        }

        return button;
    }

    convertInputView(component) {
        return {
            tagName: 'input',
            type: component.inputType || 'text',
            placeholder: component.placeholder || '',
            value: component.defaultValue || '',
            disabled: component.disabled || false,
            className: component.class || '',
            id: component.cid
        };
    }

    convertContainerView(component) {
        const container = {
            tagName: 'div',
            className: this.buildContainerClasses(component),
            style: component.style || {},
            id: component.cid,
            children: []
        };

        // Convert child components
        if (component.components) {
            for (const child of component.components) {
                const converted = this.convertComponent(child);
                if (converted) {
                    container.children.push(converted);
                }
            }
        }

        return container;
    }

    convertIteratorView(component) {
        // Create a simplified iterator - DDOM has array namespace support
        const iterator = {
            tagName: 'div',
            className: component.class || '',
            id: component.cid,
            children: {
                prototype: 'Array',
                items: component.dataSource || [],
                map: component.body ? this.convertComponent(component.body) : null
            }
        };

        return iterator;
    }

    convertCheckboxView(component) {
        return {
            tagName: 'input',
            type: 'checkbox',
            checked: component.defaultValue || false,
            disabled: component.disabled || false,
            className: component.class || '',
            id: component.cid
        };
    }

    convertSelectView(component) {
        const select = {
            tagName: 'select',
            className: component.class || '',
            disabled: component.disabled || false,
            id: component.cid,
            children: []
        };

        // Convert options
        if (component.options) {
            if (Array.isArray(component.options)) {
                for (const option of component.options) {
                    select.children.push({
                        tagName: 'option',
                        value: typeof option === 'object' ? option.value : option,
                        textContent: typeof option === 'object' ? option.text : option
                    });
                }
            }
        }

        return select;
    }

    convertGenericComponent(component) {
        // Fallback for unknown component types
        return {
            tagName: 'div',
            className: `unknown-component ${component.type}`,
            textContent: `Unknown component: ${component.type}`,
            id: component.cid,
            'data-original-type': component.type
        };
    }

    buildButtonClasses(component) {
        let classes = ['btn'];
        
        if (component.variant) {
            classes.push(`btn-${component.variant}`);
        }
        
        if (component.size && component.size !== 'default') {
            classes.push(`btn-${component.size}`);
        }
        
        if (component.class) {
            classes.push(component.class);
        }
        
        return classes.join(' ');
    }

    buildContainerClasses(component) {
        let classes = [];
        
        if (component.direction === 'row') {
            classes.push('d-flex', 'flex-row');
        } else if (component.direction === 'column') {
            classes.push('d-flex', 'flex-column');
        }
        
        if (component.layoutClass) {
            classes.push(component.layoutClass);
        }
        
        if (component.class) {
            classes.push(component.class);
        }
        
        return classes.join(' ');
    }

    convertEventHandlers(eventHandlers) {
        // Simplified event handler conversion
        // In a full implementation, this would need to handle action chains
        return function() {
            console.log('Event handler triggered', eventHandlers);
            // Could implement action parsing here
        };
    }

    exportAsJsesc(ddomObject) {
        return jsesc(ddomObject, {
            es6: true,
            indent: '  ',
            compact: false
        });
    }
}

export default DaquotaToDdomConverter;