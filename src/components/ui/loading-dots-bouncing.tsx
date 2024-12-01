/* eslint-disable react/no-unknown-property */
"use client";

import { cn } from "@/lib/utils";

export const LoadingDotsBouncing = ({
	size = 16,
	className,
	backgroundColor = "currentColor",
}: {
	size?: number;
	className?: string;
	backgroundColor?: string;
}) => {
	return (
		<div className={cn("bouncing-loader", className)}>
			<div />
			<div />
			<div />

			<style jsx>
				{`
          .bouncing-loader {
            display: flex;
            justify-content: center;
            margin-top: ${size / 2}px;
          }

          .bouncing-loader > div {
            width: ${size}px;
            height: ${size}px;
            margin: 3px ${size / 4}px;
            border-radius: 50%;
            background-color: ${backgroundColor};
            opacity: 1;
            animation: bouncing-loader 0.6s infinite alternate;
          }

          @keyframes bouncing-loader {
            to {
              opacity: 0.1;
              transform: translateY(-${size - size / 2}px);
            }
          }

          .bouncing-loader > div:nth-child(2) {
            animation-delay: 0.2s;
          }

          .bouncing-loader > div:nth-child(3) {
            animation-delay: 0.4s;
          }
        `}
			</style>
		</div>
	);
};
