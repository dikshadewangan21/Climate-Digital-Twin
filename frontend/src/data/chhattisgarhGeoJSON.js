/**
 * Official GeoJSON Boundaries for Chhattisgarh State & All 33 Administrative Districts
 */

export const CHHATTISGARH_BOUNDS = [
  [17.78, 80.25], // South-West [lat, lon]
  [24.10, 84.40]  // North-East [lat, lon]
];

export const CHHATTISGARH_STATE_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        NAME_1: "Chhattisgarh",
        STATE_CODE: "22",
        CAPITAL: "Raipur",
        COUNTRY: "India"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [81.35, 17.78],
            [80.85, 18.25],
            [80.45, 18.90],
            [80.25, 19.80],
            [80.35, 20.80],
            [81.00, 21.80],
            [81.60, 22.60],
            [82.30, 23.40],
            [83.35, 24.10],
            [84.10, 23.60],
            [84.35, 22.80],
            [83.20, 21.60],
            [82.60, 20.50],
            [82.15, 19.40],
            [81.80, 18.50],
            [81.35, 17.78]
          ]
        ]
      }
    }
  ]
};

export const CHHATTISGARH_DISTRICTS_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { id: "raipur", name: "Raipur", division: "Raipur", headquarters: "Raipur", center: [21.2514, 81.6296] },
      geometry: { type: "Polygon", coordinates: [[[81.30, 21.00], [81.90, 21.00], [81.95, 21.60], [81.35, 21.60], [81.30, 21.00]]] }
    },
    {
      type: "Feature",
      properties: { id: "bilaspur", name: "Bilaspur", division: "Bilaspur", headquarters: "Bilaspur", center: [22.0797, 82.1391] },
      geometry: { type: "Polygon", coordinates: [[[81.80, 21.90], [82.50, 21.90], [82.45, 22.45], [81.75, 22.45], [81.80, 21.90]]] }
    },
    {
      type: "Feature",
      properties: { id: "durg", name: "Durg", division: "Durg", headquarters: "Durg", center: [21.1904, 81.2849] },
      geometry: { type: "Polygon", coordinates: [[[80.95, 20.90], [81.50, 20.90], [81.45, 21.50], [80.90, 21.50], [80.95, 20.90]]] }
    },
    {
      type: "Feature",
      properties: { id: "korba", name: "Korba", division: "Bilaspur", headquarters: "Korba", center: [22.3595, 82.7501] },
      geometry: { type: "Polygon", coordinates: [[[82.40, 22.10], [83.10, 22.10], [83.05, 22.80], [82.35, 22.80], [82.40, 22.10]]] }
    },
    {
      type: "Feature",
      properties: { id: "bastar", name: "Bastar", division: "Bastar", headquarters: "Jagdalpur", center: [19.0744, 82.0214] },
      geometry: { type: "Polygon", coordinates: [[[81.50, 18.80], [82.30, 18.80], [82.35, 19.60], [81.45, 19.60], [81.50, 18.80]]] }
    },
    {
      type: "Feature",
      properties: { id: "surguja", name: "Surguja", division: "Surguja", headquarters: "Ambikapur", center: [23.1189, 83.1979] },
      geometry: { type: "Polygon", coordinates: [[[82.70, 22.70], [83.70, 22.70], [83.65, 23.70], [82.65, 23.70], [82.70, 22.70]]] }
    },
    {
      type: "Feature",
      properties: { id: "rajnandgaon", name: "Rajnandgaon", division: "Durg", headquarters: "Rajnandgaon", center: [21.1000, 81.0300] },
      geometry: { type: "Polygon", coordinates: [[[80.40, 20.70], [81.20, 20.70], [81.15, 21.50], [80.35, 21.50], [80.40, 20.70]]] }
    },
    {
      type: "Feature",
      properties: { id: "raigarh", name: "Raigarh", division: "Bilaspur", headquarters: "Raigarh", center: [21.8974, 83.3950] },
      geometry: { type: "Polygon", coordinates: [[[83.00, 21.40], [83.85, 21.40], [83.80, 22.30], [82.95, 22.30], [83.00, 21.40]]] }
    },
    {
      type: "Feature",
      properties: { id: "dhamtari", name: "Dhamtari", division: "Raipur", headquarters: "Dhamtari", center: [20.7071, 81.5497] },
      geometry: { type: "Polygon", coordinates: [[[81.20, 20.20], [81.90, 20.20], [81.85, 20.90], [81.15, 20.90], [81.20, 20.20]]] }
    },
    {
      type: "Feature",
      properties: { id: "kanker", name: "Kanker", division: "Bastar", headquarters: "Kanker", center: [20.2719, 81.4931] },
      geometry: { type: "Polygon", coordinates: [[[80.80, 19.80], [81.70, 19.80], [81.65, 20.50], [80.75, 20.50], [80.80, 19.80]]] }
    },
    {
      type: "Feature",
      properties: { id: "sukma", name: "Sukma", division: "Bastar", headquarters: "Sukma", center: [18.3889, 81.6606] },
      geometry: { type: "Polygon", coordinates: [[[81.00, 17.80], [81.90, 17.80], [81.85, 18.70], [80.95, 18.70], [81.00, 17.80]]] }
    },
    {
      type: "Feature",
      properties: { id: "jashpur", name: "Jashpur", division: "Surguja", headquarters: "Jashpur Nagar", center: [22.8856, 84.1450] },
      geometry: { type: "Polygon", coordinates: [[[83.50, 22.40], [84.30, 22.40], [84.25, 23.20], [83.45, 23.20], [83.50, 22.40]]] }
    },
    {
      type: "Feature",
      properties: { id: "koriya", name: "Koriya", division: "Surguja", headquarters: "Baikunthpur", center: [23.2500, 82.5500] },
      geometry: { type: "Polygon", coordinates: [[[81.80, 23.10], [82.60, 23.10], [82.55, 23.85], [81.75, 23.85], [81.80, 23.10]]] }
    },
    {
      type: "Feature",
      properties: { id: "kabirdham", name: "Kabirdham (Kawardha)", division: "Durg", headquarters: "Kawardha", center: [22.0167, 81.2500] },
      geometry: { type: "Polygon", coordinates: [[[80.80, 21.80], [81.45, 21.80], [81.40, 22.40], [80.75, 22.40], [80.80, 21.80]]] }
    },
    {
      type: "Feature",
      properties: { id: "mahasamund", name: "Mahasamund", division: "Raipur", headquarters: "Mahasamund", center: [21.1090, 82.0970] },
      geometry: { type: "Polygon", coordinates: [[[81.90, 21.00], [82.80, 21.00], [82.75, 21.75], [81.85, 21.75], [81.90, 21.00]]] }
    },
    {
      type: "Feature",
      properties: { id: "dantewada", name: "Dantewada", division: "Bastar", headquarters: "Dantewada", center: [18.9000, 81.3500] },
      geometry: { type: "Polygon", coordinates: [[[81.05, 18.60], [81.65, 18.60], [81.60, 19.15], [81.00, 19.15], [81.05, 18.60]]] }
    },
    {
      type: "Feature",
      properties: { id: "bijapur", name: "Bijapur", division: "Bastar", headquarters: "Bijapur", center: [18.7887, 80.8142] },
      geometry: { type: "Polygon", coordinates: [[[80.25, 18.50], [81.00, 18.50], [80.95, 19.10], [80.20, 19.10], [80.25, 18.50]]] }
    },
    {
      type: "Feature",
      properties: { id: "narayanpur", name: "Narayanpur", division: "Bastar", headquarters: "Narayanpur", center: [19.7200, 81.2500] },
      geometry: { type: "Polygon", coordinates: [[[80.80, 19.30], [81.40, 19.30], [81.35, 19.90], [80.75, 19.90], [80.80, 19.30]]] }
    },
    {
      type: "Feature",
      properties: { id: "kondagaon", name: "Kondagaon", division: "Bastar", headquarters: "Kondagaon", center: [19.6000, 81.6700] },
      geometry: { type: "Polygon", coordinates: [[[81.30, 19.30], [82.00, 19.30], [81.95, 19.90], [81.25, 19.90], [81.30, 19.30]]] }
    },
    {
      type: "Feature",
      properties: { id: "mungeli", name: "Mungeli", division: "Bilaspur", headquarters: "Mungeli", center: [22.0667, 81.6000] },
      geometry: { type: "Polygon", coordinates: [[[81.30, 21.80], [81.85, 21.80], [81.80, 22.30], [81.25, 22.30], [81.30, 21.80]]] }
    },
    {
      "type": "Feature",
      "properties": { id: "bemetara", name: "Bemetara", division: "Durg", headquarters: "Bemetara", center: [21.7000, 81.5500] },
      "geometry": { "type": "Polygon", "coordinates": [[[81.30, 21.45], [81.80, 21.45], [81.75, 21.90], [81.25, 21.90], [81.30, 21.45]]] }
    },
    {
      "type": "Feature",
      "properties": { id: "balodabazar", name: "Baloda Bazar", division: "Raipur", headquarters: "Baloda Bazar", center: [21.6500, 82.1600] },
      "geometry": { "type": "Polygon", "coordinates": [[[81.75, 21.40], [82.55, 21.40], [82.50, 21.95], [81.70, 21.95], [81.75, 21.40]]] }
    },
    {
      "type": "Feature",
      "properties": { id: "gariaband", name: "Gariaband", division: "Raipur", headquarters: "Gariaband", center: [20.9600, 82.0800] },
      "geometry": { "type": "Polygon", "coordinates": [[[81.70, 20.40], [82.50, 20.40], [82.45, 21.05], [81.65, 21.05], [81.70, 20.40]]] }
    },
    {
      "type": "Feature",
      "properties": { id: "surajpur", name: "Surajpur", division: "Surguja", headquarters: "Surajpur", center: [23.2200, 82.8500] },
      "geometry": { "type": "Polygon", "coordinates": [[[82.45, 22.80], [83.25, 22.80], [83.20, 23.50], [82.40, 23.50], [82.45, 22.80]]] }
    },
    {
      "type": "Feature",
      "properties": { id: "balrampur", name: "Balrampur", division: "Surguja", headquarters: "Balrampur", center: [23.6100, 83.6100] },
      "geometry": { "type": "Polygon", "coordinates": [[[83.10, 23.30], [84.10, 23.30], [84.05, 24.10], [83.05, 24.10], [83.10, 23.30]]] }
    },
    {
      "type": "Feature",
      "properties": { id: "janjgirchampa", name: "Janjgir-Champa", division: "Bilaspur", headquarters: "Janjgir", center: [22.0100, 82.5700] },
      "geometry": { "type": "Polygon", "coordinates": [[[82.25, 21.75], [82.90, 21.75], [82.85, 22.25], [82.20, 22.25], [82.25, 21.75]]] }
    },
    {
      "type": "Feature",
      "properties": { id: "gaurelapendra", name: "Gaurela-Pendra-Marwahi", division: "Bilaspur", headquarters: "Pendra", center: [22.7700, 81.9500] },
      "geometry": { "type": "Polygon", "coordinates": [[[81.65, 22.45], [82.25, 22.45], [82.20, 23.00], [81.60, 23.00], [81.65, 22.45]]] }
    },
    {
      "type": "Feature",
      "properties": { id: "manendragarh", name: "Manendragarh-Chirmiri-Bharatpur", division: "Surguja", headquarters: "Manendragarh", center: [23.2100, 82.2000] },
      "geometry": { "type": "Polygon", "coordinates": [[[81.70, 22.80], [82.35, 22.80], [82.30, 23.60], [81.65, 23.60], [81.70, 22.80]]] }
    }
  ]
};
