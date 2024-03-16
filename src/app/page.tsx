export default async function Home() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/api/hello`,
	);

	const { message } = (await response.json()) as { message: string };
	const messageArray = message.split("\n");

	return (
		<div>
			{messageArray.map((phrase) => (
				<p key={phrase}>{phrase}</p>
			))}
		</div>
	);
}
