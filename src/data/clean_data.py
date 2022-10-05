import csv
import argparse
import pandas as pd
import locale

parser = argparse.ArgumentParser()
parser.add_argument("input", type=argparse.FileType("r"))
parser.add_argument("output_objects", type=argparse.FileType("w"))
args = parser.parse_args()

reader = csv.DictReader(args.input, delimiter="\t")

print("Loading data")

last_object = None
objects = []
for object in reader:
    if object["user"] == 0:
        object["user"] = ""

    # At the start we do not have a last object, so we choose the first item and then continue with the second item
    if last_object is None:
        last_object = object
        continue

    # If the object does not have an address, we assume it has the same address as the previous one
    elif (
        not object["postcode"].strip()
        and not object["city"].strip()
        and not object["street"].strip()
    ):
        objects.append(last_object)
        last_object = {
            **last_object,
            "area": object["area"],
            "user": object["user"],
            "size": object["size"],
        }

    # If the object has an address, we assume the previous object is complete and store it, then we continue with this object
    elif object["id"].strip():
        objects.append(last_object)
        last_object = object

if last_object is not None:
    objects.append(last_object)
    last_object = None

print("Aggregating data")

locale.setlocale(locale.LC_NUMERIC, "de_DE.UTF-8")

df = pd.DataFrame(objects)
df["address"] = df["street"] + ", " + df["postcode"] + " " + df["city"]
df["size"] = df["size"].apply(locale.atof)
df.loc[df.user == "0", "user"] = ""

agg_df = df.groupby(["address", "user", "area"]).agg({"size": "sum"}).reset_index()
agg_df["data"] = agg_df.apply(
    lambda x: {"user": x["user"], "area": x["area"], "size": x["size"]}, axis=1
)
agg_df = agg_df.groupby("address").agg({"data": list})
print(agg_df)
args.output_objects.write(agg_df.data.to_json())
