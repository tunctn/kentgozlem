/* eslint-disable react/no-unknown-property */
"use client";

import { cn } from "@/lib/utils";

interface LoadingBladeSpinnerProps {
	size?: number;
	color?: string;
	backgroundColor?: string;
	className?: string;
}

const BLADE_COUNT = 12;

export const LoadingBladeSpinner = ({
	size = 24,
	color = "currentColor",
	backgroundColor = "transparent",
	className,
}: LoadingBladeSpinnerProps) => {
	return (
		<div
			className={cn("overlay pointer-events-none ", className)}
			style={{ background: backgroundColor }}
		>
			<div
				className={cn("spinner absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2")}
				style={{ fontSize: `${size}px` }}
			>
				{Array.from({ length: BLADE_COUNT }).map((_, index) => {
					const opacity = ((BLADE_COUNT - index) / BLADE_COUNT) * -1;
					const animationDelay = (index / BLADE_COUNT) * -1;
					const rotate = index * 30;

					return (
						<div
							key={index.toString()}
							className="blade"
							style={{
								animationDelay: `${animationDelay}s`,
								opacity: opacity,
								transform: `rotate(${rotate}deg)`,
							}}
						/>
					);
				})}
			</div>
			<style global jsx>{`
        .overlay {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          transform: scaleX(-1);
        }

        .spinner {
          position: relative;
          display: inline-block;
          width: 1em;
          height: 1em;
        }

        .blade {
          position: absolute;
          left: 0.4629em;
          bottom: 0;
          width: 0.074em;
          height: 0.2777em;
          border-radius: 0.5em;
          background-color: ${color};
          transform-origin: center -0.2222em;
          animation: spinnerFade 1s infinite linear;
        }
      
				@keyframes spinnerFade {
          0% {
            opacity: 1;  
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
		</div>
	);
};
