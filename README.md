# 🎰 Vending Machine DFA Simulator

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://vending-machine-dfa-simulator.vercel.app/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC)](https://tailwindcss.com/)

An interactive web application demonstrating a **Deterministic Finite Automaton (DFA)** through a vending machine simulation with beautiful animations.

## 🌐 Live Demo

**[View Live Demo →](https://vending-machine-dfa-simulator.vercel.app/)**

## ✨ Features

- 🎮 **Interactive DFA Simulation** - Real-time state machine visualization
- 💰 **Coin System** - Accept ₱5, ₱10, and ₱25 coins
- 🥤 **Drink Dispensing** - Animated drink dispensing with physics
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- 📊 **State Tracking** - Visual representation of DFA states (₱0 → ₱5 → ₱10 → ₱15 → ₱20 → ₱25)
- 🔄 **Refund System** - Return coins and reset state
- 📱 **Responsive Design** - Works on desktop and mobile

## 🎯 DFA Concept

This project demonstrates a **Deterministic Finite Automaton** where:

- **States**: 6 states representing credit amount (₱0, ₱5, ₱10, ₱15, ₱20, ₱25)
- **Input Alphabet**: Coins (₱5, ₱10, ₱25), Drinks (COKE, SPRITE, WATER), Refund
- **Transitions**: Coins advance states, ≥₱25 allows drink selection
- **Accept State**: ₱25 or more enables drink dispensing

## 🚀 Getting Started

### Prerequisites

- Node.js 20.15+ or 22.12+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/vending-machine-dfa-simulator.git

# Navigate to project directory
cd vending-machine-dfa-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 🏗️ Built With

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript** - DFA logic implementation

## 📁 Project Structure

```
vending-machine-dfa-simulator/
├── src/
│   ├── App.jsx          # Main component with DFA logic
│   ├── App.css          # Component styles
│   ├── index.css        # Global styles & animations
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
└── package.json         # Dependencies
```

## 🎮 How to Use

1. **Insert Coins** - Click ₱5, ₱10, or ₱25 coin buttons
2. **Watch State Progress** - See the state machine advance
3. **Select Drink** - Once you have ≥₱25, click a drink button
4. **Enjoy Animation** - Watch the drink dispense
5. **Refund** - Click refund button to return coins

## 🛠️ Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Your Name**

- GitHub: [@rhondeldi](https://github.com/rhondeldi)

---

Made with ❤️ using React, Vite, and Tailwind CSS
