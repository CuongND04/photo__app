import { useEffect } from "react";
import { useState } from "react";
import fetchModel from "../../lib/fetchModelData";
import { useAuth } from "../../contexts/AuthContext";

function HomePage() {
  const { setPage } = useAuth();
  const [data, setData] = useState({});
  useEffect(() => {
    const getData = async () => {
      const data = await fetchModel(`/api/admin/check-auth`);
      setData(data);
    };
    getData();
    setPage("Home");
  }, []);
  return (
    <div>
      <h1>
        Welcome <strong>{data.first_name}</strong> to the Photo App!
      </h1>
    </div>
  );
}

export default HomePage;
