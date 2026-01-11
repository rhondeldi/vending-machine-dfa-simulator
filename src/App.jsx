import { useState } from "react";

class VendingMachineDFA {
  constructor() {
    this.currentState = 0;

    this.coinValues = { N: 5, D: 10, Q: 20 };

    this.stock = {
      COKE: 5,
      SPRITE: 3,
      WATER: 5,
    };

    this.prices = {
      COKE: 25,
      SPRITE: 25,
      WATER: 25,
    };
  }

  transition(input) {
    input = input.toUpperCase();

    if (input === "R") {
      const refund = this.currentState;
      this.currentState = 0;
      return { state: 0, msg: `Refunded ₱${refund}`, action: "refund" };
    }

    if (this.stock[input] !== undefined) {
      if (this.currentState >= 25) {
        if (this.stock[input] > 0) {
          this.stock[input]--;
          const change = this.currentState - 25;
          this.currentState = change;
          return {
            state: change,
            msg:
              change > 0
                ? `Dispensing ${input} - Credit ₱${change}`
                : `Dispensing ${input}`,
            action: "dispense",
          };
        }
        return { state: this.currentState, msg: "SOLD OUT", action: "error" };
      }
      // Insufficient funds - soft reject (DFA Pattern #3)
      return {
        state: this.currentState,
        msg: `Need ₱${25 - this.currentState} more`,
        action: "insufficient",
      };
    }

    if (this.coinValues[input]) {
      // Reject coins if machine is at max capacity (₱50)
      if (this.currentState >= 50) {
        return {
          state: this.currentState,
          msg: "COIN REJECTED - MAX CREDIT",
          action: "reject",
        };
      }

      // Check if adding coin would exceed max capacity
      const newState = this.currentState + this.coinValues[input];
      if (newState > 50) {
        return {
          state: this.currentState,
          msg: `COIN REJECTED - EXCEEDS ₱50`,
          action: "reject",
        };
      }

      this.currentState = newState;
      return {
        state: this.currentState,
        msg: `Credit ₱${this.currentState}`,
        action: "none",
      };
    }

    return {
      state: this.currentState,
      msg: "Invalid Input",
      action: "invalid",
    };
  }
}

export default function App() {
  const [dfa] = useState(() => new VendingMachineDFA());
  const [screen, setScreen] = useState("INSERT COIN");
  const [state, setState] = useState(0);
  const [, rerender] = useState(0);
  const [coinAnimation, setCoinAnimation] = useState(false);
  const [dispensing, setDispensing] = useState(null);
  const [flashScreen, setFlashScreen] = useState(false);
  const [rejectedCoin, setRejectedCoin] = useState(false);
  const [insufficientFunds, setInsufficientFunds] = useState(false);

  const press = (input) => {
    const res = dfa.transition(input);
    setScreen(res.msg);
    setState(res.state);
    rerender((x) => x + 1);

    // Coin insertion animation
    if (res.action === "none" && dfa.coinValues[input.toUpperCase()]) {
      setCoinAnimation(true);
      setFlashScreen(true);
      setTimeout(() => setCoinAnimation(false), 500);
      setTimeout(() => setFlashScreen(false), 200);
    }

    // Coin rejection animation
    if (res.action === "reject") {
      setRejectedCoin(true);
      setFlashScreen(true);
      setTimeout(() => setRejectedCoin(false), 800);
      setTimeout(() => setFlashScreen(false), 300);
    }

    // Dispense animation
    if (res.action === "dispense") {
      setDispensing(input);
      setTimeout(() => {
        setDispensing(null);
        setScreen("INSERT COIN");
      }, 2000);
    }

    // Insufficient funds flash (DFA Pattern #3)
    if (res.action === "insufficient") {
      setInsufficientFunds(true);
      setFlashScreen(true);
      setTimeout(() => setInsufficientFunds(false), 1000);
      setTimeout(() => setFlashScreen(false), 300);
    }

    // Error flash
    if (res.action === "error") {
      setFlashScreen(true);
      setTimeout(() => setFlashScreen(false), 300);
    }

    // Invalid input flash (DFA Pattern #1)
    if (res.action === "invalid") {
      setFlashScreen(true);
      setTimeout(() => setFlashScreen(false), 400);
    }
  };

  const drinks = {
    COKE: {
      color: "bg-gradient-to-br from-red-600 to-red-800",
      glow: "shadow-red-500/50",
    },
    SPRITE: {
      color: "bg-gradient-to-br from-green-500 to-green-700",
      glow: "shadow-green-500/50",
    },
    WATER: {
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      glow: "shadow-blue-500/50",
    },
  };

  const states = [0, 5, 10, 15, 20, 25];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-6"
      style={{ perspective: "2000px" }}
    >
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VENDING MACHINE */}
        <div
          className="lg:col-span-2 bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border border-slate-600 relative"
          style={{
            transform: "rotateY(-5deg) rotateX(2deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* PRODUCTS */}
          <div
            className="md:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-inner relative"
            style={{ transform: "translateZ(20px)" }}
          >
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-2">
              <span className="text-3xl">🥤</span> DRINKS
            </h2>

            <div className="grid grid-cols-3 gap-4 relative">
              {Object.keys(drinks).map((item) => {
                const isDispensing = dispensing === item;
                return (
                  <div key={item} className="text-center">
                    <button
                      onClick={() => press(item)}
                      disabled={dfa.stock[item] === 0}
                      style={{
                        transform: "translateZ(30px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                      }}
                      className={`${drinks[item].color} ${
                        drinks[item].glow
                      } h-36 w-full rounded-xl font-bold text-white text-lg shadow-xl 
                      hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                      ${isDispensing ? "animate-bounce" : ""}
                      relative overflow-hidden group`}
                    >
                      <span className="relative z-10">{item}</span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      {isDispensing && (
                        <div className="absolute inset-0 bg-white animate-ping opacity-30"></div>
                      )}
                    </button>
                    <p
                      className={`text-sm mt-2 font-semibold transition-all duration-300 ${
                        dfa.stock[item] === 0 ? "text-red-400" : "text-gray-300"
                      }`}
                    >
                      Stock: {dfa.stock[item]}{" "}
                      {dfa.stock[item] === 0 ? "⚠️" : ""}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">₱25</p>
                  </div>
                );
              })}
            </div>

            {/* DISPENSER TRAY */}
            <div className="mt-6 relative">
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-4 border-2 border-gray-700 shadow-inner">
                <div className="text-center text-gray-400 text-xs font-bold mb-2">
                  PICKUP TRAY
                </div>
                <div className="bg-black rounded-lg h-20 relative overflow-hidden border-2 border-gray-800">
                  {/* Falling drink animation */}
                  {dispensing && (
                    <div className="absolute left-1/2 -translate-x-1/2 animate-fall-drink">
                      <div
                        className={`w-12 h-16 rounded-lg ${drinks[dispensing].color} shadow-2xl border-2 border-white/20 flex items-center justify-center text-2xl animate-wiggle`}
                      >
                        🥤
                      </div>
                    </div>
                  )}

                  {/* Tray content indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gray-600 text-xs">
                    {dispensing ? "↓ GRAB YOUR DRINK! ↓" : "Empty"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTROL PANEL */}
          <div
            className="bg-gradient-to-br from-slate-900 to-black rounded-2xl p-6 flex flex-col items-center shadow-inner border border-slate-700"
            style={{ transform: "translateZ(20px)" }}
          >
            {/* LCD */}
            <div
              style={{
                transform: "translateZ(15px)",
                boxShadow:
                  "0 8px 20px rgba(0,0,0,0.6), inset 0 2px 10px rgba(0,255,0,0.1)",
              }}
              className={`bg-black font-mono text-xl px-4 py-4 rounded-lg w-full text-center mb-6 border-4 border-gray-800 relative overflow-hidden transition-all duration-200
            ${flashScreen ? "brightness-150 scale-105" : ""}
            ${
              insufficientFunds
                ? "text-red-400 border-red-600"
                : "text-green-400"
            }
          `}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-b ${
                  insufficientFunds ? "from-red-500/10" : "from-green-500/10"
                } to-transparent`}
              ></div>
              <div className="relative z-10 tracking-wider font-bold animate-pulse">
                {screen}
              </div>
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  insufficientFunds ? "bg-red-500/30" : "bg-green-500/30"
                }`}
              ></div>
              {insufficientFunds && (
                <div className="absolute inset-0 border-4 border-red-500 animate-ping opacity-40"></div>
              )}
            </div>

            {/* COIN SLOT */}
            <div
              className="w-full mb-4 relative"
              style={{ transform: "translateZ(10px)" }}
            >
              <div className="bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg p-3 border-2 border-gray-600 shadow-inner">
                <div className="text-center text-gray-400 text-xs font-bold mb-2">
                  COIN SLOT
                </div>
                <div className="h-2 bg-black rounded-full relative overflow-hidden">
                  {coinAnimation && (
                    <div className="absolute top-0 left-0 w-6 h-full bg-yellow-400 rounded-full animate-coin-drop shadow-lg shadow-yellow-500/50"></div>
                  )}
                </div>
              </div>
              {/* COIN RETURN SLOT */}
              <div className="mt-2 bg-gradient-to-b from-gray-800 to-gray-950 rounded-lg p-2 border border-gray-700 shadow-inner">
                <div className="text-center text-gray-500 text-xs font-bold mb-1">
                  COIN RETURN
                </div>
                <div className="bg-black rounded h-8 relative overflow-hidden border border-gray-800 flex items-center justify-center">
                  {rejectedCoin && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-coin-reject">
                      <div className="w-6 h-6 rounded-full bg-yellow-400 shadow-lg shadow-yellow-500/50 border-2 border-yellow-600 flex items-center justify-center text-xs">
                        💰
                      </div>
                    </div>
                  )}
                  <span className="text-gray-700 text-xs">
                    {rejectedCoin ? "⚠️ REJECTED" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* COINS */}
            <div
              className="space-y-3 w-full mb-4"
              style={{ transform: "translateZ(15px)" }}
            >
              <Coin
                label="₱5 Coin"
                onClick={() => press("N")}
                color="from-gray-400 to-gray-500"
              />
              <Coin
                label="₱10 Coin"
                onClick={() => press("D")}
                color="from-gray-300 to-gray-400"
              />
              <Coin
                label="₱20 Coin"
                onClick={() => press("Q")}
                color="from-yellow-400 to-yellow-600"
              />
            </div>

            <button
              onClick={() => press("R")}
              style={{
                transform: "translateZ(15px)",
                boxShadow: "0 6px 15px rgba(239, 68, 68, 0.4)",
              }}
              className="w-full bg-gradient-to-br from-red-600 to-red-800 py-3 rounded-lg font-bold text-white hover:from-red-500 hover:to-red-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-red-500/50 border-2 border-red-900"
            >
              REFUND
            </button>
          </div>

          {/* DFA STATES */}
          <div
            className="md:col-span-3 flex justify-center gap-4 bg-gradient-to-br from-white to-gray-100 rounded-2xl p-6 shadow-inner"
            style={{ transform: "translateZ(10px)" }}
          >
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {states.map((s, idx) => {
                const active = (state >= 25 && s === 25) || state === s;
                const passed = state > s && s !== 25;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-500 transform
                    ${
                      active
                        ? "bg-yellow-400 border-yellow-600 scale-110 shadow-lg shadow-yellow-500/50 animate-pulse"
                        : passed
                        ? "bg-green-300 border-green-500"
                        : s === 25
                        ? "bg-green-400 border-green-600"
                        : "bg-gray-200 border-gray-400"
                    }`}
                    >
                      <span className={active ? "text-xl" : ""}>
                        {s === 25 ? "✓" : "₱" + s}
                      </span>
                    </div>
                    {idx < states.length - 1 && (
                      <div
                        className={`w-8 h-1 rounded transition-all duration-500 ${
                          state > s ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DFA DESCRIPTION - RIGHT SIDE */}
        <div
          className="lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-600 flex flex-col"
          style={{
            transform: "rotateY(5deg) rotateX(2deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <h1 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-center">
            🎰 DFA Simulator
          </h1>
          <div className="bg-slate-900/50 rounded-lg p-4 space-y-4 text-gray-300 flex-1">
            <div>
              <p className="text-center text-base font-semibold text-cyan-400 mb-2">
                Deterministic Finite Automaton
              </p>
              <p className="text-sm leading-relaxed">
                This vending machine demonstrates how a{" "}
                <span className="text-yellow-400 font-semibold">DFA</span>{" "}
                (Deterministic Finite Automaton) works through states and
                transitions.
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="font-bold text-cyan-400 mb-2 text-base">
                📊 States
              </div>
              <div className="text-sm space-y-1">
                <div>
                  • Each credit amount is a{" "}
                  <span className="text-cyan-300">state</span>
                </div>
                <div>• ₱0 → ₱5 → ₱10 → ₱20 → ₱25+</div>
                <div>• Machine tracks current state</div>
                <div>• Visual progress shown below</div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="font-bold text-yellow-400 mb-2 text-base">
                ⚡ Transitions
              </div>
              <div className="text-sm space-y-1">
                <div>
                  • Coins cause{" "}
                  <span className="text-yellow-300">state transitions</span>
                </div>
                <div>• Each input moves to new state</div>
                <div>• Refund returns to start state (₱0)</div>
                <div>• Max capacity: ₱50 (reject coins)</div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="font-bold text-green-400 mb-2 text-base">
                ✅ Accept State
              </div>
              <div className="text-sm space-y-1">
                <div>• At ₱25+ machine accepts purchase</div>
                <div>• Dispenses drink (output action)</div>
                <div>• Returns to new state with change</div>
                <div>• Credit retained for next purchase</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Coin({ label, onClick, color, invalid = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-gradient-to-br ${color} py-3 rounded-lg font-semibold text-white hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl border ${
        invalid ? "border-red-700 border-2 opacity-80" : "border-gray-500"
      }`}
    >
      {label}
    </button>
  );
}
