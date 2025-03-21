/**
 * Debug utility for routing issues
 */
export const logRouteDebug = (componentName, location) => {
  console.log(`[${componentName}] Route Debug:`, {
    component: componentName,
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    state: location.state,
    key: location.key
  });
};

/**
 * Create a global route debugger that monitors route changes
 */
export const setupRouteDebugger = () => {
  if (typeof window !== 'undefined') {
    // Store original functions
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    // Override pushState
    window.history.pushState = function() {
      console.log('[ROUTE DEBUG] pushState called with:', {
        state: arguments[0],
        title: arguments[1],
        url: arguments[2]
      });
      return originalPushState.apply(this, arguments);
    };
    
    // Override replaceState
    window.history.replaceState = function() {
      console.log('[ROUTE DEBUG] replaceState called with:', {
        state: arguments[0],
        title: arguments[1],
        url: arguments[2]
      });
      return originalReplaceState.apply(this, arguments);
    };
    
    // Listen for hash changes
    window.addEventListener('hashchange', (e) => {
      console.log('[ROUTE DEBUG] hashchange event:', {
        oldURL: e.oldURL,
        newURL: e.newURL
      });
    });
    
    console.log('[ROUTE DEBUG] Route debugger installed');
  }
};

export default { logRouteDebug, setupRouteDebugger };
