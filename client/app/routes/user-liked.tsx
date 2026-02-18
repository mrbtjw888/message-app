import React from 'react';
import { Link, useParams } from "react-router";

export default function UserLiked() {
  let params = useParams()


  return (
    <div>
      <h1>{params.username} liked Page</h1>
    </div>
  );
}
