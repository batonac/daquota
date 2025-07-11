/*
 * Simple Confirm Action Example - DDOM Format
 * 
 * This application has a simple button for performing an action. 
 * If the user confirms the action, it is performed (showing a simple alert), 
 * if not, the action is ignored.
 */

export default {
  // Application metadata
  $appName: 'App name',
  $appDescription: 'This application has a simple button for performing an action. If the user confirms the action, it is performed (showing a simple alert), if not, the action is ignored.',
  $version: '0.0.0',
  
  // Application state
  $globals: {},
  
  document: {
    head: {
      title: '${window.$appName}',
      children: [
        {
          tagName: 'link',
          attributes: {
            rel: 'stylesheet',
            href: 'assets/ext/themes/daquota.css'
          }
        }
      ]
    },
    body: {
      style: {
        margin: '0',
        padding: '0',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      },
      children: [
        // Navigation bar
        {
          tagName: 'nav-bar',
          $brand: '${window.$appName}',
          $defaultPage: 'index',
          $navigationItems: [
            {
              pageId: 'index',
              label: 'Index'
            }
          ]
        },
        
        // Main content
        {
          tagName: 'main',
          $id: 'index',
          style: {
            padding: '2em'
          },
          children: [
            {
              tagName: 'button-view',
              $label: 'Perform action',
              $buttonType: 'button',
              $variant: 'primary',
              
              // Click handler
              onclick: function() {
                const confirmed = confirm('Are you sure?');
                if (confirmed) {
                  alert('Action is performed because you confirmed.');
                }
              }
            }
          ]
        }
      ]
    }
  },

  // Custom elements definitions
  customElements: [
    // Navigation bar component
    {
      tagName: 'nav-bar',
      $brand: '',
      $defaultPage: 'index',
      $navigationItems: [],
      
      style: {
        display: 'block',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '1rem 2rem'
      },
      
      children: [
        {
          tagName: 'div',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          },
          children: [
            {
              tagName: 'span',
              style: {
                fontSize: '1.25rem',
                fontWeight: 'bold'
              },
              textContent: '${this.$brand}'
            },
            {
              tagName: 'nav',
              children: function() {
                return this.$navigationItems.get().map(item => ({
                  tagName: 'a',
                  textContent: item.label,
                  attributes: {
                    href: `#${item.pageId}`
                  },
                  style: {
                    color: 'white',
                    textDecoration: 'none',
                    marginLeft: '1rem'
                  }
                }));
              }
            }
          ]
        }
      ]
    },

    // Button view component
    {
      tagName: 'button-view',
      $label: '',
      $buttonType: 'button',
      $variant: 'primary',
      $disabled: false,
      
      tagName: 'button',
      
      attributes: {
        type: '${this.$buttonType}',
        disabled: function() { return this.$disabled.get() || null; },
        class: function() {
          const variant = this.$variant.get();
          return `btn btn-${variant}`;
        }
      },
      
      style: {
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer',
        fontSize: '1rem',
        ':hover': {
          opacity: '0.8'
        }
      },
      
      textContent: '${this.$label}'
    }
  ]
};