# Daquota DDOM Migration

This repository demonstrates the migration from Vue.js-based components to Declarative DOM (DDOM) format, abandoning the proprietary JSON syntax in favor of standards-based reactive programming.

## What Changed

### Before: Vue.js + JSON Configuration
```json
{
  "type": "ButtonView", 
  "label": "Click Me",
  "variant": "primary",
  "eventHandlers": [...]
}
```

### After: DDOM Objects with Reactive Properties
```javascript
export default {
  tagName: 'button',
  $label: 'Click Me',
  $variant: 'primary',
  
  textContent: '${this.$label}',
  className: 'btn btn-${this.$variant}',
  
  onclick: function() {
    // Direct event handling
  }
}
```

## Key Benefits

### 1. Standards-Based
- Uses Declarative DOM specification
- Leverages TC39 Signals proposal for reactivity
- No proprietary syntax or framework lock-in

### 2. Reactive by Design
- Properties prefixed with `$` become reactive signals
- Automatic dependency tracking and updates
- Computed properties using functions

### 3. Direct DOM Mapping
- DDOM objects map directly to DOM elements
- No translation layer or compilation step
- What you write is what you get

### 4. Enhanced Developer Experience
- Full JavaScript syntax support
- Better IDE support and autocomplete
- Easier debugging and testing

## Project Structure

### Components (DDOM Format)
- `src/components/text-view.js` - Text display component
- `src/components/button-view.js` - Interactive button component  
- `src/components/input-view.ddom.js` - Form input component
- `src/components/checkbox-view.ddom.js` - Checkbox/switch component
- `src/layouts/container-view.ddom.js` - Layout container component

### Examples
- `examples/example-confirm.ddom.js` - Simple confirmation dialog
- `examples/advanced-todo.ddom.js` - Complete todo application

### IDE
- `src/ddom-editor/` - DDOM IDE for creating and editing applications
  - Live editing with syntax validation
  - Export to clean JavaScript using jsesc
  - Example templates and tutorials

## Getting Started

1. **Open the DDOM IDE:**
   ```bash
   python3 -m http.server 8080
   # Visit http://localhost:8080/src/ddom-editor/
   ```

2. **Load an example** to see DDOM syntax in action

3. **Create new applications** using the DDOM format

## Migration Progress

- ✅ Remove converter approach (per user feedback)
- ✅ Core components converted to DDOM format
- ✅ DDOM IDE with live editing and export
- ✅ Example applications demonstrating full capabilities
- 🔄 Continue converting remaining Vue.js components
- 🔄 Update all examples from JSON to DDOM format
- 🔄 Create component registry system

## DDOM Syntax Overview

### Reactive Properties
```javascript
$property: 'initial value'  // Becomes a reactive signal
```

### Computed Properties  
```javascript
$computed: function() {
  return this.$property.get() + ' processed';
}
```

### Event Handlers
```javascript
onclick: function(event) {
  this.$property.set('new value');
}
```

### Dynamic Content
```javascript
textContent: '${this.$property}'  // Reactive text binding
children: function() {            // Dynamic children
  return this.$items.get().map(item => ({
    tagName: 'div',
    textContent: item.name
  }));
}
```

### Custom Elements
```javascript
customElements: [
  {
    tagName: 'my-component',
    $data: 'component state',
    // ... component definition
  }
]
```

This migration represents a fundamental shift toward modern, standards-based web development while maintaining the visual design capabilities that make Daquota powerful.