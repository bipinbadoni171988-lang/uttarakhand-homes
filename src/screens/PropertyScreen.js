import { useEffect, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export default function PropertyScreen() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProperties(data);

      if (data.length === 0) {
        import('../constants/mockData').then((m) => setProperties(m.MOCK_PROPERTIES));
      }
    });

    return unsubscribe;
  }, []);

  return null;
}
