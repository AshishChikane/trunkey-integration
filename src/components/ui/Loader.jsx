const Loader = () => {
  return (
    <div className="loader-container">
      <span className="loader"></span>
      <style jsx>{`
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 9999;
        }
        .loader {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: inline-block;
          border-top: 3px solid #fff;
          border-right: 3px solid transparent;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }
        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
