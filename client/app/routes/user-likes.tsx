import React from 'react';
import { Link, useParams } from "react-router";

export default function UserLikes() {
  let params = useParams()


  return (
    <div>
      <h1>{params.username} likes Page</h1>
    </div>
  );
}
