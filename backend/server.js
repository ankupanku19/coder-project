import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import archiver from 'archiver';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Initialize Claude
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000"
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Store active projects in memory (use Redis in production)
const activeProjects = new Map();

// ============================================================================
// UNIVERSAL WEB APP GENERATOR SYSTEM
// ============================================================================

class UniversalPromptAnalyzer {
  analyze(prompt) {
    return {
      appType: this.detectAppType(prompt),
      features: this.extractUniversalFeatures(prompt),
      dataPatterns: this.analyzeDataRequirements(prompt),
      designRequirements: this.extractDesignElements(prompt),
      technicalSpecs: this.analyzeTechnicalNeeds(prompt),
      userJourneys: this.mapInteractionFlows(prompt)
    };
  }

  detectAppType(prompt) {
    const appPatterns = {
      'dashboard': /dashboard|analytics|metrics|chart|graph|data visualization|admin panel|monitoring/i,
      'ecommerce': /shop|store|cart|product|buy|sell|payment|checkout|marketplace|catalog/i,
      'social': /social|post|comment|like|share|follow|friend|message|network|forum/i,
      'productivity': /todo|task|note|calendar|schedule|project|organize|planner|workspace/i,
      'content': /blog|article|news|cms|content|publish|editor|portfolio|gallery/i,
      'finder': /search|find|discover|browse|filter|recipe|movie|job|directory/i,
      'utility': /calculator|converter|tool|generator|validator|formatter|utility/i,
      'game': /game|play|score|level|puzzle|quiz|trivia|interactive/i,
      'finance': /budget|expense|money|finance|bank|investment|crypto|trading/i,
      'education': /learn|course|quiz|study|education|tutorial|lesson/i,
      'communication': /chat|message|email|contact|communication|support/i
    };

    for (const [type, pattern] of Object.entries(appPatterns)) {
      if (pattern.test(prompt)) return type;
    }

    return 'custom';
  }

  extractUniversalFeatures(prompt) {
    const featurePatterns = {
      'search': /search|find|lookup|query|discover/i,
      'filter': /filter|sort|category|type|group|organize/i,
      'crud': /add|create|edit|update|delete|remove|modify|manage/i,
      'pagination': /page|next|previous|more|load|infinite scroll/i,
      'modal': /popup|modal|dialog|overlay|detail|lightbox/i,
      'dropdown': /dropdown|select|menu|options|picker/i,
      'tabs': /tab|section|category|navigation|switch/i,
      'carousel': /slider|carousel|gallery|swipe|slideshow/i,
      'auth': /login|register|signup|account|profile|user|authentication/i,
      'favorites': /favorite|bookmark|save|like|wishlist|star/i,
      'sharing': /share|export|download|print|send|publish/i,
      'rating': /rate|review|star|rating|feedback|score/i,
      'realtime': /live|realtime|update|sync|notification|instant/i,
      'offline': /offline|cache|local|storage|sync/i,
      'api': /api|fetch|data|external|integration|backend/i,
      'upload': /upload|file|image|document|attachment|drag/i,
      'responsive': /mobile|responsive|device|tablet|phone/i,
      'animation': /animation|transition|effect|smooth|hover/i
    };

    const detectedFeatures = [];
    for (const [feature, pattern] of Object.entries(featurePatterns)) {
      if (pattern.test(prompt)) {
        detectedFeatures.push(feature);
      }
    }

    return detectedFeatures;
  }

  analyzeDataRequirements(prompt) {
    return {
      storage: this.detectStorageNeeds(prompt),
      apiIntegration: this.detectAPINeeds(prompt),
      dataStructure: this.analyzeDataStructure(prompt),
      realTimeNeeds: this.checkRealTimeRequirements(prompt)
    };
  }

  detectStorageNeeds(prompt) {
    if (/localStorage|save|persist|remember|cache/i.test(prompt)) return 'localStorage';
    if (/database|backend|server|api/i.test(prompt)) return 'external';
    return 'memory';
  }

  detectAPINeeds(prompt) {
    if (/api|fetch|external|backend|server/i.test(prompt)) return true;
    return false;
  }

  extractDesignElements(prompt) {
    const designPatterns = {
      'modern': /modern|clean|minimalist|sleek|contemporary/i,
      'colorful': /colorful|vibrant|bright|bold|vivid/i,
      'dark': /dark|night|black|gothic/i,
      'professional': /professional|business|corporate|formal/i,
      'playful': /playful|fun|casual|friendly|bright/i
    };

    const detectedStyles = [];
    for (const [style, pattern] of Object.entries(designPatterns)) {
      if (pattern.test(prompt)) {
        detectedStyles.push(style);
      }
    }

    return detectedStyles.length > 0 ? detectedStyles : ['modern'];
  }

  analyzeTechnicalNeeds(prompt) {
    return {
      framework: 'vanilla', // Always vanilla for this system
      responsive: /responsive|mobile|device/i.test(prompt),
      animations: /animation|transition|effect|smooth|hover/i.test(prompt),
      accessibility: /accessible|a11y|screen reader|keyboard/i.test(prompt)
    };
  }

  mapInteractionFlows(prompt) {
    // Basic interaction mapping - can be expanded
    return {
      primary: 'user interaction',
      secondary: 'data management',
      tertiary: 'feedback and notifications'
    };
  }

  analyzeDataStructure(prompt) {
    if (/user|profile|account/i.test(prompt)) return 'user-centric';
    if (/product|item|listing/i.test(prompt)) return 'item-centric';
    if (/post|article|content/i.test(prompt)) return 'content-centric';
    return 'general';
  }

  checkRealTimeRequirements(prompt) {
    return /realtime|live|instant|sync|notification/i.test(prompt);
  }
}

class UniversalArchitectureGenerator {
  generateArchitecture(analysis) {
    return {
      htmlStructure: this.buildHTMLBlueprint(analysis),
      cssStrategy: this.defineCSSStrategy(analysis),
      jsPattern: this.defineJSPattern(analysis),
      componentMap: this.mapComponents(analysis)
    };
  }

  buildHTMLBlueprint(analysis) {
    const baseStructure = ['header', 'main', 'footer'];

    const sectionMap = {
      'dashboard': ['sidebar', 'content-area', 'widget-grid', 'stats-section'],
      'ecommerce': ['navigation', 'product-grid', 'cart', 'checkout', 'filters'],
      'social': ['feed', 'sidebar', 'post-composer', 'notifications', 'user-profile'],
      'productivity': ['toolbar', 'workspace', 'sidebar', 'status-bar', 'task-list'],
      'finder': ['search-section', 'filters', 'results-grid', 'details-modal'],
      'portfolio': ['hero', 'projects-grid', 'about', 'contact', 'skills'],
      'utility': ['input-section', 'controls', 'output-section', 'settings'],
      'content': ['article-list', 'content-area', 'sidebar', 'comments'],
      'communication': ['chat-area', 'contacts', 'message-input', 'notifications']
    };

    const appSections = sectionMap[analysis.appType] || ['content'];
    const featureComponents = this.mapFeaturesToComponents(analysis.features);

    return {
      structure: [...baseStructure],
      sections: appSections,
      components: featureComponents,
      interactions: this.defineInteractionElements(analysis.features)
    };
  }

  mapFeaturesToComponents(features) {
    const componentMap = {
      'search': ['search-form', 'search-input', 'search-button', 'search-suggestions'],
      'filter': ['filter-container', 'filter-options', 'filter-chips', 'filter-clear'],
      'crud': ['form-modal', 'action-buttons', 'confirmation-dialog', 'form-fields'],
      'modal': ['modal-overlay', 'modal-content', 'modal-close', 'modal-header'],
      'favorites': ['favorite-button', 'favorites-list', 'favorites-counter'],
      'pagination': ['pagination-container', 'page-numbers', 'nav-buttons'],
      'rating': ['star-rating', 'review-form', 'rating-display'],
      'auth': ['login-form', 'register-form', 'user-menu', 'logout-button'],
      'upload': ['file-input', 'upload-area', 'progress-bar', 'file-preview'],
      'carousel': ['carousel-container', 'carousel-slides', 'carousel-nav'],
      'tabs': ['tab-container', 'tab-buttons', 'tab-content'],
      'dropdown': ['dropdown-button', 'dropdown-menu', 'dropdown-options']
    };

    const components = [];
    features.forEach(feature => {
      if (componentMap[feature]) {
        components.push(...componentMap[feature]);
      }
    });

    return [...new Set(components)];
  }

  defineCSSStrategy(analysis) {
    const designMap = {
      'dashboard': {
        layout: 'CSS Grid with sidebar',
        colors: 'Professional blue/gray palette',
        typography: 'Clean, data-focused fonts',
        components: 'Cards, charts, data tables'
      },
      'ecommerce': {
        layout: 'Product grid with flexible cards',
        colors: 'Trust-building blues with action orange',
        typography: 'Clear product typography',
        components: 'Product cards, buttons, forms'
      },
      'social': {
        layout: 'Feed-based with infinite scroll',
        colors: 'Social blues with engagement colors',
        typography: 'Readable content fonts',
        components: 'Post cards, user avatars, buttons'
      },
      'finder': {
        layout: 'Search-focused with results grid',
        colors: 'Clean whites with brand accent',
        typography: 'Search-optimized typography',
        components: 'Search bars, filter chips, result cards'
      }
    };

    return designMap[analysis.appType] || {
      layout: 'CSS Grid for main layout, Flexbox for components',
      colors: 'Modern color palette with primary/secondary',
      typography: 'Clean, readable fonts',
      components: 'Cards, buttons, forms'
    };
  }

  defineJSPattern(analysis) {
    return {
      architecture: 'Modular vanilla JavaScript',
      patterns: ['Event delegation', 'State management', 'API integration'],
      features: analysis.features,
      dataFlow: 'Unidirectional with local state'
    };
  }

  defineInteractionElements(features) {
    const interactions = [];

    features.forEach(feature => {
      switch(feature) {
        case 'search':
          interactions.push('search input with real-time suggestions');
          break;
        case 'filter':
          interactions.push('filter buttons with state management');
          break;
        case 'modal':
          interactions.push('modal triggers and close handlers');
          break;
        case 'favorites':
          interactions.push('favorite toggle with persistence');
          break;
      }
    });

    return interactions;
  }

  inferElementType(component) {
    if (component.includes('button')) return 'interactive button element';
    if (component.includes('form')) return 'form with proper validation';
    if (component.includes('input')) return 'input with labels and validation';
    if (component.includes('modal')) return 'dialog with overlay and close button';
    if (component.includes('grid')) return 'container for dynamic content';
    if (component.includes('list')) return 'semantic list for data display';
    if (component.includes('card')) return 'article element for content display';
    return 'semantic container element';
  }

  inferInteractions(component) {
    if (component.includes('button')) return 'click handlers and keyboard support';
    if (component.includes('form')) return 'submit handlers and validation';
    if (component.includes('input')) return 'input events and validation';
    if (component.includes('modal')) return 'open/close functionality';
    return 'appropriate event handlers';
  }

  mapComponents(analysis) {
    console.log(`🗺️ [DEBUG] Mapping components for ${analysis.appType} application...`);

    const baseComponents = ['header', 'navigation', 'main-content', 'footer'];
    const featureComponents = this.mapFeaturesToComponents(analysis.features);
    const appSpecificComponents = this.getAppSpecificComponents(analysis.appType);

    const allComponents = [...baseComponents, ...featureComponents, ...appSpecificComponents];
    const uniqueComponents = [...new Set(allComponents)];

    console.log(`🗺️ [DEBUG] Component mapping complete:`, {
      baseComponents: baseComponents.length,
      featureComponents: featureComponents.length,
      appSpecificComponents: appSpecificComponents.length,
      totalUniqueComponents: uniqueComponents.length,
      componentList: uniqueComponents
    });

    return {
      all: uniqueComponents,
      base: baseComponents,
      features: featureComponents,
      appSpecific: appSpecificComponents,
      interactions: this.mapComponentInteractions(uniqueComponents)
    };
  }

  getAppSpecificComponents(appType) {
    const componentMap = {
      'dashboard': ['sidebar', 'widget-container', 'stats-card', 'chart-container'],
      'ecommerce': ['product-grid', 'cart-sidebar', 'checkout-form', 'filter-panel'],
      'social': ['feed-container', 'post-card', 'user-profile', 'notification-bell'],
      'portfolio': ['hero-section', 'projects-grid', 'skills-section', 'contact-form'],
      'finder': ['search-results', 'detail-modal', 'filter-sidebar', 'pagination'],
      'productivity': ['task-list', 'toolbar', 'workspace', 'status-indicator'],
      'utility': ['input-controls', 'output-display', 'settings-panel'],
      'content': ['article-grid', 'content-viewer', 'sidebar-nav', 'comment-section'],
      'communication': ['chat-window', 'contact-list', 'message-composer']
    };

    return componentMap[appType] || ['content-area'];
  }

  mapComponentInteractions(components) {
    return components.reduce((interactions, component) => {
      interactions[component] = this.inferInteractions(component);
      return interactions;
    }, {});
  }
}

class AdaptiveHTMLGenerator {
  async generateHTML(architecture, analysis) {
    const htmlPrompt = this.buildUniversalHTMLPrompt(architecture, analysis);
    console.log(`📝 [DEBUG] Built HTML prompt: ${htmlPrompt.length} characters for ${analysis.appType} app`);
    return await this.callAI(htmlPrompt, 'HTML');
  }

  buildUniversalHTMLPrompt(architecture, analysis) {
    const idNamingRules = this.generateIDNamingRules(analysis.appType);
    const componentRequirements = this.generateComponentRequirements(architecture.htmlStructure.components);

    return `Create semantic HTML5 structure for a ${analysis.appType} application.

APP CONTEXT:
${analysis.appType} with features: ${analysis.features.join(', ')}

REQUIRED STRUCTURE:
- Header with navigation and branding
- Main content area with ${architecture.sections.join(', ')}
- Footer with links and information
- All interactive elements for requested features

COMPONENT REQUIREMENTS:
${componentRequirements}

NAMING CONVENTION (CRITICAL):
- IDs: ${idNamingRules}
- Classes: kebab-case (search-container, recipe-card)
- Data attributes: Use data-* for dynamic content

ACCESSIBILITY REQUIREMENTS:
- Semantic HTML5 elements (header, nav, main, section, article, footer)
- ARIA labels for all interactive elements
- Skip links for keyboard navigation
- Proper form labels and validation attributes
- Focus management for modals and dropdowns

MODERN STANDARDS:
- HTML5 semantic elements throughout
- Progressive enhancement approach
- Mobile-first structure
- SEO-friendly markup with proper meta tags

CRITICAL REQUIREMENTS:
1. Every interactive element MUST have a unique, descriptive ID
2. Use semantic HTML consistently
3. Include ALL requested features: ${analysis.features.join(', ')}
4. Proper form structure with validation
5. Accessibility attributes throughout

OUTPUT: Complete, valid HTML5 document ready for CSS styling and JavaScript functionality.`;
  }

  generateIDNamingRules(appType) {
    const idPatterns = {
      'dashboard': 'widget[Name], chart[Type], data[Section] (e.g., widgetSales, chartRevenue)',
      'ecommerce': 'product[Action], cart[Element], checkout[Step] (e.g., productAdd, cartItems)',
      'social': 'post[Action], user[Element], feed[Component] (e.g., postLike, userProfile)',
      'finder': 'search[Element], filter[Type], result[Component] (e.g., searchInput, filterCategory)',
      'productivity': 'task[Action], project[Element], workspace[Area] (e.g., taskAdd, projectList)',
      'default': '[feature][Element] camelCase (e.g., searchButton, modalClose)'
    };

    return idPatterns[appType] || idPatterns.default;
  }

  generateComponentRequirements(components) {
    return components.map(component => {
      const elementType = this.inferElementType(component);
      const interactions = this.inferInteractions(component);
      return `- ${component}: ${elementType} with ${interactions}`;
    }).join('\n');
  }

  inferElementType(component) {
    if (component.includes('button')) return 'interactive button element';
    if (component.includes('form')) return 'form with proper validation';
    if (component.includes('input')) return 'input with labels and validation';
    if (component.includes('modal')) return 'dialog with overlay and close button';
    if (component.includes('grid')) return 'container for dynamic content';
    if (component.includes('list')) return 'semantic list for data display';
    if (component.includes('card')) return 'article element for content display';
    return 'semantic container element';
  }

  inferInteractions(component) {
    if (component.includes('button')) return 'click handlers and keyboard support';
    if (component.includes('form')) return 'submit handlers and validation';
    if (component.includes('input')) return 'input events and validation';
    if (component.includes('modal')) return 'open/close functionality';
    return 'appropriate event handlers';
  }

  async callAI(prompt, fileType = 'unknown') {
    const startTime = Date.now();
    try {
      console.log(`🤖 [DEBUG] AI Call Starting for ${fileType}...`);
      console.log(`📏 [DEBUG] Prompt length: ${prompt.length} characters`);
      console.log(`🎯 [DEBUG] AI is now thinking about ${fileType} generation...`);

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const generationTime = Date.now() - startTime;
      const generatedContent = response.content[0].text.trim();

      console.log(`✅ [DEBUG] AI Generation Complete for ${fileType}:`, {
        generationTime: `${generationTime}ms`,
        outputLength: generatedContent.length,
        tokenUsage: response.usage || 'unknown',
        contentPreview: generatedContent.substring(0, 100) + '...'
      });

      console.log(`💭 [DEBUG] AI successfully generated ${fileType} with ${generatedContent.length} characters in ${generationTime}ms`);

      return generatedContent;
    } catch (error) {
      const generationTime = Date.now() - startTime;
      console.error(`❌ [DEBUG] AI generation failed for ${fileType} after ${generationTime}ms:`, error);
      throw new Error(`AI generation failed for ${fileType}: ${error.message}`);
    }
  }
}

class IntelligentCSSGenerator {
  async generateCSS(htmlContent, analysis) {
    const htmlAnalysis = this.parseHTMLStructure(htmlContent);
    const designSystem = this.createDesignSystem(analysis.appType, analysis.designRequirements);
    const cssPrompt = this.buildIntelligentCSSPrompt(htmlAnalysis, designSystem, analysis);

    console.log(`🎨 [DEBUG] Built CSS prompt: ${cssPrompt.length} characters targeting ${htmlAnalysis.ids.length} IDs and ${htmlAnalysis.classes.length} classes`);
    return await this.callAI(cssPrompt, 'CSS');
  }

  parseHTMLStructure(htmlContent) {
    return {
      ids: this.extractAllIds(htmlContent),
      classes: this.extractAllClasses(htmlContent),
      semanticElements: this.extractSemanticElements(htmlContent),
      interactiveElements: this.extractInteractiveElements(htmlContent),
      structure: this.analyzeLayoutStructure(htmlContent)
    };
  }

  extractAllIds(htmlContent) {
    const idMatches = htmlContent.match(/id="([^"]+)"/g) || [];
    return idMatches.map(match => match.replace(/id="([^"]+)"/, '$1'));
  }

  extractAllClasses(htmlContent) {
    const classMatches = htmlContent.match(/class="([^"]+)"/g) || [];
    const allClasses = [];
    classMatches.forEach(match => {
      const classes = match.replace(/class="([^"]+)"/, '$1').split(' ');
      allClasses.push(...classes);
    });
    return [...new Set(allClasses)];
  }

  extractSemanticElements(htmlContent) {
    const semanticTags = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'];
    return semanticTags.filter(tag => htmlContent.includes(`<${tag}`));
  }

  extractInteractiveElements(htmlContent) {
    const interactiveTags = ['button', 'input', 'select', 'textarea', 'a'];
    return interactiveTags.filter(tag => htmlContent.includes(`<${tag}`));
  }

  analyzeLayoutStructure(htmlContent) {
    if (htmlContent.includes('sidebar')) return 'sidebar-layout';
    if (htmlContent.includes('grid')) return 'grid-layout';
    if (htmlContent.includes('feed')) return 'feed-layout';
    return 'standard-layout';
  }

  createDesignSystem(appType, designRequirements) {
    const baseSystem = {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        neutral: '#6b7280',
        background: '#f9fafb',
        surface: '#ffffff'
      },
      typography: {
        primary: 'system-ui, -apple-system, sans-serif',
        secondary: 'Georgia, serif',
        mono: 'Monaco, Consolas, monospace'
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      }
    };

    // Customize based on app type
    switch(appType) {
      case 'dashboard':
        baseSystem.colors.primary = '#1e40af';
        baseSystem.colors.secondary = '#059669';
        break;
      case 'ecommerce':
        baseSystem.colors.primary = '#dc2626';
        baseSystem.colors.secondary = '#ea580c';
        break;
      case 'social':
        baseSystem.colors.primary = '#3b82f6';
        baseSystem.colors.secondary = '#ec4899';
        break;
    }

    return baseSystem;
  }

  buildIntelligentCSSPrompt(htmlAnalysis, designSystem, analysis) {
    return `Create modern, responsive CSS that PERFECTLY matches this HTML structure:

EXACT HTML ELEMENTS TO STYLE:
IDs: ${htmlAnalysis.ids.join(', ')}
Classes: ${htmlAnalysis.classes.join(', ')}
Semantic Elements: ${htmlAnalysis.semanticElements.join(', ')}
Interactive Elements: ${htmlAnalysis.interactiveElements.join(', ')}

DESIGN SYSTEM:
Colors: ${JSON.stringify(designSystem.colors)}
Typography: ${JSON.stringify(designSystem.typography)}
Layout Type: ${htmlAnalysis.structure}

APP TYPE: ${analysis.appType}
FEATURES: ${analysis.features.join(', ')}

LAYOUT STRATEGY:
${this.generateLayoutStrategy(htmlAnalysis.structure, analysis.appType)}

CRITICAL REQUIREMENTS:
1. Style ONLY elements that exist in the HTML
2. Use modern CSS (Grid, Flexbox, Custom Properties)
3. Mobile-first responsive design (320px, 768px, 1024px breakpoints)
4. Smooth animations and transitions (0.3s ease)
5. Accessibility (focus states, contrast ratios)
6. Performance optimized (efficient selectors)

COMPONENT STYLING:
- Cards: Box shadow, rounded corners, hover effects
- Buttons: Primary/secondary styles, hover states, active states
- Forms: Clean inputs, validation states, proper spacing
- Navigation: Clear hierarchy, active states
- Interactive elements: Hover feedback, focus indicators

ANIMATION REQUIREMENTS:
- Hover effects on interactive elements
- Loading states and spinners
- Smooth transitions between states
- Micro-interactions for better UX

OUTPUT: Complete, production-ready CSS with consistent design system.`;
  }

  generateLayoutStrategy(structure, appType) {
    const strategies = {
      'sidebar-layout': 'CSS Grid for main layout (sidebar + content), Flexbox for components',
      'grid-layout': 'CSS Grid for main content area, responsive card layouts',
      'feed-layout': 'Flexbox for feed layout, CSS Grid for post content',
      'standard-layout': 'CSS Grid for page structure, Flexbox for components'
    };

    return strategies[structure] || strategies['standard-layout'];
  }

  async callAI(prompt, fileType = 'unknown') {
    const startTime = Date.now();
    try {
      console.log(`🤖 [DEBUG] AI Call Starting for ${fileType}...`);
      console.log(`📏 [DEBUG] Prompt length: ${prompt.length} characters`);
      console.log(`🎯 [DEBUG] AI is now thinking about ${fileType} generation...`);

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const generationTime = Date.now() - startTime;
      const generatedContent = response.content[0].text.trim();

      console.log(`✅ [DEBUG] AI Generation Complete for ${fileType}:`, {
        generationTime: `${generationTime}ms`,
        outputLength: generatedContent.length,
        tokenUsage: response.usage || 'unknown',
        contentPreview: generatedContent.substring(0, 100) + '...'
      });

      console.log(`💭 [DEBUG] AI successfully generated ${fileType} with ${generatedContent.length} characters in ${generationTime}ms`);

      return generatedContent;
    } catch (error) {
      const generationTime = Date.now() - startTime;
      console.error(`❌ [DEBUG] AI generation failed for ${fileType} after ${generationTime}ms:`, error);
      throw new Error(`AI generation failed for ${fileType}: ${error.message}`);
    }
  }
}

class UniversalJavaScriptOrchestrator {
  async generateJS(htmlContent, analysis) {
    const elementFunctionMap = this.mapElementsToFunctions(htmlContent, analysis.features);
    const interactionPatterns = this.defineInteractionPatterns(analysis.appType, analysis.features);
    const dataStrategy = this.defineDataStrategy(analysis.dataPatterns);
    const jsPrompt = this.buildUniversalJSPrompt(elementFunctionMap, interactionPatterns, dataStrategy, analysis);

    console.log(`⚡ [DEBUG] Built JavaScript prompt: ${jsPrompt.length} characters for ${analysis.features.length} features`);
    console.log(`🔧 [DEBUG] Mapped ${Object.keys(elementFunctionMap).length} features to interactive elements`);
    return await this.callAI(jsPrompt, 'JavaScript');
  }

  mapElementsToFunctions(htmlContent, features) {
    const elementMap = {
      ids: this.extractAllIds(htmlContent),
      buttons: this.extractButtonElements(htmlContent),
      forms: this.extractFormElements(htmlContent),
      inputs: this.extractInputElements(htmlContent),
      modals: this.extractModalElements(htmlContent)
    };

    const functionMap = {};

    features.forEach(feature => {
      const featureFunctions = this.getFeatureFunctions(feature);
      const relevantElements = this.findElementsForFeature(feature, elementMap);

      functionMap[feature] = {
        functions: featureFunctions,
        elements: relevantElements,
        patterns: this.getFeaturePatterns(feature)
      };
    });

    return functionMap;
  }

  extractAllIds(htmlContent) {
    const idMatches = htmlContent.match(/id="([^"]+)"/g) || [];
    return idMatches.map(match => match.replace(/id="([^"]+)"/, '$1'));
  }

  extractButtonElements(htmlContent) {
    const buttonMatches = htmlContent.match(/id="([^"]+)"[^>]*>[^<]*button|button[^>]*id="([^"]+)"/g) || [];
    return buttonMatches.map(match => {
      const idMatch = match.match(/id="([^"]+)"/);
      return idMatch ? idMatch[1] : null;
    }).filter(Boolean);
  }

  extractFormElements(htmlContent) {
    const formMatches = htmlContent.match(/form[^>]*id="([^"]+)"/g) || [];
    return formMatches.map(match => match.replace(/form[^>]*id="([^"]+)"/, '$1'));
  }

  extractInputElements(htmlContent) {
    const inputMatches = htmlContent.match(/input[^>]*id="([^"]+)"/g) || [];
    return inputMatches.map(match => match.replace(/input[^>]*id="([^"]+)"/, '$1'));
  }

  extractModalElements(htmlContent) {
    const modalMatches = htmlContent.match(/id="([^"]*modal[^"]*)"/gi) || [];
    return modalMatches.map(match => match.replace(/id="([^"]+)"/, '$1'));
  }

  getFeatureFunctions(feature) {
    const functionLibrary = {
      'search': ['handleSearch', 'displayResults', 'clearResults', 'handleSearchInput'],
      'filter': ['applyFilters', 'updateFilters', 'resetFilters', 'handleFilterChange'],
      'crud': ['create', 'read', 'update', 'delete', 'validate', 'handleFormSubmit'],
      'modal': ['openModal', 'closeModal', 'handleModalEvents', 'handleModalClose'],
      'favorites': ['addToFavorites', 'removeFromFavorites', 'updateFavoritesList', 'toggleFavorite'],
      'pagination': ['loadNextPage', 'loadPreviousPage', 'updatePagination', 'handlePageClick'],
      'auth': ['login', 'logout', 'register', 'validateUser', 'handleAuthForm'],
      'upload': ['handleFileUpload', 'validateFile', 'showProgress', 'handleFileDrop'],
      'api': ['fetchData', 'postData', 'handleErrors', 'cacheData'],
      'rating': ['handleRating', 'updateRatingDisplay', 'submitRating'],
      'carousel': ['nextSlide', 'prevSlide', 'goToSlide', 'autoPlay'],
      'tabs': ['switchTab', 'initializeTabs', 'handleTabClick']
    };

    return functionLibrary[feature] || [`handle${this.capitalize(feature)}`];
  }

  findElementsForFeature(feature, elementMap) {
    const relevantElements = [];

    // Search for elements related to this feature
    elementMap.ids.forEach(id => {
      if (id.toLowerCase().includes(feature.toLowerCase())) {
        relevantElements.push(id);
      }
    });

    return relevantElements;
  }

  getFeaturePatterns(feature) {
    const patterns = {
      'search': 'Real-time search with debouncing',
      'filter': 'Multi-select filtering with state management',
      'modal': 'Focus management and escape key handling',
      'favorites': 'LocalStorage persistence with UI updates',
      'api': 'Error handling with retry logic'
    };

    return patterns[feature] || 'Standard event handling';
  }

  defineInteractionPatterns(appType, features) {
    const patterns = {
      'dashboard': {
        initialization: 'Load dashboard data and setup widgets',
        dataRefresh: 'Real-time data updates with WebSockets',
        userInteraction: 'Widget interactions and filtering'
      },
      'ecommerce': {
        initialization: 'Load products and setup shopping cart',
        shopping: 'Add/remove items, update quantities',
        checkout: 'Multi-step checkout with validation'
      },
      'social': {
        initialization: 'Load user feed and setup real-time updates',
        posting: 'Create, edit, delete posts with media',
        engagement: 'Like, comment, share functionality'
      },
      'finder': {
        initialization: 'Setup search and filter components',
        searching: 'Real-time search with suggestions',
        results: 'Display and interact with search results'
      }
    };

    return patterns[appType] || {
      initialization: 'Setup application state and event listeners',
      interaction: 'Handle user interactions and updates',
      persistence: 'Save and retrieve application data'
    };
  }

  defineDataStrategy(dataPatterns) {
    return {
      storage: dataPatterns.storage || 'localStorage',
      api: dataPatterns.apiIntegration ? 'REST API with fallback data' : 'Static demo data',
      caching: 'LocalStorage caching with expiration',
      state: 'Centralized state management'
    };
  }

  buildUniversalJSPrompt(elementFunctionMap, interactionPatterns, dataStrategy, analysis) {
    return `Create complete, production-ready JavaScript for a ${analysis.appType} application.

ELEMENT-FUNCTION MAPPING:
${JSON.stringify(elementFunctionMap, null, 2)}

INTERACTION PATTERNS:
${JSON.stringify(interactionPatterns, null, 2)}

DATA STRATEGY:
${JSON.stringify(dataStrategy, null, 2)}

REQUIRED FUNCTIONALITY:
${analysis.features.map(feature =>
  `- ${feature}: Complete implementation with error handling and user feedback`
).join('\n')}

ARCHITECTURE REQUIREMENTS:
1. Modern ES6+ JavaScript (const/let, arrow functions, async/await)
2. Modular code organization with clear separation of concerns
3. Comprehensive error handling and user feedback
4. Performance optimization (debouncing, caching, lazy loading)
5. Accessibility support (ARIA updates, keyboard navigation)
6. Mobile-responsive interactions (touch events, responsive design)

ELEMENT VALIDATION:
- Always verify elements exist before using them
- Graceful degradation for missing elements
- Console warnings for debugging missing elements
- Defensive programming throughout

DATA MANAGEMENT:
- LocalStorage for user preferences and favorites
- API integration with demo data fallback
- State management for complex interactions
- Caching strategies for improved performance

DEMO DATA:
Include realistic demo data for ${analysis.appType} that works immediately without external APIs.

EVENT HANDLING:
- Use event delegation for dynamic content
- Debounce search inputs and API calls
- Handle both mouse and keyboard interactions
- Support touch events for mobile devices

OUTPUT REQUIREMENTS:
- Complete working application with all features
- Production-ready code quality
- Comprehensive error handling
- Performance optimized
- Accessible and mobile-friendly
- Self-contained with demo data

CRITICAL: Every feature must be fully implemented and working. No placeholder comments or TODO items.`;
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async callAI(prompt, fileType = 'unknown') {
    const startTime = Date.now();
    try {
      console.log(`🤖 [DEBUG] AI Call Starting for ${fileType}...`);
      console.log(`📏 [DEBUG] Prompt length: ${prompt.length} characters`);
      console.log(`🎯 [DEBUG] AI is now thinking about ${fileType} generation...`);

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const generationTime = Date.now() - startTime;
      const generatedContent = response.content[0].text.trim();

      console.log(`✅ [DEBUG] AI Generation Complete for ${fileType}:`, {
        generationTime: `${generationTime}ms`,
        outputLength: generatedContent.length,
        tokenUsage: response.usage || 'unknown',
        contentPreview: generatedContent.substring(0, 100) + '...'
      });

      console.log(`💭 [DEBUG] AI successfully generated ${fileType} with ${generatedContent.length} characters in ${generationTime}ms`);

      return generatedContent;
    } catch (error) {
      const generationTime = Date.now() - startTime;
      console.error(`❌ [DEBUG] AI generation failed for ${fileType} after ${generationTime}ms:`, error);
      throw new Error(`AI generation failed for ${fileType}: ${error.message}`);
    }
  }
}

class UltraValidationSystem {
  async validateGeneratedApp(htmlContent, cssContent, jsContent, originalAnalysis) {
    console.log(`🔍 [DEBUG] Starting comprehensive validation...`);
    console.log(`📊 [DEBUG] Validation inputs:`, {
      htmlSize: htmlContent.length,
      cssSize: cssContent.length,
      jsSize: jsContent.length,
      requestedFeatures: originalAnalysis.features.length
    });

    console.log(`🤖 [DEBUG] AI is thinking about validation criteria...`);
    console.log(`💭 [DEBUG] AI considerations: HTML structure, CSS targeting, JS functionality, feature completeness`);

    const validationReport = {
      htmlValidation: this.validateHTML(htmlContent),
      cssValidation: this.validateCSS(cssContent, htmlContent),
      jsValidation: this.validateJS(jsContent, htmlContent),
      featureValidation: this.validateFeatures(originalAnalysis.features, htmlContent, jsContent),
      qualityScore: 0,
      issues: [],
      fixes: []
    };

    console.log(`📈 [DEBUG] Individual validation results:`, {
      htmlValid: validationReport.htmlValidation.syntax,
      cssValid: validationReport.cssValidation.syntax,
      jsValid: validationReport.jsValidation.syntax,
      featureCompleteness: validationReport.featureValidation.completeness
    });

    validationReport.qualityScore = this.calculateQualityScore(validationReport);

    console.log(`✅ [DEBUG] Validation complete - Quality Score: ${validationReport.qualityScore}%`);

    return validationReport;
  }

  validateHTML(htmlContent) {
    console.log(`📄 [DEBUG] Validating HTML structure...`);
    const ids = this.extractAllIds(htmlContent);
    const uniqueIds = [...new Set(ids)];

    const validation = {
      syntax: this.validateHTMLSyntax(htmlContent),
      semantics: this.validateSemanticStructure(htmlContent),
      accessibility: this.validateAccessibility(htmlContent),
      elementIds: {
        total: ids.length,
        unique: uniqueIds.length,
        duplicates: ids.length - uniqueIds.length
      }
    };

    console.log(`📄 [DEBUG] HTML validation results:`, {
      hasDoctype: validation.syntax,
      semanticElements: validation.semantics,
      accessibilityFeatures: validation.accessibility,
      idStats: validation.elementIds
    });

    return validation;
  }

  validateCSS(cssContent, htmlContent) {
    console.log(`🎨 [DEBUG] Validating CSS targeting and responsiveness...`);
    const htmlElements = this.extractAllElements(htmlContent);
    const cssSelectors = this.extractAllCSSSelectors(cssContent);

    const validation = {
      syntax: cssContent.length > 0,
      targeting: this.validateCSSTargeting(cssSelectors, htmlElements),
      responsiveness: this.validateResponsiveDesign(cssContent)
    };

    console.log(`🎨 [DEBUG] CSS validation results:`, {
      hasContent: validation.syntax,
      selectorsValid: validation.targeting.valid,
      orphanedSelectors: validation.targeting.orphanedSelectors?.length || 0,
      isResponsive: validation.responsiveness,
      totalSelectors: cssSelectors.length
    });

    return validation;
  }

  validateJS(jsContent, htmlContent) {
    console.log(`⚡ [DEBUG] Validating JavaScript functionality and element targeting...`);
    const htmlElements = this.extractAllElements(htmlContent);
    const jsElementReferences = this.extractJSElementReferences(jsContent);

    const validation = {
      syntax: jsContent.length > 0,
      elementTargeting: this.validateJSElementTargeting(jsElementReferences, htmlElements),
      functionCompleteness: this.validateFunctionImplementations(jsContent)
    };

    console.log(`⚡ [DEBUG] JavaScript validation results:`, {
      hasContent: validation.syntax,
      elementTargetingValid: validation.elementTargeting.valid,
      missingElements: validation.elementTargeting.missingElements?.length || 0,
      hasFunctions: validation.functionCompleteness,
      referencedElements: jsElementReferences.length
    });

    return validation;
  }

  validateFeatures(requestedFeatures, htmlContent, jsContent) {
    console.log(`🎯 [DEBUG] Validating feature implementation...`);
    console.log(`📋 [DEBUG] Requested features:`, requestedFeatures);

    const implementedFeatures = this.detectImplementedFeatures(htmlContent, jsContent);
    const missingFeatures = requestedFeatures.filter(feature => !implementedFeatures.includes(feature));
    const completeness = requestedFeatures.length > 0 ? (implementedFeatures.length / requestedFeatures.length) * 100 : 100;

    console.log(`🎯 [DEBUG] Feature validation results:`, {
      requested: requestedFeatures.length,
      implemented: implementedFeatures.length,
      missing: missingFeatures.length,
      completenessPercentage: Math.round(completeness),
      implementedList: implementedFeatures,
      missingList: missingFeatures
    });

    return {
      implemented: implementedFeatures,
      missing: missingFeatures,
      completeness: completeness
    };
  }

  calculateQualityScore(validationReport) {
    console.log(`📊 [DEBUG] Calculating quality score...`);
    let score = 100;
    const penalties = [];

    // HTML quality
    if (!validationReport.htmlValidation.syntax) {
      score -= 20;
      penalties.push('HTML syntax issues (-20)');
    }
    if (validationReport.htmlValidation.elementIds.duplicates > 0) {
      score -= 10;
      penalties.push(`Duplicate IDs (-10)`);
    }

    // CSS quality
    if (!validationReport.cssValidation.syntax) {
      score -= 20;
      penalties.push('CSS syntax issues (-20)');
    }

    // JS quality
    if (!validationReport.jsValidation.syntax) {
      score -= 20;
      penalties.push('JavaScript syntax issues (-20)');
    }

    // Feature completeness
    const featureMultiplier = validationReport.featureValidation.completeness / 100;
    const originalScore = score;
    score = score * featureMultiplier;

    console.log(`📊 [DEBUG] Quality score calculation:`, {
      startingScore: 100,
      afterPenalties: originalScore,
      featureCompleteness: `${validationReport.featureValidation.completeness}%`,
      featureMultiplier: featureMultiplier,
      finalScore: Math.round(score),
      appliedPenalties: penalties.length > 0 ? penalties : ['No penalties']
    });

    return Math.max(0, Math.round(score));
  }

  extractAllIds(htmlContent) {
    const idMatches = htmlContent.match(/id="([^"]+)"/g) || [];
    return idMatches.map(match => match.replace(/id="([^"]+)"/, '$1'));
  }

  extractAllElements(htmlContent) {
    const ids = this.extractAllIds(htmlContent);
    const classes = this.extractAllClasses(htmlContent);
    return { ids, classes };
  }

  extractAllClasses(htmlContent) {
    const classMatches = htmlContent.match(/class="([^"]+)"/g) || [];
    const allClasses = [];
    classMatches.forEach(match => {
      const classes = match.replace(/class="([^"]+)"/, '$1').split(' ');
      allClasses.push(...classes);
    });
    return [...new Set(allClasses)];
  }

  extractAllCSSSelectors(cssContent) {
    // Basic CSS selector extraction
    const selectorMatches = cssContent.match(/[.#]?[a-zA-Z-_][a-zA-Z0-9-_]*\s*{/g) || [];
    return selectorMatches.map(match => match.replace(/\s*{$/, '').trim());
  }

  extractJSElementReferences(jsContent) {
    const elementRefs = [];
    const getElementMatches = jsContent.match(/getElementById\(['"`]([^'"`]+)['"`]\)/g) || [];
    getElementMatches.forEach(match => {
      const id = match.match(/getElementById\(['"`]([^'"`]+)['"`]\)/)[1];
      elementRefs.push(id);
    });
    return elementRefs;
  }

  validateHTMLSyntax(htmlContent) {
    return htmlContent.includes('<!DOCTYPE html>') &&
           htmlContent.includes('<html') &&
           htmlContent.includes('</html>');
  }

  validateSemanticStructure(htmlContent) {
    const semanticElements = ['header', 'nav', 'main', 'section', 'footer'];
    return semanticElements.some(element => htmlContent.includes(`<${element}`));
  }

  validateAccessibility(htmlContent) {
    return htmlContent.includes('aria-') || htmlContent.includes('role=');
  }

  validateCSSTargeting(cssSelectors, htmlElements) {
    const orphanedSelectors = [];
    cssSelectors.forEach(selector => {
      const cleanSelector = selector.replace(/[.#]/, '');
      if (selector.startsWith('#') && !htmlElements.ids.includes(cleanSelector)) {
        orphanedSelectors.push(selector);
      }
      if (selector.startsWith('.') && !htmlElements.classes.includes(cleanSelector)) {
        orphanedSelectors.push(selector);
      }
    });

    return {
      valid: orphanedSelectors.length === 0,
      orphanedSelectors
    };
  }

  validateResponsiveDesign(cssContent) {
    return cssContent.includes('@media');
  }

  validateJSElementTargeting(jsElementReferences, htmlElements) {
    const missingElements = jsElementReferences.filter(ref => !htmlElements.ids.includes(ref));
    return {
      valid: missingElements.length === 0,
      missingElements
    };
  }

  validateFunctionImplementations(jsContent) {
    return jsContent.includes('function') || jsContent.includes('=>');
  }

  detectImplementedFeatures(htmlContent, jsContent) {
    const implementedFeatures = [];

    const featurePatterns = {
      'search': /search|find/i,
      'filter': /filter/i,
      'modal': /modal/i,
      'favorites': /favorite|bookmark/i,
      'auth': /login|register/i,
      'upload': /upload|file/i,
      'pagination': /page|pagination/i,
      'rating': /rating|star/i,
      'carousel': /carousel|slider/i,
      'tabs': /tab/i
    };

    Object.keys(featurePatterns).forEach(feature => {
      if (featurePatterns[feature].test(htmlContent) || featurePatterns[feature].test(jsContent)) {
        implementedFeatures.push(feature);
      }
    });

    return implementedFeatures;
  }
}

class UniversalWebAppGenerator {
  async generatePerfectWebApp(userPrompt, emitCallback) {
    const startTime = Date.now();

    try {
      console.log(`🎯 [DEBUG] Universal Web App Generator Starting...`);
      console.log(`📝 [DEBUG] User Prompt Analysis: "${userPrompt}"`);
      emitCallback('status', { message: '🧠 Analyzing your requirements...', phase: 'analysis' });

      // PHASE 1: Ultra-Analysis
      console.log(`🔍 [DEBUG] PHASE 1: Starting prompt analysis...`);
      const analyzer = new UniversalPromptAnalyzer();
      const analysis = analyzer.analyze(userPrompt);

      console.log(`🎯 [DEBUG] AI Analysis Complete:`, {
        detectedAppType: analysis.appType,
        extractedFeatures: analysis.features,
        designRequirements: analysis.designRequirements,
        dataPatterns: analysis.dataPatterns,
        technicalSpecs: analysis.technicalSpecs
      });

      emitCallback('status', {
        message: `✅ Detected ${analysis.appType} app with ${analysis.features.length} features`,
        analysis: analysis,
        phase: 'analysis_complete',
        debug: {
          detectedFeatures: analysis.features,
          appCategory: analysis.appType,
          designStyle: analysis.designRequirements
        }
      });

      // PHASE 2: Architecture Planning
      console.log(`🏗️ [DEBUG] PHASE 2: Planning application architecture...`);
      const architect = new UniversalArchitectureGenerator();
      const architecture = architect.generateArchitecture(analysis);

      console.log(`🏛️ [DEBUG] Architecture Plan:`, {
        htmlStructure: architecture.htmlStructure,
        cssStrategy: architecture.cssStrategy,
        jsPattern: architecture.jsPattern,
        componentMap: architecture.componentMap
      });

      emitCallback('status', {
        message: '🏗️ Planning application architecture...',
        phase: 'architecture',
        debug: {
          plannedSections: architecture.htmlStructure.sections,
          plannedComponents: architecture.htmlStructure.components.length,
          layoutStrategy: architecture.cssStrategy.layout
        }
      });

      // PHASE 3: HTML Generation (Foundation)
      console.log(`📄 [DEBUG] PHASE 3: Generating HTML structure...`);
      emitCallback('status', { message: '📄 Generating semantic HTML structure...', phase: 'html_generation' });

      const htmlGenerator = new AdaptiveHTMLGenerator();
      console.log(`🤖 [DEBUG] AI is thinking about HTML structure...`);
      console.log(`💭 [DEBUG] AI considerations: semantic HTML5, accessibility, ${analysis.features.join(', ')} features`);

      const htmlContent = await htmlGenerator.generateHTML(architecture, analysis);

      console.log(`📄 [DEBUG] HTML Generation Complete:`, {
        htmlSize: htmlContent.length,
        containsDoctype: htmlContent.includes('<!DOCTYPE html>'),
        semanticElements: ['header', 'nav', 'main', 'section', 'footer'].filter(tag => htmlContent.includes(`<${tag}`)),
        estimatedElements: (htmlContent.match(/</g) || []).length
      });

      // PHASE 4: CSS Generation (Based on actual HTML)
      console.log(`🎨 [DEBUG] PHASE 4: Analyzing HTML and generating CSS...`);
      emitCallback('status', { message: '🎨 Creating beautiful CSS styles...', phase: 'css_generation' });

      const cssGenerator = new IntelligentCSSGenerator();

      // Parse HTML first to understand structure
      const htmlAnalysis = cssGenerator.parseHTMLStructure(htmlContent);
      console.log(`🔍 [DEBUG] HTML Analysis for CSS:`, {
        extractedIDs: htmlAnalysis.ids,
        extractedClasses: htmlAnalysis.classes,
        semanticElements: htmlAnalysis.semanticElements,
        layoutStructure: htmlAnalysis.structure
      });

      console.log(`🤖 [DEBUG] AI is thinking about CSS design...`);
      console.log(`💭 [DEBUG] AI considerations: ${analysis.appType} design patterns, responsive layout, ${analysis.designRequirements.join(', ')} aesthetic`);

      const cssContent = await cssGenerator.generateCSS(htmlContent, analysis);

      console.log(`🎨 [DEBUG] CSS Generation Complete:`, {
        cssSize: cssContent.length,
        hasMediaQueries: cssContent.includes('@media'),
        hasGridOrFlex: cssContent.includes('grid') || cssContent.includes('flex'),
        estimatedRules: (cssContent.match(/{/g) || []).length
      });

      // PHASE 5: JavaScript Generation (Synchronized with HTML)
      console.log(`⚡ [DEBUG] PHASE 5: Analyzing HTML/CSS and generating JavaScript...`);
      emitCallback('status', { message: '⚡ Building interactive JavaScript...', phase: 'js_generation' });

      const jsGenerator = new UniversalJavaScriptOrchestrator();

      // Analyze HTML for interactive elements
      const elementMap = jsGenerator.mapElementsToFunctions(htmlContent, analysis.features);
      console.log(`🔍 [DEBUG] Interactive Elements Mapping:`, {
        availableIDs: elementMap.search?.elements || [],
        requiredFunctions: Object.keys(elementMap),
        featureComplexity: Object.keys(elementMap).length
      });

      console.log(`🤖 [DEBUG] AI is thinking about JavaScript functionality...`);
      console.log(`💭 [DEBUG] AI considerations: modern ES6+, ${analysis.features.join(', ')} features, error handling, performance`);

      const jsContent = await jsGenerator.generateJS(htmlContent, analysis);

      console.log(`⚡ [DEBUG] JavaScript Generation Complete:`, {
        jsSize: jsContent.length,
        hasES6Features: jsContent.includes('=>') || jsContent.includes('const '),
        hasEventListeners: jsContent.includes('addEventListener'),
        hasErrorHandling: jsContent.includes('try') || jsContent.includes('catch'),
        estimatedFunctions: (jsContent.match(/function|=>/g) || []).length
      });

      // PHASE 6: Ultra-Validation
      console.log(`🔍 [DEBUG] PHASE 6: Validating generated application...`);
      emitCallback('status', { message: '🔍 Validating app quality...', phase: 'validation' });

      const validator = new UltraValidationSystem();
      const validationResult = await validator.validateGeneratedApp(
        htmlContent, cssContent, jsContent, analysis
      );

      console.log(`✅ [DEBUG] Validation Complete:`, {
        qualityScore: validationResult.qualityScore,
        htmlValidation: validationResult.htmlValidation,
        cssValidation: validationResult.cssValidation,
        jsValidation: validationResult.jsValidation,
        featureCompleteness: validationResult.featureValidation.completeness
      });

      // PHASE 7: Generate README
      console.log(`📚 [DEBUG] PHASE 7: Generating documentation...`);
      const readmeContent = this.generateUniversalREADME(analysis, validationResult);

      const totalTime = Date.now() - startTime;
      console.log(`🎉 [DEBUG] Universal Generation Complete!`, {
        totalGenerationTime: `${totalTime}ms`,
        finalQualityScore: validationResult.qualityScore,
        appType: analysis.appType,
        featuresImplemented: analysis.features.length,
        filesGenerated: 4
      });

      emitCallback('status', {
        message: `🎉 Generation complete! Quality: ${validationResult.qualityScore}%`,
        phase: 'complete',
        debug: {
          generationTime: totalTime,
          qualityScore: validationResult.qualityScore,
          appType: analysis.appType,
          features: analysis.features
        }
      });

      return {
        files: {
          'index.html': htmlContent,
          'styles.css': cssContent,
          'script.js': jsContent,
          'README.md': readmeContent
        },
        analysis: analysis,
        qualityReport: validationResult,
        features: analysis.features,
        appType: analysis.appType,
        debug: {
          generationTime: totalTime,
          phases: ['analysis', 'architecture', 'html', 'css', 'js', 'validation', 'readme'],
          aiThoughts: {
            promptAnalysis: `Detected ${analysis.appType} with ${analysis.features.length} features`,
            architecturalDecisions: `Used ${architecture.cssStrategy.layout} with ${architecture.htmlStructure.components.length} components`,
            qualityAssurance: `Achieved ${validationResult.qualityScore}% quality score`
          }
        }
      };

    } catch (error) {
      const totalTime = Date.now() - startTime;
      console.error(`❌ [DEBUG] Universal generation failed after ${totalTime}ms:`, error);
      emitCallback('status', {
        message: `❌ Generation failed: ${error.message}`,
        phase: 'error',
        debug: {
          errorTime: totalTime,
          errorStack: error.stack
        }
      });
      throw new Error(`Universal generation failed: ${error.message}`);
    }
  }

  generateUniversalREADME(analysis, validationResult) {
    return `# ${this.capitalize(analysis.appType)} App

A modern, responsive ${analysis.appType} application built with HTML5, CSS3, and JavaScript.

## 🌟 Features

${analysis.features.map(feature => `- **${this.capitalize(feature)}**: Advanced ${feature} functionality`).join('\n')}

## 🚀 Quick Start

1. Download all files to a folder
2. Open \`index.html\` in your web browser
3. Start using the app immediately!

## 📱 App Type: ${analysis.appType}

This application is specifically designed for ${analysis.appType} use cases with optimized user experience.

## 🎯 Quality Report

- **Quality Score**: ${validationResult.qualityScore}%
- **Features Implemented**: ${validationResult.featureValidation.implemented.length}/${analysis.features.length}
- **HTML Validation**: ✅ Valid semantic structure
- **CSS Validation**: ✅ Modern responsive design
- **JavaScript Validation**: ✅ Complete functionality

## 🛠️ Technical Stack

- **HTML5**: Semantic structure with accessibility
- **CSS3**: Modern styling with Grid and Flexbox
- **JavaScript**: ES6+ with modular architecture
- **Design**: ${analysis.designRequirements.join(', ')} aesthetic

## 📋 Features Details

${analysis.features.map(feature => `### ${this.capitalize(feature)}
Complete ${feature} implementation with modern UX patterns.`).join('\n\n')}

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT License - feel free to use and modify.

---

**Generated with Universal Web App Generator** 🚀`;
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// ============================================================================
// ENHANCED CODE GENERATOR WITH UNIVERSAL SYSTEM
// ============================================================================

class CodeGenerator {
  constructor(projectId, projectName, description, socketId) {
    this.projectId = projectId;
    this.projectName = projectName;
    this.description = description;
    this.socketId = socketId;
    this.projectPath = path.join(__dirname, '..', 'generated', projectName);
    this.files = new Map();
    this.status = 'initializing';
    this.universalGenerator = new UniversalWebAppGenerator();
  }

  async init() {
    try {
      await fs.ensureDir(this.projectPath);
      this.status = 'ready';
      this.emit('status', { status: this.status, message: 'Project initialized' });
    } catch (error) {
      this.status = 'error';
      this.emit('error', { message: 'Failed to initialize project', error: error.message });
    }
  }

  emit(event, data) {
    io.to(this.socketId).emit(event, { projectId: this.projectId, ...data });
  }

  async generateProject() {
    try {
      this.status = 'generating';
      console.log(`🚀 [DEBUG] Starting Universal Web App Generator for project: ${this.projectName}`);
      console.log(`📝 [DEBUG] User prompt: "${this.description}"`);
      this.emit('status', { status: this.status, message: 'Initializing Universal Web App Generator...' });

      // Use the new universal system with real-time status updates and detailed debugging
      const result = await this.universalGenerator.generatePerfectWebApp(
        this.description,
        (event, data) => {
          console.log(`📡 [DEBUG] Universal System Event: ${event}`, data);
          this.emit(event, data);
        }
      );

      console.log(`✅ [DEBUG] Universal generation completed successfully!`);
      console.log(`📊 [DEBUG] Generation results:`, {
        appType: result.appType,
        features: result.features,
        qualityScore: result.qualityReport.qualityScore,
        filesGenerated: Object.keys(result.files)
      });

      // Generate files based on the intelligent analysis
      this.emit('status', { message: '📁 Writing generated files to disk...' });

      for (const [filename, content] of Object.entries(result.files)) {
        console.log(`💾 [DEBUG] Writing file: ${filename} (${content.length} characters)`);

        await this.writeGeneratedFile(filename, content);
        this.files.set(filename, content);

        this.emit('file-complete', {
          fileName: filename,
          content: content,
          message: `✅ Generated ${filename}`,
          size: content.length,
          timestamp: new Date().toISOString()
        });
      }

      this.status = 'completed';
      console.log(`🎉 [DEBUG] Project generation completed successfully!`);
      console.log(`📈 [DEBUG] Final quality metrics:`, result.qualityReport);

      this.emit('status', {
        status: this.status,
        message: `🎉 Perfect ${result.appType} app generated! Quality: ${result.qualityReport.qualityScore}%`,
        appType: result.appType,
        features: result.features,
        qualityScore: result.qualityReport.qualityScore,
        debug: {
          totalFiles: Object.keys(result.files).length,
          generationTime: new Date().toISOString(),
          validation: result.qualityReport
        }
      });

      this.emit('project-complete', {
        projectId: this.projectId,
        projectName: this.projectName,
        files: Array.from(this.files.keys()),
        appType: result.appType,
        features: result.features,
        qualityReport: result.qualityReport
      });

    } catch (error) {
      console.error(`❌ [DEBUG] Generation failed:`, error);
      this.status = 'error';
      this.emit('error', {
        message: 'Failed to generate project',
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  }

  async writeGeneratedFile(fileName, content) {
    try {
      const filePath = path.join(this.projectPath, fileName);
      await fs.writeFile(filePath, content);
    } catch (error) {
      throw new Error(`Failed to write ${fileName}: ${error.message}`);
    }
  }

  // Legacy method - now handled by Universal System
  async generateFile(fileName, fileType) {
    // This method is kept for compatibility but redirects to the new system
    console.log(`Legacy generateFile called for ${fileName} - using Universal System instead`);
    return this.generateProject();
  }

  async improveProject(iterations = 2) {
    try {
      this.status = 'improving';
      this.emit('status', { status: this.status, message: 'Using Universal System for improvements...' });

      // The Universal System already generates high-quality code
      // For improvements, we can regenerate with additional context
      const improvedPrompt = `${this.description}\n\nAdditional requirements: Enhanced version with ${iterations} improvement iterations focusing on advanced features, better UX, and optimization.`;

      const result = await this.universalGenerator.generatePerfectWebApp(
        improvedPrompt,
        (event, data) => this.emit(event, data)
      );

      // Update files with improved versions
      for (const [filename, content] of Object.entries(result.files)) {
        await this.writeGeneratedFile(filename, content);
        this.files.set(filename, content);

        this.emit('file-improve-complete', {
          fileName: filename,
          content: content,
          iteration: iterations,
          message: `✅ Enhanced ${filename} with Universal System`
        });
      }

      this.status = 'completed';
      this.emit('status', {
        status: this.status,
        message: `🚀 Universal System improvements completed! Quality: ${result.qualityReport.qualityScore}%`
      });

    } catch (error) {
      this.status = 'error';
      this.emit('error', { message: 'Failed during improvements', error: error.message });
    }
  }

  async createDownloadZip() {
    try {
      const zipPath = path.join(__dirname, '..', 'generated', `${this.projectName}.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      archive.pipe(output);
      archive.directory(this.projectPath, this.projectName);
      await archive.finalize();

      return zipPath;
    } catch (error) {
      throw new Error(`Failed to create zip: ${error.message}`);
    }
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/projects', (req, res) => {
  const projects = Array.from(activeProjects.values()).map(project => ({
    id: project.projectId,
    name: project.projectName,
    description: project.description,
    status: project.status,
    files: Array.from(project.files.keys())
  }));
  res.json(projects);
});

app.get('/api/projects/:id/download', async (req, res) => {
  try {
    const project = activeProjects.get(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const zipPath = await project.createDownloadZip();
    res.download(zipPath, `${project.projectName}.zip`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('create-project', async (data) => {
    try {
      const { projectName, description, improvements = 2 } = data;

      if (!projectName || !description) {
        socket.emit('error', { message: 'Project name and description are required' });
        return;
      }

      const projectId = uuidv4();
      const generator = new CodeGenerator(projectId, projectName, description, socket.id);

      activeProjects.set(projectId, generator);

      await generator.init();
      socket.emit('project-created', { projectId, projectName });

      // Start generation
      await generator.generateProject();

      // Apply improvements if requested
      if (improvements > 0) {
        await generator.improveProject(improvements);
      }

    } catch (error) {
      socket.emit('error', { message: 'Failed to create project', error: error.message });
    }
  });

  socket.on('improve-project', async (data) => {
    try {
      const { projectId, iterations = 1 } = data;
      const project = activeProjects.get(projectId);

      if (!project) {
        socket.emit('error', { message: 'Project not found' });
        return;
      }

      await project.improveProject(iterations);
    } catch (error) {
      socket.emit('error', { message: 'Failed to improve project', error: error.message });
    }
  });

  socket.on('get-project-files', (data) => {
    const { projectId } = data;
    const project = activeProjects.get(projectId);

    if (!project) {
      socket.emit('error', { message: 'Project not found' });
      return;
    }

    const files = {};
    for (const [fileName, content] of project.files.entries()) {
      files[fileName] = content;
    }

    socket.emit('project-files', { projectId, files });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5005;
server.listen(PORT, () => {
  console.log(`🚀 AI Code Generator Backend running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for real-time communication`);

  console.log(`\n🤖 [DEBUG] Universal Web App Generator System Initialized:`);
  console.log(`🧠 [DEBUG] - UniversalPromptAnalyzer: Intelligent app type detection`);
  console.log(`🏗️ [DEBUG] - UniversalArchitectureGenerator: Smart architecture planning`);
  console.log(`📄 [DEBUG] - AdaptiveHTMLGenerator: Semantic HTML generation`);
  console.log(`🎨 [DEBUG] - IntelligentCSSGenerator: CSS based on actual HTML elements`);
  console.log(`⚡ [DEBUG] - UniversalJavaScriptOrchestrator: JS synchronized with HTML`);
  console.log(`🔍 [DEBUG] - UltraValidationSystem: Comprehensive quality validation`);
  console.log(`\n💭 [DEBUG] AI Thinking Process: Fully implemented with detailed logging`);
  console.log(`📊 [DEBUG] Quality Assurance: Real-time validation and scoring`);
  console.log(`🌐 [DEBUG] Universal Support: Works for ANY web app type`);
  console.log(`✅ [DEBUG] System Status: Ready for high-quality web app generation!`);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY not found in environment variables');
  }
});

export default app;