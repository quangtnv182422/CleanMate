import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { Helmet } from 'react-helmet';
import { BookingContext } from '../../context/BookingProvider';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const GoogleMapAutocomplete = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const infoWindowRef = useRef(null);
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const {
        userAddress,
        selectedPlace,
        setSelectedPlace,
        houseType,
        houseNumber,
        setHouseType,
        setHouseNumber,
        refetchUserAddress,
    } = useContext(BookingContext);

    const { user, loading } = useAuth();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const queryParams = new URLSearchParams(location.search);

    const serviceId = queryParams.get('service');


    const handleSubmitAddress = async () => {
        if (!selectedPlace || !houseNumber || !user) return;

        try {
            const addressCount = userAddress.length;

            const isDefault = addressCount === 0;

            const response = await axios.post(
                `/address/add-address`,
                {
                    userId: user.id,
                    gg_DispalyName: selectedPlace.displayName,
                    gg_FormattedAddress: selectedPlace.formattedAddress,
                    gg_PlaceId: selectedPlace.id,
                    addressNo: houseNumber,
                    latitude: selectedPlace.location.lat,
                    longitude: selectedPlace.location.lng,
                    isInUse: true,
                    isDefault: isDefault
                },
                { withCredentials: true }
            );


            toast.success("Địa chỉ đã được thêm");
            await refetchUserAddress();
            if (mapRef.current) {
                if (selectedPlace.viewport) {
                    mapRef.current.fitBounds(selectedPlace.viewport);
                } else {
                    mapRef.current.setCenter(selectedPlace.location);
                    mapRef.current.setZoom(17);
                }

                // Update or create marker
                if (markerRef.current) {
                    markerRef.current.setMap(null);
                }
                markerRef.current = new google.maps.marker.AdvancedMarkerElement({
                    map: mapRef.current,
                    position: selectedPlace.location,
                    title: selectedPlace.displayName,
                });

                // Update or create infoWindow
                if (infoWindowRef.current) {
                    infoWindowRef.current.close();
                }
                infoWindowRef.current = new google.maps.InfoWindow({
                    content: `<div><strong>${selectedPlace.displayName}</strong><br>${selectedPlace.formattedAddress}</div>`,
                    position: selectedPlace.location,
                });
                infoWindowRef.current.open({ map: mapRef.current, anchor: markerRef.current });
            }

            setHouseNumber('house')
            setHouseNumber('')
            handleClose();
            setTimeout(() => {
                navigate(`/booking-service?service=${serviceId}`);
            }, 100);

        } catch (error) {
            toast.error("Lỗi khi thêm địa chỉ:", error);
        }
    };

    useEffect(() => {
        if (window._googleMapAutocompleteInitialized) return;
        window._googleMapAutocompleteInitialized = true;

        let placeAutocomplete;
        let card;
        let placeAutocompleteListener;

        const loader = new Loader({
            apiKey: apiKey,
            version: "weekly",
            libraries: ["places"],
        });

        loader.load().then(async () => {
            const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
                google.maps.importLibrary("maps"),
                google.maps.importLibrary("marker"),
            ]);

            await google.maps.importLibrary("places");

            const center = { lat: 21.0278, lng: 105.8342 };

            mapRef.current = new Map(document.getElementById("map"), {
                center,
                zoom: 13,
                mapId: "4504f8b37365c3d0",
                mapTypeControl: false,
            });

            placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({
                locationBias: center,
                includedRegionCodes: ["vn"],
            });

            placeAutocomplete.id = "place-autocomplete-input";

            card = document.getElementById("place-autocomplete-card");
            if (!document.getElementById("place-autocomplete-input")) {
                card.appendChild(placeAutocomplete);
                mapRef.current.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
            }

            placeAutocompleteListener = placeAutocomplete.addEventListener(
                "gmp-select",
                async ({ placePrediction }) => {
                    const place = placePrediction.toPlace();
                    await place.fetchFields({
                        fields: ["displayName", "formattedAddress", "location", "viewport"],
                    });

                    if (place.viewport) {
                        mapRef.current.fitBounds(place.viewport);
                    } else {
                        mapRef.current.setCenter(place.location);
                        mapRef.current.setZoom(17);
                    }

                    // Update marker
                    if (markerRef.current) {
                        markerRef.current.setMap(null);
                    }
                    markerRef.current = new google.maps.marker.AdvancedMarkerElement({
                        map: mapRef.current,
                        position: place.location,
                        title: place.displayName,
                    });

                    // Update infoWindow
                    if (infoWindowRef.current) {
                        infoWindowRef.current.close();
                    }
                    infoWindowRef.current = new google.maps.InfoWindow({
                        content: `<div><strong>${place.displayName}</strong><br>${place.formattedAddress}</div>`,
                        position: place.location,
                    });
                    infoWindowRef.current.open({ map: mapRef.current, anchor: markerRef.current });

                    const placeData = {
                        id: place.id,
                        displayName: place.displayName,
                        formattedAddress: place.formattedAddress,
                        location: {
                            lat: place.location.lat(),
                            lng: place.location.lng(),
                        },
                        viewport: place.viewport,
                    };
                    setSelectedPlace(placeData);
                }
            );
        });

        return () => {
            if (placeAutocompleteListener) {
                google.maps.event.removeListener(placeAutocompleteListener);
            }
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }
            if (mapRef.current && card) {
                const controls = mapRef.current.controls[google.maps.ControlPosition.TOP_LEFT];
                for (let i = 0; i < controls.getLength(); i++) {
                    if (controls.getAt(i) === card) {
                        controls.removeAt(i);
                        break;
                    }
                }
            }
            window._googleMapAutocompleteInitialized = false;
        };
    }, [apiKey, setSelectedPlace]);


    return (
        <>
            <Helmet>
                <title>Google Maps + Place Autocomplete</title>
            </Helmet>

            <div id="map" style={{ height: "60vh", width: "100%" }}></div>

            <div id="place-autocomplete-card" style={style.autocompleteCard}></div>

            <div style={style.selectAddressButton}>
                <Button
                    variant="outlined"
                    onClick={() => navigate(`/booking-service?service=${serviceId}`)}
                    sx={{ mr: 1 }}
                >
                    Quay lại
                </Button>
                <Button
                    variant={selectedPlace ? 'contained' : 'disabled'}
                    onClick={handleOpen}
                    sx={style.selectButtonMain}
                >
                    Chọn loại nhà và số nhà
                </Button>
            </div>

            <Modal open={open} onClose={handleClose} disableAutoFocus>
                <Box sx={style.modal}>
                    <Typography variant="h5" textAlign="center" mb={2}>Vui lòng chọn địa điểm</Typography>

                    <Box sx={style.houseType}>
                        <HomeOutlinedIcon />
                        <Typography>Loại nhà</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1, mb: 2 }}>
                        <Button
                            variant='outlined'
                            onClick={() => setHouseType('house')}
                            sx={style.selectButton}
                        >
                            <Typography sx={houseType === 'house' ? { color: '#1565C0' } : {}}>
                                Nhà / nhà phố
                            </Typography>
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={() => setHouseType('apartment')}
                            sx={style.selectButton}
                        >
                            <Typography sx={houseType === 'apartment' ? { color: '#1565C0' } : {}}>
                                Căn hộ
                            </Typography>
                        </Button>
                    </Box>

                    <Box sx={style.houseType}>
                        {houseType === 'house' ? <HouseOutlinedIcon /> : <ApartmentOutlinedIcon />}
                        <Typography>{houseType === 'house' ? 'Số nhà, hẻm (ngõ)' : 'Căn hộ'}</Typography>
                    </Box>
                    <Box mt={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={houseNumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            placeholder={houseType === 'house' ? 'Số nhà 1, hẻm 2' : 'Lầu 1, phòng 2, block A'}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                        *Vui lòng nhập đúng thông tin để Nhân viên có thể tìm thấy nhà bạn.
                    </Typography>

                    <Box mt={2}>
                        <Button
                            variant={houseNumber.length > 0 && !loading && user ? 'contained' : 'disabled'}
                            sx={style.confirmButton}
                            onClick={handleSubmitAddress}
                        >
                            Đồng ý
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

const primaryColor = '#1565C0';

const style = {
    autocompleteCard: {
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        margin: '10px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
    },
    selectAddressButton: {
        padding: '10px',
        background: '#f3f3f3',
        height: '40vh',
        overflowY: 'auto',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90vw', sm: '80vw', md: 400 },
        maxWidth: '100%',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: { xs: 2, sm: 3, md: 4 },
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    houseType: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        borderRadius: 2,
    },
    selectButton: {
        justifyContent: 'flex-start',
        textTransform: 'none',
        fontSize: 14,
        borderColor: '#1565C0',
        color: 'inherit',
        padding: '8px 12px',
        '&.MuiButton-outlined': {
            borderWidth: 2,
        },
    },
    selectButtonMain: {
        bgcolor: '#1565C0',
        color: '#fff',
        '&:hover': {
            bgcolor: '#0d47a1',
        },
    },
    confirmButton: {
        width: '100%',
        backgroundColor: primaryColor,
        color: '#fff',
        fontSize: 14,
        py: 1.5,
        '&:hover': {
            backgroundColor: '#005cbf',
        },
    },
};

export default GoogleMapAutocomplete;
