# Smart Beach Web App

This project is an initial version of a web-based application that will aim to improve how people interact with beach and water safety. This web application will provide a detailed 7-day forecast of the weather and beach conditions from March to October. With the integration of a lifeguard-type warning system, the app can provide real-time information on beach conditions, enabling users to make informed decisions about their safety. 

## Group Members
- Shanaya Bonagua
- Jihan Duerme
- Sarah Fisher
- Karen Karger
- Alex Taylor
- Jason Williams

## Project Goals

- Promote beach safety and prevent drownings through a user-friendly, real-time web platform accessible to desktop and mobile browsers.
- Help beachgoers make informed decisions with clear and dynamic warnings about potential dangers and swimming conditions.
- Make technical data easily understandable to ensure accessibility for all types of users.
- Create a scalable website architecture, laying the foundation for future expansion with additional features and functionality as the project evolves.

## Required Functionalities

The web application is designed to offer a seamless user experience on various devices, ensuring responsiveness for optimal accessibility. Its primary functionality revolves around providing complete weather information for a 7-day forecast at Station Beach in Kincardine, Ontario. The site will also include information about how the data was collected and the team involved.  

## Technology Stack

As the web application is relatively small and user driven, we feel that React is a perfect library to use for the development of this application. When working locally, React provides a built-in development server, saving the need for any additional packages for testing purposes. As the team uses a combination of Windows and Mac operating systems, React allows us to build a web application that is flexible, scalable, and easy to maintain. If the web application is to be used as a base for a potential mobile application, many of the components created in React provide a solid foundation for future developers to use across Android and iOS devices. 
 
By default, React does not allow for page routing. The React-Router-Dom package will allow us to define routes to different pages and handle how we navigate through them. Furthermore, the Axios package is a fast way for us to make API calls from the collected buoy data into the React application. Next, the ECWeatherJS package lets us access weather API data provided from Environment Canada to display additional data metrics such as humidity and cloud cover, not provided by the buoy data model. Their inclusion will allow users to make better informed decisions in visiting the beach. Finally, using the Bootstrap package provides us with prebuilt components such as navigation, buttons, and cards, which allow for an appealing and responsive web application.    To deploy the alpha and beta versions of the web application, we have decided to use Render as a web host. Render provides many benefits with hosting this application, such as managing network TLS certificates, the option for a custom domain name, and deploying directly from GitHub, all while being free. 

## Group GitHub File

https://github.com/MonsieurJAWs/SmartBeach-WebApp