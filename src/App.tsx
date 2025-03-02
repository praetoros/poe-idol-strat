import Header from "@/components/header.tsx";
import IdolList from "@/components/idol-list.tsx";
import { Toaster } from "@/components/ui/sonner";

function App() {
	return (
		<>
			<Header />
			<IdolList />
			<Toaster />
		</>
	);
}

export default App;
