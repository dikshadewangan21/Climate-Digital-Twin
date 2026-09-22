# Representative coordinates for district-level weather queries.
# These are district-HQ/representative points, not every village or station.
DISTRICTS = [
    {"id":"balod","name":"Balod","lat":20.73,"lon":81.20},
    {"id":"baloda-bazar","name":"Baloda Bazar-Bhatapara","lat":21.66,"lon":82.16},
    {"id":"balrampur","name":"Balrampur-Ramanujganj","lat":23.80,"lon":83.70},
    {"id":"bastar","name":"Bastar","lat":19.06,"lon":82.02},
    {"id":"bemetara","name":"Bemetara","lat":21.72,"lon":81.53},
    {"id":"bijapur","name":"Bijapur","lat":18.85,"lon":80.83},
    {"id":"bilaspur","name":"Bilaspur","lat":22.08,"lon":82.15},
    {"id":"dantewada","name":"Dantewada","lat":18.90,"lon":81.35},
    {"id":"dhamtari","name":"Dhamtari","lat":20.71,"lon":81.55},
    {"id":"durg","name":"Durg","lat":21.19,"lon":81.28},
    {"id":"gariaband","name":"Gariaband","lat":20.63,"lon":82.06},
    {"id":"gaurela-pendra-marwahi","name":"Gaurela-Pendra-Marwahi","lat":22.75,"lon":81.90},
    {"id":"janjgir-champa","name":"Janjgir-Champa","lat":22.01,"lon":82.58},
    {"id":"jashpur","name":"Jashpur","lat":22.89,"lon":84.14},
    {"id":"kanker","name":"Kanker","lat":20.27,"lon":81.49},
    {"id":"khairagarh-chhuikhadan-gandai","name":"Khairagarh-Chhuikhadan-Gandai","lat":21.42,"lon":80.98},
    {"id":"kondagaon","name":"Kondagaon","lat":19.59,"lon":81.67},
    {"id":"korba","name":"Korba","lat":22.35,"lon":82.68},
    {"id":"korea","name":"Korea","lat":23.25,"lon":82.55},
    {"id":"kabirdham","name":"Kabirdham","lat":22.01,"lon":81.22},
    {"id":"mahasamund","name":"Mahasamund","lat":21.10,"lon":82.10},
    {"id":"manendragarh-chirmiri-bharatpur","name":"Manendragarh-Chirmiri-Bharatpur","lat":23.20,"lon":82.35},
    {"id":"mohla-manpur-ambagarh-chowki","name":"Mohla-Manpur-Ambagarh Chowki","lat":20.45,"lon":80.85},
    {"id":"mungeli","name":"Mungeli","lat":22.07,"lon":81.69},
    {"id":"narayanpur","name":"Narayanpur","lat":19.72,"lon":81.25},
    {"id":"raigarh","name":"Raigarh","lat":21.90,"lon":83.40},
    {"id":"raipur","name":"Raipur","lat":21.25,"lon":81.63},
    {"id":"rajnandgaon","name":"Rajnandgaon","lat":21.10,"lon":81.03},
    {"id":"sakti","name":"Sakti","lat":22.03,"lon":82.96},
    {"id":"sarangarh-bilaigarh","name":"Sarangarh-Bilaigarh","lat":21.59,"lon":83.08},
    {"id":"sukma","name":"Sukma","lat":18.39,"lon":81.66},
    {"id":"surajpur","name":"Surajpur","lat":23.21,"lon":82.86},
    {"id":"surguja","name":"Surguja","lat":23.12,"lon":83.20},
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
