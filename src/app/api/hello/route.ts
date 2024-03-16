import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import { ObjectData } from "@/app/interfaces/ObjectData";
import { PlaceData } from "@/app/interfaces/PlaceData";
import { db } from "@/app/services/firebase";

const pickRandomWord = (
	words: {
		name: string;
		percentage: number;
	}[],
) => {
	const totalPercentage = words.reduce(
		(acc, { percentage }) => acc + percentage,
		0,
	);
	let randomNumber = Math.random() * totalPercentage;

	for (const { name, percentage } of words) {
		if (randomNumber < percentage) name;
		randomNumber -= percentage;
	}

	return words[words.length - 1].name;
};

export const GET = async () => {
	let places: PlaceData[] = [];
	let object: ObjectData = {
		id: "",
		name: "",
		allowedActions: [],
	};

	const placesCollection = await getDocs(collection(db, "places"));
	placesCollection.forEach((place) => {
		places.push({ ...(place.data() as PlaceData), id: place.id });
	});

	const selectedPlace = pickRandomWord(places);
	const { availableObjects } = places.find(
		(place) => place.name == selectedPlace,
	) as PlaceData;

	const selectedObject = pickRandomWord(availableObjects);

	const objectsCollection = await getDocs(
		query(collection(db, "objects"), where("name", "==", selectedObject)),
	);
	objectsCollection.forEach((objectData) => {
		object = { ...(objectData.data() as ObjectData), id: objectData.id };
	});

	const action =
		object.allowedActions[
			Math.floor(Math.random() * object.allowedActions.length)
		];

	const message = `Olá aventureiro!\n
	Aqui estão os detalhes da sua missão:\n
	Você vai ${action.toLowerCase()} um ou uma ${selectedObject.toLowerCase()} em ${selectedPlace}.`;

	return NextResponse.json({ message: message });
};
