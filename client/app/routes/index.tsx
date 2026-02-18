import React from 'react';
import { Link } from "react-router";

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
        <ul>
      
          <li><Link to="/account">account</Link></li>
          <li><Link to="/login" >login</Link></li>
          <li><Link to="/sign-up" >item</Link></li>
          <li><Link to="/jacker" >jacker</Link></li>
          <li><Link to="/jacker/status/1" >status 1</Link></li>
          <li><Link to="/jacker/liked" >liked</Link></li>
          <li><Link to="/sign-up" >item</Link></li>
        </ul>
    </div>
  );
}
