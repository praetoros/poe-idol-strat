const Header = () => {
	return (
		<header className="w-full bg-gray-800 px-6 py-4 text-white">
			<div className="container mx-auto flex items-center justify-between">
				<div>
					<h1 className="font-bold text-xl">POE Idol Strat</h1>
				</div>
				<div className="flex items-center">
					<a href="https://github.com/praetoros" className="hover:underline">
						Made by Praetoros
					</a>
				</div>
			</div>
		</header>
	);
};

export default Header;
