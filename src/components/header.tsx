const Header = () => {
	return (
		<header className="w-full bg-gray-800 px-6 py-4 text-white">
			<div className="container mx-auto flex items-center justify-between">
				<a href="/">
					<img src="/favico.webp" alt="Logo" className="h-8 w-auto" />
				</a>
				<div>
					<h1 className="font-bold text-xl">
						<a href="/">POE Idol Strat</a>
					</h1>
				</div>
				<div className="flex items-center">
					<a
						href="https://github.com/praetoros"
						target="_blank"
						rel="noreferrer"
						className="hover:underline"
					>
						Made by Praetoros
					</a>
				</div>
			</div>
		</header>
	);
};

export default Header;
