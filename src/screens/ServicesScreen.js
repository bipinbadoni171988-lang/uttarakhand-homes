import { useEffect, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function ServicesScreen() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setServices(data);

      if (data.length === 0) {
        import('../constants/mockData').then((m) => setServices(m.MOCK_SERVICES));
      }
    });

    return unsubscribe;
  }, []);

  return null;
}
