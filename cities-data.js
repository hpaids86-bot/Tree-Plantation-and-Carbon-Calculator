// Comprehensive Indian Cities Data
// 50 Indian cities with coordinates, climate zones, and pollution data

const INDIAN_CITIES = {
    // Major Metropolitan Cities
    'Delhi': {
        lat: 28.6139, lng: 77.2090,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 25, rainfall: 700, humidity: 50,
        aqi: 342, pm25: 250, pm10: 400
    },
    'Mumbai': {
        lat: 19.0760, lng: 72.8777,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 27, rainfall: 2400, humidity: 75,
        aqi: 180, pm25: 90, pm10: 150
    },
    'Bangalore': {
        lat: 12.9716, lng: 77.5946,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 24, rainfall: 970, humidity: 65,
        aqi: 95, pm25: 45, pm10: 80
    },
    'Chennai': {
        lat: 13.0827, lng: 80.2707,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 28, rainfall: 1200, humidity: 70,
        aqi: 120, pm25: 60, pm10: 100
    },
    'Hyderabad': {
        lat: 17.3850, lng: 78.4867,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 26, rainfall: 800, humidity: 60,
        aqi: 110, pm25: 55, pm10: 95
    },
    'Kolkata': {
        lat: 22.5726, lng: 88.3639,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 27, rainfall: 1800, humidity: 80,
        aqi: 135, pm25: 68, pm10: 115
    },
    'Pune': {
        lat: 18.5204, lng: 73.8567,
        zone: 'Subtropical', subzone: 'Tropical Savanna',
        avgTemp: 24, rainfall: 700, humidity: 60,
        aqi: 85, pm25: 40, pm10: 70
    },
    'Ahmedabad': {
        lat: 23.0225, lng: 72.5714,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 27, rainfall: 800, humidity: 55,
        aqi: 155, pm25: 75, pm10: 130
    },
    'Jaipur': {
        lat: 26.9124, lng: 75.7873,
        zone: 'Subtropical', subzone: 'Hot Semi-Arid',
        avgTemp: 26, rainfall: 650, humidity: 45,
        aqi: 140, pm25: 70, pm10: 120
    },
    'Surat': {
        lat: 21.1702, lng: 72.8311,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 28, rainfall: 1200, humidity: 70,
        aqi: 105, pm25: 50, pm10: 88
    },
    'Lucknow': {
        lat: 26.8467, lng: 80.9462,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 26, rainfall: 1000, humidity: 65,
        aqi: 125, pm25: 62, pm10: 105
    },
    'Kanpur': {
        lat: 26.4499, lng: 80.3319,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 26, rainfall: 900, humidity: 60,
        aqi: 165, pm25: 80, pm10: 140
    },
    'Nagpur': {
        lat: 21.1458, lng: 79.0882,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 27, rainfall: 1200, humidity: 60,
        aqi: 115, pm25: 58, pm10: 98
    },
    'Indore': {
        lat: 22.7196, lng: 75.8577,
        zone: 'Subtropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 25, rainfall: 950, humidity: 55,
        aqi: 100, pm25: 48, pm10: 85
    },
    'Thane': {
        lat: 19.2183, lng: 72.9781,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 27, rainfall: 2400, humidity: 75,
        aqi: 130, pm25: 65, pm10: 110
    },
    'Bhopal': {
        lat: 23.2599, lng: 77.4126,
        zone: 'Subtropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 25, rainfall: 1100, humidity: 58,
        aqi: 145, pm25: 72, pm10: 125
    },
    'Visakhapatnam': {
        lat: 17.6868, lng: 83.2185,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 28, rainfall: 1100, humidity: 75,
        aqi: 90, pm25: 42, pm10: 75
    },
    'Patna': {
        lat: 25.5941, lng: 85.1376,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 26, rainfall: 1100, humidity: 68,
        aqi: 150, pm25: 73, pm10: 128
    },
    'Vadodara': {
        lat: 22.3072, lng: 73.1812,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 27, rainfall: 900, humidity: 62,
        aqi: 108, pm25: 52, pm10: 92
    },
    'Ghaziabad': {
        lat: 28.6692, lng: 77.4538,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 25, rainfall: 700, humidity: 50,
        aqi: 285, pm25: 210, pm10: 350
    },
    'Ludhiana': {
        lat: 30.9010, lng: 75.8573,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 24, rainfall: 650, humidity: 48,
        aqi: 160, pm25: 78, pm10: 135
    },
    'Agra': {
        lat: 27.1767, lng: 78.0081,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 26, rainfall: 700, humidity: 52,
        aqi: 170, pm25: 82, pm10: 145
    },
    'Nashik': {
        lat: 19.9975, lng: 73.7898,
        zone: 'Subtropical', subzone: 'Tropical Savanna',
        avgTemp: 24, rainfall: 900, humidity: 58,
        aqi: 88, pm25: 41, pm10: 72
    },
    'Faridabad': {
        lat: 28.4089, lng: 77.3178,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 25, rainfall: 700, humidity: 50,
        aqi: 275, pm25: 205, pm10: 340
    },
    'Meerut': {
        lat: 28.9845, lng: 77.7064,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 25, rainfall: 750, humidity: 51,
        aqi: 190, pm25: 92, pm10: 160
    },
    'Rajkot': {
        lat: 22.3039, lng: 70.8022,
        zone: 'Arid', subzone: 'Semi-Arid',
        avgTemp: 27, rainfall: 600, humidity: 50,
        aqi: 135, pm25: 67, pm10: 115
    },
    'Varanasi': {
        lat: 25.3176, lng: 82.9739,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 26, rainfall: 1000, humidity: 65,
        aqi: 175, pm25: 85, pm10: 150
    },
    'Srinagar': {
        lat: 34.0837, lng: 74.7973,
        zone: 'Temperate', subzone: 'Subtropical Highland',
        avgTemp: 13, rainfall: 660, humidity: 60,
        aqi: 82, pm25: 38, pm10: 68
    },
    'Amritsar': {
        lat: 31.6340, lng: 74.8723,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 23, rainfall: 600, humidity: 50,
        aqi: 148, pm25: 71, pm10: 126
    },
    'Aurangabad': {
        lat: 19.8762, lng: 75.3433,
        zone: 'Subtropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 26, rainfall: 750, humidity: 55,
        aqi: 118, pm25: 59, pm10: 100
    },
    'Solapur': {
        lat: 17.6599, lng: 75.9064,
        zone: 'Subtropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 27, rainfall: 700, humidity: 56,
        aqi: 112, pm25: 56, pm10: 95
    },
    'Jabalpur': {
        lat: 23.1815, lng: 79.9864,
        zone: 'Subtropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 25, rainfall: 1300, humidity: 58,
        aqi: 125, pm25: 62, pm10: 105
    },
    'Gwalior': {
        lat: 26.2183, lng: 78.1828,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 26, rainfall: 900, humidity: 53,
        aqi: 152, pm25: 74, pm10: 130
    },
    'Coimbatore': {
        lat: 11.0168, lng: 76.9558,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 25, rainfall: 650, humidity: 62,
        aqi: 78, pm25: 36, pm10: 65
    },
    'Madurai': {
        lat: 9.9252, lng: 78.1198,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 850, humidity: 68,
        aqi: 85, pm25: 40, pm10: 70
    },
    'Vijayawada': {
        lat: 16.5062, lng: 80.6480,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 950, humidity: 72,
        aqi: 95, pm25: 45, pm10: 80
    },
    'Jamshedpur': {
        lat: 22.8046, lng: 86.2029,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 26, rainfall: 1300, humidity: 70,
        aqi: 138, pm25: 69, pm10: 118
    },
    'Raipur': {
        lat: 21.2514, lng: 81.6296,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 27, rainfall: 1200, humidity: 65,
        aqi: 132, pm25: 66, pm10: 112
    },
    'Chandigarh': {
        lat: 30.7333, lng: 76.7794,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 24, rainfall: 1100, humidity: 58,
        aqi: 102, pm25: 49, pm10: 86
    },
    'Guwahati': {
        lat: 26.1445, lng: 91.7362,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 24, rainfall: 1800, humidity: 78,
        aqi: 88, pm25: 41, pm10: 72
    },
    'Kochi': {
        lat: 9.9312, lng: 76.2673,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 27, rainfall: 3000, humidity: 82,
        aqi: 72, pm25: 33, pm10: 60
    },
    'Bhubaneswar': {
        lat: 20.2961, lng: 85.8245,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 27, rainfall: 1500, humidity: 75,
        aqi: 98, pm25: 47, pm10: 82
    },
    'Dehradun': {
        lat: 30.3165, lng: 78.0322,
        zone: 'Temperate', subzone: 'Subtropical Highland',
        avgTemp: 18, rainfall: 2100, humidity: 70,
        aqi: 92, pm25: 43, pm10: 76
    },
    'Mysore': {
        lat: 12.2958, lng: 76.6394,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 25, rainfall: 785, humidity: 64,
        aqi: 68, pm25: 31, pm10: 58
    },
    'Goa': {
        lat: 15.2993, lng: 74.1240,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 27, rainfall: 3000, humidity: 85,
        aqi: 65, pm25: 30, pm10: 55
    },
    'Shimla': {
        lat: 31.1048, lng: 77.1734,
        zone: 'Temperate', subzone: 'Subtropical Highland',
        avgTemp: 17, rainfall: 1600, humidity: 70,
        aqi: 58, pm25: 26, pm10: 48
    },
    'Ooty': {
        lat: 11.4102, lng: 76.6950,
        zone: 'Temperate', subzone: 'Oceanic',
        avgTemp: 14, rainfall: 1200, humidity: 75,
        aqi: 45, pm25: 20, pm10: 38
    },

    // Tamil Nadu Cities
    'Tiruchirappalli': {
        lat: 10.7905, lng: 78.7047,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 850, humidity: 70,
        aqi: 88, pm25: 41, pm10: 72
    },
    'Salem': {
        lat: 11.6643, lng: 78.1460,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 27, rainfall: 900, humidity: 66,
        aqi: 82, pm25: 38, pm10: 68
    },
    'Tirunelveli': {
        lat: 8.7139, lng: 77.7567,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 30, rainfall: 700, humidity: 65,
        aqi: 75, pm25: 35, pm10: 62
    },
    'Erode': {
        lat: 11.3410, lng: 77.7172,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 28, rainfall: 750, humidity: 64,
        aqi: 80, pm25: 37, pm10: 66
    },
    'Vellore': {
        lat: 12.9166, lng: 79.1333,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 28, rainfall: 950, humidity: 68,
        aqi: 78, pm25: 36, pm10: 64
    },
    'Dindigul': {
        lat: 10.3629, lng: 77.9750,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 28, rainfall: 800, humidity: 65,
        aqi: 72, pm25: 33, pm10: 60
    },
    'Thanjavur': {
        lat: 10.7869, lng: 79.1378,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 1000, humidity: 72,
        aqi: 70, pm25: 32, pm10: 58
    },
    'Thoothukudi': {
        lat: 8.7642, lng: 78.1348,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 30, rainfall: 650, humidity: 70,
        aqi: 68, pm25: 31, pm10: 56
    },
    'Nagercoil': {
        lat: 8.1774, lng: 77.4344,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 28, rainfall: 1400, humidity: 78,
        aqi: 62, pm25: 28, pm10: 52
    },
    'Tiruppur': {
        lat: 11.1085, lng: 77.3411,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 27, rainfall: 700, humidity: 63,
        aqi: 85, pm25: 40, pm10: 70
    },
    'Hosur': {
        lat: 12.7403, lng: 77.8253,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 26, rainfall: 850, humidity: 64,
        aqi: 88, pm25: 41, pm10: 73
    },
    'Kanchipuram': {
        lat: 12.8342, lng: 79.7036,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 1100, humidity: 71,
        aqi: 82, pm25: 38, pm10: 68
    },
    'Sivakasi': {
        lat: 9.4492, lng: 77.7974,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 29, rainfall: 750, humidity: 66,
        aqi: 90, pm25: 42, pm10: 75
    },
    'Karur': {
        lat: 10.9574, lng: 78.0769,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 29, rainfall: 800, humidity: 67,
        aqi: 78, pm25: 36, pm10: 64
    },
    'Neyveli': {
        lat: 11.5183, lng: 79.4880,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 28, rainfall: 1200, humidity: 70,
        aqi: 95, pm25: 45, pm10: 80
    },
    'Cuddalore': {
        lat: 11.7447, lng: 79.7680,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 1300, humidity: 75,
        aqi: 72, pm25: 33, pm10: 60
    },
    'Ranipet': {
        lat: 12.9279, lng: 79.3300,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 28, rainfall: 1000, humidity: 69,
        aqi: 80, pm25: 37, pm10: 66
    },
    'Virudhunagar': {
        lat: 9.5900, lng: 77.9600,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 29, rainfall: 700, humidity: 65,
        aqi: 75, pm25: 35, pm10: 62
    },
    'Pollachi': {
        lat: 10.6589, lng: 77.0083,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 26, rainfall: 900, humidity: 68,
        aqi: 68, pm25: 31, pm10: 58
    },
    'Karaikudi': {
        lat: 10.0667, lng: 78.7833,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 850, humidity: 70,
        aqi: 70, pm25: 32, pm10: 58
    },
    'Pudukkottai': {
        lat: 10.3800, lng: 78.8200,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 900, humidity: 71,
        aqi: 65, pm25: 30, pm10: 55
    },
    'Namakkal': {
        lat: 11.2212, lng: 78.1659,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 28, rainfall: 800, humidity: 66,
        aqi: 72, pm25: 33, pm10: 60
    },
    'Krishnagiri': {
        lat: 12.5191, lng: 78.2138,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 27, rainfall: 850, humidity: 65,
        aqi: 78, pm25: 36, pm10: 64
    },
    'Theni': {
        lat: 10.0104, lng: 77.4768,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 27, rainfall: 750, humidity: 64,
        aqi: 68, pm25: 31, pm10: 58
    },
    'Dharmapuri': {
        lat: 12.1270, lng: 78.1579,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 28, rainfall: 800, humidity: 66,
        aqi: 70, pm25: 32, pm10: 58
    },
    'Tiruvannamalai': {
        lat: 12.2265, lng: 79.0745,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 29, rainfall: 950, humidity: 70,
        aqi: 75, pm25: 35, pm10: 62
    },
    'Ranchi': {
        lat: 23.3441, lng: 85.3096,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 24, rainfall: 1400, humidity: 70,
        aqi: 145, pm25: 70, pm10: 120
    },
    'Gurugram': {
        lat: 28.4595, lng: 77.0266,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 26, rainfall: 650, humidity: 48,
        aqi: 285, pm25: 210, pm10: 340
    },
    'Noida': {
        lat: 28.5355, lng: 77.3910,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 26, rainfall: 800, humidity: 55,
        aqi: 275, pm25: 205, pm10: 330
    },
    'Udaipur': {
        lat: 24.5854, lng: 73.7125,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 27, rainfall: 640, humidity: 50,
        aqi: 150, pm25: 72, pm10: 125
    },
    'Patiala': {
        lat: 30.3398, lng: 76.3869,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 25, rainfall: 680, humidity: 52,
        aqi: 168, pm25: 82, pm10: 138
    },
    'Durgapur': {
        lat: 23.5204, lng: 87.3119,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 27, rainfall: 1300, humidity: 72,
        aqi: 165, pm25: 78, pm10: 135
    },
    'Siliguri': {
        lat: 26.7271, lng: 88.3953,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 23, rainfall: 3200, humidity: 80,
        aqi: 118, pm25: 58, pm10: 102
    },
    'Rourkela': {
        lat: 22.2604, lng: 84.8536,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 27, rainfall: 1500, humidity: 70,
        aqi: 155, pm25: 72, pm10: 128
    },
    'Belgaum': {
        lat: 15.8497, lng: 74.4977,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 24, rainfall: 1200, humidity: 68,
        aqi: 90, pm25: 42, pm10: 75
    },
    'Hubli': {
        lat: 15.3647, lng: 75.1239,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 26, rainfall: 730, humidity: 60,
        aqi: 105, pm25: 50, pm10: 88
    },
    'Mangalore': {
        lat: 12.9141, lng: 74.8560,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 28, rainfall: 3800, humidity: 82,
        aqi: 78, pm25: 34, pm10: 62
    },
    'Warangal': {
        lat: 17.9689, lng: 79.5941,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 28, rainfall: 1000, humidity: 62,
        aqi: 142, pm25: 68, pm10: 120
    },
    'Nanded': {
        lat: 19.1383, lng: 77.3210,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 28, rainfall: 950, humidity: 60,
        aqi: 138, pm25: 66, pm10: 112
    },
    'Kolhapur': {
        lat: 16.7050, lng: 74.2433,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 25, rainfall: 1900, humidity: 78,
        aqi: 92, pm25: 43, pm10: 78
    },
    'Rajahmundry': {
        lat: 17.0005, lng: 81.8040,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 1100, humidity: 74,
        aqi: 130, pm25: 62, pm10: 108
    },
    'Guntur': {
        lat: 16.3067, lng: 80.4365,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 900, humidity: 68,
        aqi: 125, pm25: 60, pm10: 104
    },
    'Deoghar': {
        lat: 24.4867, lng: 86.6940,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 26, rainfall: 1200, humidity: 65,
        aqi: 150, pm25: 74, pm10: 128
    },
    // Kerala Cities
    'Thiruvananthapuram': {
        lat: 8.5241, lng: 76.9366,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 27, rainfall: 1700, humidity: 78,
        aqi: 45, pm25: 20, pm10: 40
    },
    'Kozhikode': {
        lat: 11.2588, lng: 75.7804,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 28, rainfall: 3000, humidity: 80,
        aqi: 50, pm25: 22, pm10: 45
    },
    'Thrissur': {
        lat: 10.5276, lng: 76.2144,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 28, rainfall: 3000, humidity: 78,
        aqi: 48, pm25: 21, pm10: 42
    },
    'Kollam': {
        lat: 8.8932, lng: 76.6141,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 27, rainfall: 2500, humidity: 79,
        aqi: 42, pm25: 18, pm10: 38
    },
    'Alappuzha': {
        lat: 9.4981, lng: 76.3388,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 27, rainfall: 2800, humidity: 82,
        aqi: 40, pm25: 15, pm10: 35
    },
    'Palakkad': {
        lat: 10.7867, lng: 76.6548,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 2000, humidity: 70,
        aqi: 55, pm25: 25, pm10: 50
    },
    'Malappuram': {
        lat: 11.0510, lng: 76.0711,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 28, rainfall: 2800, humidity: 78,
        aqi: 45, pm25: 20, pm10: 40
    },
    'Kannur': {
        lat: 11.8745, lng: 75.3704,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 28, rainfall: 3400, humidity: 80,
        aqi: 46, pm25: 21, pm10: 41
    },
    'Kottayam': {
        lat: 9.5916, lng: 76.5222,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 27, rainfall: 2900, humidity: 80,
        aqi: 44, pm25: 19, pm10: 39
    },
    'Puducherry': {
        lat: 11.9416, lng: 79.8083,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 1300, humidity: 78,
        aqi: 88, pm25: 40, pm10: 72
    },
    'Davanagere': {
        lat: 14.4644, lng: 75.9218,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 26, rainfall: 650, humidity: 55,
        aqi: 92, pm25: 43, pm10: 76
    },
    'Bellary': {
        lat: 15.1394, lng: 76.9214,
        zone: 'Arid', subzone: 'Hot Semi-Arid',
        avgTemp: 28, rainfall: 500, humidity: 45,
        aqi: 105, pm25: 50, pm10: 88
    },
    'Kalaburagi': {
        lat: 17.3297, lng: 76.8343,
        zone: 'Arid', subzone: 'Hot Semi-Arid',
        avgTemp: 28, rainfall: 700, humidity: 48,
        aqi: 112, pm25: 54, pm10: 95
    },
    'Nellore': {
        lat: 14.4426, lng: 79.9865,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 29, rainfall: 1080, humidity: 72,
        aqi: 85, pm25: 39, pm10: 70
    },
    'Tirupati': {
        lat: 13.6288, lng: 79.4192,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 27, rainfall: 950, humidity: 68,
        aqi: 90, pm25: 42, pm10: 75
    },
    'Kurnool': {
        lat: 15.8281, lng: 78.0373,
        zone: 'Arid', subzone: 'Hot Semi-Arid',
        avgTemp: 28, rainfall: 670, humidity: 50,
        aqi: 102, pm25: 48, pm10: 85
    },
    'Kasaragod': {
        lat: 12.5103, lng: 74.9852,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 27, rainfall: 3200, humidity: 82,
        aqi: 45, pm25: 20, pm10: 38
    },
    'Wayanad': {
        lat: 11.6854, lng: 76.1320,
        zone: 'Temperate', subzone: 'Subtropical Highland',
        avgTemp: 20, rainfall: 2800, humidity: 80,
        aqi: 38, pm25: 16, pm10: 30
    },
    'Idukki': {
        lat: 9.8500, lng: 76.9667,
        zone: 'Temperate', subzone: 'Subtropical Highland',
        avgTemp: 19, rainfall: 3000, humidity: 84,
        aqi: 35, pm25: 15, pm10: 28
    },
    'Ariyalur': {
        lat: 11.1401, lng: 79.0786,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 29, rainfall: 950, humidity: 68,
        aqi: 80, pm25: 36, pm10: 66
    },
    'Ramanathapuram': {
        lat: 9.3639, lng: 78.8394,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 30, rainfall: 820, humidity: 74,
        aqi: 72, pm25: 32, pm10: 58
    },
    'Kodaikanal': {
        lat: 10.2381, lng: 77.4892,
        zone: 'Temperate', subzone: 'Oceanic',
        avgTemp: 15, rainfall: 1650, humidity: 76,
        aqi: 32, pm25: 14, pm10: 25
    },
    'Amravati': {
        lat: 20.9374, lng: 77.7796,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 27, rainfall: 850, humidity: 55,
        aqi: 110, pm25: 52, pm10: 94
    },
    'Jalgaon': {
        lat: 21.0077, lng: 75.5626,
        zone: 'Arid', subzone: 'Hot Semi-Arid',
        avgTemp: 27, rainfall: 750, humidity: 50,
        aqi: 120, pm25: 58, pm10: 102
    },
    'Satara': {
        lat: 17.6805, lng: 73.9918,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 24, rainfall: 1000, humidity: 62,
        aqi: 82, pm25: 38, pm10: 68
    },
    'Sangli': {
        lat: 16.8524, lng: 74.5815,
        zone: 'Tropical', subzone: 'Tropical Savanna',
        avgTemp: 26, rainfall: 650, humidity: 58,
        aqi: 88, pm25: 41, pm10: 72
    },
    'Bilaspur': {
        lat: 22.0796, lng: 82.1391,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 26, rainfall: 1250, humidity: 64,
        aqi: 130, pm25: 64, pm10: 110
    },
    'Ujjain': {
        lat: 23.1760, lng: 75.7885,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 25, rainfall: 900, humidity: 58,
        aqi: 115, pm25: 55, pm10: 98
    },
    'Jhansi': {
        lat: 25.4484, lng: 78.5685,
        zone: 'Subtropical', subzone: 'Hot Semi-Arid',
        avgTemp: 26, rainfall: 850, humidity: 52,
        aqi: 140, pm25: 68, pm10: 118
    },
    'Gorakhpur': {
        lat: 26.7606, lng: 83.3731,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 25, rainfall: 1200, humidity: 68,
        aqi: 148, pm25: 72, pm10: 124
    },
    'Prayagraj': {
        lat: 25.4358, lng: 81.8463,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 26, rainfall: 950, humidity: 60,
        aqi: 155, pm25: 76, pm10: 130
    },
    'Aligarh': {
        lat: 27.8974, lng: 78.0880,
        zone: 'Subtropical', subzone: 'Hot Semi-Arid',
        avgTemp: 25, rainfall: 750, humidity: 50,
        aqi: 168, pm25: 82, pm10: 142
    },
    'Bareilly': {
        lat: 28.3670, lng: 79.4304,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 25, rainfall: 1050, humidity: 65,
        aqi: 150, pm25: 73, pm10: 126
    },
    'Gaya': {
        lat: 24.7955, lng: 85.0075,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 26, rainfall: 1050, humidity: 62,
        aqi: 152, pm25: 74, pm10: 128
    },
    'Muzaffarpur': {
        lat: 26.1209, lng: 85.3647,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 25, rainfall: 1150, humidity: 66,
        aqi: 146, pm25: 71, pm10: 122
    },
    'Dhanbad': {
        lat: 23.7957, lng: 86.4304,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 26, rainfall: 1300, humidity: 70,
        aqi: 162, pm25: 80, pm10: 138
    },
    'Bokaro': {
        lat: 23.6693, lng: 86.1511,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 26, rainfall: 1250, humidity: 68,
        aqi: 145, pm25: 70, pm10: 120
    },
    'Asansol': {
        lat: 23.6740, lng: 86.9525,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 26, rainfall: 1350, humidity: 72,
        aqi: 150, pm25: 72, pm10: 125
    },
    'Darjeeling': {
        lat: 27.0410, lng: 88.2627,
        zone: 'Temperate', subzone: 'Subtropical Highland',
        avgTemp: 12, rainfall: 3000, humidity: 82,
        aqi: 52, pm25: 24, pm10: 42
    },
    'Cuttack': {
        lat: 20.4625, lng: 85.8830,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 27, rainfall: 1450, humidity: 75,
        aqi: 95, pm25: 45, pm10: 80
    },
    'Puri': {
        lat: 19.8135, lng: 85.8312,
        zone: 'Tropical', subzone: 'Tropical Wet and Dry',
        avgTemp: 28, rainfall: 1400, humidity: 78,
        aqi: 78, pm25: 35, pm10: 64
    },
    'Gandhinagar': {
        lat: 23.2156, lng: 72.6369,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 27, rainfall: 800, humidity: 52,
        aqi: 115, pm25: 54, pm10: 96
    },
    'Jamnagar': {
        lat: 22.4707, lng: 70.0577,
        zone: 'Arid', subzone: 'Hot Semi-Arid',
        avgTemp: 27, rainfall: 550, humidity: 60,
        aqi: 108, pm25: 50, pm10: 90
    },
    'Jodhpur': {
        lat: 26.2389, lng: 73.0243,
        zone: 'Arid', subzone: 'Hot Desert',
        avgTemp: 28, rainfall: 350, humidity: 38,
        aqi: 135, pm25: 64, pm10: 114
    },
    'Kota': {
        lat: 25.1800, lng: 75.8300,
        zone: 'Subtropical', subzone: 'Semi-Arid',
        avgTemp: 27, rainfall: 750, humidity: 48,
        aqi: 128, pm25: 60, pm10: 108
    },
    'Jammu': {
        lat: 32.7266, lng: 74.8570,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 23, rainfall: 1100, humidity: 62,
        aqi: 112, pm25: 52, pm10: 95
    },
    'Dharamshala': {
        lat: 32.2190, lng: 76.3234,
        zone: 'Temperate', subzone: 'Subtropical Highland',
        avgTemp: 18, rainfall: 2900, humidity: 66,
        aqi: 58, pm25: 26, pm10: 48
    },
    'Haridwar': {
        lat: 29.9457, lng: 78.1642,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 23, rainfall: 1200, humidity: 64,
        aqi: 105, pm25: 48, pm10: 88
    },
    'Panaji': {
        lat: 15.4909, lng: 73.8278,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 27, rainfall: 2900, humidity: 82,
        aqi: 62, pm25: 28, pm10: 50
    },
    'Shillong': {
        lat: 25.5788, lng: 91.8933,
        zone: 'Temperate', subzone: 'Subtropical Highland',
        avgTemp: 17, rainfall: 2400, humidity: 76,
        aqi: 45, pm25: 20, pm10: 36
    },
    'Imphal': {
        lat: 24.8170, lng: 93.9368,
        zone: 'Subtropical', subzone: 'Humid Subtropical',
        avgTemp: 21, rainfall: 1400, humidity: 74,
        aqi: 72, pm25: 32, pm10: 58
    },
    'Port Blair': {
        lat: 11.6234, lng: 92.7265,
        zone: 'Tropical', subzone: 'Tropical Monsoon',
        avgTemp: 28, rainfall: 3100, humidity: 80,
        aqi: 38, pm25: 16, pm10: 30
    }
};

// Helper function to get all city names
function getAllCityNames() {
    return Object.keys(INDIAN_CITIES).sort();
}

// Helper function to get city coordinates
function getCityCoordinates(cityName) {
    const city = INDIAN_CITIES[cityName];
    if (!city) return null;
    return { lat: city.lat, lng: city.lng, country: 'IN' };
}

// Helper function to get city coordinates array [lat, lng]
function getCityCoordinatesArray(cityName) {
    const city = INDIAN_CITIES[cityName];
    if (!city) return [20.5937, 78.9629]; // Default to India center
    return [city.lat, city.lng];
}

// Helper function to get city climate data
function getCityClimate(cityName) {
    const city = INDIAN_CITIES[cityName];
    if (!city) return {
        zone: 'Tropical',
        subzone: 'Tropical',
        avgTemp: 25,
        rainfall: 1000,
        humidity: 60
    };
    return {
        zone: city.zone,
        subzone: city.subzone,
        avgTemp: city.avgTemp,
        rainfall: city.rainfall,
        humidity: city.humidity
    };
}

