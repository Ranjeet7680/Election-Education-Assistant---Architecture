import os
import csv
import json
from collections import defaultdict

data_dir = r"C:\Users\Victus\Downloads\Project hackthon\archive (1)\election_dataset"
output_file = r"C:\Users\Victus\Downloads\Project hackthon\src\data\election_data.json"

party_votes = defaultdict(int)
party_seats = defaultdict(int)
total_votes = 0

for filename in os.listdir(data_dir):
    if filename.endswith(".csv"):
        filepath = os.path.join(data_dir, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    party = row.get("party", "").strip()
                    status = row.get("status", "").strip().lower()
                    votes_str = row.get("votes", "0").strip()
                    
                    if not party or party == "NOTA":
                        continue
                        
                    # Handle possible comma or float in votes
                    try:
                        votes = int(float(votes_str.replace(",", "")))
                    except ValueError:
                        votes = 0
                        
                    party_votes[party] += votes
                    total_votes += votes
                    
                    if status == "won":
                        party_seats[party] += 1
        except Exception as e:
            print(f"Error reading {filename}: {e}")

# Keep top 10 parties by seats, combine others
sorted_parties = sorted(party_seats.keys(), key=lambda x: party_seats[x], reverse=True)
top_parties = sorted_parties[:10]

final_data = {
    "totalVotes": total_votes,
    "totalSeats": sum(party_seats.values()),
    "parties": []
}

for party in top_parties:
    final_data["parties"].append({
        "name": party,
        "votes": party_votes[party],
        "seats": party_seats[party]
    })

# "Others" category
other_votes = sum(party_votes[p] for p in party_votes if p not in top_parties)
other_seats = sum(party_seats[p] for p in party_seats if p not in top_parties)

if other_votes > 0 or other_seats > 0:
    final_data["parties"].append({
        "name": "Others",
        "votes": other_votes,
        "seats": other_seats
    })

os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(final_data, f, indent=2)

print(f"Data successfully generated at {output_file}")
