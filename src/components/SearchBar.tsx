import React from 'react';
import { searchableLocations } from '../utils/data';
import SelectSearch, { SelectSearchOption } from 'react-select-search';
import _ from 'lodash';
import './SearchBar.css';
import { useNavigate } from 'react-router';
import Fuse from 'fuse.js';


export function SearchBar(): JSX.Element {

  const navigate = useNavigate();

  function fuzzySearch(options: SelectSearchOption[]) {
    const fuse = new Fuse(searchableLocations, {
      keys: ['name'],
      // threshold: 0.3,
      ignoreLocation: true,
    });

    return (value: string) => {
      if (!value.length) {
        console.log('no value', value);
        return options.slice(0, 10);
      }
      const res = fuse.search(value, { limit: 10 });
      return res.map((x) => x.item);
    };
  }

  const debouncedSearch = _.throttle(fuzzySearch, 500)

  return (
    <>
      <SelectSearch
        search={true}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filterOptions={debouncedSearch}
        options={searchableLocations.slice(0, 10)}
        placeholder="Standort suchen"
        onChange={(value) => { console.log("going to", JSON.stringify(value)); navigate(`/details/${encodeURIComponent(value as unknown as string)}`) }}
      />
    </>
  );
}
