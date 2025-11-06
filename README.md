# 🚀 Smoelenboek - Extremely Dynamic Portfolio

A fully dynamic, single-page application (SPA) student portfolio showcase for Gilde Opleidingen.

## ✨ Dynamic Features

### 🎯 Core Dynamic Functionality

1. **Data-Driven Architecture**
   - All profile data stored in `data.json`
   - No hardcoded content in HTML
   - Easy to add/update profiles without touching code

2. **Single-Page Application (SPA)**
   - Dynamic routing with hash-based navigation
   - No page reloads - instant transitions
   - Browser back/forward button support
   - URL persistence for sharing

3. **Dynamic Profile Rendering**
   - Profiles generated automatically from JSON data
   - Real-time updates (checks for data changes every 30 seconds)
   - Smooth animations on render

### 🔍 Interactive Features

4. **Real-Time Search**
   - Search by name, role, or bio
   - Instant filtering as you type
   - Highlights matches dynamically

5. **Theme Filtering**
   - Filter profiles by color theme
   - Dynamic dropdown with all available themes
   - Instant visual feedback

6. **Modal Profile Viewer**
   - Click any card to view full details
   - Smooth slide-in animations
   - Close with button, outside click, or ESC key
   - Full contact information and hobbies

### 🎨 Visual Dynamics

7. **Dark Mode Toggle**
   - Persistent dark mode (saves to localStorage)
   - Smooth color transitions
   - Applies to all components

8. **Advanced Animations**
   - Fade-in animations on scroll
   - Hover effects with 3D transforms
   - Animated gradients in background
   - Smooth card interactions
   - Ripple effects on buttons
   - Rotate animations on modal images

9. **Responsive Design**
   - Mobile-first approach
   - Fluid grid layouts
   - Adapts to all screen sizes

### 🎭 Dynamic Styling

10. **Theme-Based Colors**
    - Each profile has a unique theme color
    - Dynamic gradient overlays
    - Color-coded UI elements
    - Smooth theme transitions

11. **Custom Scrollbar**
    - Gradient-colored scrollbar
    - Matches application theme
    - Smooth hover effects

## 📁 File Structure

```
Smoelenboek-A-1/
├── index.html              # Clean, minimal HTML structure
├── app.js                  # Dynamic JavaScript engine (400+ lines)
├── dynamic-styles.css      # Comprehensive CSS with animations (700+ lines)
├── data.json              # Profile data source
└── README.md              # This file
```

## 🎮 How to Use

### View Profiles
1. Open `index.html` in a modern browser
2. Browse through dynamically generated profile cards
3. Use search box to find specific students
4. Filter by theme using the dropdown

### View Details
- Click any profile card
- Click "View Details" button
- Modal opens with full information
- Close with X, outside click, or ESC

### Dark Mode
- Click the moon/sun icon in the header
- Setting persists across sessions

## 🔧 Adding New Profiles

Simply edit `data.json`:

```json
{
  "id": "newstudent",
  "name": "New Student",
  "age": 18,
  "role": "Developer",
  "email": "student@email.com",
  "phone": "+31612345678",
  "image": "image-url",
  "bio": "Description",
  "hobbies": ["Hobby1", "Hobby2"],
  "theme": "blue"
}
```

No code changes needed!

## 🎨 Available Themes

- `blue` - Professional blue gradient
- `green` - Fresh green gradient
- `dark` - Elegant dark gradient
- `purple` - Creative purple gradient

## ⚡ Performance Features

- Intersection Observer for lazy animations
- Debounced search input
- Efficient DOM updates
- Auto-refresh data every 30 seconds
- Optimized CSS animations
- Hardware-accelerated transforms

## 🌟 Key Improvements Over Previous Version

### Before
- 10+ separate HTML files with duplicated code
- Hardcoded data in HTML
- Multiple CSS files scattered everywhere
- No JavaScript functionality
- Manual navigation required
- Inconsistent styling across pages

### After
- Single HTML file
- All data in JSON
- Consolidated CSS with consistent styling
- Full-featured JavaScript application
- SPA with dynamic routing
- Search, filter, and modal features
- Dark mode support
- Smooth animations throughout
- Mobile responsive
- Easy to maintain and update

## 🚀 Technical Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with CSS Variables
- **Data**: JSON
- **Architecture**: Single-Page Application (SPA)
- **Features**:
  - Dynamic rendering
  - Hash-based routing
  - LocalStorage for preferences
  - Intersection Observer API
  - Fetch API for data loading

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

Requires modern browser with ES6+ support.

## 🎯 Future Enhancements (Easily Addable)

- Backend API integration
- Database connectivity
- Admin panel for editing profiles
- Social media integration
- Contact form functionality
- Export profiles to PDF
- Multi-language support
- Advanced filtering options
- Sorting capabilities
- Profile comparison feature

## 📝 License

Educational project for Gilde Opleidingen students.

---

**Made with 💙 by Claude - Extremely Dynamic Edition**
