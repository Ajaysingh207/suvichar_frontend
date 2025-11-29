import React, { useEffect, useState } from "react";
import Appbar from "./Appbar";
import Cards from "./Cards";
import { fetchUsers } from "../../Servieces/Service";

export default function AdminDashboard() {
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetchUsers();
  console.log("ressssssssssssssssssssssssssssssssss",res.user);
  
   setData(res.user)

      console.log("API RESPONSE:", res);
    }
    fetchData();
  }, []);

  return (
    <>
      <div>
        <div className="appbar">
          <Appbar />
        </div>

         <div className="cards flex gap-2 justify-evenly ">
          {data.map((user, index) => (
            <Cards
            
              key={index}
              name={user.name}
              userName={user.userName}
              image={user.image}
            />
          ))}
        </div> 
      </div>
    </>
  );
}
