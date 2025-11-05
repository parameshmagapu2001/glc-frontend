import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  InputBase,
  Modal,
  Button,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';


interface LatLng {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: '100%',
  height: '90%',
};

interface GoogleLocationViewerProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialLatitude?: string;
  initialLongitude?: string;
}

const GoogleLocationViewer: React.FC<GoogleLocationViewerProps> = ({
  onLocationChange,
  initialLatitude,
  initialLongitude,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
  const [tempMarkerPosition, setTempMarkerPosition] = useState<LatLng | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD2s1d-NbTMPxsKDems87TGyTLaJu3223g',
    libraries: ['places'],
  });

  useEffect(() => {
    if (initialLatitude && initialLongitude) {
      const lat = parseFloat(initialLatitude);
      const lng = parseFloat(initialLongitude);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        setMarkerPosition({ lat, lng });
        setTempMarkerPosition({ lat, lng });
      }
    }
  }, [initialLatitude, initialLongitude]);

  useEffect(() => {
    if (isLoaded && open) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, [isLoaded, open]);

  const handleZoomChange = () => {
    if (map) {
      const zoom = map.getZoom();
      if (zoom !== undefined) {
        map.setZoom(Math.min(zoom, 15));
      }
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim() || !geocoder || !map) return;

    setIsSearching(true);
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      setIsSearching(false);
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const bounds = results[0].geometry.viewport;
        const newPosition = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setTempMarkerPosition(newPosition);

        map.setCenter(newPosition);
        map.setZoom(17);

        setTimeout(() => {
          if (map) {
            map.fitBounds(bounds);
            const currentZoom = map.getZoom();
            if (currentZoom !== undefined) {
              map.setZoom(Math.min(currentZoom, 15)); // Prevent zooming out too much
            }
          }
        }, 500);
      } else {
        enqueueSnackbar('Location not found. Please try a different search term.', {
          variant: 'error',
        });
        console.error('Geocode was not successful:', status);
      }
    });
  };

  const handleOpen = () => {
    setTempMarkerPosition(markerPosition ?? { lat: 17.483585, lng: 78.380505 });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery('');
  };

  const handleSave = () => {
    if (tempMarkerPosition) {
      const roundedPosition = {
        lat: parseFloat(tempMarkerPosition.lat.toFixed(7)),
        lng: parseFloat(tempMarkerPosition.lng.toFixed(7)),
      };
      setMarkerPosition(roundedPosition);
      onLocationChange(roundedPosition.lat, roundedPosition.lng);
      enqueueSnackbar('Location saved successfully', { variant: 'success' });
    }
    setOpen(false);
    setSearchQuery('');
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setTempMarkerPosition({ lat, lng });
      if (map) {
        map.panTo({ lat, lng });
      }
    }
  };

  const onMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    if (tempMarkerPosition) {
      mapInstance.setCenter(tempMarkerPosition);
      mapInstance.setZoom(15);
    }
    if (mapInstance) {
      mapInstance.addListener('zoom_changed', handleZoomChange);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Google Location of Land
      </Typography>

      <InputBase
        onClick={handleOpen}
        value={
          markerPosition
            ? `${markerPosition.lat.toFixed(7)}, ${markerPosition.lng.toFixed(7)}`
            : 'Add Google Location'
        }
        readOnly
        startAdornment={
          <InputAdornment position="start" sx={{ height: '100%', mr: 1 }}>
            <Image
              src="/assets/images/mapIcon.svg"
              alt="map-icon"
              width={20}
              height={20}
              style={{ display: 'flex' }}
            />
          </InputAdornment>
        }
        sx={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          px: 1.5,
          py: 1,
          fontSize: '16px',
          fontFamily: 'poppins',
          alignItems: 'baseline',
          width: '270px',
          cursor: 'pointer',
          '& input': {
            cursor: 'pointer',
          },
          color: '#1D7ABE',
          fontWeight: markerPosition ? 600 : 400,
        }}
      />

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90vw', md: '80vw' }, // Responsive: mobile and desktop
    height: { xs: '80vh', md: '80vh' }, // 80% viewport height
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
          }}
        >
          {isLoaded ? (
            <>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={tempMarkerPosition ?? { lat: 17.483585, lng: 78.380505 }}
                  zoom={15}
                  onClick={handleMapClick}
                  onLoad={onMapLoad}
                  options={{
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                      position: window.google.maps.ControlPosition.TOP_RIGHT,
                      style: window.google.maps.MapTypeControlStyle.DEFAULT,
                    },
                  }}
                >
                  {/* Search input INSIDE the map */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      zIndex: 10,
                      width: '320px',
                    }}
                  >
                    <TextField
                      fullWidth
                      placeholder="Search for a location"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isSearching}
                      InputProps={{
                        sx: {
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: '#fff',
                          boxShadow: 2,
                          px: 2,
                          '& input': {
                            fontSize: '16px',
                          },
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <Iconify
                              onClick={handleSearch}
                              icon="eva:search-fill"
                              sx={{ fontSize: "24px", cursor: "pointer", color: 'text.secondary' }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                {tempMarkerPosition && (
                  <Marker
                    position={tempMarkerPosition}
                    animation={window.google?.maps?.Animation?.DROP}
                  />
                )}
              </GoogleMap>

              <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={!tempMarkerPosition}>
                  Save
                </Button>
              </Stack>
            </>
          ) : (
            <Typography>Loading Map...</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default GoogleLocationViewer;
