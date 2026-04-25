import { useState } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [coords, setCoords] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [loading, setLoading] = useState(false);

  const requestLocation = async () => {
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        setPermissionStatus('granted');
      } else {
        setPermissionStatus('denied');
      }
    } finally {
      setLoading(false);
    }
  };

  return { coords, permissionStatus, loading, requestLocation };
};
