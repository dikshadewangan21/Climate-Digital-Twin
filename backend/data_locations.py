# Representative coordinates for district-level weather queries.
# These are district-HQ/representative points, not every village or station.
DISTRICTS = [
    {"id":"balod","name":"Balod","lat":20.73,"lon":81.20,"baseTemp":32.10,"baseRain":3.25},
    {"id":"baloda-bazar","name":"Baloda Bazar-Bhatapara","lat":21.66,"lon":82.16,"baseTemp":32.49,"baseRain":3.19},
    {"id":"balrampur","name":"Balrampur-Ramanujganj","lat":23.80,"lon":83.70,"baseTemp":31.65,"baseRain":5.51},
    {"id":"bastar","name":"Bastar","lat":19.06,"lon":82.02,"baseTemp":32.36,"baseRain":5.13},
    {"id":"bemetara","name":"Bemetara","lat":21.72,"lon":81.53,"baseTemp":32.49,"baseRain":2.62},
    {"id":"bijapur","name":"Bijapur","lat":18.85,"lon":80.83,"baseTemp":32.47,"baseRain":5.03},
    {"id":"bilaspur","name":"Bilaspur","lat":22.08,"lon":82.15,"baseTemp":32.01,"baseRain":3.69},
    {"id":"dantewada","name":"Dantewada","lat":18.90,"lon":81.35,"baseTemp":32.36,"baseRain":4.83},
    {"id":"dhamtari","name":"Dhamtari","lat":20.71,"lon":81.55,"baseTemp":32.02,"baseRain":3.46},
    {"id":"durg","name":"Durg","lat":21.19,"lon":81.28,"baseTemp":32.02,"baseRain":3.33},
    {"id":"gariaband","name":"Gariaband","lat":20.63,"lon":82.06,"baseTemp":32.02,"baseRain":3.51},
    {"id":"gaurela-pendra-marwahi","name":"Gaurela-Pendra-Marwahi","lat":22.75,"lon":81.90,"baseTemp":31.40,"baseRain":4.10},
    {"id":"janjgir-champa","name":"Janjgir-Champa","lat":22.01,"lon":82.58,"baseTemp":32.66,"baseRain":3.78},
    {"id":"jashpur","name":"Jashpur","lat":22.89,"lon":84.14,"baseTemp":31.74,"baseRain":4.31},
    {"id":"kanker","name":"Kanker","lat":20.27,"lon":81.49,"baseTemp":32.02,"baseRain":3.46},
    {"id":"khairagarh-chhuikhadan-gandai","name":"Khairagarh-Chhuikhadan-Gandai","lat":21.42,"lon":80.98,"baseTemp":32.60,"baseRain":3.15},
    {"id":"kondagaon","name":"Kondagaon","lat":19.59,"lon":81.67,"baseTemp":32.36,"baseRain":3.68},
    {"id":"korba","name":"Korba","lat":22.35,"lon":82.68,"baseTemp":31.93,"baseRain":3.08},
    {"id":"korea","name":"Korea","lat":23.25,"lon":82.55,"baseTemp":31.77,"baseRain":3.71},
    {"id":"kabirdham","name":"Kabirdham","lat":22.01,"lon":81.22,"baseTemp":32.01,"baseRain":3.35},
    {"id":"mahasamund","name":"Mahasamund","lat":21.10,"lon":82.10,"baseTemp":32.02,"baseRain":3.51},
    {"id":"manendragarh-chirmiri-bharatpur","name":"Manendragarh-Chirmiri-Bharatpur","lat":23.20,"lon":82.35,"baseTemp":31.55,"baseRain":3.85},
    {"id":"mohla-manpur-ambagarh-chowki","name":"Mohla-Manpur-Ambagarh Chowki","lat":20.45,"lon":80.85,"baseTemp":32.30,"baseRain":3.95},
    {"id":"mungeli","name":"Mungeli","lat":22.07,"lon":81.69,"baseTemp":32.01,"baseRain":3.35},
    {"id":"narayanpur","name":"Narayanpur","lat":19.72,"lon":81.25,"baseTemp":32.36,"baseRain":3.68},
    {"id":"raigarh","name":"Raigarh","lat":21.90,"lon":83.40,"baseTemp":31.74,"baseRain":4.12},
    {"id":"raipur","name":"Raipur","lat":21.25,"lon":81.63,"baseTemp":32.49,"baseRain":2.62},
    {"id":"rajnandgaon","name":"Rajnandgaon","lat":21.10,"lon":81.03,"baseTemp":32.86,"baseRain":3.47},
    {"id":"sakti","name":"Sakti","lat":22.03,"lon":82.96,"baseTemp":32.50,"baseRain":3.65},
    {"id":"sarangarh-bilaigarh","name":"Sarangarh-Bilaigarh","lat":21.59,"lon":83.08,"baseTemp":32.20,"baseRain":3.80},
    {"id":"sukma","name":"Sukma","lat":18.39,"lon":81.66,"baseTemp":31.78,"baseRain":5.44},
    {"id":"surajpur","name":"Surajpur","lat":23.21,"lon":82.86,"baseTemp":31.77,"baseRain":3.04},
    {"id":"surguja","name":"Surguja","lat":23.12,"lon":83.20,"baseTemp":31.77,"baseRain":3.04},
]
BY_ID = {d["id"]: d for d in DISTRICTS}

# Common spelling / abbreviation aliases from frontend
DISTRICT_ALIASES = {
    "balodabazar": "baloda-bazar",
    "gpm": "gaurela-pendra-marwahi",
    "janjgirchampa": "janjgir-champa",
    "kcg": "khairagarh-chhuikhadan-gandai",
    "koriya": "korea",
    "mcb": "manendragarh-chirmiri-bharatpur",
    "mma": "mohla-manpur-ambagarh-chowki",
    "sarangarh": "sarangarh-bilaigarh",
    "bilaigarh": "sarangarh-bilaigarh",
    "chirmiri": "manendragarh-chirmiri-bharatpur",
    "bharatpur": "manendragarh-chirmiri-bharatpur",
    "ambikapur": "surguja",
    "jagdalpur": "bastar",
    "kawardha": "kabirdham",
}

for alias, target in DISTRICT_ALIASES.items():
    if target in BY_ID:
        BY_ID[alias] = BY_ID[target]

def get_district_by_id(district_id: str | None) -> dict:
    if not district_id:
        return BY_ID["raipur"]
    d_clean = district_id.strip().lower()
    if d_clean in BY_ID:
        return BY_ID[d_clean]
    norm = "".join(c for c in d_clean if c.isalnum())
    if norm in BY_ID:
        return BY_ID[norm]
    for key, d in list(BY_ID.items()):
        if "".join(c for c in key if c.isalnum()) == norm:
            return d
    for d in DISTRICTS:
        if norm in "".join(c for c in d["name"].lower() if c.isalnum()):
            return d
    return BY_ID.get("raipur", DISTRICTS[0])
