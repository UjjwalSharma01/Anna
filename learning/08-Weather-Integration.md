# Weather API Integration

## Overview

Weather information is critical for farmers, affecting planting decisions, harvesting times, and daily operations. The Annadata platform integrates weather data to provide farmers with:

1. **Current Weather Conditions**: Temperature, humidity, wind speed, etc.
2. **Weather Forecasts**: Short and medium-term weather predictions
3. **Agricultural Weather Advice**: Crop-specific recommendations based on weather conditions

## Implementation Strategy

### External API Selection

We chose the OpenWeatherMap API for our weather data because:

1. **Comprehensive Data**: Provides current conditions, forecasts, and historical data
2. **Global Coverage**: Works for farmers in various regions
3. **Reasonable Pricing**: Free tier with adequate request limits for our initial needs
4. **Well-Documented API**: Clear documentation and reliable endpoints
5. **Weather Parameters**: Provides agricultural-relevant data like soil temperature and humidity

### API Integration

The weather integration is implemented in the `weatherController.js` file:

```javascript
const getWeatherForecast = asyncHandler(async (req, res) => {
  const { lat, lon, location } = req.query;
  
  // Input validation
  if ((!lat || !lon) && !location) {
    res.status(400);
    throw new Error('Either coordinates or location name is required');
  }
  
  try {
    let apiUrl;
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (lat && lon) {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    }
    
    const response = await axios.get(apiUrl);
    
    // Format the response for our clients
    const forecast = response.data.list.map(item => ({
      time: item.dt_txt,
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      humidity: item.main.humidity,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      wind: item.wind.speed
    }));
    
    res.json({
      city: response.data.city.name,
      country: response.data.city.country,
      forecast: forecast
    });
  } catch (error) {
    // Handle API errors
    console.error('Weather API Error:', error);
    res.status(error.response?.status || 500);
    throw new Error('Error fetching weather data');
  }
});
```

### Agricultural Weather Advice

We also provide agricultural advice based on weather conditions:

```javascript
const getWeatherAdvice = asyncHandler(async (req, res) => {
  const { lat, lon, cropType } = req.query;
  
  // Fetch weather data from external API
  // ...
  
  // Generate crop-specific advice based on weather conditions
  let advice = [];
  
  if (currentTemp > 35) {
    advice.push("High temperature alert: Consider additional irrigation.");
  }
  
  if (humidity > 80) {
    advice.push("High humidity: Monitor crops for fungal diseases.");
  }
  
  // Add crop-specific advice
  if (cropType) {
    switch (cropType.toLowerCase()) {
      case 'rice':
        advice.push("Rice crops need consistent standing water during this phase.");
        break;
      case 'wheat':
        advice.push("Maintain soil moisture for wheat but avoid waterlogging.");
        break;
      // ...other crops
    }
  }
  
  res.json({
    location: {
      lat,
      lon,
      name: weather.timezone
    },
    currentConditions: {
      // Weather data
    },
    agriculturalAdvice: advice
  });
});
```

## API Key Management

Weather API keys are stored in environment variables:

```
WEATHER_API_KEY=your_openweathermap_api_key
```

This approach:
1. Keeps sensitive keys out of source control
2. Allows different keys for development and production
3. Makes key rotation easier

## Route Structure

Weather endpoints are defined in `weatherRoutes.js`:

```javascript
// All routes require authentication
router.use(protect);

// @route   GET /api/weather
router.get('/', getWeatherForecast);

// @route   GET /api/weather/advice
router.get('/advice', getWeatherAdvice);
```

These routes are protected, ensuring only authenticated users can access weather data.

## Error Handling

Weather API integrations include specific error handling:

1. **API Connection Errors**: When the external API is unreachable
2. **Invalid Parameters**: When required parameters are missing
3. **Rate Limiting**: Handling API rate limit errors
4. **Invalid Location**: When a requested location doesn't exist

## Caching Strategy

To minimize API calls and improve performance, we could implement caching:

```javascript
// Example caching strategy (not currently implemented)
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const getWeatherWithCache = async (location) => {
  const cacheKey = `weather_${location}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData && cachedData.timestamp > Date.now() - CACHE_TTL) {
    return cachedData.data;
  }
  
  // Fetch fresh data from API
  const freshData = await fetchWeatherFromAPI(location);
  
  // Store in cache
  cache.set(cacheKey, {
    timestamp: Date.now(),
    data: freshData
  });
  
  return freshData;
};
```

## Alternatives Considered

### Multiple Weather API Providers

- **Pros**: Redundancy, ability to compare data, more data points
- **Cons**: More complex integration, higher costs
- **Why Not Chosen**: Single provider was sufficient for our initial needs

### Building Our Own Weather Database

- **Pros**: Complete control, no API dependencies
- **Cons**: Extremely resource-intensive, not our core competency
- **Why Not Chosen**: Leveraging experts in weather data made more sense

### Client-Side Weather API Calls

- **Pros**: Reduced backend load, potentially fresher data
- **Cons**: Exposed API keys, inconsistent experiences
- **Why Not Chosen**: Server-side integration provides better security and consistency

## Future Enhancements

1. **Weather Alerts**: Implementing notification system for severe weather
2. **Historical Data Analysis**: Providing seasonal patterns and trends
3. **Machine Learning Integration**: More sophisticated crop recommendations
4. **Localized Forecasts**: Hyper-local weather data for specific fields
5. **Weather Maps**: Visual representation of weather patterns

## Best Practices

1. **Error Handling**: Robust error handling for API failures
2. **Response Formatting**: Transforming API responses to meet our application's needs
3. **Parameter Validation**: Validating input parameters before making API calls
4. **Secure Key Management**: Using environment variables for API keys
5. **Caching Consideration**: Implementing caching to reduce API calls
6. **Rate Limit Awareness**: Being mindful of API rate limits
7. **Fallback Mechanisms**: Having fallback options when the primary API fails
