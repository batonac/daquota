/*
 * Advanced Todo Application - DDOM Format
 * 
 * This demonstrates a complete DDOM application with:
 * - Multiple custom components
 * - Complex state management
 * - Form validation
 * - Conditional rendering
 * - Event handling
 */

export default {
  // Application metadata
  $appName: 'Advanced Todo App',
  $version: '1.0.0',
  
  // Application state
  $todos: [
    { id: 1, text: 'Learn DDOM fundamentals', completed: true, priority: 'high', category: 'learning' },
    { id: 2, text: 'Build a complete app', completed: false, priority: 'medium', category: 'development' },
    { id: 3, text: 'Deploy to production', completed: false, priority: 'low', category: 'deployment' }
  ],
  $newTodo: {
    text: '',
    priority: 'medium',
    category: 'general'
  },
  $filter: 'all', // 'all', 'active', 'completed'
  $showAddForm: false,
  $selectedCategory: 'all',
  
  // Computed properties
  $filteredTodos: function() {
    let todos = this.$todos.get();
    
    // Filter by completion status
    const filter = this.$filter.get();
    if (filter === 'active') {
      todos = todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      todos = todos.filter(todo => todo.completed);
    }
    
    // Filter by category
    const category = this.$selectedCategory.get();
    if (category !== 'all') {
      todos = todos.filter(todo => todo.category === category);
    }
    
    return todos;
  },
  
  $todoStats: function() {
    const todos = this.$todos.get();
    return {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      active: todos.filter(t => !t.completed).length,
      highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length
    };
  },
  
  $categories: function() {
    const todos = this.$todos.get();
    const categories = [...new Set(todos.map(t => t.category))];
    return ['all', ...categories];
  },

  $isValidNewTodo: function() {
    const newTodo = this.$newTodo.get();
    return newTodo.text.trim().length >= 3;
  },

  document: {
    head: {
      title: '${window.$appName}',
      children: [
        {
          tagName: 'link',
          attributes: {
            rel: 'stylesheet',
            href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
          }
        },
        {
          tagName: 'style',
          textContent: `
            .todo-item {
              transition: all 0.2s ease;
            }
            .todo-item:hover {
              transform: translateX(5px);
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .priority-high { border-left: 4px solid #dc3545; }
            .priority-medium { border-left: 4px solid #ffc107; }
            .priority-low { border-left: 4px solid #198754; }
            .fade-enter { opacity: 0; transform: translateY(-10px); }
            .fade-enter-active { transition: all 0.3s ease; }
          `
        }
      ]
    },
    body: {
      style: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      },
      children: [
        // Header
        {
          tagName: 'header',
          style: {
            backgroundColor: '#007bff',
            color: 'white',
            padding: '2rem 0',
            marginBottom: '2rem'
          },
          children: [
            {
              tagName: 'div',
              className: 'container',
              children: [
                {
                  tagName: 'h1',
                  textContent: '${window.$appName}',
                  style: { margin: '0', fontSize: '2.5rem' }
                },
                {
                  tagName: 'todo-stats'
                }
              ]
            }
          ]
        },

        // Main content
        {
          tagName: 'main',
          className: 'container',
          children: [
            // Controls
            {
              tagName: 'div',
              className: 'row mb-4',
              children: [
                {
                  tagName: 'div',
                  className: 'col-md-8',
                  children: [
                    {
                      tagName: 'todo-filters'
                    }
                  ]
                },
                {
                  tagName: 'div',
                  className: 'col-md-4 text-end',
                  children: [
                    {
                      tagName: 'button',
                      className: 'btn btn-success',
                      textContent: '+ Add Todo',
                      onclick: function() {
                        $showAddForm.set(!$showAddForm.get());
                      }
                    }
                  ]
                }
              ]
            },

            // Add todo form
            {
              tagName: 'add-todo-form',
              attributes: {
                hidden: function() { return !window.$showAddForm.get(); }
              }
            },

            // Todo list
            {
              tagName: 'todo-list'
            }
          ]
        }
      ]
    }
  },

  // Custom elements
  customElements: [
    // Todo stats component
    {
      tagName: 'todo-stats',
      
      style: {
        display: 'flex',
        gap: '2rem',
        marginTop: '1rem',
        color: 'rgba(255, 255, 255, 0.9)'
      },
      
      children: function() {
        const stats = window.$todoStats.get();
        return [
          {
            tagName: 'div',
            children: [
              { tagName: 'div', textContent: stats.total, style: { fontSize: '1.5rem', fontWeight: 'bold' } },
              { tagName: 'div', textContent: 'Total', style: { fontSize: '0.9rem' } }
            ]
          },
          {
            tagName: 'div',
            children: [
              { tagName: 'div', textContent: stats.active, style: { fontSize: '1.5rem', fontWeight: 'bold' } },
              { tagName: 'div', textContent: 'Active', style: { fontSize: '0.9rem' } }
            ]
          },
          {
            tagName: 'div',
            children: [
              { tagName: 'div', textContent: stats.completed, style: { fontSize: '1.5rem', fontWeight: 'bold' } },
              { tagName: 'div', textContent: 'Completed', style: { fontSize: '0.9rem' } }
            ]
          },
          {
            tagName: 'div',
            children: [
              { tagName: 'div', textContent: stats.highPriority, style: { fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' } },
              { tagName: 'div', textContent: 'High Priority', style: { fontSize: '0.9rem' } }
            ]
          }
        ];
      }
    },

    // Todo filters component
    {
      tagName: 'todo-filters',
      
      style: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      },
      
      children: [
        // Status filter
        {
          tagName: 'div',
          className: 'btn-group',
          children: function() {
            const filter = window.$filter.get();
            return ['all', 'active', 'completed'].map(f => ({
              tagName: 'button',
              className: `btn btn-outline-primary ${f === filter ? 'active' : ''}`,
              textContent: f.charAt(0).toUpperCase() + f.slice(1),
              onclick: function() {
                $filter.set(f);
              }
            }));
          }
        },
        
        // Category filter
        {
          tagName: 'select',
          className: 'form-select',
          style: { width: 'auto' },
          children: function() {
            return window.$categories.get().map(category => ({
              tagName: 'option',
              textContent: category.charAt(0).toUpperCase() + category.slice(1),
              attributes: {
                value: category,
                selected: window.$selectedCategory.get() === category
              }
            }));
          },
          onchange: function(e) {
            $selectedCategory.set(e.target.value);
          }
        }
      ]
    },

    // Add todo form component
    {
      tagName: 'add-todo-form',
      
      style: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      },
      
      children: [
        {
          tagName: 'form',
          onsubmit: function(e) {
            e.preventDefault();
            const newTodo = $newTodo.get();
            if (newTodo.text.trim().length >= 3) {
              const todos = $todos.get();
              const id = Math.max(...todos.map(t => t.id), 0) + 1;
              $todos.set([...todos, { 
                id, 
                completed: false, 
                ...newTodo,
                text: newTodo.text.trim()
              }]);
              $newTodo.set({ text: '', priority: 'medium', category: 'general' });
              $showAddForm.set(false);
            }
          },
          children: [
            {
              tagName: 'div',
              className: 'row g-3',
              children: [
                {
                  tagName: 'div',
                  className: 'col-md-6',
                  children: [
                    {
                      tagName: 'input',
                      className: function() {
                        const isValid = window.$isValidNewTodo.get();
                        const text = window.$newTodo.get().text;
                        return `form-control ${text && !isValid ? 'is-invalid' : ''}`;
                      },
                      attributes: {
                        type: 'text',
                        placeholder: 'Enter todo text...',
                        value: function() { return window.$newTodo.get().text; },
                        required: true
                      },
                      oninput: function(e) {
                        const newTodo = $newTodo.get();
                        $newTodo.set({ ...newTodo, text: e.target.value });
                      }
                    },
                    {
                      tagName: 'div',
                      className: 'invalid-feedback',
                      textContent: 'Todo text must be at least 3 characters long.',
                      attributes: {
                        hidden: function() {
                          const newTodo = window.$newTodo.get();
                          return !newTodo.text || window.$isValidNewTodo.get();
                        }
                      }
                    }
                  ]
                },
                {
                  tagName: 'div',
                  className: 'col-md-3',
                  children: [
                    {
                      tagName: 'select',
                      className: 'form-select',
                      children: [
                        { tagName: 'option', value: 'low', textContent: 'Low Priority' },
                        { tagName: 'option', value: 'medium', textContent: 'Medium Priority', attributes: { selected: true } },
                        { tagName: 'option', value: 'high', textContent: 'High Priority' }
                      ],
                      onchange: function(e) {
                        const newTodo = $newTodo.get();
                        $newTodo.set({ ...newTodo, priority: e.target.value });
                      }
                    }
                  ]
                },
                {
                  tagName: 'div',
                  className: 'col-md-2',
                  children: [
                    {
                      tagName: 'input',
                      className: 'form-control',
                      attributes: {
                        type: 'text',
                        placeholder: 'Category',
                        value: function() { return window.$newTodo.get().category; }
                      },
                      oninput: function(e) {
                        const newTodo = $newTodo.get();
                        $newTodo.set({ ...newTodo, category: e.target.value || 'general' });
                      }
                    }
                  ]
                },
                {
                  tagName: 'div',
                  className: 'col-md-1',
                  children: [
                    {
                      tagName: 'button',
                      className: 'btn btn-primary',
                      attributes: {
                        type: 'submit',
                        disabled: function() { return !window.$isValidNewTodo.get(); }
                      },
                      textContent: 'Add'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    // Todo list component
    {
      tagName: 'todo-list',
      
      children: function() {
        const todos = window.$filteredTodos.get();
        
        if (todos.length === 0) {
          return [
            {
              tagName: 'div',
              className: 'text-center py-5',
              style: { color: '#6c757d' },
              children: [
                { tagName: 'h3', textContent: 'No todos found' },
                { tagName: 'p', textContent: 'Add a new todo to get started!' }
              ]
            }
          ];
        }

        return todos.map(todo => ({
          tagName: 'todo-item',
          $todo: todo,
          key: todo.id
        }));
      }
    },

    // Todo item component
    {
      tagName: 'todo-item',
      $todo: null,
      
      style: {
        backgroundColor: 'white',
        marginBottom: '0.5rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      },
      
      className: function() {
        const todo = this.$todo || {};
        return `todo-item priority-${todo.priority}`;
      },
      
      children: [
        {
          tagName: 'div',
          className: 'd-flex align-items-center p-3',
          children: [
            {
              tagName: 'input',
              className: 'form-check-input me-3',
              attributes: {
                type: 'checkbox',
                checked: function() { return this.$todo?.completed; }
              },
              onchange: function() {
                const todo = this.$todo;
                const todos = $todos.get();
                const updated = todos.map(t => 
                  t.id === todo.id ? { ...t, completed: !t.completed } : t
                );
                $todos.set(updated);
              }
            },
            {
              tagName: 'div',
              className: 'flex-grow-1',
              children: [
                {
                  tagName: 'div',
                  textContent: function() { return this.$todo?.text; },
                  style: function() {
                    return {
                      textDecoration: this.$todo?.completed ? 'line-through' : 'none',
                      color: this.$todo?.completed ? '#6c757d' : '#333',
                      fontWeight: '500'
                    };
                  }
                },
                {
                  tagName: 'small',
                  className: 'text-muted',
                  textContent: function() {
                    const todo = this.$todo;
                    return `${todo?.category} • ${todo?.priority} priority`;
                  }
                }
              ]
            },
            {
              tagName: 'button',
              className: 'btn btn-outline-danger btn-sm',
              textContent: 'Delete',
              onclick: function() {
                const todo = this.$todo;
                const todos = $todos.get();
                $todos.set(todos.filter(t => t.id !== todo.id));
              }
            }
          ]
        }
      ]
    }
  ]
};