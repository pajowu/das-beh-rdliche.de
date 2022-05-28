from audioop import add
import csv
import json
import argparse
from collections import defaultdict

parser = argparse.ArgumentParser()
parser.add_argument("input", type=argparse.FileType("r"))
parser.add_argument("output_objects", type=argparse.FileType("w"))
parser.add_argument("output_addresses", type=argparse.FileType("w"))
args = parser.parse_args()

reader = csv.DictReader(args.input, delimiter="\t")

# data = {str(i): {**x, "our_id": str(i)} for i, x in enumerate(reader)}
last_object = None
objects = []
for object in reader:
    if last_object is None:
        last_object = object
        continue

    elif object["id"].strip():
        objects.append(last_object)
        last_object = object

    else:
        last_object["user"] += (
            "" + (f'{object["street"]} {object["area"]} {object["user"]}').strip()
        )
        assert not object["postcode"]
        assert not object["city"]
        assert not object["size"]
        assert not object["id"]

    # address = "{street} {postcode} {city}".format(**object)
    # if object["id"] not in objects:
    #     objects[object["id"]] = {"address": address, "users": []}
    # obj_addr = objects[object["id"]]["address"]
    # this_addr = "{street} {postcode} {city}".format(**object)
    # assert obj_addr == this_addr, f"{obj_addr=} {this_addr=} {object=}"
    # objects[object["id"]]["users"].append(object)

if last_object is not None:
    objects.append(last_object)
    last_object = None

addresses = defaultdict(list)
small_objects = {}
for object in objects:
    address = "{street} {postcode} {city}".format(**object)

    assert (
        object["id"] not in addresses[address]
    ), f"{object['id']=}, {addresses[address]}"
    addresses[address].append(object["id"])
    del object["street"]
    del object["postcode"]
    del object["city"]
    id = object["id"]
    del object["id"]
    small_objects[id] = object

print("Converted", len(objects), "objects")
json.dump(small_objects, args.output_objects)
print("Converted", len(addresses), "addresses")
json.dump(addresses, args.output_addresses)
