import * as React from "react";

function SpinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <style>{`
        @keyframes spinner_grm3 {
          0%, 50% {
            animation-timing-function: cubic-bezier(.27,.42,.37,.99);
            r: 1px;
          }
          25% {
            animation-timing-function: cubic-bezier(.53,0,.61,.73);
            r: 2px;
          }
        }

        @keyframes spinner_T3O6 {
          0% {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .spinner_EUy1 {
          animation: spinner_grm3 1.2s infinite;
        }

        .spinner_container {
          transform-origin: center;
          animation: spinner_T3O6 6s linear infinite;
        }
      `}</style>

      <g className="spinner_container" fill="currentColor">
        <circle className="spinner_EUy1" cx={12} cy={3} r={1} />
        <circle
          className="spinner_EUy1"
          cx={16.5}
          cy={4.21}
          r={1}
          style={{ animationDelay: ".1s" }}
        />
        <circle
          className="spinner_EUy1"
          cx={7.5}
          cy={4.21}
          r={1}
          style={{ animationDelay: "1.1s" }}
        />
        <circle
          className="spinner_EUy1"
          cx={19.79}
          cy={7.5}
          r={1}
          style={{ animationDelay: ".2s" }}
        />
        <circle
          className="spinner_EUy1"
          cx={4.21}
          cy={7.5}
          r={1}
          style={{ animationDelay: "1s" }}
        />
        <circle
          className="spinner_EUy1"
          cx={21}
          cy={12}
          r={1}
          style={{ animationDelay: ".3s" }}
        />
        <circle
          className="spinner_EUy1"
          cx={3}
          cy={12}
          r={1}
          style={{ animationDelay: ".9s" }}
        />
        <circle
          className="spinner_EUy1"
          cx={19.79}
          cy={16.5}
          r={1}
          style={{ animationDelay: ".4s" }}
        />
        <circle
          className="spinner_EUy1"
          cx={4.21}
          cy={16.5}
          r={1}
          style={{ animationDelay: ".8s" }}
        />
        <circle
          className="spinner_EUy1"
          cx={16.5}
          cy={19.79}
          r={1}
          style={{ animationDelay: ".5s" }}
        />
        <circle
          className="spinner_EUy1"
          cx={7.5}
          cy={19.79}
          r={1}
          style={{ animationDelay: ".7s" }}
        />
        <circle
          className="spinner_EUy1"
          cx={12}
          cy={21}
          r={1}
          style={{ animationDelay: ".6s" }}
        />
      </g>
    </svg>
  );
}

export default SpinnerIcon;
