import React, { useEffect, useState } from "react"
import "leaflet/dist/leaflet.css";
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    shadowUrl: iconShadow,

});

L.Marker.prototype.options.icon = DefaultIcon;

interface IMapping {
    onclickMap: Function;
    latitude: number | null;
    longitude: number | null;
    height?: string;
    width?: string;
    markerPopup?: string;
    showMarker?: boolean;
}

const defaultProps: any = {
    scrollWheelZoom: true,
    draggable: true,
    height: "calc(100vh - 8rem)",
    width: "100%",
    markerPopup: "",
    showMarker: false,
};
const tileLayer = {
    url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.osm.org/copyright">OpenStreetMap</a>'
};

const LeafletMap: React.FC<IMapping> = ({
    onclickMap,
    latitude,
    longitude,
    height,
    width,
    markerPopup,
    showMarker,
}) => {

    const [zoom, setZoon] = useState<number>(6);
    const [xcenter, setXcenter] = useState<number>(35.6892);
    const [ycenter, setYcenter] = useState<number>(51.3890);

    useEffect(() => {
        !!latitude && setXcenter(latitude);
        !!longitude && setYcenter(longitude);
    }, []);

    return (
        <Map
            center={[xcenter, ycenter]}
            onclick={(e) => {
                setZoon(e.target._zoom);
                onclickMap(e.latlng);
            }}
            minZoom={5}
            maxZoom={19}
            zoom={zoom}
            style={{ width: width, height: height }}
        >

            <TileLayer
                attribution={tileLayer!.attribution}
                url={tileLayer!.url}
            />

            {showMarker &&
                <Marker
                    position={[latitude ?? 35.6892, longitude ?? 51.3890]} >
                    <Popup>{markerPopup}</Popup>
                </Marker>
            }
        </Map >
    );
};

LeafletMap.defaultProps = defaultProps;
export default LeafletMap;

