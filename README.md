# Global Development Visualization System

## Project Overview
This project was developed as a part of the Introduction to Data Visualization and Analytics course taken in 2023. Our goal was to create an interactive visualization system using a dataset that consists of detailed information for each country. The dataset contains 35 columns providing vital information, ranging from fertility-mortality rates to the GDP of 193 countries. Our final project consists of four different visualizations: a choropleth map, a scatter plot matrix, a bubble chart, and a bar chart. These visualizations are designed to showcase important statistics and enable users to explore data in an intuitive and interactive manner.<br><br>
![image](https://github.com/user-attachments/assets/02a5405a-3b47-4a46-87e1-8c3660af68c0)

## Data Preprocessing
Before creating the visualizations, we performed data preprocessing to ensure the data was clean and structured. The preprocessing steps included:
1. Adding a new column for country regions ('Continent') using external resources.
2. Modifying country names for consistency.
3. Hashing numerical values for better data handling.
4. Updating latitude and longitude information.

These steps were crucial to enable accurate and meaningful visualizations.

## Visualizations
### Choropleth Map
The choropleth map displays a world map with color gradients from red to yellow, indicating differences in each metric across countries. Users can interact with the map by selecting a metric from a dropdown list. Tooltips provide additional information by displaying the country name and the selected metric when users hover over a country.

![image](https://github.com/user-attachments/assets/0da28afd-be71-47e8-b931-a639e0e48586)

### Brushable Scatter Plot Matrix
The scatter plot matrix shows the correlation between different metrics through their coordinates in each scatter plot. Users can:
  * Select which metrics to include in the matrices using checkboxes.
  * Choose which regions to include in the analysis.
  * Use the brushable feature to identify brushed coordinates in other plots, revealing relationships between multiple indicators simultaneously.

![image](https://github.com/user-attachments/assets/294161ec-26c0-4978-9fb9-b7c3ff3b1b50)

### Bar Chart
The bar chart includes two interactive features:
  * Sorting buttons: Users can sort the data in ascending or descending order.
  * Dropdown menus: Users can choose which region and values to display. 

For example, selecting the ‘GDP’ value and region ‘Asia’ in descending order will display China as the leftmost bar, followed by Japan, India, South Korea, and so on.This allows users to easily compare values across regions.

![image](https://github.com/user-attachments/assets/bb39b06c-8b74-48fd-9ed8-32c0ecd264ce)

### Bubble Chart
The bubble chart allows users to adjust the x and y axes using dropdown lists to visualize the relationship between two metrics. The features include:
  * Bubble colors representing different regions.
  * Bubble sizes representing the country’s population size.
  * Tooltips providing information on the country’s name, region, and axis values.

This visualization highlights population size and clusters of countries with similar values and patterns.

![image](https://github.com/user-attachments/assets/f325afa3-8c63-467c-8896-39e55457e118)

## Use Cases
Our visualization system aims to provide educational information demonstrating development patterns in each country from different aspects. Potential use cases include:
* Researchers studying international relations, economics, and sociology can compare different metrics between countries.
* Companies considering global expansion can assess potential markets by understanding various socio-economic factors.

## Conclusion
Our Global Development Visualization System provides an intuitive and interactive way to explore and analyze various socio-economic metrics across countries. The system’s diverse visualizations allow users to uncover patterns and insights that can inform research and business decisions. Through careful data preprocessing and the creation of user-friendly visualizations, this project demonstrates the power of data visualization in making complex datasets accessible and informative.
