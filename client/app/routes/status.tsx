import React from 'react';
import { Link, useParams } from "react-router";

export default function Status() {
  let params = useParams();

  return (
    <div>
      <h1>Username: {params.username}</h1>
      <h1>Status ID: {params.statusId}</h1>
    </div>
  );
}
