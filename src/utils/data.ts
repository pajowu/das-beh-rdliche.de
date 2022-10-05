import _object_list from "../data/objects.json";

export type ObjectData = {
  area: string;
  user: string;
  size: number;
};

export const objects: Record<string, ObjectData[]> = _object_list;

type SearchOption = { name: string; value: string };

export const searchableLocations: SearchOption[] = Object.entries(objects).map(
  ([key, value]) => {
    return { name: key, value: key };
  }
);

export function get_objects(address: string): ObjectData[] | null {
  if (objects.hasOwnProperty(address)) {
    return objects[address];
  }
  return null;
}
