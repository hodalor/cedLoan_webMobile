const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Cache for content data
let contentCache = {
  data: null,
  timestamp: null,
  expiry: 5 * 60 * 1000 // 5 minutes
};

class ContentAPI {
  // Get all content
  static async getAllContent() {
    try {
      const response = await fetch(`${API_BASE_URL}/content`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch content');
      }
    } catch (error) {
      console.error('Error fetching all content:', error);
      return this.getDefaultContent();
    }
  }

  // Get content by type
  static async getContentByType(type) {
    try {
      const response = await fetch(`${API_BASE_URL}/content?type=${type}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || `Failed to fetch ${type} content`);
      }
    } catch (error) {
      console.error(`Error fetching ${type} content:`, error);
      return this.getDefaultContentByType(type);
    }
  }

  // Get content by key
  static async getContentByKey(key) {
    try {
      const response = await fetch(`${API_BASE_URL}/content/${key}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || `Failed to fetch content for key: ${key}`);
      }
    } catch (error) {
      console.error(`Error fetching content for key ${key}:`, error);
      return null;
    }
  }

  // Get FAQ content with caching
  static async getFAQContent() {
    return this.getCachedContentByType('faq');
  }

  // Get process guide content with caching
  static async getProcessGuideContent() {
    return this.getCachedContentByType('process_guide');
  }

  // Get contact info with caching
  static async getContactInfo() {
    return this.getCachedContentByType('contact_info');
  }

  // Get cached content by type
  static async getCachedContentByType(type) {
    const cacheKey = `${type}_cache`;
    const cached = contentCache[cacheKey];
    
    if (cached && cached.timestamp && (Date.now() - cached.timestamp < contentCache.expiry)) {
      return cached.data;
    }
    
    try {
      const content = await this.getContentByType(type);
      contentCache[cacheKey] = {
        data: content,
        timestamp: Date.now()
      };
      return content;
    } catch (error) {
      console.error(`Error fetching cached ${type} content:`, error);
      return this.getDefaultContentByType(type);
    }
  }

  // Clear cache
  static clearCache() {
    contentCache = {
      data: null,
      timestamp: null,
      expiry: 5 * 60 * 1000
    };
  }

  // Get default content when API fails
  static getDefaultContent() {
    return {
      faq: this.getDefaultContentByType('faq'),
      process_guide: this.getDefaultContentByType('process_guide'),
      contact_info: this.getDefaultContentByType('contact_info')
    };
  }

  // Get default content by type
  static getDefaultContentByType(type) {
    switch (type) {
      case 'faq':
        return [
          {
            key: 'faq_how_to_get_loan',
            title: 'How can I get a loan?',
            content: {
              answer: 'To get a loan, you need to register with your phone number, fill in your personal information, provide two references, upload your NRC photos, and submit your application.'
            },
            order: 1
          },
          {
            key: 'faq_how_much_borrow',
            title: 'How much can I borrow?',
            content: {
              answer: 'Loan amounts range from GHS 100 to GHS 5,000 for first-time borrowers. Your credit limit may increase based on your repayment history.'
            },
            order: 2
          },
          {
            key: 'faq_when_can_apply',
            title: 'When can I apply?',
            content: {
              answer: 'You can apply for a loan 24/7 through our mobile application. Processing happens during business hours.'
            },
            order: 3
          }
        ];
      
      case 'process_guide':
        return [
          {
            key: 'process_step_1',
            title: 'Submit Application',
            content: {
              description: 'Login with SMS OTP or Nguzu PIN',
              step: 1
            },
            metadata: { icon: '📱' },
            order: 1
          },
          {
            key: 'process_step_2',
            title: 'Get Credit Approved',
            content: {
              description: 'Fill in basic personal information',
              step: 2
            },
            metadata: { icon: '✅' },
            order: 2
          },
          {
            key: 'process_step_3',
            title: 'Get Money',
            content: {
              description: 'Enter phone numbers for two references',
              step: 3
            },
            metadata: { icon: '💰' },
            order: 3
          }
        ];
      
      case 'contact_info':
        return [
          {
            key: 'contact_whatsapp',
            title: 'WhatsApp',
            content: {
              type: 'whatsapp',
              value: '+260123456789',
              displayText: 'Chat with us on WhatsApp'
            },
            metadata: { icon: '💬', color: '#25D366' },
            order: 1
          },
          {
            key: 'contact_phone',
            title: 'Contact',
            content: {
              type: 'phone',
              value: '+260123456789',
              displayText: 'Call us directly'
            },
            metadata: { icon: '📞', color: '#007bff' },
            order: 2
          },
          {
            key: 'contact_email',
            title: 'Email Support',
            content: {
              type: 'email',
              value: 'customer@nguzulending.com',
              displayText: 'Send us an email'
            },
            metadata: { icon: '✉️', color: '#dc3545' },
            order: 3
          }
        ];
      
      default:
        return [];
    }
  }
}

export default ContentAPI;