const asyncHandler = require('../utils/asyncHandler');
const axios = require('axios');

// @desc    Get weather forecast for a location
// @route   GET /api/weather
// @access  Private
const getWeatherForecast = asyncHandler(async (req, res) => {
  const { lat, lon, location } = req.query;
  
  if ((!lat || !lon) && !location) {
    res.status(400);
    throw new Error('Either coordinates (lat, lon) or location name is required');
  }
  
  try {
    let apiUrl;
    const apiKey = process.env.WEATHER_API_KEY || 'your_default_api_key';
    
    if (lat && lon) {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    }
    
    const response = await axios.get(apiUrl);
    
    // Format the response to include only necessary information
    const forecast = response.data.list.map(item => ({
      time: item.dt_txt,
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      humidity: item.main.humidity,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      wind: item.wind.speed
    }));
    
    const formattedResponse = {
      city: response.data.city.name,
      country: response.data.city.country,
      forecast: forecast
    };
    
    res.json(formattedResponse);
  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500);
    throw new Error(error.response?.data?.message || 'Error fetching weather data');
  }
});

// @desc    Get agricultural weather advice for a location
// @route   GET /api/weather/advice
// @access  Private
const getWeatherAdvice = asyncHandler(async (req, res) => {
  const { lat, lon, cropType } = req.query;
  
  if (!lat || !lon) {
    res.status(400);
    throw new Error('Coordinates (lat, lon) are required');
  }
  
  try {
    const apiKey = process.env.WEATHER_API_KEY || 'your_default_api_key';
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    const response = await axios.get(apiUrl);
    
    // Here we would normally use the weather data to generate crop-specific advice
    // For now we'll return mock advice based on conditions
    
    const weather = response.data;
    const currentTemp = weather.current.temp;
    const humidity = weather.current.humidity;
    const windSpeed = weather.current.wind_speed;
    const rainForecast = weather.daily.slice(0, 3).some(day => 
      day.weather.some(w => w.main === 'Rain')
    );
    
    // Generate advice based on conditions
    let advice = [];
    
    if (currentTemp > 35) {
      advice.push("High temperature alert: Consider additional irrigation to prevent crop stress.");
    } else if (currentTemp < 10) {
      advice.push("Low temperature alert: Protect sensitive crops from potential frost damage.");
    }
    
    if (humidity > 80) {
      advice.push("High humidity: Monitor crops for fungal diseases.");
    } else if (humidity < 30) {
      advice.push("Low humidity: Increase irrigation to prevent water stress.");
    }
    
    if (windSpeed > 20) {
      advice.push("Strong winds: Secure any temporary structures and young plants.");
    }
    
    if (rainForecast) {
      advice.push("Rain expected in the next 3 days: Plan field operations accordingly.");
    } else {
      advice.push("No significant rain expected: Ensure adequate irrigation.");
    }
    
    // Add crop-specific advice if cropType is provided
    if (cropType) {
      switch (cropType.toLowerCase()) {
        case 'rice':
          advice.push("Rice crops need consistent standing water during this phase.");
          break;
        case 'wheat':
          advice.push("Maintain soil moisture for wheat but avoid waterlogging.");
          break;
        case 'cotton':
          advice.push("Cotton is sensitive to excessive moisture, ensure good drainage.");
          break;
        default:
          advice.push("Monitor soil moisture levels regularly for optimal growth.");
      }
    }
    
    res.json({
      location: {
        lat,
        lon,
        name: weather.timezone
      },
      currentConditions: {
        temperature: currentTemp,
        humidity,
        windSpeed,
        description: weather.current.weather[0].description
      },
      agriculturalAdvice: advice
    });
    
  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500);
    throw new Error(error.response?.data?.message || 'Error fetching weather advice');
  }
});

module.exports = {
  getWeatherForecast,
  getWeatherAdvice
};
