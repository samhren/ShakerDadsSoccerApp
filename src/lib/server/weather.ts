// Simple weather service using Open-Meteo API
// No API key required - free for non-commercial use

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const SHAKER_HEIGHTS_LAT = 41.4739;
const SHAKER_HEIGHTS_LON = -81.5371;

export interface WeatherData {
	temperature: number;
	description: string;
	humidity: number;
	windSpeed: number;
	icon: string;
}

// Convert weather code to description and icon
function getWeatherDescription(code: number): { description: string; icon: string } {
	const weatherCodes: { [key: number]: { description: string; icon: string } } = {
		0: { description: 'clear sky', icon: '01d' },
		1: { description: 'mainly clear', icon: '01d' },
		2: { description: 'partly cloudy', icon: '02d' },
		3: { description: 'overcast', icon: '03d' },
		45: { description: 'foggy', icon: '50d' },
		48: { description: 'depositing rime fog', icon: '50d' },
		51: { description: 'light drizzle', icon: '09d' },
		53: { description: 'moderate drizzle', icon: '09d' },
		55: { description: 'dense drizzle', icon: '09d' },
		61: { description: 'slight rain', icon: '10d' },
		63: { description: 'moderate rain', icon: '10d' },
		65: { description: 'heavy rain', icon: '10d' },
		71: { description: 'slight snow', icon: '13d' },
		73: { description: 'moderate snow', icon: '13d' },
		75: { description: 'heavy snow', icon: '13d' },
		80: { description: 'slight rain showers', icon: '09d' },
		81: { description: 'moderate rain showers', icon: '09d' },
		82: { description: 'violent rain showers', icon: '09d' },
		95: { description: 'thunderstorm', icon: '11d' },
		96: { description: 'thunderstorm with slight hail', icon: '11d' },
		99: { description: 'thunderstorm with heavy hail', icon: '11d' }
	};

	return weatherCodes[code] || { description: 'unknown', icon: '01d' };
}

// Find the most common weather code from an array of hourly codes
function getMostCommonWeatherCode(codes: number[]): number {
	const frequency: { [key: number]: number } = {};
	
	for (const code of codes) {
		frequency[code] = (frequency[code] || 0) + 1;
	}
	
	let mostCommon = codes[0];
	let maxCount = 0;
	
	for (const [code, count] of Object.entries(frequency)) {
		if (count > maxCount) {
			maxCount = count;
			mostCommon = parseInt(code);
		}
	}
	
	return mostCommon;
}

export async function getWeatherForGame(location: string, date: Date): Promise<WeatherData | null> {
	// Only show weather for games within the next 7 days (Open-Meteo free tier)
	const today = new Date();
	const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

	if (diffDays < 0 || diffDays > 7) {
		return null;
	}

	try {
		// Format date for API (YYYY-MM-DD)
		const dateStr = date.toISOString().split('T')[0];

		const response = await fetch(
			`${WEATHER_API_URL}?latitude=${SHAKER_HEIGHTS_LAT}&longitude=${SHAKER_HEIGHTS_LON}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York&start_date=${dateStr}&end_date=${dateStr}`
		);

		if (!response.ok) {
			return null;
		}

		const data = await response.json();

		if (!data.hourly || !data.hourly.weather_code || !data.daily) {
			return null;
		}

		// Get daily temperature data
		const maxTemp = data.daily.temperature_2m_max[0];
		const minTemp = data.daily.temperature_2m_min[0];
		const avgTemp = Math.round((maxTemp + minTemp) / 2);

		// Get hourly weather codes and find the most common one
		const hourlyWeatherCodes = data.hourly.weather_code;
		const mostCommonCode = getMostCommonWeatherCode(hourlyWeatherCodes);

		// Calculate average humidity and wind speed for the day
		const hourlyHumidity = data.hourly.relative_humidity_2m;
		const hourlyWindSpeed = data.hourly.wind_speed_10m;
		
		const avgHumidity = Math.round(hourlyHumidity.reduce((a: number, b: number) => a + b, 0) / hourlyHumidity.length);
		const avgWindSpeed = Math.round(hourlyWindSpeed.reduce((a: number, b: number) => a + b, 0) / hourlyWindSpeed.length);

		const weatherInfo = getWeatherDescription(mostCommonCode);

		return {
			temperature: avgTemp,
			description: weatherInfo.description,
			humidity: avgHumidity,
			windSpeed: avgWindSpeed,
			icon: weatherInfo.icon
		};
	} catch (error) {
		console.error('Weather API error:', error);
		return null;
	}
}

// Mock weather data for development when no API key is available
export function getMockWeatherData(): WeatherData {
	const conditions = [
		{ temp: 72, desc: 'sunny', icon: '01d' },
		{ temp: 68, desc: 'partly cloudy', icon: '02d' },
		{ temp: 65, desc: 'cloudy', icon: '03d' },
		{ temp: 58, desc: 'light rain', icon: '10d' }
	];

	const condition = conditions[Math.floor(Math.random() * conditions.length)];

	return {
		temperature: condition.temp,
		description: condition.desc,
		humidity: 60 + Math.floor(Math.random() * 30),
		windSpeed: 5 + Math.floor(Math.random() * 10),
		icon: condition.icon
	};
}
