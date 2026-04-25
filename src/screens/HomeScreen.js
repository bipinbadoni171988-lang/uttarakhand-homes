import { useEffect, useState } from 'react';
import { getDocs, collection, query, limit } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { MOCK_PROPERTIES, MOCK_RENTALS, MOCK_SERVICES } from '../constants/mockData';

export default function HomeScreen() {
  const [trendingProperties, setTrendingProperties] = useState([]);
  const [trendingRentals, setTrendingRentals] = useState([]);
  const [trendingServices, setTrendingServices] = useState([]);

  useEffect(() => {
    const loadTrending = async () => {
      const [propertySnap, rentalSnap, serviceSnap] = await Promise.all([
        getDocs(query(collection(db, 'properties'), limit(4))),
        getDocs(query(collection(db, 'rentals'), limit(4))),
        getDocs(query(collection(db, 'services'), limit(4)))
      ]);

      const propertyData = propertySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const rentalData = rentalSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const serviceData = serviceSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setTrendingProperties(propertyData.length ? propertyData : MOCK_PROPERTIES.slice(0, 4));
      setTrendingRentals(rentalData.length ? rentalData : MOCK_RENTALS.slice(0, 4));
      setTrendingServices(serviceData.length ? serviceData : MOCK_SERVICES.slice(0, 4));
    };

    loadTrending();
  }, []);

  return null;
}
