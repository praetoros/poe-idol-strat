import Header from "@/components/header.tsx";
import IdolList from "@/components/idol-list.tsx";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";

function App() {
	const [isDarkMode, setIsDarkMode] = useState(true);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		setIsDarkMode(mediaQuery.matches);

		const handleChange = (event: MediaQueryListEvent) => {
			setIsDarkMode(event.matches);
		};

		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	return (
		<div
			className={`min-h-screen bg-background text-foreground ${isDarkMode ? "dark" : ""}`}
		>
			<Header />
			<IdolList />
			<Toaster />
		</div>
	);
}

export default App;
