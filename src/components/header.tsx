const Header = () => {
	return (
		<header className="w-full bg-foreground px-6 py-4 text-background">
			<div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
				<a href="/">
					<img src="/assets/logo.webp" alt="Logo" className="h-8 w-auto" />
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
					<span className="mx-2">|</span>
					<a
						href="https://github.com/praetoros/poe-idol-strat/issues"
						target="_blank"
						rel="noreferrer"
						className="hover:underline"
					>
						Report issues on the GitHub
					</a>
				</div>
			</div>
		</header>
	);
};

export default Header;
