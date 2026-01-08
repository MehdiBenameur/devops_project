const apiBase = "http://localhost:4000/api";

const fetchMatches = async () => {
  const res = await fetch(`${apiBase}/all-matches`); // on va créer cette route côté API Gateway vite fait
  const matches = await res.json();
  displayMatches(matches);
};

const displayMatches = async (matches) => {
  const scores = await fetchScores();
  const container = document.getElementById("matches");
  container.innerHTML = "";

  matches.forEach(match => {
    const matchScores = scores.filter(score => score.matchId === match.id);

    // Calcul des scores par équipe
    const homeScore = matchScores.filter(score => score.team === match.homeTeam).length;
    const awayScore = matchScores.filter(score => score.team === match.awayTeam).length;

    const homeScoreId = `score-${match.id}-home`;
    const awayScoreId = `score-${match.id}-away`;


    const card = document.createElement("div");
    card.className = "col-md-6";

    card.innerHTML = `
      <div class="p-3 bg-white match-card">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="d-flex align-items-center">
            <img src="${match.homeTeamLogoUrl}" alt="home" class="team-logo me-2">
            <strong>${match.homeTeam}</strong>
          </div>
          <span>vs</span>
          <div class="d-flex align-items-center">
            <strong>${match.awayTeam}</strong>
            <img src="${match.awayTeamLogoUrl}" alt="away" class="team-logo ms-2">
          </div>
        </div>

        <p class="mb-1 text-muted">📅 ${new Date(match.date).toLocaleString()}</p>

        <!-- Affichage du score en live -->
        <h5 class="my-2">
  🔢 Score :
  <span id="${homeScoreId}" class="live-score">${homeScore}</span> -
  <span id="${awayScoreId}" class="live-score">${awayScore}</span>
</h5>


        <div class="mt-2">
          <h6>⚽ Players</h6>
          <div class="d-flex flex-wrap gap-2">
            ${match.players.map(player => `
              <div class="text-center">
                <img src="${player.photoUrl}" class="player-photo" title="${player.name}">
                <small class="d-block">${player.name}</small>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="mt-3">
          <h6>📊 Scores</h6>
          <ul class="list-group">
            ${matchScores.map(score => `
              <li class="list-group-item">
                <strong>${score.team}</strong> ⚽ à la ${score.minute}′ (Player : ${score.playerName})
              </li>
            `).join("") || "<li class='list-group-item'>Aucun but pour le moment</li>"}
          </ul>
        </div>

      </div>
    `;

    container.appendChild(card);
    // Effet d'animation si le score change
const homeScoreEl = document.getElementById(homeScoreId);
const awayScoreEl = document.getElementById(awayScoreId);

// Stocker le score actuel pour comparaison (dans un attribut data)
if (homeScoreEl.dataset.lastValue !== homeScore.toString()) {
  homeScoreEl.classList.add("animated");
  homeScoreEl.dataset.lastValue = homeScore;
  setTimeout(() => homeScoreEl.classList.remove("animated"), 800);
}

if (awayScoreEl.dataset.lastValue !== awayScore.toString()) {
  awayScoreEl.classList.add("animated");
  awayScoreEl.dataset.lastValue = awayScore;
  setTimeout(() => awayScoreEl.classList.remove("animated"), 800);
}

  });
};



// Appel initial et refresh toutes les 10s
fetchMatches();
setInterval(fetchMatches, 10000);

const fetchScores = async () => {
  const res = await fetch(`${apiBase}/all-scores`);
  const scores = await res.json();
  return scores;
};

