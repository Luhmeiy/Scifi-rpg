export interface PlaceData {
	id: string;
	name: string;
	percentage: number;
	availableObjects: {
		name: string;
		percentage: number;
	}[];
}
