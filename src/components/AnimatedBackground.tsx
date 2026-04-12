import React from "react";
import "../app/globals.css";

// Parallax stars background for dark mode
export default function AnimatedBackground() {
	return (
		<>
			<div className="parallax-stars-bg" aria-hidden="true">
				<div className="stars stars1"></div>
				<div className="stars stars2"></div>
				<div className="stars stars3"></div>
			</div>
		</>
	);
}
