import { createPortal } from "react-dom";

const PageLoader = () => {
  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        zIndex: 99999,
      }}
    >
      <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>

        {/* Orange arc */}
        <svg
          width="110"
          height="110"
          viewBox="0 0 110 110"
          style={{
            position: "absolute",
            animation: "loaderSpin 1s linear infinite",
          }}
        >
          <circle
            cx="55" cy="55" r="48"
            fill="none"
            stroke="#FF9933"
            strokeWidth="4"
            strokeDasharray="75 226"
            strokeLinecap="round"
          />
        </svg>

        {/* Green arc (opposite) */}
        <svg
          width="110"
          height="110"
          viewBox="0 0 110 110"
          style={{
            position: "absolute",
            animation: "loaderSpinReverse 1s linear infinite",
          }}
        >
          <circle
            cx="55" cy="55" r="48"
            fill="none"
            stroke="#138808"
            strokeWidth="4"
            strokeDasharray="75 226"
            strokeLinecap="round"
            strokeDashoffset="-113"
          />
        </svg>

        {/* Logo in center */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            animation: "logoPulse 1.5s ease-in-out infinite",
          }}
        >
          <img
            src="/assets/sss.png"
            alt="Loading"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loaderSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes loaderSpinReverse {
          from { transform: rotate(180deg); }
          to   { transform: rotate(-180deg); }
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.07); }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default PageLoader;
