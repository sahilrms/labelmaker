Sure — here’s the **complete, ready-to-copy `README.md` content** in proper Markdown format 👇

---

````markdown
# Label Maker Application

A modern web application for creating and managing product labels with barcode support. Built with Next.js, React, and MongoDB.

---

## 🚀 Features

- 🏷️ Create and print product labels with barcodes  
- 📊 Track print history with timestamps  
- 🔍 Search and filter through printed labels  
- 📱 Responsive design that works on all devices  
- 🖨️ Print-ready label templates  
- 🔄 Real-time updates  

---

## 🧠 Tech Stack

- **Frontend:** Next.js 13, React 19, TailwindCSS  
- **Backend:** Next.js API Routes  
- **Database:** MongoDB with Mongoose ODM  
- **Form Handling:** React Hook Form + Zod validation  
- **UI Components:** Hero Icons, TailwindCSS  
- **Printing:** react-to-print  

---

## ⚙️ Prerequisites

- Node.js **v18.0.0** or later  
- MongoDB database (local or cloud)  
- npm or yarn package manager  

---

## 🧩 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd label-maker
````

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add your MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Now open [http://localhost:3000](http://localhost:3000) in your browser 🎉

---

## 📁 Project Structure

```
label-maker/
├── components/       # Reusable UI components
├── lib/              # Utility functions and configurations
├── models/           # Database models
├── pages/            # Application pages and API routes
│   ├── api/          # API endpoints
│   └── ...           # Page components
├── public/           # Static files
├── styles/           # Global styles
└── utils/            # Helper utilities
```

---

## 📜 Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build the app for production |
| `npm start`     | Start the production server  |
| `npm run lint`  | Run ESLint                   |

---

## 🔐 Environment Variables

| Variable               | Description                 |
| ---------------------- | --------------------------- |
| `MONGODB_URI`          | MongoDB connection string   |
| `NEXT_PUBLIC_APP_NAME` | Application name (optional) |

---

## 🧾 Data Model

### Label

| Field         | Type   | Description                       |
| ------------- | ------ | --------------------------------- |
| `productName` | String | Name of the product *(required)*  |
| `batchNumber` | String | Batch/Lot number *(required)*     |
| `packingDate` | Date   | Date of packaging *(required)*    |
| `expiryDate`  | Date   | Expiration date *(required)*      |
| `quantity`    | Number | Quantity of items *(default: 1)*  |
| `price`       | Number | Price of the product *(required)* |
| `barcode`     | String | Auto-generated barcode            |
| `printDate`   | Date   | Timestamp when label was printed  |

---

## 🌐 API Endpoints

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| `GET`  | `/api/print-history` | Get all printed labels    |
| `POST` | `/api/print-history` | Create a new label record |
| `GET`  | `/api/labels`        | Get all labels            |
| `POST` | `/api/labels`        | Create a new label        |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch

   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes

   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to the branch

   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request 🎉

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 💬 Support

For support, please open an issue in the [GitHub repository](#).

