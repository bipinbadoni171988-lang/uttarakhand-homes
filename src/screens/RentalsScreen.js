import { useEffect, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function RentalsScreen() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'rentals'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRentals(data);

      if (data.length === 0) {
        import('../constants/mockData').then((m) => setRentals(m.MOCK_RENTALS));
      }
    });

    return unsubscribe;
  }, []);

  return null;
}
