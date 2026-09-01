const reports = [
  {
    id: 1,
    category: "afval",
    title: "Afval naast ondergrondse containers",
    location: "Gerard Douplein · De Pijp",
    description:
      "Rond de containers ligt al enkele dagen veel afval en karton op straat.",
    time: "Vandaag · 18:40",
    people: 42,
    lat: 52.3548,
    lng: 4.8907,
  },
  {
    id: 2,
    category: "fietsen",
    title: "Fietsen blokkeren de stoep",
    location: "Stationsplein · Centrum",
    description:
      "De doorgang op de stoep is erg smal doordat veel fietsen buiten de rekken staan.",
    time: "Vandaag · 17:15",
    people: 31,
    lat: 52.3782,
    lng: 4.9004,
  },
  {
    id: 3,
    category: "verkeer",
    title: "Onveilige oversteekplaats",
    location: "Wibautstraat · Oost",
    description:
      "Auto's rijden hier vaak hard en voetgangers hebben weinig overzicht bij het oversteken.",
    time: "Vandaag · 15:22",
    people: 27,
    lat: 52.3542,
    lng: 4.9125,
  },
  {
    id: 4,
    category: "geluid",
    title: "Veel geluidsoverlast in de avond",
    location: "Leidseplein · Centrum",
    description:
      "Bewoners ervaren de laatste avonden veel geluid van groepen en verkeer tot laat in de nacht.",
    time: "Gisteren · 23:18",
    people: 19,
    lat: 52.364,
    lng: 4.883,
  },
  {
    id: 5,
    category: "drukte",
    title: "Erg druk rond het plein",
    location: "Dam · Centrum",
    description:
      "Door grote groepen bezoekers is er nauwelijks ruimte om rustig door te lopen.",
    time: "Vandaag · 16:05",
    people: 36,
    lat: 52.3731,
    lng: 4.8922,
  },
  {
    id: 6,
    category: "voorzieningen",
    title: "Straatverlichting werkt niet",
    location: "Westerpark · West",
    description:
      "Meerdere lantaarnpalen langs het pad werken niet waardoor het hier 's avonds erg donker is.",
    time: "Gisteren · 21:44",
    people: 14,
    lat: 52.3876,
    lng: 4.8742,
  },
  {
    id: 7,
    category: "afval",
    title: "Volle afvalbakken bij park",
    location: "Oosterpark · Oost",
    description:
      "De afvalbakken zitten vol en afval ligt verspreid rondom de bankjes.",
    time: "Vandaag · 13:11",
    people: 23,
    lat: 52.3601,
    lng: 4.9194,
  },
  {
    id: 8,
    category: "fietsen",
    title: "Fietsen staan midden op looproute",
    location: "Javastraat · Oost",
    description:
      "Voor winkels staan veel fietsen op de looproute waardoor voetgangers moeten uitwijken.",
    time: "Vandaag · 12:35",
    people: 17,
    lat: 52.3638,
    lng: 4.9362,
  },
];

const categoryLabels = {
  afval: "Afval",
  fietsen: "Fietsen",
  geluid: "Geluid",
  verkeer: "Verkeer",
  drukte: "Drukte",
  voorzieningen: "Voorzieningen",
};

const categoryColors = {
  afval: "#e31b23",
  fietsen: "#2563eb",
  geluid: "#8b5cf6",
  verkeer: "#f97316",
  drukte: "#eab308",
  voorzieningen: "#64748b",
};

const map = L.map("map", {
  zoomControl: false,
}).setView([52.3676, 4.9041], 13);

L.control
  .zoom({
    position: "bottomright",
  })
  .addTo(map);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenStreetMap",
  }
).addTo(map);

let markers = [];

function createMarker(report) {
  const color = categoryColors[report.category];

  const markerIcon = L.divIcon({
    className: "custom-marker-wrapper",
    html: `
      <div class="custom-marker" style="background:${color}">
        <span></span>
      </div>
    `,
    iconSize: [34, 42],
    iconAnchor: [17, 42],
  });

  const marker = L.marker([report.lat, report.lng], {
    icon: markerIcon,
  });

  marker.on("click", () => {
    openReportPopup(report, marker);
  });

  marker.addTo(map);

  markers.push({
    marker,
    report,
  });
}

function renderMarkers(category = "all") {
  markers.forEach((item) => {
    map.removeLayer(item.marker);
  });

  markers = [];

  reports
    .filter((report) => {
      return category === "all" || report.category === category;
    })
    .forEach(createMarker);
}

function openReportPopup(report, marker) {
  const popupContent = document.createElement("div");

  popupContent.className = "report-popup";

  popupContent.innerHTML = `
    <div class="popup-category">
      <span
        class="popup-category-dot"
        style="background:${categoryColors[report.category]}"
      ></span>

      ${categoryLabels[report.category]}
    </div>

    <h3>${report.title}</h3>

    <p class="popup-location">
      ${report.location}
    </p>

    <p class="popup-description">
      ${report.description}
    </p>

    <div class="popup-meta">
      ${report.time}
    </div>

    <button class="also-button" type="button">
      Ook last van
      <span>${report.people}</span>
    </button>
  `;

  const button = popupContent.querySelector(".also-button");

  button.addEventListener("click", () => {
    report.people += 1;

    button.classList.add("active");

    button.innerHTML = `
      Ook last van
      <span>${report.people}</span>
    `;

    updatePopularReports();
  });

  marker
    .bindPopup(popupContent, {
      maxWidth: 320,
      minWidth: 280,
      closeButton: true,
    })
    .openPopup();
}

function updatePopularReports() {
  const reportList = document.querySelector(".report-list");

  const popularReports = [...reports]
    .sort((a, b) => b.people - a.people)
    .slice(0, 3);

  reportList.innerHTML = "";

  popularReports.forEach((report, index) => {
    const article = document.createElement("article");

    article.className = "report-card";

    article.innerHTML = `
      <div class="report-card-top">
        <span
          class="category-badge"
          style="
            background:${categoryColors[report.category]}15;
            color:${categoryColors[report.category]};
          "
        >
          ${categoryLabels[report.category]}
        </span>

        ${
          index === 0
            ? `<span class="trend">↑ veel gemeld</span>`
            : ""
        }
      </div>

      <h3>${report.title}</h3>

      <p class="location">
        ${report.location}
      </p>

      <div class="report-card-footer">
        <span>
          ${report.people} mensen hebben hier last van
        </span>
      </div>
    `;

    article.addEventListener("click", () => {
      map.setView([report.lat, report.lng], 16);

      const markerItem = markers.find(
        (item) => item.report.id === report.id
      );

      if (markerItem) {
        openReportPopup(report, markerItem.marker);
      }
    });

    reportList.appendChild(article);
  });
}

const filterButtons = document.querySelectorAll(".filter-button");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    const category = button.dataset.category;

    renderMarkers(category);
  });
});

const newReportButton =
  document.getElementById("newReportButton");

const reportModal =
  document.getElementById("reportModal");

const closeModalButton =
  document.getElementById("closeModalButton");

newReportButton.addEventListener("click", () => {
  reportModal.classList.remove("hidden");
});

closeModalButton.addEventListener("click", () => {
  reportModal.classList.add("hidden");
});

reportModal.addEventListener("click", (event) => {
  if (event.target === reportModal) {
    reportModal.classList.add("hidden");
  }
});

const reportForm =
  document.getElementById("reportForm");

reportForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const category =
    document.getElementById("category").value;

  const location =
    document.getElementById("location").value;

  const description =
    document.getElementById("description").value;

  const center = map.getCenter();

  const newReport = {
    id: Date.now(),
    category,
    title: "Nieuwe melding",
    location,
    description,
    time: "Zojuist",
    people: 1,
    lat: center.lat,
    lng: center.lng,
  };

  reports.push(newReport);

  renderMarkers("all");
  updatePopularReports();

  reportForm.reset();

  reportModal.classList.add("hidden");

  map.setView(
    [newReport.lat, newReport.lng],
    16
  );

  const markerItem = markers.find(
    (item) => item.report.id === newReport.id
  );

  if (markerItem) {
    openReportPopup(
      newReport,
      markerItem.marker
    );
  }
});

renderMarkers();
updatePopularReports();
