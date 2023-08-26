# Mobile Seller BD Monorepo Overview

[Mobile Seller BD](https://mobile-seller-bd-client.vercel.app) is a Full Stack web application that provides the latest news, reviews, and information about mobile phones, tablets, and related products. This monorepo contains both the frontend and backend components of the application.

Live link : [https://mobile-seller-bd-client.vercel.app](https://mobile-seller-bd-client.vercel.app)

## Frontend Technologies

- TypeScript
- NextJS
- Tailwind CSS
- Redux
- **Other Libraries:** `Date-fns`, `swiper`, `next-auth`, `shadCN`, `react-icons`, `react-hot-toast`, and more.

## Backend Technologies

- TypeScript
- NestJS
- Express.js
- Firebase Admin
- MongoDB
- **Other Libraries:** `Passport`, `axios`, `bcrypt`, `mongoose`, `JWT`, `multer`, `class-transformer`, `class-validator`, `helmet`, and more.

## Frontend features

- **API Integration:** Seamlessly integrated with REST APIs to provide up-to-date information to users.
- **Role-based Admin Dashboard:** Protected with authentication, featuring different access levels for administrators and editors.
- **Product Management:** Administrators can perform various actions such as adding, deleting, and updating products. Editors have the ability to edit products.
- **Public View and Admin Dashboard:** a user-friendly interface for the public to browse mobile products, as well as a dedicated admin dashboard for managing content
- **Responsive Design:** Fully responsive design ensures optimal user experience across both mobile and desktop devices.
- **SEO and Best Practices:** Implemented with a focus on search engine optimization (SEO) and adhering to industry best practices for optimal performance and user engagement.

## Backend Features

- **User Authentication and Authorization:** Implemented using JWT tokens and Passport strategies to ensure secure user access.
- **API Endpoints for Management:** Provides a set of well-defined API endpoints for managing mobile phone products, user accounts, and related data.
- **Efficient Data Storage with MongoDB:** Integrated with Mongoose for seamless data storage and retrieval
- **Firebase Admin Integration:** Utilizes Firebase services for enhanced functionality and cloud storage.
- **File Upload Capability:** Supports file uploads for various purposes, enhancing the user experience.
- **Protected API Access:** Ensures the protection of sensitive data by restricting public access to designated API routes.
- **Data Validation and Transformation:** Utilizes class-validator and class-transformer to validate and transform data, maintaining data integrity.
- **Enhanced Security with Helmet Middleware:** Implements Helmet middleware to bolster security by adding necessary HTTP headers.
