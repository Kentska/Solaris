import { getKey, getPlanets } from "./api.js";

const popup = document.getElementById('popup');
const popupContent = document.getElementById('popupContent');
const closePopup = document.getElementById('closePopup');
const planetButtons = document.querySelectorAll('.circle-btn, .sun-btn');

// Funktion för att visa popup
function showPopup(content) {
	popupContent.innerHTML = content;
	popup.style.display = 'block';
}

// Funktion för att stänga popup
closePopup.addEventListener('click', () => {
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
				button.addEventListener('click',  () => {
					const planetId = button.id; // Använt knappens ID för att hitta rätt planet.
					const planet = planets.find((p) => p.name.toLowerCase() === planetId);
					
					if (planet) {
						// Visa popup med planetdata
						showPopup(`
                            <h2>${planet.name}</h2>
							<h4>${planet.latinName}</h4>
							<p>${planet.desc}</p>
							<div class="popup-details">
        						<div class="popup-column">
                            		<p><strong>OMKRETS:</strong></p>
									<p>${planet.circumference}km </p>
									<p><strong>MAX TEMPERATUR:</strong></p>
									<p>${planet.temp.day} °C</p>
									<div class="moon-list">
    					<p><strong>Moons:</strong></p>
						<p>${planet.moons.length > 0 ? planet.moons.join(', ') : 'Inga'}</p>
							</div>
								</div>
								 <div class="popup-column">
            						<p><strong>KM FRÅN SOLEN:</strong></p>
            						<p>${planet.distance} km</p>
            						<p><strong>MIN TEMPERATUR:</strong></p>
            						<p>${planet.temp.night} °C</p>
        						</div>
    						
						</div>								
                        `);
					} else {
						// Visa felmeddelande om data inte hittas
						showPopup(`<p>Data för ${planetId} kunde inte hämtas.</p>`);
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

