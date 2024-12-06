 export const getKey = async (apiType, endpoint) => {
	const url = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com' + endpoint;

	const options = {
		method: apiType,
	};

	const response = await fetch(url, options);
	const data = await response.json();

	if (!data.key) {
		throw new Error('API-nyckel saknas i svaret');
	}

	return data.key; // Returnera nyckeln
};

export const getPlanets = async (apiType, endpoint, key) => {
	const url = 'https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com' + endpoint;

	const options = {
		method: apiType,
		headers: {
			'x-zocom': key,
		},
	};

	const response = await fetch(url, options);

	if (!response.ok) {
		throw new Error(`Fel vid hämtning av planetdata: ${response.status}`);
	}

	const data = await response.json();
	console.log('Hämtade planeter:', data);

	return data;
};
