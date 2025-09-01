import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ConfigAPI {
  // Get all app configurations
  async getAllConfigs() {
    try {
      const response = await axios.get(`${API_URL}/config`);
      return response.data;
    } catch (error) {
      console.error('Error fetching app configs:', error);
      throw error;
    }
  }

  // Get specific configuration by key
  async getConfig(key) {
    try {
      const response = await axios.get(`${API_URL}/config/${key}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching config ${key}:`, error);
      throw error;
    }
  }

  // Cache for configurations to avoid repeated API calls
  static configCache = {};
  static cacheExpiry = 5 * 60 * 1000; // 5 minutes
  static lastFetch = 0;

  // Get cached configurations or fetch from API
  async getCachedConfigs() {
    const now = Date.now();
    
    // Return cached data if it's still valid
    if (ConfigAPI.configCache.data && (now - ConfigAPI.lastFetch) < ConfigAPI.cacheExpiry) {
      return ConfigAPI.configCache;
    }

    try {
      const response = await this.getAllConfigs();
      ConfigAPI.configCache = response;
      ConfigAPI.lastFetch = now;
      return response;
    } catch (error) {
      // Return cached data if API fails and we have some
      if (ConfigAPI.configCache.data) {
        console.warn('Using cached config data due to API error');
        return ConfigAPI.configCache;
      }
      throw error;
    }
  }

  // Clear cache (useful for admin updates)
  clearCache() {
    ConfigAPI.configCache = {};
    ConfigAPI.lastFetch = 0;
  }

  // Get default fallback values in case API fails
  getDefaultConfig() {
    return {
      success: true,
      data: {
        terms_and_conditions: {
          content: `**Key Terms:**\n• Loan amounts: GHS 100 - GHS 5,000\n• Repayment terms: 7, 14, or 30 days\n• Interest rates vary by loan term\n• All fees are clearly disclosed before approval\n\n**Fee Structure:**\n• Interest Fee: Calculated based on loan term\n• Service Fee: 2% of loan amount\n• Admin Fee: GHS 5 flat fee\n• Commitment Fee: 1% of loan amount\n\n**Important Notes:**\n• Late payments may incur additional charges\n• Early repayment is allowed without penalty\n• All transactions are secured and encrypted\n• Customer support available 24/7\n• By accepting, you agree to our full terms and conditions`
        },
        loan_terms_available: [7, 14, 30],
        max_loan_amount: 5000,
        min_loan_amount: 100,
        interest_rates: {
          7: 0.05,
          14: 0.08,
          30: 0.12
        },
        fee_structure: {
          service_fee_rate: 0.02,
          admin_fee_flat: 5,
          commitment_fee_rate: 0.01
        },
        credit_score_range: {
          min: 300,
          max: 850,
          default: 650
        },
        default_credit_limit: 2000
      }
    };
  }
}

export default new ConfigAPI();