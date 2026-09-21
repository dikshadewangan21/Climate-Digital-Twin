from pathlib import Path
from datetime import date, timedelta
import sys
import time

import pandas as pd
import requests

sys.path.append(str(Path(__file__).resolve().parents[1]))

from data_locations import DISTRICTS
from weather_service import historical_weather


YEARS = 10
OUTPUT = Path("datasets/historical_chhattisgarh.csv")


def download_with_retry(lat, lon, start, end, district_name, max_retries=8):
    for attempt in range(max_retries):
        try:
            return historical_weather(lat, lon, start, end)

        except requests.HTTPError as e:
            status = e.response.status_code if e.response is not None else None

            if status == 429:
                wait_time = 60 * (attempt + 1)
                print(
                    f"  Rate limited: {district_name}. "
                    f"Waiting {wait_time}s before retry "
                    f"{attempt + 1}/{max_retries}..."
                )
                time.sleep(wait_time)
            else:
                raise

        except requests.RequestException as e:
            wait_time = 20 * (attempt + 1)
            print(
                f"  Network error: {district_name}: {e}. "
                f"Waiting {wait_time}s before retry..."
            )
            time.sleep(wait_time)

    raise RuntimeError(
        f"Failed to download {district_name} "
        f"for {start} to {end} after {max_retries} retries."
    )


def add_years(d, years):
    try:
        return d.replace(year=d.year + years)
    except ValueError:
        return d.replace(month=2, day=28, year=d.year + years)


def main():
    years = YEARS

    if "--years" in sys.argv:
        idx = sys.argv.index("--years")
        years = int(sys.argv[idx + 1])

    end = date.today() - timedelta(days=6)
    start = add_years(end, -years)

    all_frames = []

    for district_index, district in enumerate(DISTRICTS, start=1):

        print()
        print("=" * 60)
        print(
            f"[{district_index}/{len(DISTRICTS)}] "
            f"{district['name']}"
        )
        print("=" * 60)

        district_frames = []

        current = start

        while current <= end:

            chunk_end = min(
                add_years(current, 1) - timedelta(days=1),
                end
            )

            print(
                f"  Downloading "
                f"{current} → {chunk_end}"
            )

            payload = download_with_retry(
                district["lat"],
                district["lon"],
                current,
                chunk_end,
                district["name"],
            )

            daily = payload.get("daily", {})

            frame = pd.DataFrame(daily)

            frame["district_id"] = district["id"]
            frame["district_name"] = district["name"]
            frame["latitude"] = district["lat"]
            frame["longitude"] = district["lon"]

            district_frames.append(frame)

            current = chunk_end + timedelta(days=1)

            # Small pause between yearly requests.
            time.sleep(5)

        district_data = pd.concat(
            district_frames,
            ignore_index=True
        )

        all_frames.append(district_data)

        print(
            f"  Completed {district['name']}: "
            f"{len(district_data):,} rows"
        )

        # Pause between districts.
        time.sleep(10)

    result = pd.concat(
        all_frames,
        ignore_index=True
    )

    OUTPUT.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    result.to_csv(
        OUTPUT,
        index=False
    )

    print()
    print("=" * 60)
    print("HISTORICAL DATASET CREATED SUCCESSFULLY")
    print("=" * 60)
    print(f"Rows: {len(result):,}")
    print(
        f"Districts: "
        f"{result['district_id'].nunique()}"
    )
    print(
        f"Date range: "
        f"{result['time'].min()} "
        f"to "
        f"{result['time'].max()}"
    )
    print(f"Output: {OUTPUT}")
    print("=" * 60)


if __name__ == "__main__":
    main()