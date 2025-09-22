import { Rule } from "../types";

export const rule: Rule = {
	id: "data-visualization",
	slug: "data-visualization",
	title: "Data Visualization & Charts",
	description:
		"Create compelling data visualizations using D3.js, Chart.js, and modern visualization libraries",
	content: `# Data Visualization

This document provides comprehensive guidelines for data visualization development and best practices.

---

## Visualization Fundamentals

1. **Data-driven**
   - Data-driven design principles
   - Implement proper data-driven design principles
   - Follow best practices for optimal results

2. **Chart**
   - Chart type selection for data
   - Implement proper chart type selection for data
   - Follow best practices for optimal results

3. **Color**
   - Color theory and accessibility
   - Implement proper color theory and accessibility
   - Follow best practices for optimal results

4. **Interactive**
   - Interactive design patterns
   - Implement proper interactive design patterns
   - Follow best practices for optimal results

5. **Responsive**
   - Responsive visualization strategies
   - Implement proper responsive visualization strategies
   - Follow best practices for optimal results

---

## D3.js Mastery

6. **Data**
   - Data binding and selections
   - Implement proper data binding and selections
   - Follow best practices for optimal results

7. **Scales**
   - Scales and axes configuration
   - Implement proper scales and axes configuration
   - Follow best practices for optimal results

8. **SVG**
   - SVG manipulation and drawing
   - Implement proper svg manipulation and drawing
   - Follow best practices for optimal results

9. **Transitions**
   - Transitions and animations
   - Implement proper transitions and animations
   - Follow best practices for optimal results

10. **Custom**
   - Custom visualization creation
   - Implement proper custom visualization creation
   - Follow best practices for optimal results

---

## Chart.js Implementation

11. **Chart**
   - Chart configuration and options
   - Implement proper chart configuration and options
   - Follow best practices for optimal results

12. **Data**
   - Data structure and formatting
   - Implement proper data structure and formatting
   - Follow best practices for optimal results

13. **Custom**
   - Custom plugins and extensions
   - Implement proper custom plugins and extensions
   - Follow best practices for optimal results

14. **Responsive**
   - Responsive design patterns
   - Implement proper responsive design patterns
   - Follow best practices for optimal results

15. **Animation**
   - Animation and interaction
   - Implement proper animation and interaction
   - Follow best practices for optimal results

---

## Modern Libraries

16. **Recharts**
   - Recharts for React applications
   - Implement proper recharts for react applications
   - Follow best practices for optimal results

17. **Vue**
   - Vue Chart.js for Vue apps
   - Implement proper vue chart.js for vue apps
   - Follow best practices for optimal results

18. **ng2-charts**
   - ng2-charts for Angular
   - Implement proper ng2-charts for angular
   - Follow best practices for optimal results

19. **Observable**
   - Observable Plot for web standards
   - Implement proper observable plot for web standards
   - Follow best practices for optimal results

20. **Plotly.js**
   - Plotly.js for scientific visualization
   - Implement proper plotly.js for scientific visualization
   - Follow best practices for optimal results

---

## Dashboard Development

21. **Layout**
   - Layout and grid systems
   - Implement proper layout and grid systems
   - Follow best practices for optimal results

22. **Multi-chart**
   - Multi-chart coordination
   - Implement proper multi-chart coordination
   - Follow best practices for optimal results

23. **Real-time**
   - Real-time data updates
   - Implement proper real-time data updates
   - Follow best practices for optimal results

24. **Filter**
   - Filter and interaction design
   - Implement proper filter and interaction design
   - Follow best practices for optimal results

25. **Performance**
   - Performance optimization
   - Implement proper performance optimization
   - Follow best practices for optimal results

---

## Data Processing

26. **Data**
   - Data cleaning and transformation
   - Implement proper data cleaning and transformation
   - Follow best practices for optimal results

27. **Aggregation**
   - Aggregation and summarization
   - Implement proper aggregation and summarization
   - Follow best practices for optimal results

28. **Time**
   - Time series data handling
   - Implement proper time series data handling
   - Follow best practices for optimal results

29. **Geographical**
   - Geographical data processing
   - Implement proper geographical data processing
   - Follow best practices for optimal results

30. **Statistical**
   - Statistical calculations
   - Implement proper statistical calculations
   - Follow best practices for optimal results

---

## Interactive Features

31. **Tooltip**
   - Tooltip and hover effects
   - Implement proper tooltip and hover effects
   - Follow best practices for optimal results

32. **Zoom**
   - Zoom and pan functionality
   - Implement proper zoom and pan functionality
   - Follow best practices for optimal results

33. **Brush**
   - Brush selection and filtering
   - Implement proper brush selection and filtering
   - Follow best practices for optimal results

34. **Crossfilter**
   - Crossfilter integration
   - Implement proper crossfilter integration
   - Follow best practices for optimal results

35. **Linked**
   - Linked view coordination
   - Implement proper linked view coordination
   - Follow best practices for optimal results

---

## Performance Optimization

36. **Large**
   - Large dataset handling
   - Implement proper large dataset handling
   - Follow best practices for optimal results

37. **Canvas**
   - Canvas vs SVG rendering
   - Implement proper canvas vs svg rendering
   - Follow best practices for optimal results

38. **Virtual**
   - Virtual scrolling for tables
   - Implement proper virtual scrolling for tables
   - Follow best practices for optimal results

39. **Data**
   - Data sampling techniques
   - Implement proper data sampling techniques
   - Follow best practices for optimal results

40. **Memory**
   - Memory management
   - Implement proper memory management
   - Follow best practices for optimal results

---

## Accessibility

41. **Screen**
   - Screen reader compatibility
   - Implement proper screen reader compatibility
   - Follow best practices for optimal results

42. **Keyboard**
   - Keyboard navigation support
   - Implement proper keyboard navigation support
   - Follow best practices for optimal results

43. **Color**
   - Color contrast compliance
   - Implement proper color contrast compliance
   - Follow best practices for optimal results

44. **Alternative**
   - Alternative text descriptions
   - Implement proper alternative text descriptions
   - Follow best practices for optimal results

45. **ARIA**
   - ARIA labels and roles
   - Implement proper aria labels and roles
   - Follow best practices for optimal results

---

## Responsive Design

46. **Mobile-first**
   - Mobile-first visualization
   - Implement proper mobile-first visualization
   - Follow best practices for optimal results

47. **Breakpoint-based**
   - Breakpoint-based layouts
   - Implement proper breakpoint-based layouts
   - Follow best practices for optimal results

48. **Touch**
   - Touch interaction patterns
   - Implement proper touch interaction patterns
   - Follow best practices for optimal results

49. **Progressive**
   - Progressive enhancement
   - Implement proper progressive enhancement
   - Follow best practices for optimal results

50. **Cross-device**
   - Cross-device compatibility
   - Implement proper cross-device compatibility
   - Follow best practices for optimal results

---

## Advanced Visualizations

51. **Network**
   - Network and graph visualizations
   - Implement proper network and graph visualizations
   - Follow best practices for optimal results

52. **Geospatial**
   - Geospatial mapping (Leaflet, Mapbox)
   - Implement proper geospatial mapping (leaflet, mapbox)
   - Follow best practices for optimal results

53. **3D**
   - 3D visualizations with Three.js
   - Implement proper 3d visualizations with three.js
   - Follow best practices for optimal results

54. **Custom**
   - Custom chart types
   - Implement proper custom chart types
   - Follow best practices for optimal results

55. **Animation**
   - Animation and storytelling
   - Implement proper animation and storytelling
   - Follow best practices for optimal results

---

## Real-time Updates

56. **WebSocket**
   - WebSocket data streaming
   - Implement proper websocket data streaming
   - Follow best practices for optimal results

57. **Server-sent**
   - Server-sent events integration
   - Implement proper server-sent events integration
   - Follow best practices for optimal results

58. **Data**
   - Data refresh strategies
   - Implement proper data refresh strategies
   - Follow best practices for optimal results

59. **Performance**
   - Performance monitoring
   - Implement proper performance monitoring
   - Follow best practices for optimal results

60. **Error**
   - Error handling and recovery
   - Implement proper error handling and recovery
   - Follow best practices for optimal results

---

## Testing Strategies

61. **Visual**
   - Visual regression testing
   - Implement proper visual regression testing
   - Follow best practices for optimal results

62. **Interaction**
   - Interaction testing
   - Implement proper interaction testing
   - Follow best practices for optimal results

63. **Performance**
   - Performance testing
   - Implement proper performance testing
   - Follow best practices for optimal results

64. **Accessibility**
   - Accessibility testing
   - Implement proper accessibility testing
   - Follow best practices for optimal results

65. **Cross-browser**
   - Cross-browser compatibility
   - Implement proper cross-browser compatibility
   - Follow best practices for optimal results

---

## Export and Sharing

66. **PNG/SVG**
   - PNG/SVG export functionality
   - Implement proper png/svg export functionality
   - Follow best practices for optimal results

67. **PDF**
   - PDF report generation
   - Implement proper pdf report generation
   - Follow best practices for optimal results

68. **Embed**
   - Embed code generation
   - Implement proper embed code generation
   - Follow best practices for optimal results

69. **Social**
   - Social media sharing
   - Implement proper social media sharing
   - Follow best practices for optimal results

70. **Print-friendly**
   - Print-friendly layouts
   - Implement proper print-friendly layouts
   - Follow best practices for optimal results

---

## Business Intelligence

71. **KPI**
   - KPI dashboard design
   - Implement proper kpi dashboard design
   - Follow best practices for optimal results

72. **Executive**
   - Executive summary views
   - Implement proper executive summary views
   - Follow best practices for optimal results

73. **Drill-down**
   - Drill-down capabilities
   - Implement proper drill-down capabilities
   - Follow best practices for optimal results

74. **Alert**
   - Alert and notification systems
   - Implement proper alert and notification systems
   - Follow best practices for optimal results

75. **Historical**
   - Historical trend analysis
   - Implement proper historical trend analysis
   - Follow best practices for optimal results

---

## Integration Patterns

76. **API**
   - API data consumption
   - Implement proper api data consumption
   - Follow best practices for optimal results

77. **Database**
   - Database connectivity
   - Implement proper database connectivity
   - Follow best practices for optimal results

78. **CSV**
   - CSV and JSON data loading
   - Implement proper csv and json data loading
   - Follow best practices for optimal results

79. **Real-time**
   - Real-time data sources
   - Implement proper real-time data sources
   - Follow best practices for optimal results

80. **Caching**
   - Caching strategies
   - Implement proper caching strategies
   - Follow best practices for optimal results

---

## Summary Checklist

- [ ] Core principles implemented
- [ ] Best practices followed
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Testing strategy implemented
- [ ] Documentation completed
- [ ] Monitoring configured
- [ ] Production deployment ready

---

Follow these comprehensive guidelines for successful data visualization implementation.`,
	categories: ["data-visualization", "charts", "d3js", "dashboard"],
	tags: ["data-visualization", "d3js", "charts", "dashboard", "interactive"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "intelligent",};
