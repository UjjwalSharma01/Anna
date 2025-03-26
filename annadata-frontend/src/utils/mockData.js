/**
 * This file provides mock data for the application when the backend is unavailable
 * Useful in development environments like GitHub Codespaces
 */
import { defaultSchemeImage, schemeTypeImages } from './defaultImages';

// Mock home page data
export const mockHomeData = {
  hero: {
    title: 'Welcome to Annadata',
    subtitle: 'Your one-stop platform for agricultural resources and community',
    description: 'Access agricultural schemes, connect with farmers, and get the resources you need'
  },
  // Add crop disease detection feature
  cropDiseaseDetection: {
    title: 'AI Crop Disease Detection',
    description: 'Our advanced AI can identify plant diseases from photos to help you take timely action',
    features: [
      'Instant disease identification from plant images',
      'Detailed disease information and treatment recommendations',
      'Works with major crop varieties including rice, wheat, cotton, and vegetables',
      'No internet connection needed for basic detection'
    ],
    commonDiseases: [
      { name: 'Leaf Blight', crops: ['Rice', 'Wheat', 'Maize'] },
      { name: 'Powdery Mildew', crops: ['Grapes', 'Wheat', 'Cucumbers'] },
      { name: 'Leaf Rust', crops: ['Wheat', 'Coffee', 'Beans'] },
      { name: 'Bacterial Spot', crops: ['Tomatoes', 'Peppers'] }
    ],
    actionButton: 'Scan Your Crop Now'
  },
  featuredSchemes: [
    {
      _id: 'scheme1',
      title: 'PM Kisan Samman Nidhi',
      description: 'Direct income support of Rs 6000 per year to farmers with landholding up to 2 hectares',
      category: 'Financial Support',
      imageUrl: schemeTypeImages['Financial Support'] || defaultSchemeImage
    },
    {
      _id: 'scheme2',
      title: 'Soil Health Card Scheme',
      description: 'Evaluation of soil fertility and recommending crops and fertilizers for improved yield',
      category: 'Agricultural Input',
      imageUrl: schemeTypeImages['Agricultural Input'] || defaultSchemeImage
    },
    {
      _id: 'scheme3',
      title: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Crop insurance scheme to protect farmers against crop failure',
      category: 'Insurance',
      imageUrl: schemeTypeImages['Insurance'] || defaultSchemeImage
    }
  ],
  latestQuestions: [
    {
      _id: 'q1',
      title: 'What are the best practices for organic farming?',
      content: 'I want to transition to organic farming. What are the best practices and challenges I should be aware of?',
      author: { username: 'farmer123', avatar: '' },
      createdAt: new Date().toISOString(),
      upvotes: 12,
      answers: []
    },
    {
      _id: 'q2',
      title: 'How to control pests without chemicals?',
      content: 'I am looking for natural ways to control pests in my vegetable garden without using chemicals.',
      author: { username: 'organicGrower', avatar: '' },
      createdAt: new Date().toISOString(),
      upvotes: 8,
      answers: []
    }
  ]
};

// Mock schemes data
export const mockSchemes = {
  schemes: [
    {
      _id: 'scheme1',
      title: 'PM Kisan Samman Nidhi',
      description: 'Direct income support of Rs 6000 per year to farmers with landholding up to 2 hectares',
      category: 'Financial Support',
      imageUrl: schemeTypeImages['Financial Support'] || defaultSchemeImage,
      eligibility: 'All farmers with land holdings up to 2 hectares',
      benefits: '₹6000 per year in three equal installments',
      featured: true
    },
    {
      _id: 'scheme2',
      title: 'Soil Health Card Scheme',
      description: 'Evaluation of soil fertility and recommending crops and fertilizers for improved yield',
      category: 'Agricultural Input',
      imageUrl: schemeTypeImages['Agricultural Input'] || defaultSchemeImage,
      eligibility: 'All farmers',
      benefits: 'Improved soil health and crop yield',
      featured: true
    },
    {
      _id: 'scheme3',
      title: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Crop insurance scheme to protect farmers against crop failure',
      category: 'Insurance',
      imageUrl: schemeTypeImages['Insurance'] || defaultSchemeImage,
      eligibility: 'All farmers growing notified crops',
      benefits: 'Insurance coverage for crop loss',
      featured: true
    },
    {
      _id: 'scheme4',
      title: 'Kisan Credit Card',
      description: 'Credit facility for farmers to meet their agricultural needs',
      category: 'Financial Support',
      imageUrl: schemeTypeImages['Financial Support'] || defaultSchemeImage,
      eligibility: 'All farmers and agricultural laborers',
      benefits: 'Easy access to credit for agricultural needs',
      featured: false
    }
  ]
};

// Mock forum data
export const mockForumData = {
  questions: [
    {
      _id: 'q1',
      title: 'What are the best practices for organic farming?',
      content: 'I want to transition to organic farming. What are the best practices and challenges I should be aware of?',
      author: { username: 'farmer123', avatar: '' },
      createdAt: new Date().toISOString(),
      upvotes: 12,
      answers: [],
      tags: ['organic', 'farming', 'best-practices']
    },
    {
      _id: 'q2',
      title: 'How to control pests without chemicals?',
      content: 'I am looking for natural ways to control pests in my vegetable garden without using chemicals.',
      author: { username: 'organicGrower', avatar: '' },
      createdAt: new Date().toISOString(),
      upvotes: 8,
      answers: [],
      tags: ['pests', 'organic', 'vegetables']
    }
  ],
  totalPages: 1,
  page: 1
};

export default {
  homeData: mockHomeData,
  schemes: mockSchemes,
  forum: mockForumData
};
