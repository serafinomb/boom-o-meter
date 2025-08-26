# Flash Distance Calculator

A professional flash photography calculator designed for both digital and analog photographers. Calculate optimal flash power, aperture, and distance combinations with ease.

## 🚀 Features

### 📸 Photography Modes
- **Digital Mode**: Quick ISO adjustment on main screen
- **Analog Mode**: Set film ISO once in settings

### ⚡ Smart Calculations
- Distance-first workflow - set your target distance and get optimal settings
- Multiple viable power/aperture combinations
- Real-time calculations using Guide Number formula
- Quick Power Reference table with color-coded power levels

### 🎛️ Customizable Settings
- Configurable Guide Number for any flash
- Custom aperture and ISO ranges
- Adjustable distance range (0.3m to 20m)
- Priority weights (power efficiency vs depth of field vs accuracy)
- Battery saving mode

### 📱 Progressive Web App (PWA)
- **Offline-first**: Works without internet connection
- **Installable**: Add to home screen like a native app
- **Fast**: Cached for instant loading
- **Mobile-optimized**: Touch-friendly sliders and controls

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/flash-distance-calculator.git
cd flash-distance-calculator

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### GitHub Pages Deployment

1. **Fork this repository**

2. **Update `vite.config.js`**:
   ```javascript
   export default defineConfig({
     base: '/your-repository-name/', // Change this to your repo name
     // ... rest of config
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"

4. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

5. **Access your app**:
   - Your app will be available at: `https://yourusername.github.io/your-repository-name/`

## 📋 Usage

### Quick Start
1. Set your flash's Guide Number in settings
2. Choose your photography mode (Digital/Analog)
3. Set target distance with the slider
4. Select from suggested aperture/power combinations
5. Use the Quick Power Reference for at-a-glance power levels

### Settings Configuration
- **Guide Number**: Enter your flash's GN (usually 30-60 for speedlights)
- **Photography Mode**: 
  - Digital: ISO controls on main screen
  - Analog: Fixed ISO setting in preferences
- **Available Apertures**: Select which f-stops you use
- **Distance Range**: Set your typical shooting distances
- **Priority Weights**: Adjust recommendations (efficiency/DOF/accuracy)

## 🧮 Flash Calculation Formula

The app uses the standard flash photography formula:
```
Distance = (Guide Number × √(ISO/100) × √(Power)) / Aperture
```

## 🎨 Features in Detail

### Distance-First Workflow
Unlike traditional flash calculators that require you to input power and aperture first, this app lets you:
1. Set your desired shooting distance
2. See all viable power/aperture combinations
3. Choose based on your priorities (battery life, depth of field, etc.)

### Smart Recommendations
- **Optimal**: Best overall recommendation
- **Perfect**: Low power + deep depth of field
- **Efficient**: Battery-saving power levels
- **Max DOF**: Highest f-numbers available
- **Deep DOF**: Good depth of field options

### Quick Power Reference
Dynamic table showing:
- Your configured apertures (rows)
- Your distance range (columns)
- Color-coded power level bars
- Real-time calculations based on current ISO and GN

## 🔧 Technical Details

### Built With
- **React 18** - UI framework
- **Vite** - Build tool
- **Vite PWA Plugin** - Service worker and manifest
- **Tailwind CSS** - Styling (CDN)
- **Lucide React** - Icons

### PWA Features
- **Service Worker**: Caches app for offline use
- **Web App Manifest**: Installable with app icons
- **Local Storage**: Persistent settings
- **Responsive Design**: Works on all screen sizes

### Browser Support
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Offline Capabilities
- Full functionality without internet
- Settings persist between sessions
- Calculations work entirely client-side
- Service worker caches all assets

## 📱 Mobile Features

### Touch-Optimized
- Large touch targets for sliders
- Mobile-friendly button sizes
- Swipe gestures supported
- No accidental zoom on inputs

### PWA Installation
1. **Chrome/Edge**: "Install" button in address bar
2. **Safari**: Share → Add to Home Screen
3. **Android**: "Add to Home Screen" prompt

### Offline Usage
- Install once, works forever offline
- No data usage after initial install
- Perfect for location shoots without internet

## 🎯 Photography Use Cases

### Portrait Photography
- Set distance (1-3m)
- Choose f/2.8-f/5.6 for shallow DOF
- Get optimal power levels for soft lighting

### Event Photography
- Configure 2-6m distance range
- Use f/4-f/8 for group shots
- Battery saving mode for long events

### Studio Work
- Wide aperture range (f/2.8-f/16)
- Multiple flash units (different GN values)
- Precision distance calculations

### Film Photography
- Set film ISO once per roll
- Clean interface without digital clutter
- Focus on aperture and power decisions

## 🔄 Version History

### v1.0.0
- Initial release
- Distance-first calculator
- Digital/Analog photography modes
- PWA with offline support
- Quick Power Reference table
- Customizable settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Flash photography community for feedback and testing
- Open source contributors
- PWA community for best practices

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/flash-distance-calculator/issues)
- **Feature Requests**: Create an issue with the "enhancement" label
- **Documentation**: See this README and inline help

---

## 🚀 Quick Deploy Checklist

### Before Deployment:
- [ ] Update repository name in `vite.config.js`
- [ ] Update URLs in `index.html` meta tags
- [ ] Test build locally: `npm run build && npm run preview`
- [ ] Check PWA features work in production build

### GitHub Pages Setup:
- [ ] Enable GitHub Pages with "GitHub Actions" source
- [ ] Push to main branch
- [ ] Wait for Actions workflow to complete
- [ ] Test deployed app on mobile device
- [ ] Verify PWA installation works

### Post-Deployment:
- [ ] Test offline functionality
- [ ] Verify settings persistence
- [ ] Check on different devices/browsers
- [ ] Update README with actual deployment URL

**Your app will be live at**: `https://yourusername.github.io/flash-distance-calculator/`

---

*Built with ❤️ for photographers who love the perfect exposure*
