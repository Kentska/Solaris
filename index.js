import { getKey, getPlanets } from "./api.js";






// Funktion för att visa popup
function showPopup(planet) {
	const popup = document.getElementById('popup');
	const popupName = document.getElementById('popup-name');
	const popupLatinName = document.getElementById('popup-latin-name');
	const popupDesc = document.getElementById('popup-desc');
	const popupCircumference = document.getElementById('popup-circumference');
	const popupTempDay = document.getElementById('popup-temp-day');
	const popupTempNight = document.getElementById('popup-temp-night');
	const popupDistance = document.getElementById('popup-distance');
	const popupMoons = document.getElementById('popup-moons');

	// Fyll med Data

	popup.style.display = 'block';
	popupName.textContent = planet.name;
	popupLatinName.textContent = planet.latinName;
	popupDesc.textContent = planet.desc;
	popupCircumference.textContent = `${planet.circumference} km`;
	popupTempDay.textContent = `${planet.temp.day} °C`;
	popupTempNight.textContent = `${planet.temp.night} °C`;
	popupDistance.textContent = `${planet.distance} km`;
	popupMoons.textContent = planet.moons.length > 0 ? planet.moons.join(', ') : 'Inga';

}



// Funktion för att stänga popup
const closePopup = document.getElementById('closePopup');
closePopup.addEventListener('click', () => {
	const popup = document.getElementById('popup');
	popup.style.display = 'none';
});

(async () => {
	try {
		// Hämta nyckel
		const key = await getKey('POST', '/keys'); // Hämta nyckeln
		console.log('Hämtad API-nyckel:', key);

		// Hämta planetdata
		const planetsData = await getPlanets('GET', '/bodies', key); // Använd nyckeln för att hämta planetdata
		console.log('Hämtade planetdata:', planetsData);

		// Kontrollera om planetsData innehåller nyckeln 'bodies' och den är en array
		if (Array.isArray(planetsData.bodies)) {
			const planets = planetsData.bodies; // Plocka ut info från Planetlistan!

			// Koppla planetdata till knappar, la även till .sun-btn som är den image jag har som sol.
			const planetButtons = document.querySelectorAll('.circle-btn, .sun-btn');

			planetButtons.forEach((button) => {
				button.addEventListener('click', () => {
					const planetId = button.id; // Använt knappens ID för att hitta rätt planet.
					const planet = planets.find((p) => p.name.toLowerCase() === planetId);

					if (planet) {
						showPopup(planet);

					} else {
						// Visa felmeddelande om data inte hittas
						console.error(`Data för ${planetId} kunde inte hämtas.`);
						/*showPopup(`<p>Data för ${planetId} kunde inte hämtas.</p>`);*/
					}
				});
			});
		} else {
			console.error('Planetdata är inte en array:', planetsData.bodies);
		}
	} catch (error) {
		// Hantera fel från alla asynkrona operationer
		console.error('Ett fel inträffade:', error);
	}
})();
