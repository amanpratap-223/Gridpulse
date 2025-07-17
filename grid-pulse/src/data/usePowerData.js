import { useState, useEffect } from "react";
import axios from "axios";

export const usePowerData = () => {
  const [powerData, setPowerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/power/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` // ✅ auth token
          }
        });
        setPowerData(res.data);
      } catch (error) {
        console.error("Error fetching power data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { powerData, loading };
};
