import React from 'react';
import { Link, useParams } from "react-router";


export default function User() {
  let params = useParams();
  
  return (
    <div>
      <h1>User: {params.username}</h1>
    </div>
  );
}
