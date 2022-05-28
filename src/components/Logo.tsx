import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo(): JSX.Element {
  return (
    <>
      <Link style={{ color: '#024f99', textDecoration: 'none' }} to="/">
        <h1>Das Behördliche</h1>
      </Link>
    </>
  );
}
