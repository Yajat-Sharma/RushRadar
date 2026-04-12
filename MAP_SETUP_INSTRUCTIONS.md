# 🗺️ CrowdSense Real Map Integration Setup

## 📋 Overview
This guide will help you set up the real interactive map in CrowdSense using Mapbox GL JS.

## 🔑 Step 1: Get Mapbox Access Token

### Create Mapbox Account
1. Go to [mapbox.com](https://www.mapbox.com/)
2. Click "Sign up" and create a free account
3. Verify your email address

### Get Access Token
1. After login, go to [Account → Access Tokens](https://account.mapbox.com/access-tokens/)
2. Copy your **Default public token** (starts with `pk.`)
3. Or create a new token with these scopes:
   - `styles:read`
   - `fonts:read` 
   - `datasets:read`
   - `vision:read`

## 🔧 Step 2: Configure Environment Variables

### Update .env.local file
Replace the demo token in `.env.local` with your real token:

```bash
# Replace this line:
REACT_APP_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiY3Jvd2RzZW5zZS1kZW1vIiwiYSI6ImNscXh5ejF4YjBhcXEya3BjZjBxdGVxbXoifQ.demo_token_replace_with_real

# With your real token:
REACT_APP_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHF4eXoxeGIwYXFxMmtwY2YwcXRlcW16In0.your_real_token_here
```

### Optional: Customize Map Settings
You can also customize these settings in `.env.local`:

```bash
# Default location (Mumbai coordinates)
REACT_APP_DEFAULT_LATITUDE=19.0760
REACT_APP_DEFAULT_LONGITUDE=72.8777
REACT_APP_DEFAULT_ZOOM=11

# Map style (choose from: light-v11, dark-v11, streets-v12, satellite-streets-v12)
REACT_APP_MAPBOX_STYLE=mapbox://styles/mapbox/light-v11
```

## 🚀 Step 3: Start the Application

### Install Dependencies (if not already done)
```bash
npm install
```

### Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3001` with the real map integrated!

## 🗺️ Step 4: Test Map Features

### What Should Work:
✅ **Interactive Map**: Pan, zoom, rotate  
✅ **Real Transit Stations**: Mumbai local train stations with real coordinates  
✅ **Crowd Indicators**: Color-coded station markers based on crowd levels  
✅ **Station Popups**: Click stations to see detailed information  
✅ **User Location**: Blue dot showing your current location  
✅ **City Switching**: Toggle between Mumbai, Delhi, Bangalore  
✅ **Layer Controls**: Toggle heatmap and other layers  
✅ **Crowd Heatmap**: Visual overlay showing crowd density  

### Test Checklist:
- [ ] Map loads without errors
- [ ] Station markers appear on the map
- [ ] Clicking stations shows popup with details
- [ ] User location button works (may require HTTPS for geolocation)
- [ ] City selector changes map view
- [ ] Layer controls toggle heatmap visibility
- [ ] Map is responsive on mobile devices

## 🛠️ Step 5: Customization Options

### Change Default City
Edit `src/config/mapConfig.ts`:
```typescript
export const DEFAULT_CITY = 'delhi'; // or 'bangalore', 'pune', 'hyderabad'
```

### Add More Cities
Add new cities to `INDIAN_CITIES` in `src/config/mapConfig.ts`:
```typescript
kolkata: {
  name: 'Kolkata',
  center: [88.3639, 22.5726],
  zoom: 11
}
```

### Add More Stations
Add stations to `src/data/transitStations.ts`:
```typescript
{
  id: 'new_station_id',
  name: 'New Station Name',
  type: 'metro', // or 'railway', 'bus', 'auto'
  coordinates: [longitude, latitude],
  crowdLevel: 65,
  city: 'mumbai',
  // ... other properties
}
```

### Customize Map Style
Choose from Mapbox's built-in styles or create custom ones:
- `mapbox://styles/mapbox/light-v11` (Default)
- `mapbox://styles/mapbox/dark-v11`
- `mapbox://styles/mapbox/streets-v12`
- `mapbox://styles/mapbox/satellite-streets-v12`

## 🔍 Troubleshooting

### Map Not Loading
**Problem**: Blank map or "Map Configuration Required" message  
**Solution**: 
1. Check if `REACT_APP_MAPBOX_ACCESS_TOKEN` is set correctly
2. Ensure token starts with `pk.`
3. Verify token has correct permissions
4. Restart development server after changing `.env.local`

### Stations Not Appearing
**Problem**: Map loads but no station markers visible  
**Solution**:
1. Check browser console for JavaScript errors
2. Verify station coordinates are valid [longitude, latitude]
3. Ensure selected city has stations in `transitStations.ts`

### Geolocation Not Working
**Problem**: User location button doesn't work  
**Solution**:
1. Use HTTPS (geolocation requires secure context)
2. Allow location permissions in browser
3. Test on `localhost` (usually works) or deploy to HTTPS

### Performance Issues
**Problem**: Map is slow or laggy  
**Solution**:
1. Reduce number of stations for testing
2. Disable heatmap temporarily
3. Use lighter map style (light-v11 instead of satellite)

## 📱 Mobile Testing

### Test on Mobile Devices
1. **Chrome DevTools**: Use device emulation
2. **Real Device**: Connect to same network, access via IP
3. **Touch Interactions**: Ensure tap, pinch, pan work correctly

### Mobile-Specific Features
- Touch-friendly marker sizes (minimum 44px touch target)
- Responsive popup sizing
- Optimized for portrait orientation
- Smooth animations on mobile

## 🔮 Future Enhancements

### Ready for Integration:
- **Real-time Data**: Replace mock data with live APIs
- **Route Polylines**: Add actual transit route paths
- **Live Vehicle Tracking**: Show moving buses/trains
- **Search Integration**: Add place search functionality
- **Offline Support**: Cache map tiles for offline use

### Backend Integration Points:
- `src/data/transitStations.ts` - Replace with API calls
- `src/config/mapConfig.ts` - Add dynamic city configuration
- Real-time crowd updates via WebSocket
- User location tracking and analytics

## 📞 Support

### Common Resources:
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [React Map GL Documentation](https://visgl.github.io/react-map-gl/)
- [Mapbox Studio](https://studio.mapbox.com/) - Create custom map styles

### Need Help?
1. Check browser console for errors
2. Verify all environment variables are set
3. Test with a fresh Mapbox token
4. Ensure all dependencies are installed correctly

---

🎉 **Congratulations!** You now have a production-ready interactive map integrated into CrowdSense with real Indian transit data!